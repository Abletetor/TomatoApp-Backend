import foodModel from "../models/foodModel.js";
import fs from 'fs';

//Add foods
const addFood = async (req, res) => {
   let image_filename = `${req.file.filename}`;

   const food = new foodModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: image_filename,
      category: req.body.category,
   });
   try {
      await food.save();
      res.json({ success: true, message: 'Food added' });
   } catch (error) {
      res.json({ success: false, message: 'Failed to add food' });
      console.log(error);
   }

};

//All food List
const listFood = async (req, res) => {
   try {
      const foods = await foodModel.find({});
      res.json({ success: true, data: foods });
   } catch (err) {
      res.json({ success: false, message: 'Failed to fetch food' });
      console.log(err);
   }
};

//Remove/ delete food
const removeFood = async (req, res) => {
   try {
      const food = await foodModel.findById(req.body.id);
      fs.unlink(`uploads/${food.image}`, () => { });

      await foodModel.findByIdAndDelete(req.body.id);
      res.json({ success: true, message: "Food remove successfully" });
   } catch (err) {
      res.json({ success: false, message: 'Failed to remove food' });
      console.log(err);
   }

};

// Search Food
const searchFoods = async (req, res) => {
   try {
      const query = req.query.q;
      if (!query) {
         return res.status(400).json({ success: false, message: "Search query is required" });
      }

      // Perform case-insensitive search
      const foods = await foodModel.find({
         name: { $regex: query, $options: "i" },
      });

      if (foods.length === 0) {
         return res.status(404).json({ success: false, message: "No matching foods found" });
      }

      res.status(200).json({ success: true, data: foods });
   } catch (error) {
      console.error("Error searching foods:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
   }
};


export { addFood, listFood, removeFood, searchFoods };