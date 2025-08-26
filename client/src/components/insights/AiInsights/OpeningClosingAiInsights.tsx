import React, { useEffect, useState } from 'react';
import './AiInsights.css';

interface AiInsightsProps {
    site: 'A' | 'B' | 'C';
    year: '2023' | '2024';
    month: string;
    combinedData: { date: string; opening_rate: number; closing_rate: number }[];
}

interface ParsedInsights {
    summary: string;
    anomalies: string[];
    business_insight: string;
    actionable_recommendations: string[];
}

// Component that generates AI-powered insights about opening and closing rate trends
const AiInsights: React.FC<AiInsightsProps> = ({ site, year, month, combinedData }) => {
    const [parsedData, setParsedData] = useState<ParsedInsights | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetches AI-generated insights about opening and closing patterns using OpenAI API
    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const trimmedData = combinedData.slice(-30);
                const prompt = `
You are an experienced business operations analyst.

Analyze the following service request data for Site ${site}, for the month of ${month} ${year}. Each entry includes:
- date
- number of service requests opened
- number of service requests closed

Here is the data (last 30 days of activity):
${JSON.stringify(trimmedData, null, 2)}

Your task is to return a clear, structured analysis that helps operational decision-makers. Return the output strictly in the following JSON format:

{
  "summary": "Brief 2–3 sentence overview of trends, including any visible fluctuations.",
  "anomalies": [
    "Specify days with unusually high or low activity, e.g. 'March 12th had 21 openings and only 2 closures — possible backlog spike.'"
  ],
  "business_insight": "What does this say about operational performance? Reference data directly.",
  "actionable_recommendations": [
    "Action item 1 — Include a specific operational suggestion (e.g. add personnel, review workflow)."
  ]
}

IMPORTANT: 
- Return ONLY a valid JSON object.
- Do NOT include markdown formatting (no \`\`\`json).
- Do NOT add any explanation or extra commentary before or after the JSON.
        `;

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

                const data = await response.json();

                if (data.error) {
                    setError(`OpenAI Error: ${data.error.message}`);
                    return;
                }

                const content = data.choices?.[0]?.message?.content;
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
            } catch (err: any) {
                setError('Failed to fetch AI analysis.');
            }
        };

        fetchInsights();
    }, [site, year, month, combinedData]);

    return (
        <div className="card">
            <h3 className="title">AI-Generated Insights: {month}</h3>

            {parsedData ? (
                <div className="insightContainer">
                    <section className="section">
                        <h4 className="sectionTitle">Summary</h4>
                        <p>{parsedData.summary}</p>
                    </section>

                    <section className="section">
                        <h4 className="sectionTitle">Anomalies</h4>
                        <ul className="list">
                            {parsedData.anomalies.map((item, idx) => (
                                <li key={idx}>⚠ {item}</li>
                            ))}
                        </ul>
                    </section>

                    <section className="section">
                        <h4 className="sectionTitle">Business Insight</h4>
                        <p>{parsedData.business_insight}</p>
                    </section>

                    <section className="section">
                        <h4 className="sectionTitle">Actionable Recommendations</h4>
                        <ul className="list">
                            {parsedData.actionable_recommendations.map((rec, idx) => (
                                <li key={idx}>✓ {rec}</li>
                            ))}
                        </ul>
                    </section>
                </div>
            ) : error ? (
                <p className="error">{error}</p>
            ) : (
                <p className="loading">Analyzing data...</p>
            )}
        </div>
    );
};

export default AiInsights;
