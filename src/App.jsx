import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile'; // Nuevo componente para el perfil de usuario
import "@fontsource/klee-one"; // Esto importará el peso por defecto (400)

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Home" element={<Home />} />
                {/* Ruta dinámica para usuarios específicos */}
                <Route path="/users/:id" element={<UserProfile />} /> {/* Ruta dinámica */}
            </Routes>
        </>
    );
};

export default App;