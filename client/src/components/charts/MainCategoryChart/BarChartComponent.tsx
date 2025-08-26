import React from 'react'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts'

interface BarChartComponentProps {
    data: { category: string; count: number; date?: string }[]
    color: string
}

// Reusable bar chart component with gradient styling for displaying category data
const BarChartComponent: React.FC<BarChartComponentProps> = ({
    data,
    color,
}) => {
    const orderedData = [...data].sort((a, b) =>
        a.category.localeCompare(b.category)
    )

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderedData} barCategoryGap={0} barGap={0}>
                <XAxis
                    dataKey="category"
                    tickFormatter={(value) => value.charAt(0)}
                    tick={{ fontSize: 14 }}
                />
                <YAxis />
                <Tooltip
                    formatter={(value) => [`${value}`, 'Count']}
                    labelFormatter={(category) => `Category: ${category}`}
                />
                <Bar
                    dataKey="count"
                    fill="url(#gradient)"
                    radius={[6, 6, 0, 0]}
                    barSize={30}
                />
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                        <stop offset="100%" stopColor="#e0e7ff" stopOpacity={1} />
                    </linearGradient>
                </defs>
            </BarChart>
        </ResponsiveContainer>
    )
}

export default BarChartComponent
