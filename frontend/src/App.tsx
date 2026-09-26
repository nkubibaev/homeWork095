import Navbar from './components/Navbar';
import {Route, Routes} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
      <>
          <Navbar />

          <Routes>
              <Route path="/" element={<h1>Коктейли</h1>} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
          </Routes>
      </>
  );
};

export default App;