import Navbar from './components/Navbar';
import {Route, Routes} from "react-router-dom";
import RegisterPage from "./pages/RegisterPage.tsx";

const App = () => {
  return (
      <>
          <Navbar />

          <Routes>
              <Route path="/" element={<h1>Коктейли</h1>} />
              <Route path="/register" element={<RegisterPage />} />
          </Routes>
      </>
  );
};

export default App;