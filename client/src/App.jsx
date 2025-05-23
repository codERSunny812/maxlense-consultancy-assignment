import { Route, Routes } from "react-router-dom"
import Home from "./Component/Home"
import Login from "./Pages/Login"
import SignUp from "./Pages/SignUp"
import VerifyEmail from "./Pages/VerifyEmail"
import ForgotPassword from "./Pages/ForgotPassword"
import ResetPassword from "./Pages/ResetPassword"
import Profile from "./Component/Profile"
import PrivateRoute from "./Utils/ProctectedRoute"
import UserProfile from "./Pages/UsersProfile"
import EditUser from "./Pages/admin/Edituser"



function App() {


  return (
   <>
   <Routes>
    <Route path="/home" element={
      <PrivateRoute>
        <Home/>
      </PrivateRoute>
      } />
    <Route path="/login" element={<Login/>} />
    <Route path="/" element={<SignUp/>} />
    <Route path="/verify/:token" element={<VerifyEmail/>} />
    <Route path="/forgot-password" element={<ForgotPassword/>} />
    <Route path="/reset-password/:token" element={<ResetPassword/>} />
    <Route path="/profile"  element={
      <PrivateRoute>
      <Profile/>
      </PrivateRoute>
      }  />
    <Route path="/user/:id" element={<UserProfile/>} />
    <Route path="/admin/user/:id" element={<EditUser/>} />


   </Routes>
   </>
  )
}

export default App
