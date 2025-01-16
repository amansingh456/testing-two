import React from "react";

const NotValid = () => {
  return (
    <div className="flex h-screen bg-gradient-to-br items-center justify-center">
      <div className="w-[375px] h-[300px] bg-gradient-to-b from-red-100 to-white rounded-3xl shadow-2xl flex flex-col justify-center items-center p-6">
        <h1 className="text-xl font-bold text-red-600 text-center mb-4">
          Missing Information
        </h1>
        <p className="text-gray-700 text-center mb-4">
          Please provide both <strong>Email</strong> and <strong>Token</strong>{" "}
          in the URL.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-gradient-to-r from-red-300 to-red-700 p-2 rounded-lg text-white font-bold"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotValid;
