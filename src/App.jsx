import { Routes, Route } from 'react-router-dom';
import Layout from './components/layouts/Layout/Layout';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import TaskFlow from './Pages/TaskFlow/TaskFlow';
import RotaProtegida from './components/layouts/ui/RotaProtegida';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="app"
          element={
            <RotaProtegida>
              <TaskFlow />
            </RotaProtegida>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
