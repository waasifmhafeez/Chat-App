import express from 'express';
import dotenv from 'dotenv';

import {connectDB} from './lib/db.js'

import authRoute from './routes/auth.route.js'

dotenv.config();

const app = express();
app.use(express.json())

const port = process.env.PORT;

app.use('/api/auth',authRoute)

app.listen(port, ()=>{
    console.log('server running',port);
    connectDB();
})