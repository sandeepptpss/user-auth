const authController = require('../controller/auth')
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Operations related to Users Auth
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: User login
 *     description: "Authenticates a user using either their username or email and password."
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: sandeep24
 *                 description: "The username or email address used for authentication."
 *               password:
 *                 type: string
 *                 example: admin123
 *                 description: "The password associated with the user account."
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0NTY3ODkwLCJpYXQiOjE2Nzk0NzE5MjF9.ABCD1234EFGH5678"
 *                 message:
 *                   type: string
 *                   example: "Login successful."
 *       400:
 *         description: Invalid credentials provided. Check username/email and password.
 *       401:
 *         description: Unauthorized. Incorrect username/email or password.
 *       500:
 *         description: Error logging in user.
 */
router.post('/auth/login', authController.userLogin);

/**
 * @swagger
 *  /api/auth/forgotPassword:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Forgot Password
 *     description: Sends a password reset link to the user's registered email address.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: sandeepptpss@gmail.com
 *                 description: "The registered email address of the user."
 *     responses:
 *       200:
 *         description: Password reset email sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset email sent"
 *                 token:
 *                   type: string
 *                   example: "5c9d2a023183a00f934374f4bc2ae982ab33bf9303f7b24f5ca437dfff502958"
 *                 expiresAt:
 *                   type: integer
 *                   example: 1738059779841
 *       400:
 *         description: Bad request. Email address is missing or invalid.
 *       404:
 *         description: User with the provided email does not exist.
 *       500:
 *         description: Error sending password reset email.
 */

router.post('/auth/forgotPassword', authController.forgotPassword);
/**
 * @swagger
 * /api/auth/resetPassword:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reset Password
 *     description: Resets the user's password using a token sent via email.
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         description: The unique MongoDB ObjectId of the user to retrieve.
 *         schema:
 *           type: string
 *           example: 6788f872f512cb01f1ab1d4f
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 example: "admin123"
 *                 description: The new password the user wants to set.
 *     responses:
 *       200:
 *         description: Password reset successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset successfully."
 *       400:
 *         description: Bad request. Invalid or missing token or new password.
 *       401:
 *         description: Unauthorized. The token is invalid or expired.
 *       500:
 *         description: Internal server error.
 */

router.post('/auth/resetPassword', authController.resetPassword);

exports.router = router;