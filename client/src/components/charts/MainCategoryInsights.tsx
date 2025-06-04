import React, { useEffect, useState } from 'react'

interface Props {
    site: string
    data: { category: string; count: number }[]
}

interface ParsedCategoryInsights {
    summary: string
    most_frequent: string
    business_recommendations: string[]
}

const MainCategoryInsights: React.FC<Props> = ({ site, data }) => {
    console.log(data)
    const [parsedData, setParsedData] = useState<ParsedCategoryInsights | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchInsights = async () => {
            console.log(data)
            const prompt = `
You are a business operations analyst.

Analyze the following service request data showing the number of requests per category at Site ${site}:

${JSON.stringify(data, null, 2)}

Your job is to return a structured business analysis in the following format:

{
  "summary": "A brief 2–3 sentence summary of the overall distribution and trends.",
  "most_frequent": "Name the category with the highest count and what this might indicate.",
  "business_recommendations": [
    "Actionable recommendation 1...",
    "Actionable recommendation 2..."
  ]
}

IMPORTANT:
- Return only valid JSON.
- Do not include \`\`\`json or any markdown formatting.
- Do not explain your response. Just return the JSON object.
      `

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'ft:gpt-4o-2024-08-06:noa:final:Beh9hf3v',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.8,
                    }),
                })

                const result = await response.json()
                const content = result.choices?.[0]?.message?.content

                if (content) {
                    try {
                        const cleaned = content
                            .trim()
                            .replace(/^```json\s*/i, '')
                            .replace(/^```/, '')
                            .replace(/```$/, '')
                        const parsed = JSON.parse(cleaned)
                        console.log('✅ Main Category Insights Parsed:', parsed)
                        setParsedData(parsed)
                    } catch (e) {
                        console.error('❌ Failed to parse JSON:', e)
                        setError('AI returned an invalid format.')
                    }
                } else {
                    setError('AI did not return a valid response.')
                }
            } catch (err) {
                console.error('🚨 Fetch Error:', err)
                setError('Failed to retrieve AI analysis.')
            }
        }

        fetchInsights()
    }, [site, data])

    return (
        <div style={styles.card}>
            <h3 style={styles.title}>📊 AI-Generated Insights: Category Breakdown</h3>

            {parsedData ? (
                <>
                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>Summary</h4>
                        <p>{parsedData.summary}</p>
                    </div>

                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>Most Frequent Category</h4>
                        <p>{parsedData.most_frequent}</p>
                    </div>

                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>Recommendations</h4>
                        <ul style={styles.list}>
                            {parsedData.business_recommendations.map((rec, idx) => (
                                <li key={idx}>✓ {rec}</li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : error ? (
                <p style={styles.error}>{error}</p>
            ) : (
                <p style={styles.loading}>Analyzing category trends...</p>
            )}
        </div>
    )
}

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
    title: {
        fontSize: '1.2rem',
        fontWeight: 600,
        color: '#111827',
        marginBottom: '1rem',
    },
    section: {
        marginBottom: '1.25rem',
    },
    sectionTitle: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#374151',
        marginBottom: '0.25rem',
    },
    list: {
        paddingLeft: '1.25rem',
        margin: 0,
        color: '#374151',
    },
    error: {
        color: 'red',
        fontSize: '0.95rem',
    },
    loading: {
        fontStyle: 'italic',
        color: '#6b7280',
    },
}

export default MainCategoryInsights
