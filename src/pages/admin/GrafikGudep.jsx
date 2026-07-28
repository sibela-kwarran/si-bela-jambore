import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function GrafikGudep({
  totalGudep,
  sudahVerifikasi,
  belumVerifikasi,
}) {
  const data = {
    labels: [
      "Gudep",
      "Terverifikasi",
      "Belum"
    ],

    datasets: [
      {
        label: "Jumlah",
        data: [
          totalGudep,
          sudahVerifikasi,
          belumVerifikasi,
        ],
        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#f97316",
        ],
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="font-bold text-xl mb-4">
        📊 Statistik Gudep
      </h2>

      <Bar
        data={data}
        options={options}
      />
    </div>
  );
}