import {type ChangeEvent, type SubmitEvent, useState} from 'react';
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import { useUserStore } from '../store/userStore';

interface Ingredient {
    name: string;
    amount: string;
}

const CreateCocktailPage = () => {
    const token = useUserStore((state) => state.token);
    const [name, setName] = useState('');
    const [recipe, setRecipe] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [ingredients, setIngredients] = useState<Ingredient[]>([
        {
            name: '',
            amount: '',
        },
    ]);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const addIngredient = () => {
        setIngredients([
            ...ingredients,
            {
                name: '',
                amount: '',
            },
        ]);
    };

    const removeIngredient = (index: number) => {
        setIngredients(
            ingredients.filter((_, ingredientIndex) => ingredientIndex !== index),
        );
    };

    const updateIngredient = (
        index: number,
        field: keyof Ingredient,
        value: string,
    ) => {
        setIngredients(
            ingredients.map((ingredient, ingredientIndex) => {
                if (ingredientIndex !== index) {
                    return ingredient;
                }

                return {
                    ...ingredient,
                    [field]: value,
                };
            }),
        );
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;

        setImage(file);
    };

    const submitForm = async (e: SubmitEvent) => {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (!token) {
            setError('You need to log in your account');
            return;
        }

        if (!image) {
            setError('Select image');
            return;
        }

        const hasEmptyIngredient = ingredients.some((ingredient) =>
                !ingredient.name.trim() || !ingredient.amount.trim(),
        );

        if (hasEmptyIngredient) {
            setError('Fill in all ingredients');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();

            formData.append('name', name);
            formData.append('recipe', recipe);
            formData.append('ingredients', JSON.stringify(ingredients));
            formData.append('image', image);

            const response = await fetch(
                'http://localhost:8000/cocktails',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'failed create cocktail');
                return;
            }

            setSuccess('Your cocktail is review by moderator.');
            setName('');
            setRecipe('');
            setImage(null);
            setIngredients([
                {
                    name: '',
                    amount: '',
                },
            ]);
        } catch {
            setError('Server connection error');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <Container maxWidth="sm" sx={{ mt: 5 }}>
                <Alert severity="warning">
                    Для создания коктейля необходимо войти в аккаунт.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Создать коктейль
            </Typography>

            <Box
                component="form"
                onSubmit={submitForm}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success">
                        {success}
                    </Alert>
                )}

                <TextField
                    label="Название коктейля"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />

                <TextField
                    label="Рецепт"
                    value={recipe}
                    onChange={(event) => setRecipe(event.target.value)}
                    multiline
                    minRows={5}
                    required
                />

                <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Картинка
                    </Typography>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </Box>

                <Box>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Ингредиенты
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        {ingredients.map((ingredient, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    alignItems: 'center',
                                }}
                            >
                                <TextField
                                    label="Ингредиент"
                                    value={ingredient.name}
                                    onChange={(event) =>
                                        updateIngredient(
                                            index,
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                    required
                                    fullWidth
                                />

                                <TextField
                                    label="Количество"
                                    value={ingredient.amount}
                                    onChange={(event) =>
                                        updateIngredient(
                                            index,
                                            'amount',
                                            event.target.value,
                                        )
                                    }
                                    required
                                    fullWidth
                                />

                                {ingredients.length > 1 && (
                                    <Button
                                        type="button"
                                        color="error"
                                        onClick={() => removeIngredient(index)}
                                    >
                                        Delete
                                    </Button>
                                )}
                            </Box>
                        ))}
                    </Box>

                    <Button
                        type="button"
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={addIngredient}
                    >
                        Добавить ингредиент
                    </Button>
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {loading
                        ? 'Создание...'
                        : 'Создать коктейль'}
                </Button>
            </Box>
        </Container>
    );
};

export default CreateCocktailPage;