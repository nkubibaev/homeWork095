import { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Alert,
    Box, Button,
    CircularProgress,
    Container,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material';
import { useUserStore } from '../store/userStore';
import Rating from '../components/Rating';

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
        _id: string;
        username: string;
        displayName: string;
        avatar: string;
    };
}

const CocktailPage = () => {
    const { id } = useParams();
    const token = useUserStore((state) => state.token);
    const user = useUserStore((state) => state.user);
    const [cocktail, setCocktail] = useState<Cocktail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRatingChange = (rating: number) => {
        if (!cocktail) {
            return;
        }

        setCocktail({
            ...cocktail,
            userRating: rating,
            ratingCount:
                cocktail.userRating === null
                    ? cocktail.ratingCount + 1
                    : cocktail.ratingCount,
            ratingAverage:
                cocktail.userRating === null
                    ? (
                        (cocktail.ratingAverage *
                            cocktail.ratingCount +
                            rating) /
                        (cocktail.ratingCount + 1)
                    )
                    : (
                        (cocktail.ratingAverage *
                            cocktail.ratingCount -
                            cocktail.userRating +
                            rating) /
                        cocktail.ratingCount
                    ),
        });
    };

    useEffect(() => {
        const fetchCocktail = async () => {
            if (!token || !id) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8000/cocktails/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    setError(
                        data.message || 'Failed to load cocktail',
                    );
                    return;
                }

                setCocktail(data);
            } catch {
                setError('Server connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchCocktail();
    }, [id, token]);

    const deleteCocktail = async () => {
        if (!token || !cocktail) {
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
                `http://localhost:8000/cocktails/${cocktail._id}`,
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

            navigate('/');
        } catch {
            setError('Ошибка соединения с сервером');
        }
    };

    if (!token) {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="info">
                    Войдите, чтобы просмотреть коктейль.
                </Alert>
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

    if (!cocktail) {
        return (
            <Container sx={{ mt: 5 }}>
                <Alert severity="error">
                    Коктейль не найден
                </Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 5, mb: 5 }}>
            <Paper sx={{ p: 3 }}>
                <Box
                    component="img"
                    src={`http://localhost:8000${cocktail.image}`}
                    alt={cocktail.name}
                    sx={{
                        width: '100%',
                        maxHeight: 450,
                        objectFit: 'cover',
                        borderRadius: 2,
                    }}
                />

                <Typography
                    variant="h3"
                    sx={{ mt: 3 }}
                >
                    {cocktail.name}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{ mt: 1 }}
                >
                    Автор: {cocktail.user.displayName}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{ mt: 2 }}
                >
                    ⭐ {cocktail.ratingAverage.toFixed(1)}
                    {' '}
                    ({cocktail.ratingCount} оценок)
                </Typography>

                <Typography
                    variant="h5"
                    sx={{ mt: 4 }}
                >
                    Ингредиенты
                </Typography>

                <List>
                    {cocktail.ingredients.map(
                        (ingredient, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={ingredient.name}
                                    secondary={ingredient.amount}
                                />
                            </ListItem>
                        ),
                    )}
                </List>

                <Typography
                    variant="h5"
                    sx={{ mt: 3 }}
                >
                    Рецепт
                </Typography>

                <Typography
                    sx={{
                        mt: 2,
                        whiteSpace: 'pre-wrap',
                    }}
                >
                    {cocktail.recipe}
                </Typography>

                <Rating
                    cocktailId={cocktail._id}
                    value={cocktail.userRating}
                    average={cocktail.ratingAverage}
                    count={cocktail.ratingCount}
                    onRatingChange={handleRatingChange}
                />

                {user &&
                    (user.role === 'admin' ||
                        user._id === cocktail.user._id) && (
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{ mt: 2 }}
                            onClick={deleteCocktail}
                        >
                            Удалить
                        </Button>
                    )
                }
            </Paper>
        </Container>
    );
};

export default CocktailPage;