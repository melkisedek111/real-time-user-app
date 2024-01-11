import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import LoginPage from './components/LoginPage'
import AppRoutes from './Router'
import { UserProvider } from './context/userContext'
import { Toaster } from './components/ui/toaster'
import { BrowserRouter as Router } from 'react-router-dom';

function App() {

    return (
        <Router>
            <UserProvider>
                <AppRoutes />
                <Toaster />
            </UserProvider>
        </Router>
    )
}

export default App
