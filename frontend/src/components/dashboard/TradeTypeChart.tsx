import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TradeTypeChartProps {
  data: Record<string, number>;
}

export default function TradeTypeChart({ data }: TradeTypeChartProps) {
  // Transform data for Recharts
  const chartData = Object.entries(data).map(([type, count]) => ({
    type: type.replace('_', ' '),
    count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Trades by Type
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
        Trades by Type
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(156, 163, 175, 0.2)" />
          <XAxis 
            dataKey="type" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
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
          />
          <Bar 
            dataKey="count" 
            fill="url(#colorGradient)" 
            name="Number of Trades"
            radius={[8, 8, 0, 0]}
          />
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
              <stop offset="100%" stopColor="#a855f7" stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
