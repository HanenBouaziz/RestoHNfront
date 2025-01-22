import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
const ProtectedRoute = () => {
    const token=localStorage.getItem("CC_Token");
    //console.log("token est " + token)
    return(
        token!=null ? <><Outlet/></>: <Navigate to="/"/>
    )
}

export default ProtectedRoute
