// // src/components/routeGuards/PublicRoute.jsx
// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// const PublicRoute = ({ children }) => {
//   const { user } = useSelector((state) => state.auth);

//   if (user && user._id) {
//     // Already logged in
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default PublicRoute;
