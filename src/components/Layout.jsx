import React from "react";
import { Link } from "react-router-dom";

const layoutStyle = {
  minHeight: "100vh",
  background: "linear-gradient(to right, #8e2de2, #ff0080)", // Purple to pink gradient
  color: "white",
};

const navStyle = {
  padding: "1.5rem",
};

const contentStyle = {
  padding: "1.5rem",
};

export default function Layout({ children, showAdminLink = true }) {
  return (
    <div style={layoutStyle}>
      <nav style={navStyle}>
        {showAdminLink && (
          <Link
            to="/admin"
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              color: "white",
              textDecoration: "none",
            }}
          >
            Go to Admin Home
          </Link>
        )}
      </nav>
      <div style={contentStyle}>{children}</div>
    </div>
  );
}
