import 'dotenv/config';
import express, { json } from 'express';
import { userRouter, categoryRouter, authRouter, checkinRouter, eventRouter } from './src/routes/index.js';

const app = express();
const port = 3000;

app.use(json());
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/auth', authRouter);
app.use('/', checkinRouter);
app.use('/', eventRouter);

app.get('/ping', (req, res) => {
    res.send('pong');
});

app.listen(port, () => {
    console.log(`App started!`)
});
