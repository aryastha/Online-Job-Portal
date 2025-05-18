import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = ({children}) => {
    const { user } = useSelector((store) => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    return <>{children}</>;
}

export default ProtectedRoute; 