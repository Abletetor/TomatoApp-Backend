import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db.js';
import foodRouter from './routes/foodRoutes.js';
import userRouter from './routes/userRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

dotenv.config();

//App Config
const app = express();
const PORT = process.env.APP_PORT || 4000;

//Connect to Database
connectDB();

//CORS setup
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

const corsOptions = {
   origin: allowedOrigins,
   methods: "GET,POST,PUT,DELETE",
   allowedHeaders: ["Content-Type", "Authorization"],
   credentials: true,
};
//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Serve static files from the "upload" folder
const __dirname = path.resolve();
app.use('/images', express.static(path.join(__dirname, '/uploads')));

//API Endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);


app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});