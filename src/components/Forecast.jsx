import React from "react";

const Forecast = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold mb-4 text-indigo-700">5-Day Forecast</h3>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {data.map((day, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow">
            <p className="font-medium">{new Date(day.dt_txt).toLocaleDateString()}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt="icon"
              className="mx-auto"
            />
            <p className="text-lg">{day.main.temp}°C</p>
            <p className="capitalize text-sm">{day.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
