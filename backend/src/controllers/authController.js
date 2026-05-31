import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {

    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    // Check existing email
    const emailExists = await User.findOne({
      email,
    });

    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Check existing phone (only if non-empty phone is provided)
    const activePhone = (phone && typeof phone === 'string' && phone.trim() !== "") ? phone.trim() : undefined;
    if (activePhone) {
      const phoneExists = await User.findOne({
        phone: activePhone,
      });

      if (phoneExists) {
        return res.status(400).json({
          message: "Phone number already exists",
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      phone: activePhone,
      password: hashedPassword,
    });

    // Response
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: messages[0] || "Invalid input data",
      });
    }
    res.status(500).json({
      message: error.message || "Registration failed",
    });
  }
};

export const loginUser = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    // Login with email OR phone (explicitly select password for comparison)
    const user = await User.findOne({
      $or: [
        { email: email },
        { phone: email },
      ],
    }).select("+password");

    if (
      user &&
      (await bcrypt.compare(
        password,
        user.password
      ))
    ) {

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id),
      });

    } else {

      res.status(401).json({
        message:
          "Invalid email/phone or password",
      });
    }

  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: messages[0] || "Invalid input data",
      });
    }
    res.status(500).json({
      message: error.message || "Login failed",
    });
  }
};