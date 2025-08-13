import React, { useEffect, useState } from 'react';
import './MainCategoryInsights.css';

interface Props {
    site: string;
    data: { category: string; count: number }[];
}

interface ParsedCategoryInsights {
    summary: string;
    most_frequent: string;
    business_recommendations: string[];
}

const MainCategoryInsights: React.FC<Props> = ({ site, data }) => {
    const [parsedData, setParsedData] = useState<ParsedCategoryInsights | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchInsights = async () => {
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
      `;

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
                });

                const result = await response.json();
                const content = result.choices?.[0]?.message?.content;

                if (content) {
                    try {
                        const cleaned = content
                            .trim()
                            .replace(/^```json\s*/i, '')
                            .replace(/^```/, '')
                            .replace(/```$/, '');
                        const parsed = JSON.parse(cleaned);
                        setParsedData(parsed);
                    } catch (e) {
                        setError('AI returned an invalid format.');
                    }
                } else {
                    setError('AI did not return a valid response.');
                }
            } catch (err) {
                setError('Failed to retrieve AI analysis.');
            }
        };

        fetchInsights();
    }, [site, data]);

    return (
        <div className="card">
            <h3 className="title">AI-Generated Insights: Category Breakdown</h3>

            {parsedData ? (
                <>
                    <div className="section">
                        <h4 className="sectionTitle">Summary</h4>
                        <p>{parsedData.summary}</p>
                    </div>

                    <div className="section">
                        <h4 className="sectionTitle">Most Frequent Category</h4>
                        <p>{parsedData.most_frequent}</p>
                    </div>

                    <div className="section">
                        <h4 className="sectionTitle">Recommendations</h4>
                        <ul className="list">
                            {parsedData.business_recommendations.map((rec, idx) => (
                                <li key={idx}>✓ {rec}</li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <p className="loading">Analyzing category trends...</p>
            )}
        </div>
    );
};

export default MainCategoryInsights;
