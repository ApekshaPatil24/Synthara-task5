import React, {useEffect, useState } from "react";
import axios from "axios";
import ErrorBox from "./ErrorBox";
import { FaSnowflake,FaCloudRain,FaCloudSun, FaUserCircle, FaHome, FaCalendarAlt, FaInfoCircle, FaBars } from "react-icons/fa";
import HourlyForecastChart from './HourlyForecastChart'; 
import { WiHumidity, WiRaindrop, WiStrongWind, WiDaySunny } from "react-icons/wi";
import { FaSun, FaMoon } from "react-icons/fa";

const Dashboard = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
 const [forecastData, setForecastData] = useState([]);
 const [userName, setUserName] = useState("");
const [greeting, setGreeting] = useState("");
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

useEffect(() => {
  const savedName = localStorage.getItem("weatherUserName");

  if (!savedName) {
    const inputName = prompt("👋 Welcome! What's your name?");
    if (inputName) {
      setUserName(inputName);
      localStorage.setItem("weatherUserName", inputName);
    }
  } else {
    setUserName(savedName);
  }

  setGreeting(getGreeting());

  // Get current location
  if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      // Use OpenStreetMap's Nominatim API for reverse geocoding
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const city = geoRes.data.address.city || geoRes.data.address.town || geoRes.data.address.village || geoRes.data.address.state_district;
      setLocation(city); // This should return Navsari if accurate
    } catch (err) {
      setError("⚠️ Failed to determine your exact location.");
    }
  });
}
}, []);

useEffect(() => {
  if (location) {
    fetchWeather();
  }
}, [location]);

  const fetchWeather = async () => {
  try {
    setError("");
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`
    );
    setWeather(weatherRes.data);

    const forecastRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${API_KEY}`
    );

    const daily = forecastRes.data.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );
    setForecast(daily.slice(0, 5));

    setForecastData(forecastRes.data.list); // ✅ Add this line
  } catch (err) {
    setError("❌ Invalid city or zip. Try again.");
    setWeather(null);
    setForecast([]);
    setForecastData([]); // Clear hourly forecast too
  }
};

const renderWelcomeScreen = (userName) => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-6 animate-fade-in">
      <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 drop-shadow-lg text-center">
  🌤️ Welcome, {userName || 'Friend'}!
