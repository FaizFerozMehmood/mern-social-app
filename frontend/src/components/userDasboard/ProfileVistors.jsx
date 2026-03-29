import { useEffect } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
// {
//   "profileOwner": "DUSRE_KI_USER_ID", 
//   "visitorsId": "MERI_APNI_ID"
// }

const ProfileVistors = () => {
      const { userId } = useParams();
    const myId = localStorage.getItem('id');

    useEffect(() => {
        
        if (!userId || !myId || userId === myId) {
            console.log("ℹ️ Skipping: Same user or missing IDs", { userId, myId });
            return;
        }

        const postVisit = async () => {
            try {
                const response = await api.post('/api/visitors', {
                    profileOwner: userId,
                    visitorsId: myId,
                });
                console.log(" Visit recorded:", response.data);
            } catch (error) {
                console.log("Error visiting profile:", error.response?.data || error.message);
            }
        };

        postVisit();
    }, [userId]); 


    return null;
};

export default ProfileVistors;