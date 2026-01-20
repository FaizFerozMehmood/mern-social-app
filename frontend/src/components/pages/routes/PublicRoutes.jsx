import { Navigate } from "react-router-dom";


const PublicRotes = ({children})=>{
    const token = localStorage.getItem('token')
    if(token){
        return <Navigate to='/posts' replace/>
    }
    return children;
}

export default PublicRotes

