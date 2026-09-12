import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import ProtectedRoute from "./components/protectedroutes";

import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Bills from "./pages/Bills";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/expenses"
                    element={
                        <ProtectedRoute>
                            <Expenses />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/income"
                    element={
                        <ProtectedRoute>
                            <Income />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bills"
                    element={
                        <ProtectedRoute>
                            <Bills />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;