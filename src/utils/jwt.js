import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

export function generateJWT(payload) {
    return jwt.sign(payload, JWT_SECRET, { 
        issuer: 'hitt-api'
    });
}

export function verifyJWT(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

export function generateUserJWT(user) {
    const payload = {
        id: user.id,
        iat: Math.floor(Date.now() / 1000)
    };
    
    return generateJWT(payload);
}
