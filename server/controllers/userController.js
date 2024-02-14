const UserModel = require("../models/User");
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");


// create token 
const createToken = (id) => {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ id }, jwtkey, { expiresIn: "3d" })
}

// validations
const schema = Joi.object({
    firstName: Joi.string().min(3).max(30).required(),
    lastName: Joi.string().min(3).max(30).required(),
    userName: Joi.string().min(3).max(30).required(),
    // userName: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email().required(),
    mobileNumber: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
    // userType: Joi.string().required(),
    // repeat_password: Joi.ref('password'),
    // access_token: [Joi.string(), Joi.number()],
    // birthyear: Joi.number().integer().min(1900).max(2013),
});

const loginschema = Joi.object({
    // userName: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string().email().required(),
    // mobileNumber: Joi.string().pattern(new RegExp('^[0-9]{10}$')).required(),
    // userType: Joi.string().required(),
    // repeat_password: Joi.ref('password'),
    // access_token: [Joi.string(), Joi.number()],
    // birthyear: Joi.number().integer().min(1900).max(2013),
});


// register api
const register = async (req, res) => {
    try {

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }

        const { firstName, lastName, userName, email, mobileNumber, password } = req.body;
        if (!userName || !email || !mobileNumber || !password) return res.status(400).json("All fields are required...");

        let existUserName = await UserModel.findOne({ where: { userName: req.body.userName } });
        let existUserEmail = await UserModel.findOne({ where: { email: req.body.email } });

        if (existUserName) {
            return res.status(400).json("Username already exists...");
        }

        if (existUserEmail) {
            return res.status(400).json("Email already exists...");
        }



        user = new UserModel({
            firstName,
            lastName,
            userName,
            email,
            mobileNumber,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();
        const token = createToken(user.userName);
        const userId = user.id;
        const id = user.id;
        const userData = {
            id,
            userId,
            firstName,
            lastName,
            userName,
            email,
            mobileNumber,
            token
        }
        res.status(200).json(userData
        )

    } catch (error) {
        res.status(500).json({ error: error })
    }

}

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log('loginEmal', email)
    try {

        const { error, value } = loginschema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        let user = await UserModel.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json("Invalid Email or Password");
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json("Invalid Email or Password");
        }

        const token = createToken(user.id);

        const userData = {
            id: user.id,
            userName: user.userName, // Assuming you have a 'name' field in your user model
            email: user.email,
            mobileNumber: user.mobileNumber,
            type: user.userType,
            image: user.image,
            token
        };

        res.status(200).json(userData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const findUser = async (req, res) => {
    const id = req.params.id; // Assuming the parameter is in the URL

    try {
        const user = await UserModel.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Customize the user data as needed
        const userData = {
            id: user.id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            image: user.image,

        };

        res.status(200).json(userData);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const searchUser = async (req, res) => {

    try {
        const { userName } = req.body;

        // Check if userName is provided
        if (!userName) {
            return res.status(400).json({ error: 'userName parameter is required' });
        }

        // Find users with matching userName
        const users = await UserModel.findAll({
            where: {
                userName: {
                    [Op.like]: `%${userName}%`, // Use LIKE for partial matches
                },
            },
        });

        // Customize the user data as needed
        const userArray = users.map(user => ({
            id: user.id,
            userName: user.userName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            // type: user.userType,
        }));

        res.status(200).json(userArray);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }


}

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.findAll();

        // Customize the user data as needed
        const userArray = users.map(user => ({
            id: user.id,
            userName: user.userName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            type: user.userType,
        }));

        res.status(200).json(userArray);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Function to handle profile image upload
const uploadProfileImage = async (req, res) => {
    try {

        // Get the user ID from the request
        const userId = req.params.userId;
        const { imageUrl } = req.body

        // Update the user's profile image path in the database
        await UserModel.update({ image: imageUrl }, { where: { id: userId } });

        // Send a success response
        res.status(200).json({ message: 'Profile image uploaded successfully' });
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ error: 'Internal server error', error });
    }
};


const editProfile = async (req, res) => {
    try {
        // Get the user ID from the request
        const userId = req.params.userId;

        // Get the fields to update from the request body
        const fieldsToUpdate = req.body;

        // Construct an object containing only the provided fields
        const updatedFields = {};
        for (const key in fieldsToUpdate) {
            if (fieldsToUpdate.hasOwnProperty(key)) {
                updatedFields[key] = fieldsToUpdate[key];
            }
        }

        // Update the user's profile in the database with the provided fields
        await UserModel.update(updatedFields, { where: { id: userId } });

        // Send a success response
        res.status(200).json({ message: 'Profile updated successfully' });


    } catch (error) {
        res.status(500).json({ error: 'Internak server error', error });
    }
}

const deleteUserProfile = async (req, res) => {

    try {

        // Get the user ID from the request
        const userId = req.params.userId;

         // Find the user by ID and delete it
         const deletedUser = await UserModel.destroy({ where: { id: userId } });

         // Check if the user was found and deleted
         if (deletedUser === 0) {
             return res.status(404).json({ error: 'User not found' });
         }
 
         // Send a success response
         res.status(200).json({ message: 'User profile deleted successfully' });

    } catch (error) {
        return res.status(500).json({ error: 'Internak server error', error });
    }
}

module.exports = {
    register,
    login,
    findUser,
    getAllUsers,
    searchUser,
    uploadProfileImage,
    editProfile,
    deleteUserProfile,
}

