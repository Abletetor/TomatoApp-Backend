import userModel from '../models/userModel.js';
import mongoose from 'mongoose';

// Add to cart
const addToCart = async (req, res) => {
   try {
      const { userId, itemId } = req.body;

      // Check if userId or itemId is missing
      if (!userId || !itemId) {
         return res.status(400).json({ success: false, message: "User ID and Item ID are required" });
      }

      // Validate userId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
         return res.status(400).json({ success: false, message: "Invalid User ID format" });
      }

      // Find user by userId
      let userData = await userModel.findById(userId);
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      // Ensure cartData exists
      let cartData = userData.cartData || {};

      // Update cartData
      cartData[itemId] = (cartData[itemId] || 0) + 1;

      // Save updated cartData
      await userModel.findByIdAndUpdate(userId, { cartData });

      res.status(200).json({ success: true, message: "Item added to cart" });
   } catch (error) {
      console.error("Error in addToCart:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};


// Remove from cart
const removeFromCart = async (req, res) => {
   try {
      const { userId, itemId } = req.body;

      // Check if userId or itemId is missing
      if (!userId || !itemId) {
         return res.status(400).json({ success: false, message: "User ID and Item ID are required" });
      }

      // Validate userId format
      if (!mongoose.Types.ObjectId.isValid(userId)) {
         return res.status(400).json({ success: false, message: "Invalid User ID format" });
      }

      // Find user
      let userData = await userModel.findById(userId);
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      // Ensure cartData exists
      let cartData = userData.cartData || {};

      // If item exists, decrease quantity or remove it
      if (cartData[itemId]) {
         cartData[itemId] -= 1;
         if (cartData[itemId] <= 0) {
            delete cartData[itemId];
         }
      } else {
         return res.status(400).json({ success: false, message: "Item not found in cart" });
      }

      // Update database with the modified cartData
      await userModel.findByIdAndUpdate(userId, { cartData });
      res.status(200).json({ success: true, message: "Item removed from cart" });
   } catch (error) {
      console.error("Error in removeFromCart:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};

// Get cart items of a user
const getCart = async (req, res) => {
   try {
      const { userId } = req.query;

      // Check if userId is valid
      if (!mongoose.Types.ObjectId.isValid(userId)) {
         return res.status(400).json({ success: false, message: "Invalid User ID format" });
      }

      const userData = await userModel.findById(userId);
      if (!userData) {
         return res.status(404).json({ success: false, message: "User not found" });
      }

      // Ensure cartData exists
      const cartData = userData.cartData || {};
      res.status(200).json({ success: true, cartData });
   } catch (error) {
      console.error("Error in getCart:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};


export { addToCart, removeFromCart, getCart };