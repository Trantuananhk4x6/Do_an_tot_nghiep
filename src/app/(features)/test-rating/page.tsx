"use client";

import { useState } from "react";

export default function TestRatingPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const testSubmit = async () => {
    setLoading(true);
    setResult("Sending request...");
    
    try {
      const testData = {
        userEmail: "test@example.com",
        userName: "Test User",
        rating: 5,
        comment: "This is a test review",
      };

      console.log("Sending:", testData);

      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      console.log("Response:", response.status, data);

      setResult(
        `Status: ${response.status}\n` +
        `Response: ${JSON.stringify(data, null, 2)}`
      );
    } catch (error: any) {
      console.error("Error:", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testGet = async () => {
    setLoading(true);
    setResult("Fetching ratings...");
    
    try {
      const response = await fetch("/api/ratings");
      const data = await response.json();
      
      console.log("GET Response:", data);
      
      setResult(
        `Status: ${response.status}\n` +
        `Total Ratings: ${data.totalRatings}\n` +
        `Average: ${data.averageRating}\n` +
        `Ratings: ${JSON.stringify(data.ratings, null, 2)}`
      );
    } catch (error: any) {
      console.error("Error:", error);
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Test Rating API</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testGet}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-medium disabled:opacity-50"
        >
          Test GET (Fetch Ratings)
        </button>
        
        <button
          onClick={testSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-medium disabled:opacity-50 ml-4"
        >
          Test POST (Submit Rating)
        </button>
      </div>

      {result && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Result:</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-300">
            {result}
          </pre>
        </div>
      )}

      <div className="mt-8 bg-red-900/20 border border-red-500/50 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4 text-red-400">⚠️ ERROR: Table "rating" does not exist!</h2>
        <div className="space-y-4 text-gray-300">
          <p className="font-semibold">Bạn cần tạo bảng "rating" trong PostgreSQL database:</p>
          
          <div className="bg-gray-800 p-4 rounded">
            <p className="font-mono text-sm mb-2 text-green-400">📝 Copy SQL này:</p>
            <pre className="text-xs overflow-x-auto">
{`CREATE TABLE IF NOT EXISTS "rating" (
  "id" serial PRIMARY KEY NOT NULL,
  "userEmail" text NOT NULL,
  "userName" text NOT NULL,
  "rating" integer NOT NULL,
  "comment" text,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);`}
            </pre>
          </div>

          <div className="space-y-2">
            <p className="font-semibold text-yellow-400">🔧 Cách chạy SQL:</p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Mở <span className="font-mono bg-gray-800 px-2 py-1 rounded">create_rating_table.sql</span> trong root project</li>
              <li>Copy toàn bộ nội dung</li>
              <li>Mở Neon/Vercel Postgres Dashboard → SQL Editor</li>
              <li>Paste và chạy SQL</li>
              <li>Restart dev server (Ctrl+C rồi <span className="font-mono bg-gray-800 px-2 py-1 rounded">npm run dev</span>)</li>
              <li>Refresh trang này và test lại!</li>
            </ol>
          </div>

          <p className="text-sm">
            📖 Chi tiết: Xem file <span className="font-mono bg-gray-800 px-2 py-1 rounded">FIX_RATING_TABLE.md</span>
          </p>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Open browser console (F12)</li>
          <li>Click "Test GET" to see if API is working</li>
          <li>Click "Test POST" to submit a test review</li>
          <li>Check console for detailed logs</li>
          <li>Check terminal where dev server is running for server logs</li>
        </ol>
      </div>
    </div>
  );
}
