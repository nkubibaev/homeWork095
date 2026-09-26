import Navbar from './components/Navbar';
import {Route, Routes} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage.tsx";

const App = () => {
  return (
      <>
          <Navbar />

          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
          </Routes>
      </>
  );
};

export default App;