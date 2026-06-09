import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

function Analytics({ stats }) {
  const data = [
    {
      name: "Pending",
      value: stats.pending,
    },
    {
      name: "In Progress",
      value: stats.progress,
    },
    {
      name: "Resolved",
      value: stats.resolved,
    },
  ];

  const COLORS = [
    "#facc15",
    "#3b82f6",
    "#22c55e",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Issue Analytics
      </h2>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default Analytics;