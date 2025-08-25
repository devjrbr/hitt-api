import { findUserByEmail, updateUserLoginCode } from '../repository/index.js';
import { generateUserJWT } from '../utils/jwt.js';
import { sendLoginCode } from '../utils/email.js';

export async function requestLoginCode(email) {
    const user = await findUserByEmail(email);
    
    if (!user) {
        throw new Error('User not found');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    await updateUserLoginCode(user.id, code);
    
    try {
        await sendLoginCode(email, code, user.full_name);
        return { message: 'Verification code sent to email' };
    } catch (error) {
        await updateUserLoginCode(user.id, null);
        console.error(`[${new Date().toISOString()}] [msg:"Failed to send login code to ${email}"] [error: ${error.message}]`);
        throw new Error('Failed to send email');
    }
}

export async function verifyLoginCode(email, code) {
    const user = await findUserByEmail(email);
    
    if (!user) {
        throw new Error('User not found');
    }
    
    if (!user.login_code) {
        throw new Error('No code found');
    }
    
    if (user.login_code !== code) {
        throw new Error('Invalid code');
    }
    
    if (user.login_code_expires_at && new Date() > new Date(user.login_code_expires_at)) {
        await updateUserLoginCode(user.id, null);
        throw new Error('Code has expired');
    }
    
    await updateUserLoginCode(user.id, null);
    
    const token = generateUserJWT(user);
    
    return { token };
}
