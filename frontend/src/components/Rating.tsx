import {type SyntheticEvent, useState} from 'react';
import { Alert, Box, Rating as MuiRating, Typography } from '@mui/material';
import { useUserStore } from '../store/userStore';

interface RatingProps {
    cocktailId: string;
    value: number | null;
    average: number;
    count: number;
    onRatingChange: (
        rating: number,
    ) => void;
}

const Rating = ({
                    cocktailId,
                    value,
                    average,
                    count,
                    onRatingChange,
                }: RatingProps) => {
    const token = useUserStore((state) => state.token);

    const [error, setError] = useState('');

    const handleChange = async (_event: SyntheticEvent,
        newValue: number | null,
    ) => {
        if (!token || newValue === null) {
            return;
        }

        setError('');

        try {
            const response = await fetch(
                `http://localhost:8000/cocktails/${cocktailId}/rating`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        rating: newValue,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message || 'Failed to save rating',
                );
                return;
            }

            onRatingChange(newValue);
        } catch {
            setError('Server connection error');
        }
    };

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h6">
                Рейтинг
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mt: 1,
                }}
            >
                <MuiRating
                    value={value}
                    precision={1}
                    max={5}
                    onChange={handleChange}
                />

                <Typography>
                    {average.toFixed(1)} ({count})
                </Typography>
            </Box>

            {value !== null && (
                <Typography
                    variant="body2"
                    sx={{ mt: 1 }}
                >
                    Ваша оценка: {value}
                </Typography>
            )}

            {error && (
                <Alert
                    severity="error"
                    sx={{ mt: 1 }}
                >
                    {error}
                </Alert>
            )}
        </Box>
    );
};

export default Rating;