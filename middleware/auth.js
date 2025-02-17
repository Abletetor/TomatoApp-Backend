import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
   }

   const token = authHeader.split(" ")[1];

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.body.userId = decoded.id;

      next();
   } catch (error) {
      console.error("JWT Verification Error:", error);
      return res.status(401).json({ success: false, message: "Invalid or Expired Token" });
   }
};

export default authMiddleware;
