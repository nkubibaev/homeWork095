import { Typography } from '@mui/material';
import Navbar from './components/Navbar';

const App = () => {
  return (
      <>
        <Navbar />

        <Typography
            variant="h4"
            sx={{ p: 3 }}
        >
          Коктейли
        </Typography>
      </>
  );
};

export default App;