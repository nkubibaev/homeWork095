import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <Container
            sx={{
                mt: 10,
                textAlign: 'center',
            }}
        >
            <Typography variant="h1">
                404
            </Typography>

            <Typography variant="h5" sx={{ mt: 2 }}>
                Страница не найдена
            </Typography>

            <Typography sx={{ mt: 1 }}>
                Такой страницы не существует.
            </Typography>

            <Button
                variant="contained"
                sx={{ mt: 3 }}
                onClick={() => navigate('/')}
            >
                На главную
            </Button>
        </Container>
    );
};

export default NotFoundPage;