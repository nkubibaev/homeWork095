import mongoose, { HydratedDocument, Model } from 'mongoose';

export interface UserFields {
    username: string;
    displayName: string;
    email: string;
    avatar: string;
    password: string;
    role: 'user' | 'admin';
    googleId?: string;
    token?: string;
}

export type UserDocument = HydratedDocument<UserFields>;

const UserSchema = new mongoose.Schema<UserFields>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        displayName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            required: true,
        },
        googleId: {
            type: String,
            default: null,
        },
        token: {
            type: String,
            default: null,
        }
    },
    {
        versionKey: false,
    },
);

export const User: Model<UserFields> = mongoose.model<UserFields>(
    'User',
    UserSchema,
);