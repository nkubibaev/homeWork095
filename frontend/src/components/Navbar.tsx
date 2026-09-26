import { AppBar, Avatar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useUserStore } from '../store/userStore';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1 }}
                >
                    Cocktail App
                </Typography>

                {user ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Button
                            color="inherit"
                            onClick={() => navigate('/')}
                        >
                            Коктейли
                        </Button>

                        <Button
                            color="inherit"
                            onClick={() => navigate('/cocktails/create')}
                        >
                            Добавить коктейль
                        </Button>

                        <Button
                            color="inherit"
                            onClick={() => navigate('/my-cocktails')}
                        >
                            Мои коктейли
                        </Button>
                        {user.role === 'admin' && (
                            <Button
                                color="inherit"
                                onClick={() => navigate('/admin')}
                            >
                                Модерация
                            </Button>
                        )}
                        <Avatar src={user.avatar}>
                            {user.displayName.charAt(0)}
                        </Avatar>
                        <Typography>
                            {user.displayName}
                        </Typography>
                        <Button
                            color="inherit"
                            onClick={logout}
                        >
                            logout
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Sign in
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>
                            Sign up
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;