import './App.css'
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
