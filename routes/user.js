const express = require('express');
const router = express.Router();
const userController = require('../controller/user');
/**
 * 
 *@swagger
 * tags:
 *   - name: Auth
 *     description: Operations related to Users Auth
 */
 /**
 * @swagger
 *  /api/request-otp:
 *   post:
 *     tags:
 *      - Auth
 *     summary: Create a new user
 *     description: Create a new user in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sandeep
 *               username:
 *                 type: string
 *                 example: sandeep24
 *               gender:
 *                 type: string
 *                 example: male
 *               email:
 *                 type: string
 *                 example: sandeepptpss@gmail.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       201:
 *         description: User created successfully.
 *       500:
 *         description: Error creating user.
 */
router.post('/request-otp', userController.requestOTP); 
/**
 * 
 *@swagger
 * tags:
 *   - name: Auth
 *     description: Operations related to Users Auth
 */
/**
 * @swagger
 * /api/verify-otp:
 *   post:
 *     summary: Verify OTP for user registration
 *     description: Verify the OTP that was sent to the user's email during registration.
 *     operationId: verifyOTP
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: The OTP received by the user.
 *                 example: 687022
 *     responses:
 *       200:
 *         description: Account verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Account verified successfully
 *       400:
 *         description: Invalid or expired OTP.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Invalid OTP or OTP has expired
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post('/verify-otp', userController.verifyOTPAndSignup);


/**
 * @swagger
 * /api/viewuser:
 *   get:
 *     tags:
 *       - User
 *     summary: Retrieve all users
 *     description: Retrieve a list of all users in the database.
 *     responses:
 *       200:
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 6790e16ec7cd76df37be28b6
 *                   name:
 *                     type: string
 *                     example: Sandeep
 *                   username:
 *                     type: string
 *                     example: sandeep24
 *                   gender:
 *                     type: string
 *                     example: male
 *                   email:
 *                     type: string
 *                     example: sandeepptpss@gamil.com
 *                   role:
 *                     type: string
 *                     example: admin
 *       500:
 *         description: Error retrieving users.
 */
router.get('/viewuser', userController.getAllUsers);
/**
 * @swagger
 * /api/getuser/{_id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Retrieve a user by ID
 *     description: Retrieve a single user from the database by their unique ID.
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The unique MongoDB ObjectId of the user to retrieve.
 *         schema:
 *           type: string
 *           example: 6788f872f512cb01f1ab1d4f
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 6788f872f512cb01f1ab1d4f
 *                 name:
 *                   type: string
 *                   example: Sandeep
 *                 username:
 *                   type: string
 *                   example: sandeep24
 *                 gender:
 *                   type: string
 *                   example: male
 *                 email:
 *                   type: string
 *                   example: sandeepptpss@gamil.com
 *                 role:
 *                   type: string
 *                   example: admin
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error retrieving user.
 */
router.get('/getuser/:id', userController.getUser);
/**
 * @swagger
 * /api/delete-user/{_id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete a user by ID
 *     description: Deletes a user from the database based on their unique ID.
 *     parameters:
 *       - name: _id
 *         in: path
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *           example: 6788f872f512cb01f1ab1d4f
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error deleting user.
 */
router.delete('/delete-user/:id', userController.deleteUser);
router.patch('/update/:id', userController.updateUser);
exports.router = router;

