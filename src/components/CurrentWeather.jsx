import React from "react";

const CurrentWeather = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 max-w-sm mx-auto mb-6">
      <h2 className="text-2xl font-semibold mb-2">{data.name}, {data.sys.country}</h2>
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt="icon"
        className="mx-auto"
      />
      <p className="text-xl">{data.main.temp}°C - {data.weather[0].description}</p>
      <p>Humidity: {data.main.humidity}%</p>
      <p>Wind: {data.wind.speed} m/s</p>
    </div>
  );
};

export default CurrentWeather;
