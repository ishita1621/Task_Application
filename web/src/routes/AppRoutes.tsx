import {Routes,Route,Navigate} from "react-router-dom"
import Login from "../pages/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Signup from "../pages/SignUp";



export default function AppRoutes(){
    return(
        <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login/>}/>
            <Route element={<ProtectedRoute/>}>
                <Route path="/dashboard" element={<Dashboard/>} />
            </Route>
            <Route path="/" element={<Navigate to="/login" replace />}/>
        </Routes>
    );
}