import React from 'react'
import {
    ComposedChart,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    Area,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts'

interface LineAreaChartProps {
    data: { date: string; opening_rate: number; closing_rate: number }[]
}

// Combined line and area chart component for displaying opening and closing rate trends over time
const LineAreaChart: React.FC<LineAreaChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
                <defs>
                    <linearGradient id="openingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="70%" stopColor="#6366f1" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="closingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.2} />
                        <stop offset="70%" stopColor="#a78bfa" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    tickFormatter={(d) => new Date(d).getDate().toString()}
                    style={{ fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip />

                <Area
                    type="monotone"
                    dataKey="opening_rate"
                    fill="url(#openingGradient)"
                    stroke="none"
                />

                <Area
                    type="monotone"
                    dataKey="closing_rate"
                    fill="url(#closingGradient)"
                    stroke="none"
                />

                <Line
                    type="monotone"
                    dataKey="opening_rate"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                />

                <Line
                    type="monotone"
                    dataKey="closing_rate"
                    stroke="#6b7280"
                    strokeWidth={2}
                    dot={false}
                />
            </ComposedChart>
        </ResponsiveContainer>
    )
}

export default LineAreaChart
