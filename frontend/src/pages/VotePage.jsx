// ✅ VotePage.jsx - ตรวจสิทธิ์ + sign out อัตโนมัติ หากใช้สิทธิ์แล้ว
import { useEffect, useState } from "react";
import CommitteeList from "../components/CommitteeList";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VotePage = () => {
  const [committees, setCommittees] = useState([]);
  const navigate = useNavigate();

  const signOut = () => {
    localStorage.removeItem("voter_id");
    localStorage.removeItem("voter_group");
    navigate("/login");
  };

  useEffect(() => {
    const voterId = localStorage.getItem("voter_id");
    const group = localStorage.getItem("voter_group");
  
    console.log("🟡 ตรวจสอบ voter_id:", voterId);
    console.log("🟡 ตรวจสอบ group:", group);
  
    if (!voterId || !group) {
      signOut();
      return;
    }


    fetch(`http://localhost:5001/api/has-voted/${voterId}`)
      .then(res => res.json())
      .then(data => {
        if (data.hasVoted) {
          alert("คุณได้ใช้สิทธิ์แล้ว ระบบจะพาคุณกลับไปหน้าหลัก");
          signOut();
        } else {
          fetch(`http://localhost:5001/api/committees/${group}`)
            .then((res) => res.json())
            .then((data) => setCommittees(data));
        }
      });
  }, []);

  const handleVoteSuccess = () => {
    setTimeout(() => {
      alert("ลงคะแนนเสร็จสิ้น");
      signOut();
    }, 3000); // รอให้ toast โชว์ก่อนเล็กน้อย ถ้ามี
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>ลงคะแนนเลือกกรรมการ</h1>
      <CommitteeList committees={committees} onVoteSuccess={handleVoteSuccess} />
      <ToastContainer position="top-center" />
    </div>
  );
};

export default VotePage;
