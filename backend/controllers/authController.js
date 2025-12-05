const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

// Tạo JWT token
const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ĐĂNG NHẬP
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Vui lòng nhập email và mật khẩu",
      });
    }

    // Tìm admin
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        error: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "Email hoặc mật khẩu không chính xác",
      });
    }

    // Check active status
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        error: "Tài khoản đã bị khóa",
      });
    }

    // Cập nhật lastLogin
    admin.lastLogin = new Date();
    await admin.save();

    // Tạo token
    const token = generateToken(admin._id);

    res.json({
      success: true,
      token,
      admin: admin.toJSON(),
      message: "Đăng nhập thành công",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Lỗi server khi đăng nhập",
    });
  }
};

// ĐĂNG XUẤT
exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi server khi đăng xuất",
    });
  }
};

// LẤY THÔNG TIN ADMIN HIỆN TẠI
exports.getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin không tồn tại",
      });
    }

    res.json({
      success: true,
      admin: admin.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Lỗi khi lấy thông tin",
    });
  }
};
