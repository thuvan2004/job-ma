import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444'];

const JobChart = ({ jobs }) => {
  const data = [
    { name: 'Applied', value: jobs.filter(j => j.status === 'Applied').length },
    { name: 'Interview', value: jobs.filter(j => j.status === 'Interview').length },
    { name: 'Offer', value: jobs.filter(j => j.status === 'Offer').length },
    { name: 'Rejected', value: jobs.filter(j => j.status === 'Rejected').length },
  ].filter(d => d.value > 0);

  if (data.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        📊 Application Overview
      </h3>
      <div className="flex justify-center">
        <PieChart width={350} height={250}>
          <Pie
            data={data}
            cx={175}
            cy={110}
            outerRadius={90}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
    </div>
        
  );
};

export default JobChart;