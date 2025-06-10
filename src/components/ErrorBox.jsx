import React from "react";

const ErrorBox = ({ message }) => (
  <div className="text-red-700 bg-red-100 border border-red-300 p-3 rounded mb-4 max-w-lg mx-auto">
    {message}
  </div>
);

export default ErrorBox;
