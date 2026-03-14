import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

function defaultDataset(label, color, data) {
  return {
    label,
    data,
    borderColor: color,
    backgroundColor: color + '66',
    fill: true,
    tension: 0.35
  };
}

export default function ChartPanel({ title, kind, labels, data, color = '#1f7a75' }) {
  const chartData = {
    labels,
    datasets: [defaultDataset(title, color, data)]
  };

  return (
    <section className="card">
      <h3>{title}</h3>
      {kind === 'line' ? <Line data={chartData} /> : null}
      {kind === 'bar' ? <Bar data={chartData} /> : null}
      {kind === 'pie' ? <Pie data={chartData} /> : null}
    </section>
  );
}