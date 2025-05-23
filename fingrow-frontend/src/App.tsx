import Login from "./Views/Login/Login";
import Register from "./Views/Register/Register";
import Dashboard from "./Views/Dashboard/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./Context";

function App() {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
