import axios from 'axios';
import nodemailer from 'nodemailer';

async function sendViaMailgunAPI(email, code, userName) {
    const domain = process.env.MAILGUN_DOMAIN;
    const apiKey = process.env.MAILGUN_API_KEY;
    
    if (!domain || !apiKey) {
        throw new Error('Mailgun credentials not configured');
    }

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin: 0;">HITT</h1>
                <p style="color: #666; margin: 5px 0;">Seu código de acesso</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
                <h2 style="color: #333; margin: 0 0 15px 0;">Olá${userName ? `, ${userName}` : ''}!</h2>
                <p style="color: #666; margin: 0 0 25px 0;">Use o código abaixo para acessar sua conta:</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${code}</span>
                </div>
                
                <p style="color: #999; font-size: 14px; margin: 20px 0 0 0;">
                    Este código é válido por 10 minutos.<br>
                    Se você não solicitou este código, ignore este email.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                    © 2025 HITT App. Todos os direitos reservados.
                </p>
            </div>
        </div>
    `;

    try {
        const response = await axios.post(
            `https://api.mailgun.net/v3/${domain}/messages`,
            new URLSearchParams({
                from: `HITT App <hitt@${domain}>`,
                to: email,
                subject: 'Seu código de acesso - HITT',
                html: htmlContent
            }),
            {
                auth: {
                    username: 'api',
                    password: apiKey
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return { success: true, messageId: response.data.id };
    } catch (error) {
        console.error(`[${new Date().toISOString()}] [msg:"Mailgun API failed"] [error: ${error.response?.data || error.message}]`);
        throw new Error('Failed to send email');
    }
}

export async function sendLoginCode(email, code, userName) {
    if (process.env.MAILGUN_SMTP_PASSWORD) {
        try {
            return await sendViaMailgunSMTP(email, code, userName);
        } catch (error) {
            console.error(`[${new Date().toISOString()}] [msg:"Mailgun SMTP failed, trying API fallback"] [error: ${error.message}]`);
        }
    }
    
    return await sendViaMailgunAPI(email, code, userName);
}

async function sendViaMailgunSMTP(email, code, userName) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        secure: false,
        auth: {
            user: `hitt@${process.env.MAILGUN_DOMAIN}`,
            pass: process.env.MAILGUN_SMTP_PASSWORD
        }
    });

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #333; margin: 0;">HITT</h1>
                <p style="color: #666; margin: 5px 0;">Seu código de acesso</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; margin: 20px 0;">
                <h2 style="color: #333; margin: 0 0 15px 0;">Olá${userName ? `, ${userName}` : ''}!</h2>
                <p style="color: #666; margin: 0 0 25px 0;">Use o código abaixo para acessar sua conta:</p>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <span style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px;">${code}</span>
                </div>
                
                <p style="color: #999; font-size: 14px; margin: 20px 0 0 0;">
                    Este código é válido por 10 minutos.<br>
                    Se você não solicitou este código, ignore este email.
                </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="color: #999; font-size: 12px; margin: 0;">
                    © 2025 HITT App. Todos os direitos reservados.
                </p>
            </div>
        </div>
    `;

    const info = await transporter.sendMail({
        from: `"HITT App" <hitt@${process.env.MAILGUN_DOMAIN}>`,
        to: email,
        subject: 'Seu código de acesso - HITT',
        html: htmlContent
    });

    return { success: true, messageId: info.messageId };
}
