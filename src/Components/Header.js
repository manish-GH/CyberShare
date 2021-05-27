import React from "react";
import { useAuth } from "../contexts/AuthProvider";
import { useHistory, Link } from "react-router-dom";

export const Header = () => {
  const { logout } = useAuth();
  const history = useHistory();

  const handleClick = async () => {
    try {
      await logout();
      history.push("/login");
    } catch {
      console.log("Failed to log out");
    }
  };
  return (
    <div className="header">
      <nav>
        <Link style={{ textDecoration: "none" }} className="brand" to="/">
          CyberShare
        </Link>
        <div>
          <button className="logout-btn" variant="link" onClick={handleClick}>
            Log Out
          </button>
        </div>
      </nav>
    </div>
  );
};
