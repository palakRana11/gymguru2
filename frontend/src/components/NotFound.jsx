import React from "react";
export default function NotFound() {
    return (
      <section className="h-screen w-full bg-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="mt-4 text-lg">The page you are looking for does not exist.</p>
          <a href="/" className="mt-6 inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            404 - NOT FOUND|Go to Home|
          </a>
        </div>
      </section>
    );
  }