import { useState , type SubmitEvent } from 'react';
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitForm = async (e: SubmitEvent) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:8000/users',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        displayName,
                        email,
                        avatar,
                        password,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Registration failed');
                return;
            }

            navigate('/login');
        } catch {
            setError('Server connection error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                component="form"
                onSubmit={submitForm}
                sx={{
                    mt: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant="h4">
                    Регистрация
                </Typography>

                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Username"
                    value={username}
                    onChange={(event) =>
                        setUsername(event.target.value)
                    }
                    required
                />

                <TextField
                    label="Display name"
                    value={displayName}
                    onChange={(event) =>
                        setDisplayName(event.target.value)
                    }
                    required
                />

                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    required
                />

                <TextField
                    label="Avatar URL"
                    value={avatar}
                    onChange={(event) =>
                        setAvatar(event.target.value)
                    }
                    required
                />

                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(event) =>
                        setPassword(event.target.value)
                    }
                    required
                />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
            </Box>
        </Container>
    );
};

export default RegisterPage;