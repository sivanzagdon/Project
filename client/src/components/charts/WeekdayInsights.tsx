import React, { useEffect, useState } from 'react'

interface Props {
    site: string
    data: { weekday: string; count: number }[]
}

interface ParsedWeekdayInsights {
    summary: string
    peak_day: string
    business_recommendations: string[]
}

const WeekdayInsights: React.FC<Props> = ({ site, data }) => {
    const [parsedData, setParsedData] = useState<ParsedWeekdayInsights | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchInsights = async () => {
            const prompt = `
You are a data analyst providing strategic business insights.

The following data shows the number of service requests received on each weekday at Site ${site}:

${JSON.stringify(data, null, 2)}

Analyze the data and respond in the following JSON format:

{
  "summary": "A short 2–3 sentence overview of request patterns across weekdays.",
  "peak_day": "Name of the weekday with the highest volume and what it implies.",
  "business_recommendations": [
    "Actionable insight 1...",
    "Actionable insight 2..."
  ]
}

Return valid JSON only. No markdown or explanation.`

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: 'gpt-4o',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.3,
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
                        console.log('✅ Weekday Insights Parsed:', parsed)
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
            <h3 style={styles.title}>📊 Weekday Activity Insights</h3>
            {parsedData ? (
                <>
                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>Summary</h4>
                        <p>{parsedData.summary}</p>
                    </div>

                    <div style={styles.section}>
                        <h4 style={styles.sectionTitle}>Peak Day</h4>
                        <p>{parsedData.peak_day}</p>
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
                <p style={styles.loading}>Analyzing weekday patterns...</p>
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

export default WeekdayInsights
