import { useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, CardMedia, CircularProgress, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

interface Cocktail {
    _id: string;
    name: string;
    image: string;
    recipe: string;
    published: boolean;
    ingredients: {
        name: string;
        amount: string;
    }[];
    user: {
        username: string;
        displayName: string;
        avatar: string;
    };
}

const AdminPage = () => {
    const token = useUserStore((state) => state.token);
    const user = useUserStore((state) => state.user);
    const navigate = useNavigate();
    const [cocktails, setCocktails] = useState<Cocktail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token || user?.role !== 'admin') {
            setLoading(false);
            return;
        }

        const fetchCocktails = async () => {
            try {
                const response = await fetch(
                    'http://localhost:8000/cocktails/admin/unpublished',
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
    }, [token, user]);

    const publishCocktail = async (id: string) => {
        if (!token) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/cocktails/${id}/publish`,
                {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message || 'Не удалось опубликовать коктейль',
                );
                return;
            }

            setCocktails(
                cocktails.filter((cocktail) => cocktail._id !== id),
            );
        } catch {
            setError('Ошибка соединения с сервером');
        }
    };

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
                setError(
                    data.message || 'Не удалось удалить коктейль',
                );
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
                    Для доступа к странице необходимо войти.
                </Alert>
            </Container>
        );
    }

    if (user?.role !== 'admin') {
        return (
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Alert severity="error">
                    У вас нет доступа к странице администратора.
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
                Модерация коктейлей
            </Typography>

            {cocktails.length === 0 ? (
                <Typography>
                    Нет коктейлей на модерации.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {cocktails.map((cocktail) => (
                        <Grid
                            key={cocktail._id}
                            size={{ xs: 12, sm: 6, md: 4 }}
                        >
                            <Card sx={{ height: '100%' }}>
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
                                        {cocktail.recipe}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        sx={{ mt: 2, mr: 1 }}
                                        onClick={() =>
                                            navigate(`/cocktails/${cocktail._id}`)
                                        }
                                    >
                                        Просмотреть
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="success"
                                        sx={{ mt: 2, mr: 1 }}
                                        onClick={() =>
                                            publishCocktail(cocktail._id)
                                        }
                                    >
                                        Опубликовать
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        sx={{ mt: 2 }}
                                        onClick={() =>
                                            deleteCocktail(cocktail._id)
                                        }
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

export default AdminPage;