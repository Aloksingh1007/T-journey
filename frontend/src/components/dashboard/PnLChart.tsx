import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface PnLChartProps {
  data: Array<{ date: string; pnl: number; currency?: string }>;
  currency?: 'INR' | 'USD';
}

export default function PnLChart({ data, currency }: PnLChartProps) {
  // Transform data for Recharts - single line for selected currency
  const chartData = data.map(item => ({
    date: item.date,
    PnL: item.pnl,
  }));

  // Sort by date
  chartData.sort((a, b) => a.date.localeCompare(b.date));

  // Format date for display
  const formattedData = chartData.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
  }));

  if (formattedData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          P&L Over Time
        </h3>
        <div className="flex items-center justify-center h-64 text-neutral-500">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in">
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        P&L Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            formatter={(value: number) => value.toFixed(2)}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            labelStyle={{ color: '#111827', fontWeight: 600 }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="PnL"
            stroke={currency === 'USD' ? '#3b82f6' : '#a855f7'}
            strokeWidth={3}
            name={`P&L (${currency || 'INR'})`}
            dot={{ r: 5, fill: currency === 'USD' ? '#3b82f6' : '#a855f7', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 7, fill: currency === 'USD' ? '#3b82f6' : '#a855f7' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
