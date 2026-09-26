import { AppBar, Avatar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useUserStore } from '../store/userStore';

const Navbar = () => {
    const user = useUserStore((state) => state.user);
    const logout = useUserStore((state) => state.logout);

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
                        <Button color="inherit">
                            Sign in
                        </Button>
                        <Button color="inherit">
                            Sign up
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;