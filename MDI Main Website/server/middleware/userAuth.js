const jwt = require('jsonwebtoken');

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach all decoded information to req.body
        req.body.user = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role
        };


        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = userAuth;
