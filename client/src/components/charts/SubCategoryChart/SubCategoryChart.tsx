import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import './SubCategoryChart.css';

interface Props {
  site: string;
  data: { subcategory: string; count: number }[];
  title?: string;
  color: string;
}

// Chart component that displays subcategory breakdown data with gradient bars
const SubCategoryChart: React.FC<Props> = ({ site, data, title, color }) => {
  return (
    <div className="card">
      <h2 className="title">{title || `${site} SubCategory Breakdown`}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} barCategoryGap={0} barGap={0}>
          <XAxis dataKey="subcategory" interval={0} tick={false} />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill={`url(#gradient)`}
            radius={[6, 6, 0, 0]}
            barSize={16}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SubCategoryChart;
