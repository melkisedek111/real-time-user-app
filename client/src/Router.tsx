import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import UsersPage from './components/UsersPage';
import { useUser } from './context/userContext';

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