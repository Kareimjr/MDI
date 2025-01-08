const userModel = require('../models/userModel.js');

const getUserData = async (req, res) => {
    try {
        const { user } = req.body;

        const userData = await userModel.findById(user.id);

        if (!userData) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            userData: {
                _id: userData._id, 
                email: userData.email,
                name: userData.name,
                role: userData.role,
                residence: userData.residence,
                // Add more fields if necessary but avoid sensitive data like passwords
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

module.exports = { getUserData };
