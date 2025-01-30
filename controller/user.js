const bcrypt = require('bcrypt'); 
const model = require('../model/user');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = model.User;

// Create new user data
//Function to Send OTP Email
const sendOTPEmail = async (email, otp) => {
  try {
    console.log('Sending OTP to:', email); // Log the email to be sent to
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send OTP');
  }
};

// Request OTP (Signup & Send OTP)
exports.requestOTP = async (req, res) => {
  try {
    const { name, username, gender, email, password } = req.body;

    if (!name || !username || !gender || !email || !password) {
      return res.status(400).json({ code: 400, message: 'All fields are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ code: 400, message: 'Password must be at least 8 characters' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ code: 400, message: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.verified) {
        return res.status(409).json({ code: 409, message: 'Email or Username already in use' });
      } else {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOTP = await bcrypt.hash(otp, 10);
        existingUser.otp = hashedOTP;
        existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await existingUser.save();
        await sendOTPEmail(email, otp);
        return res.status(200).json({ code: 200, message: 'OTP resent successfully' });
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = await bcrypt.hash(otp, 10);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const newUser = new User({
      name,
      username,
      gender,
      email,
      password: hashedPassword,
      verified: false,
      otp: hashedOTP,
      otpExpires
    });
    await newUser.save();
    await sendOTPEmail(email, otp);
    res.status(200).json({ code: 200, message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Internal server error', error: error.message });
  }
};

exports.verifyOTPAndSignup = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const { otp } = req.body;
    if (!otp) {
      return res.status(400).json({ code: 400, message: 'Email and OTP are required' });
    }
    const user = await User.findOne({
      verified: false,
      otpExpires: { $gt: Date.now() },  // Ensure OTP hasn't expired
    });

    if (!user) {
      return res.status(400).json({ code: 400, message: 'Invalid OTP or OTP has expired' });
    }
    const isOTPValid = await bcrypt.compare(otp, user.otp);
    if (!isOTPValid) {
      return res.status(400).json({ code: 400, message: 'Invalid OTP' });
    }
    // If OTP is valid, mark the user as verified and clear OTP data
    user.verified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(200).json({ code: 200, message: 'Account verified successfully' });
  } catch (error) {
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
}

// Get all user data
exports.getAllUsers = async(req, res) => {
  try {
    const users = await User.find();
    if (users && users.length > 0) {
      return  res.status(200).send({code:200, message: 'Users found', users})
    } else {
      return res.status(404).send({ code: 404, message: 'No users found' });
    }
  } catch (error) {
    return res.status(500).send({ code: 500, message: 'Internal Server Error' });
  }
}
// Get specific user data
exports.getUser = async (req, res)=> {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }
    return res.status(200).send({
      code: 200,
      message: 'User found',
      user
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
// Delete user function
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
   try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: `No user found with ID ${id}` });
    }
    return res.status(200).json({
      code: 200,
      message: 'User deleted successfully',
      user: deletedUser,
    });
   } catch (error) {
      return res.status(500).json({ 
      message: 'Server error',
      error: error.message });
   }
}
// Update a user by ID
exports.updateUser = async (req, res)=> {
  const { id } = req.params;
  const updateData = req.body; 
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
   if(!updatedUser) {
      return res.status(404).json({ message: `No user found with ID ${id}`});
    }
    return res.status(200).json(updatedUser);
    }catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}