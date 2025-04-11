// src/pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./LoginPage.css"; // ✅ เพิ่ม

const LoginPage = () => {
  const [options, setOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/api/committees")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((c) => ({
          value: c.comm_id,
          label: c.comm_name,
          group: c.comm_group,
        }));
        setOptions(formatted);
      });
  }, []);

  const handleLogin = () => {
    if (!selectedUser) {
      toast.error("กรุณาเลือกชื่อก่อนเข้าสู่ระบบ");
      return;
    }

    localStorage.setItem("voter_id", selectedUser.value);
    localStorage.setItem("voter_group", selectedUser.group);
    navigate("/vote");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>เข้าสู่ระบบเพื่อลงคะแนนเลือกตั้ง</h2>
        <p className="subtext">กรรมการจริยธรรม</p>

        <Select
          options={options}
          onChange={setSelectedUser}
          placeholder="ค้นหาชื่อของคุณ..."
          isSearchable
          className="select-input"
        />

        <button onClick={handleLogin} className="login-btn">
          เข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
};

export default LoginPage;