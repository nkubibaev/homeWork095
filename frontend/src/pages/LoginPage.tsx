import { useState, type SubmitEvent } from 'react';
import { Alert, Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';

const LoginPage = () => {
    const navigate = useNavigate();
    const login = useUserStore((state) => state.login);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const submitForm = async (e: SubmitEvent,
    ) => {
        e.preventDefault();

        setError('');
        setLoading(true);

        try {
            const response = await fetch(
                'http://localhost:8000/users/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Login failed');
                return;
            }

            login(data.user, data.user.token);

            navigate('/');
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
                    Sign in
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
                    {loading ? 'Enter...' : 'Enter'}
                </Button>
            </Box>
        </Container>
    );
};

export default LoginPage;