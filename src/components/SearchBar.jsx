import React from "react";

const SearchBar = ({ location, setLocation, fetchWeather }) => {
  return (
    <div className="flex justify-center mb-6">
      <input
        type="text"
        placeholder="Enter city or zip"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 w-64 border rounded-l-md focus:outline-none"
      />
      <button
        onClick={fetchWeather}
        className="bg-indigo-600 text-white px-4 rounded-r-md hover:bg-indigo-700"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
