import React, { useEffect, useState } from 'react';
import './WeekdayInsights.css';

interface Props {
    site: string;
    data: { weekday: string; count: number }[];
}

interface ParsedWeekdayInsights {
    summary: string;
    peak_day: string;
    business_recommendations: string[];
}

// Component that generates AI-powered insights about weekday service request patterns
const WeekdayInsights: React.FC<Props> = ({ site, data }) => {
    const [parsedData, setParsedData] = useState<ParsedWeekdayInsights | null>(null);
    const [error, setError] = useState<string | null>(null);
    console.log(data);

    // Fetches AI-generated insights about weekday patterns using OpenAI API
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
                        model: 'ft:gpt-4o-2024-08-06:noa:final:Beh9hf3v',
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.3,
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
                        console.log('Weekday Insights Parsed:', parsed);
                        setParsedData(parsed);
                    } catch (e) {
                        console.error('Failed to parse JSON:', e);
                        setError('AI returned an invalid format.');
                    }
                } else {
                    setError('AI did not return a valid response.');
                }
            } catch (err) {
                console.error('Fetch Error:', err);
                setError('Failed to retrieve AI analysis.');
            }
        };

        fetchInsights();
    }, [site, data]);

    return (
        <div className="card">
            <h3 className="title">Weekday Activity Insights</h3>
            {parsedData ? (
                <>
                    <div className="section">
                        <h4 className="sectionTitle">Summary</h4>
                        <p>{parsedData.summary}</p>
                    </div>

                    <div className="section">
                        <h4 className="sectionTitle">Peak Day</h4>
                        <p>{parsedData.peak_day}</p>
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
                <p className="loading">Analyzing weekday patterns...</p>
            )}
        </div>
    );
};

export default WeekdayInsights;
