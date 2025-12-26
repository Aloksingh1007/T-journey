import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

interface EmotionChartProps {
  data: Record<string, number>;
}

const COLORS = [
  '#3b82f6', // blue - confident
  '#a855f7', // purple - neutral
  '#ec4899', // pink - excited
  '#f59e0b', // amber - anxious
  '#10b981', // green - greedy
  '#ef4444', // red - fearful
  '#6366f1', // indigo - frustrated
];

export default function EmotionChart({ data }: EmotionChartProps) {
  // Transform data for Recharts
  const chartData = Object.entries(data).map(([emotion, count]) => ({
    name: emotion.charAt(0) + emotion.slice(1).toLowerCase(),
    value: count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 animate-fade-in">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Emotional State Distribution
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
        Emotional State Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(props: any) =>
              `${props.name}: ${((props.percent || 0) * 100).toFixed(0)}%`
            }
            outerRadius={90}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(229, 231, 235, 0.5)',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
