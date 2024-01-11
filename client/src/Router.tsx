import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import UsersPage from './components/UsersPage';
import { useUser } from './context/userContext';


type TGuestRouteProps = {
    children: React.ReactNode;
}

type TPrivateRouteProps = {
    element: React.ReactNode;
    path: string;
}


interface PrivateRouteProps {
    path?: string;
    element?: React.ReactNode;
}



// const PrivateRoute: React.FC<TPrivateRouteProps> = ({ path, element }) => {
//     const { user } = useUser();
//     if (user.isLoggedIn) {
//       return <Route path={path} element={element} />;
//     } else {
//       return <Navigate to="/login" replace />;
//     }
//   };


const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({
    element,
  }) => {
    const { user } = useUser();

    return user.isLoggedIn ? (
      <>{element}</>
    ) : (
      <Navigate to="/login" replace />
    );
  };

const GuestRoute: React.FC = () => {
    const { user } = useUser();
    return (
        !user.isLoggedIn ? <Outlet /> : (
            <Navigate to="/dashboard" />
        )
    )
}
const AppRoutes = () => {



    return (
        <div className="min-h-screen flex items-center justify-center">
            <Routes>
                <Route
                    path="/dashboard"
                    element={<PrivateRoute element={<UsersPage />} />}
                />
                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                </Route>
                <Route path="*" element={<div>LOGIN PAGE</div>} />
            </Routes>
        </div>
    )
}

export default AppRoutes;