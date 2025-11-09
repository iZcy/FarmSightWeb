import React from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import { format } from 'date-fns';
import type { NDVIData } from '../../types';

interface NDVIChartProps {
  data: NDVIData[];
  forecast?: NDVIData[];
  showForecast?: boolean;
}

export const NDVIChart: React.FC<NDVIChartProps> = ({
  data,
  forecast = [],
  showForecast = false,
}) => {
  // Combine historical and forecast data
  const chartData = [
    ...data.map(d => ({
      date: format(d.date, 'MMM dd'),
      ndvi: d.value,
      type: 'historical' as const,
      confidence: d.confidence,
    })),
    ...(showForecast
      ? forecast.map(d => ({
          date: format(d.date, 'MMM dd'),
          forecast: d.value,
          type: 'forecast' as const,
          confidence: d.confidence,
        }))
      : []),
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.date}</p>
          {data.ndvi !== undefined && (
            <p className="text-sm text-success-600">
              NDVI: {data.ndvi.toFixed(3)}
            </p>
          )}
          {data.forecast !== undefined && (
            <p className="text-sm text-primary-600">
              Forecast: {data.forecast.toFixed(3)}
            </p>
          )}
          {data.confidence && (
            <p className="text-xs text-gray-500">
              Confidence: {data.confidence.toFixed(0)}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData}>
        <defs>
          <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickLine={{ stroke: '#e5e7eb' }}
        />
        <YAxis
          domain={[0, 1]}
          tick={{ fill: '#6b7280', fontSize: 12 }}
          tickLine={{ stroke: '#e5e7eb' }}
          label={{ value: 'NDVI', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: '20px' }}
          iconType="line"
        />

        {/* Historical data with area */}
        <Area
          type="monotone"
          dataKey="ndvi"
          stroke="#22c55e"
          fill="url(#ndviGradient)"
          fillOpacity={1}
        />
        <Line
          type="monotone"
          dataKey="ndvi"
          stroke="#16a34a"
          strokeWidth={3}
          dot={{ fill: '#16a34a', r: 4 }}
          activeDot={{ r: 6 }}
          name="Historical NDVI"
        />

        {/* Forecast data */}
        {showForecast && (
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#0ea5e9"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#0ea5e9', r: 3 }}
            name="Forecast"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
};
