import { useEffect, useState } from 'react';
import {
    Alert,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from '@mui/material';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

interface Ingredient {
    name: string;
    amount: string;
}

interface Rating {
    userId: string;
    rating: number;
}

interface Cocktail {
    _id: string;
    name: string;
    image: string;
    recipe: string;
    published: boolean;
    ingredients: Ingredient[];
    ratings: Rating[];
    ratingCount: number;
    ratingAverage: number;
    userRating: number | null;
    user: {
        username: string;
        displayName: string;
        avatar: string;
    };
}

const HomePage = () => {
    const token = useUserStore((state) => state.token);

    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCocktails = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    'http://localhost:8000/cocktails',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || 'Failed to load cocktails');
                    return;
                }

                setCocktails(data);
            } catch {
                setError('Server connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchCocktails();
    }, [token]);

    if (!token) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography variant="h4">
                    Коктейли
                </Typography>

                <Typography sx={{ mt: 2 }}>
                    Войдите, чтобы увидеть коктейли.
                </Typography>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container
                sx={{
                    mt: 5,
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">
                    {error}
                </Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 5 }}>
            <Typography
                variant="h4"
                sx={{ mb: 3 }}
            >
                Коктейли
            </Typography>

            <Grid container spacing={3}>
                {cocktails.map((cocktail) => (
                    <Grid key={cocktail._id} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card
                            onClick={() =>
                                navigate(`/cocktails/${cocktail._id}`)
                            }
                            sx={{ cursor: 'pointer' }}>
                            <CardMedia
                                component="img"
                                height="220"
                                image={`http://localhost:8000${cocktail.image}`}
                                alt={cocktail.name}
                            />

                            <CardContent>
                                <Typography variant="h5">
                                    {cocktail.name}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1 }}
                                >
                                    Автор: {cocktail.user.displayName}
                                </Typography>

                                <Typography
                                    variant="body2"
                                    sx={{ mt: 1 }}
                                >
                                    ⭐ {cocktail.ratingAverage.toFixed(1)}
                                    {' '}
                                    ({cocktail.ratingCount})
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default HomePage;