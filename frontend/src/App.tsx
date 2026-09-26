import Navbar from './components/Navbar';
import {Route, Routes} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.tsx";
import LoginPage from './pages/LoginPage';
import HomePage from "./pages/HomePage.tsx";
import CocktailPage from "./pages/CocktailPage.tsx";

const App = () => {
  return (
      <>
          <Navbar />

          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/cocktails/:id" element={<CocktailPage />} />
          </Routes>
      </>
  );
};

export default App;