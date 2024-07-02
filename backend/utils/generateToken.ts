import jwt from "jsonwebtoken"

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, process.env.SECRET_KEY!, { expiresIn: '1h' });
};