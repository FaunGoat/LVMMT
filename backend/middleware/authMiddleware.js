const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Không có token, vui lòng đăng nhập",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token đã hết hạn, vui lòng đăng nhập lại",
      });
    }

    res.status(401).json({
      success: false,
      error: "Token không hợp lệ",
    });
  }
};
