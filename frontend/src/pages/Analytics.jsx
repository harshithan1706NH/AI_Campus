import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import axios from "axios";

function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/issues/stats")
      .then((res) => {
        const stats = res.data;

        setData([
          { name: "Pending", value: stats.pending },
          { name: "In Progress", value: stats.inProgress },
          { name: "Resolved", value: stats.resolved },
        ]);
      });
  }, []);

  const COLORS = ["#FFBB28", "#0088FE", "#00C49F"];

  return (
    <div>
      <h2>Analytics</h2>

      <PieChart width={300} height={300}>
        <Pie data={data} dataKey="value" outerRadius={100}>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}

export default Analytics;