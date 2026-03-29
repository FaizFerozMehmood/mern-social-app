import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import { Avatar, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";

const VisitorsList = () => {
  const { userId } = useParams();
  const [visitors, setVisitors] = useState([]);

  
  const visitorsCount = visitors.length;

  useEffect(() => {
    const getVisitors = async () => {
      if (!userId) return;
      try {
        const res = await api.get(`/api/visitors/${userId}`);
       
        setVisitors(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching visitors:", err);
      }
    };

    getVisitors();
  }, [userId]);

  return (
    <div style={{ textAlign: "center", minWidth: "140px", marginTop: "20px" }}>
      <h3 style={{ marginBottom: 4 }}>{visitorsCount}</h3>
      <span style={{ color: "#666", display: "block", marginBottom: 8, fontSize: '13px' }}>
        Profile Visitors
      </span>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 6,
        }}
      >
        
        {visitors.slice(0, 5).map((v, i) => (
          <Tooltip key={v._id} title={v.visitorsId?.userName || "Anonymous"}>
            <Avatar
              src={v.visitorsId?.profileImage}
              size={32}
              icon={<UserOutlined />}
              style={{
                marginLeft: i === 0 ? 0 : -12, 
                border: "2px solid white",
                cursor: "pointer",
                backgroundColor: "#1677ff",
              }}
            />
          </Tooltip>
        ))}

       
        {visitorsCount > 5 && (
          <Avatar
            size={32}
            style={{
              marginLeft: -12,
              background: "#f0f2f5",
              color: "#555",
              fontSize: 12,
              fontWeight: 'bold',
              border: "2px solid white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +{visitorsCount - 5}
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default VisitorsList;