import { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Grid,
    Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

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
    user: {
        username: string;
        displayName: string;
        avatar: string;
    };
}

const MyCocktailsPage = () => {
    const token = useUserStore((state) => state.token);
    const navigate = useNavigate();

    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchCocktails = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8000/cocktails/my',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message || 'Не удалось загрузить коктейли',
                    );
                    return;
                }

                setCocktails(data);
            } catch {
                setError('Ошибка соединения с сервером');
            } finally {
                setLoading(false);
            }
        };

        fetchCocktails();
    }, [token]);

    const deleteCocktail = async (id: string) => {
        if (!token) {
            return;
        }

        const confirmed = window.confirm(
            'Вы действительно хотите удалить этот коктейль?',
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/cocktails/${id}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Не удалось удалить коктейль');
                return;
            }

            setCocktails(
                cocktails.filter((cocktail) => cocktail._id !== id),
            );
        } catch {
            setError('Ошибка соединения с сервером');
        }
    };

    if (!token) {
        return (
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Alert severity="warning">
                    Для просмотра своих коктейлей необходимо войти.
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container sx={{ mt: 5 }}>
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
            <Typography variant="h4" sx={{ mb: 3 }}>
                Мои коктейли
            </Typography>

            {cocktails.length === 0 ? (
                <Typography>
                    У вас пока нет коктейлей.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {cocktails.map((cocktail) => (
                        <Grid
                            key={cocktail._id}
                            size={{ xs: 12, sm: 6, md: 4 }}
                        >
                            <Card
                                onClick={() =>
                                    navigate(`/cocktails/${cocktail._id}`)
                                }
                                sx={{
                                    cursor: 'pointer',
                                    height: '100%',
                                }}
                            >
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
                                        {cocktail.published
                                            ? 'Опубликован'
                                            : 'На модерации'}
                                    </Typography>

                                    <Button
                                        color="error"
                                        variant="outlined"
                                        sx={{ mt: 2 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteCocktail(cocktail._id);
                                        }}
                                    >
                                        Удалить
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyCocktailsPage;