import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place Order
const placeOrder = async (req, res) => {
   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
   try {
      // Save order details in the database
      const newOrder = new orderModel({
         userId: req.body.userId,
         items: req.body.items,
         amount: req.body.amount,
         address: req.body.address,
      });

      await newOrder.save();
      await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

      // Format items for Stripe Checkout
      const line_items = req.body.items.map((item) => ({
         price_data: {
            currency: 'usd',
            product_data: { name: item.name },
            unit_amount: Math.round(item.price * 100),
         },
         quantity: item.quantity,
      }));

      // Add delivery charge
      line_items.push({
         price_data: {
            currency: 'usd',
            product_data: { name: "Delivery Charges" },
            unit_amount: 200,
         },
         quantity: 1,
      });

      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
         line_items,
         mode: 'payment',
         success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
         cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`,
      });

      res.status(200).json({ success: true, session_url: session.url });
   } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ success: false, message: "Failed to place order. Please try again." });
   }
};

//Verify order
const verifyOrder = async (req, res) => {
   const { orderId, success } = req.body;
   try {
      if (success === 'true') {
         await orderModel.findByIdAndUpdate(orderId, { payment: true });
         res.status(200).json({ success: true, message: 'payment success' });
      } else {
         await orderModel.findByIdAndDelete(orderId);
         res.status(200).json({ success: false, message: 'Not Paid' });
      }
   } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
   }
};

// Get User Orders
const getOrders = async (req, res) => {
   try {
      const orders = await orderModel.find({ userId: req.body.userId });

      if (!orders.length) {
         return res.status(404).json({ success: false, message: "No orders found for this user." });
      }

      res.status(200).json({ success: true, data: orders });
   } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};

// Listing orders for Admin
const listOrders = async (req, res) => {
   try {
      const orders = await orderModel.find({});
      res.status(200).json({ success: true, data: orders });
   } catch (err) {
      console.log(err);
      res.status(500).json({ sucess: false, message: "Internal Server Error" });
   }
};

// Update Order Status
const updateStatus = async (req, res) => {
   try {
      await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
      res.status(200).json({ success: true, status: "Status Updated" });
   } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};


export { placeOrder, verifyOrder, getOrders, listOrders, updateStatus };