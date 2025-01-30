const model = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = model.User;
exports.userLogin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username && !email) {
      return res.status(400).send({ message: 'Username or Email is required' });
    }
    if(!password) {
      return res.status(400).send({ message: 'Password is required' });
    }
    const user = await User.findOne({
      $or: [{ username }, { email }]
    });
    if(!user){
      return res.status(404).send({ message: 'Username or Email not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password', status: 401 });
    }
    const token = jwt.sign(
      { id: user._id, 
        email: user.email, 
        username: user.username,
        role: user.role
       },
        process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.status(200).send({
      message: 'Login successful',
      user: { id: user._id, email: user.email, username: user.username,role: user.role },
      token
    });
   }catch (error) {
    console.error('Error during login:', error);
    return res.status(500).send({ message: 'Server error', error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    // Generate token and set expiration
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = Date.now() + 3600000;
    // Save token and expiration to the user's record
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expiration;
    await user.save();
    // Generate the reset password URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/?token=${token}`;
    // Set up the transporter for nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  // Define email options, including the reset password link
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: `<h2>Reset your password</h2>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" style="
        display: inline-block;
        padding: 10px 20px;
        font-size: 16px;
        color: #ffffff;
        background-color: #007bff;
        text-decoration: none;
        border-radius: 5px;
        border: none;
        text-align: center;">
        Reset your password
      </a>`,
  };
    await transporter.sendMail(mailOptions);
    return res.status(200).send({
      message: 'Password reset email sent',
      token,
      expiresAt: expiration,
  });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.status(500).send({ message: 'Server error', error: error.message });
  }
}
// function resetPassword 
exports.resetPassword = async (req, res) =>{
  try {
    const { token } = req.query;
    const { password } = req.body;
    if (!token) {
      console.error('Token not provided in query');
      return res.status(400).send({ message: 'Token is required' });
    }
    if (!password) {
      return res.status(400).send({ message: 'Password is required' });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if(!user) {
      return res.status(400).send({ message: 'Invalid or expired token' });
    }
    //Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return res.status(200).send({ message: 'Password reset successful' });
  } catch (error) {
    return res.status(500).send({ message: 'Server error', error: error.message });
  }
}
