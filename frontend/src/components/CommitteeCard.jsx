import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./CardStyle.css"; // path ไปยัง css ที่คุณมี
import "./ConfirmStyle.css"; 


const voteStart = new Date("2025-04-01T15:00:00"); // เริ่มโหวต
const voteEnd = new Date("2025-04-02T16:30:00");   // ปิดโหวต
const CommitteeCard = ({ data, onVoteSuccess }) => {
    const borderColorMap = {
        1: "#78a3d4", // กลุ่ม 1 → น้ำเงิน
        2: "#92cea8", // กลุ่ม 2 → แดง
        3: "#fb6f92", // กลุ่ม 3 → เขียว
      };
      
      const borderColor = borderColorMap[data.comm_group] || "#999";  
  const imageUrl = `http://localhost:5001/images/${data.comm_image}`;

  const handleVote = () => {
    confirmAlert({
      title: "ยืนยันการลงคะแนน",
      message: `คุณต้องการลงคะแนนให้ ${data.comm_name} ใช่หรือไม่?`,
      buttons: [
        {
          label: "ใช่",
          onClick: () => submitVote(), // ⬅️ โหวตเฉพาะเมื่อกด "ใช่"
        },
        {
          label: "ยกเลิก",
          onClick: () => {},
        },
      ],
    });
  };
  
  const submitVote = () => {
    const voterId = localStorage.getItem("voter_id");
  
    if (!voterId) {
      toast.error("ไม่พบข้อมูลผู้ใช้");
      return;
    }
  
    fetch("http://localhost:5001/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        committee_id: data.comm_id,
        voter_id: voterId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          toast.success("ลงคะแนนสำเร็จ!");
        
          setTimeout(() => {
            if (onVoteSuccess) onVoteSuccess(); // <- ส่ง callback กลับไป logout
          }, 3000); // หน่วง 1.5 วิให้ toast โชว์ก่อน
        }
      })
      .catch((e) => toast.error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์"));
  };

  const handleConfirmVote = () => {
    const now = new Date();
  
    if (now < voteStart) {
      toast.info("ระบบลงคะแนนจะเปิดเวลา 17:00 น.");
      return;
    }
  
    if (now > voteEnd) {
      toast.error("หมดเวลาการลงคะแนนแล้ว");
      return;
    }
  
    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="custom-confirm">
          <h2>ยืนยันการลงคะแนน</h2>
          <p>คุณต้องการลงคะแนนให้</p>
          <h3>เบอร์ {data.comm_num} {data.comm_name}</h3>
          <div className="button-group">
            <button
              className="yes-btn"
              onClick={() => {
                submitVote();  // ✅ ส่งโหวตเมื่อกด "ใช่"
                onClose();     // ปิด popup
              }}
            >
              ใช่
            </button>
            <button className="cancel-btn" onClick={onClose}>ยกเลิก</button>
          </div>
        </div>
      )
    });
  };
  return (
    <div className="card">
        <img
            src={imageUrl}
            alt={data.comm_name}
            style={{
                width: "180px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "50%",
                border: `4px solid ${borderColor}`,
                marginBottom: "10px",
                boxShadow: "0 0 6px rgba(0, 0, 0, 0.15)"
            }}
        />
      <p className="card-number">{data.comm_num}</p>
      <h3>{data.comm_name}</h3>
        <button
            onClick={handleConfirmVote}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#fff";
                e.target.style.color = borderColor;
                e.target.style.border = `2px solid ${borderColor}`;
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = borderColor;
                e.target.style.color = "#fff";
                e.target.style.border = "none";
            }}
            style={{
                backgroundColor: borderColor,
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.2s ease"
            }}
            >
            ลงคะแนน
        </button>
    </div>
  );
};

export default CommitteeCard;