const jwt = require('jsonwebtoken');

exports.auth = async (req, res, next) => {
   try {
      const token = req.headers["auth"];
      if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

      const decodedToken = jwt.verify(token, "surya");
      req.user = decodedToken;
      next();
   } catch (error) {
      return res.status(400).json({ success: false, message: "Invalid token." });
   }
};
