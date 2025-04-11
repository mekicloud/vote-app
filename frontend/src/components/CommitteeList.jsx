import CommitteeCard from "./CommitteeCard";
import "./CardStyle.css";

const CommitteeList = ({ committees, onVoteSuccess }) => {
  return (
    <div className="committee-grid">
     {committees.map((item) => (
      <CommitteeCard key={item.comm_id} data={item} onVoteSuccess={onVoteSuccess} />
    ))}
    </div>
  );
};

export default CommitteeList;