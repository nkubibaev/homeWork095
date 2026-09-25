import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import './models/User';
import usersRouter from './routes/users';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 8000;
const MONGODB_URL = 'mongodb://127.0.0.1:27017/cocktails';

app.get('/', (_req, res) => {
    res.send('Cocktail API is running');
});

app.use('/users', usersRouter);

const start = async () => {
    try {
        await mongoose.connect(MONGODB_URL);

        console.log('MongoDB connected');

        app.listen(PORT, () => {
            console.log(`Server started on port :${PORT}`);
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

start();