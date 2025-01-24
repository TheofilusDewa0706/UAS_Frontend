import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import { AuthContext } from "../context/authContexts";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login: handleLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login({ username, password });
      handleLogin(token);

      const payload = JSON.parse(window.atob(token.split(".")[1]));
      if (payload.role_id === 1) {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      setError("Username atau password salah!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="border p-2 mb-4 w-full"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="border p-2 mb-4 w-full"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 w-full"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
