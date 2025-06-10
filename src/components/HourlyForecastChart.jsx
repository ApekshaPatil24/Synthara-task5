import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

const HourlyForecastChart = ({ forecast }) => {
  const [chartType, setChartType] = useState("temp"); // 'temp' or 'rain'
  const [view, setView] = useState("hourly"); // 'hourly' or 'daily'

  const currentTime = new Date();

  // 🔒 Safe fallback if forecast is undefined or not an array
  const validForecast = Array.isArray(forecast) ? forecast : [];

  // Filter forecast data
 const upcomingData = validForecast
  .filter((item) => new Date(item.dt_txt) >= currentTime)
  .slice(0, view === "hourly" ? 8 : 40);
 // 8 for hourly, 40 for ~5 days (every 3h)

  const groupedDailyData = () => {
    const dailyMap = {};
    upcomingData.forEach((item) => {
      const date = new Date(item.dt_txt).toLocaleDateString(undefined, {
        weekday: "short",
      });
      if (!dailyMap[date]) {
        dailyMap[date] = [];
      }
      dailyMap[date].push(item);
    });

    return Object.entries(dailyMap).map(([day, items]) => {
      const avgTemp = Math.round(
        items.reduce((sum, item) => sum + item.main.temp, 0) / items.length
      );
      const avgPop = Math.round(
        (items.reduce((sum, item) => sum + (item.pop || 0), 0) / items.length) *
          100
      );
      const icon = items[Math.floor(items.length / 2)].weather[0].icon;

      return {
        time: day,
        temp: avgTemp,
        pop: avgPop,
        icon,
      };
    });
  };

  const hourlyData = upcomingData.map((item, index) => {
    const dt = new Date(item.dt_txt);
    return {
      time:
        view === "hourly"
          ? index === 0
            ? "Now"
            : dt.toLocaleTimeString([], { hour: "numeric", hour12: true })
          : dt.toLocaleDateString(undefined, { weekday: "short" }),
      temp: Math.round(item.main.temp),
      icon: item.weather[0].icon,
      pop: Math.round((item.pop || 0) * 100),
    };
  });

  const displayData = view === "hourly" ? hourlyData : groupedDailyData();

  const temps = displayData.map((d) => d.temp);
  const minTemp = Math.min(...temps) - 2;
  const maxTemp = Math.max(...temps) + 2;

  return (
    <div className="bg-[#f0f8ff] rounded-2xl p-6 shadow-md w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          {view === "hourly" ? "Upcoming hours" : "Next 5 days"}
        </h2>
        <div className="flex gap-2 relative">
          {/* Dropdown Menu */}
          <div className="relative group">
            <button className="text-sm bg-white px-3 py-1 rounded-full shadow">
              {chartType === "temp" ? "Temperature" : "Rain"} ▼
            </button>
            <div className="absolute hidden group-hover:block bg-white shadow rounded mt-1 z-10">
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => setChartType("temp")}
              >
                Temperature
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                onClick={() => setChartType("rain")}
              >
                Rain
              </button>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() =>
              setView((prev) => (prev === "hourly" ? "daily" : "hourly"))
            }
            className="text-sm bg-white px-3 py-1 rounded-full shadow"
          >
            {view === "hourly" ? "Next days ▸" : "Back to hours ◂"}
          </button>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={100}>
         {chartType === "temp" ? (
        <AreaChart data={displayData}>
          <defs>
            <linearGradient
              id="chartGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor={chartType === "temp" ? "#f97316" : "#3b82f6"}
                stopOpacity={0.6}
              />
              <stop
                offset="100%"
                stopColor={chartType === "temp" ? "#f97316" : "#3b82f6"}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#ccc"
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            hide
            domain={
              chartType === "temp" ? [minTemp, maxTemp] : [0, 100]
            }
          />
          <Tooltip
            contentStyle={{ fontSize: "12px", borderRadius: "10px" }}
            formatter={(value, name) =>
              chartType === "temp"
                ? [`${value}°C`, "Temperature"]
                : [`${value}%`, "Rain"]
            }
          />
          <Area
            type="monotone"
            dataKey={chartType}
            stroke={chartType === "temp" ? "#f97316" : "#3b82f6"}
            fill="url(#chartGradient)"
          />
        </AreaChart>
         ) : (
            <LineChart data={displayData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pop"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          )}
      </ResponsiveContainer>

      {/* Icons & Data */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-700">
        {displayData.map((item, idx) => (
          <div key={idx} className="text-center w-[12%]">
            <div className="font-medium text-gray-900">{item.temp}°</div>
            <img
              src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
              alt="icon"
              className="w-6 h-6 mx-auto"
            />
            <div className="text-gray-500">{item.time}</div>
            <div className="text-blue-600 font-medium">{item.pop}% Rain</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecastChart;
