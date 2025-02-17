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
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
const adminPanelUrl = process.env.ADMIN_PANEL_URL || "http://localhost:5174";

const allowedOrigins = [
   frontendUrl,
   adminPanelUrl
];

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
   origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
      } else {
         callback(new Error("Not allowed by CORS"));
      }
   },
   methods: "GET,POST,PUT,DELETE",
   credentials: true
}));

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