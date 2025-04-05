
import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-pink-500 text-white">
      <nav className="p-6">
        <Link to="/admin" className="text-xl font-bold">Go to Admin Home</Link>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  );
}
