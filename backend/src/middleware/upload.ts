import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDirectory = path.join(process.cwd(), 'public', 'uploads', 'cocktails');

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname);
        const filename = `${Date.now()}${extension}`;

        cb(null, filename);
    },
});

export const uploadCocktailImage = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});