</div>
      <p className="text-gray-500 text-lg">Fetching weather details for your location...</p>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
    </div>
  );
};

  const renderMainContent = () => {
     // If weather hasn't been fetched yet
     if (!weather) {
    return renderWelcomeScreen(userName);
  }
    switch (activeTab) {
      case "home":
         // If data is ready, show the main UI
        return (
          <>
            {error && <ErrorBox message={error} />}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="col-span-2 space-y-6">
                {/* Forecast Cards */}
                <div>
                  <h2 className="font-poppins text-lg sm:text-xl md:text-3xl font-semibold text-gray-800 dark:text-white mt-6 mb-4 text-center tracking-wide">
  Weather <span className="text-indigo-600 underline decoration-dotted decoration-2 underline-offset-4">Forecast</span>
</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
  {forecast.map((item, idx) => (
    <div
      key={idx}
      className="bg-white rounded-2xl min-w-0 p-5 shadow-lg flex flex-col justify-center items-center space-y-2 text-center"
    >
      <div className="text-sm text-gray-500">{new Date(item.dt_txt).toLocaleDateString()}</div>
      <img
        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
        alt="weather icon"
        className="w-12 h-12"
      />
      
      <div className="text-xl font-bold text-indigo-700">{Math.round(item.main.temp)}°C</div>
      <div className="text-sm capitalize text-gray-600">{item.weather[0].main}</div>
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-400"
          style={{ width: `${Math.min(Math.max(item.main.temp, 0), 50) * 2}%` }}
        ></div>
      </div>
    </div>
  ))}
</div>

                </div>

                {/* Placeholder */}
                <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
                {forecastData.length > 0 && (
        <HourlyForecastChart forecast={forecastData} />
      )}
      </div>
              </div>

              {weather && (
  <div className="relative bg-gradient-to-b from-blue-500 to-indigo-700 text-white rounded-3xl p-6 min-w-0 shadow-xl flex flex-col justify-between items-center">
  <img
  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
  alt="weather icon"
  className="w-12 h-12 absolute top-4 right-4"
/>

    <div className="text-center mt-4">
      <p className="text-md font-light">Today</p>
      <p className="text-xs opacity-80">{new Date().toDateString()}</p>
      <div className="text-6xl font-bold my-4">{Math.round(weather.main.temp)}°C</div>
      <p className="text-lg font-medium">{weather.name}, {weather.sys.country}</p>
    </div>

    {/* Sunrise to Sunset Arc */}
   <div className="w-full flex items-center justify-center relative mt-6 mb-4">
  <svg height="100" width="240" className="relative">
    <path
      d="M20 80 Q 120 10, 220 80"
      stroke="white"
      strokeWidth="2"
      fill="transparent"
    />
    {/* Calculate sun position */}
    {(() => {
      const now = Date.now() / 1000;
      const { sunrise, sunset } = weather.sys;
      const totalTime = sunset - sunrise;
      const current = now - sunrise;
      const ratio = Math.max(0, Math.min(1, current / totalTime));
      const x = 20 + (200 * ratio);
      const y = 80 - 70 * Math.sin(Math.PI * ratio);

      return (
        <circle cx={x} cy={y} r="8" fill="yellow" stroke="white" strokeWidth="1.5" />
      );
    })()}
    <text x="20" y="95" fill="white" fontSize="12">
       {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </text>
    <text x="180" y="95" fill="white" fontSize="12">
       {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </text>
  </svg>
</div>

{/* Stylish Weather Metrics */}
{/* Stylish Weather Metrics with Inline Icons */}
<div className="grid grid-cols-2 gap-4 w-full text-sm mt-4">
  <div className="flex items-center gap-3 justify-center rounded-lg bg-white/20 backdrop-blur-sm p-3 rounded-xl w-full">
    <WiHumidity className="text-2xl" />
    <div>
      <p className="text-base font-semibold">{weather.main.humidity}%</p>
      <p className="opacity-80 text-xs">Humidity</p>
    </div>
  </div>

  <div className="flex items-center gap-3 justify-center rounded-lg bg-white/20 backdrop-blur-sm p-3 rounded-xl w-full">
    <WiRaindrop className="text-2xl" />
    <div>
      <p className="text-base font-semibold">
        {weather.rain ? weather.rain["1h"] || weather.rain["3h"] : 0}%
      </p>
      <p className="opacity-80 text-xs">Precipitation</p>
    </div>
  </div>

  <div className="flex items-center justify-center rounded-lg gap-3 bg-white/20 backdrop-blur-sm p-3 rounded-xl w-full">
    <FaSun className="text-xl" />
    <div>
      <p className="text-base font-semibold">{weather.clouds.all}%</p>
      <p className="opacity-80 text-xs">Chance of Rain</p>
    </div>
  </div>

  <div className="flex items-center justify-center rounded-lg gap-3 bg-white/20 backdrop-blur-sm p-3 rounded-xl w-full">
    <WiStrongWind className="text-2xl" />
    <div>
      <p className="text-base font-semibold">{weather.wind.speed} km/hr</p>
      <p className="opacity-80 text-xs">Wind Flow</p>
    </div>
  </div>
</div>
  </div>
)}
 </div>
  </>
        );

case "today":
  return (
    <div className="p-6 animate-fade-in space-y-6">
      <h2 className="text-3xl font-bold text-indigo-700 text-center mb-4">
        📅 Today's Weather in {location}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Weather Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl min-w-0 shadow-xl p-6 space-y-4 transition-all hover:scale-[1.01] duration-300">
          <div className="flex justify-between items-center">
            <div className="text-5xl">{weather.weather[0].main === "Clear" ? "☀️" : "🌧️"}</div>
            <div className="text-right">
              <div className="text-4xl font-semibold text-indigo-600">{weather.main.temp}°C</div>
              <div className="text-gray-500 text-sm">{weather.weather[0].description}</div>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mt-2">
            <div
              className="bg-indigo-500 h-3 rounded-full transition-all"
              style={{ width: `${(weather.main.temp / 50) * 100}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-700">
            <div className="flex items-center space-x-2"><WiHumidity size={28} className="text-blue-400" /> <span>Humidity: {weather.main.humidity}%</span></div>
            <div className="flex items-center space-x-2"><WiRaindrop size={28} className="text-indigo-300" /> <span>Pressure: {weather.main.pressure} hPa</span></div>
            <div className="flex items-center space-x-2"><WiStrongWind size={28} className="text-sky-500" /> <span>Wind: {weather.wind.speed} m/s</span></div>
            <div className="flex items-center space-x-2"><WiDaySunny size={28} className="text-yellow-500" /> <span>Feels Like: {weather.main.feels_like}°C</span></div>
          </div>
        </div>

        {/* Sunrise/Sunset & Chart */}
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-md rounded-3xl min-w-0 shadow-xl p-6">
            <h3 className="text-lg font-bold text-indigo-600 mb-2">🌅 Sunrise & 🌇 Sunset</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Sunrise</span>
                <span>{new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</span>
              </div>
              <div className="w-full bg-yellow-100 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full w-[50%] animate-pulse"></div>
              </div>

              <div className="flex justify-between mt-2">
                <span>Sunset</span>
                <span>{new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</span>
              </div>
              <div className="w-full bg-orange-100 rounded-full h-2">
                <div className="bg-orange-400 h-2 rounded-full w-[70%] animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Hourly Chart */}
          {forecastData.length > 0 && (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl min-w-0 shadow-xl p-6">
              <h3 className="text-lg font-bold text-indigo-600 mb-2">🌡️ Hourly Forecast</h3>
              
              {forecastData.length > 0 && (
        <HourlyForecastChart forecast={forecastData} />
      )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  
  case "about":
  return (
    <div className="relative mt-20 bg-white/30 backdrop-blur-xl border border-white/20 p-10 rounded-3xl min-w-0 shadow-2xl overflow-hidden animate-fade-in">
      {/* Floating Icons */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-6 left-8 text-yellow-300 animate-float">
          <FaCloudSun size={32} />
        </div>
        <div className="absolute bottom-4 right-10 text-blue-400 animate-float delay-200">
          <FaCloudRain size={28} />
        </div>
        <div className="absolute top-10 right-16 text-indigo-400 animate-float delay-500">
          <FaSnowflake size={24} />
        </div>
      </div>

      {/* Main Content */}
      <h2 className="text-4xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 animate-gradient-x">
        🌤️ About This Weather App
      </h2>

      <p className="text-gray-800 text-lg leading-relaxed font-medium">
        This isn’t just a weather app — it’s a beautiful blend of{" "}
        <span className="text-indigo-600 font-semibold">real-time meteorology</span> and{" "}
        <span className="text-purple-600 font-semibold">interactive design</span>. Powered by the{" "}
        <span className="font-bold text-blue-600">OpenWeatherMap API</span> and{" "}
        <span className="font-bold text-pink-600">React.js</span>, it smartly detects your location,
        delivers precise forecasts, and wraps it all in a uniquely serene experience.
      </p>

      <p className="mt-6 text-sm text-indigo-900 italic">
        ✨ Carefully crafted with love and code by <span className="underline">Apeksha Patil</span>
      </p>
    </div>
  );


 case "profile":
  return (
    <div className="bg-gradient-to-br mt-20 from-white to-indigo-50 p-8 rounded-3xl min-w-0 shadow-xl text-center animate-fade-in">
      <FaUserCircle className="text-7xl text-indigo-600 mx-auto mb-4 animate-pulse" />
      <h2 className="text-2xl font-bold text-indigo-700 mb-2">👋 Welcome, {userName}</h2>
      <p className="text-gray-600 mb-6 text-md">Here you can manage your identity, preferences, and personalize your experience.</p>

      <button
        onClick={() => {
          localStorage.removeItem("weatherUserName");
          window.location.reload();
        }}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-2 rounded-full font-semibold min-w-0 shadow-md transition-transform hover:scale-105"
      >
        ✏️ Change Name
      </button>
    </div>
  );

  
  default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="${sidebarOpen ? '' : 'hidden md:block'} w-20 md:w-24 bg-blue-900 text-white flex flex-col items-center py-6 space-y-6 rounded-tr-3xl rounded-br-3xl transition-all duration-300">
          <FaCloudSun className="text-3xl" />
          <FaHome onClick={() => setActiveTab("home")} className={`text-xl cursor-pointer hover:text-indigo-300 ${activeTab === "home" && "text-yellow-300"}`} title="Home" />
          <button onClick={() => setActiveTab("today")} className={`text-xl cursor-pointer hover:text-indigo-300 ${activeTab === "today" && "text-yellow-300"}`} title="today">
          <FaCalendarAlt className="text-xl" /> 
</button>

          <FaInfoCircle onClick={() => setActiveTab("about")} className={`text-xl cursor-pointer hover:text-indigo-300 ${activeTab === "about" && "text-yellow-300"}`} title="About" />
          <FaUserCircle onClick={() => setActiveTab("profile")} className={`text-xl cursor-pointer hover:text-indigo-300 ${activeTab === "profile" && "text-yellow-300"}`} title="Profile" />
        </aside>
      )}

      {/* Main Panel */}
      <main className="flex-1 p-4 overflow-y-auto">
        {/* Top Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
  Hello {userName || "Guest"}! <br />
  <span className="text-indigo-600">{greeting}!</span>
</h1>

          </div>

          <div className="flex items-center gap-4">
            <button
  className="md:hidden absolute top-4 right-4 text-2xl"
  onClick={() => setSidebarOpen(!sidebarOpen)}
>
  <FaBars />
</button>


            <input
              type="text"
              placeholder="Search some place..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
            />
            <button
              onClick={fetchWeather}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-full transition-all"
            >
              Search
            </button>
            <FaUserCircle className="text-3xl text-gray-600" />
          </div>
        </div>

        {/* Dynamic Main Content Based on Sidebar Selection */}
        {renderMainContent()}
      </main>
    </div>
  );
};

export default Dashboard;
