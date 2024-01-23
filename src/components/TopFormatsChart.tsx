"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export const options = {
  indexAxis: "x" as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  scaleShowValues: true,
  scales: {
    x: {
      ticks: {
        autoSkip: false,
      },
    },
  },
};

const TopFormatsChart = ({ topFormatsData }) => {
  const labels = topFormatsData.map((row) => row.format);
  const series = topFormatsData.map((row) => row.count);
  const data = {
    labels,
    datasets: [
      {
        data: series,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

export default TopFormatsChart;
