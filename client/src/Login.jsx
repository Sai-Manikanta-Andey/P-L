import React from "react";

const Login = () => {
  const handleLogin = () => {
    window.location.href = "http://localhost:3000/api/login"; // Backend login route
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Login to View Your P&L</h1>
      <button onClick={handleLogin}>Login with Upstox</button>
    </div>
  );
};

export default Login;
