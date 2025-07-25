import { User } from "../../../models/User.model.js";

export const getPatients = async(req, res) => {
    const patientsAll = await User.find({ role: 'PATIENT' }).select('-password');

    res.status(200).json({
        success: true,
        data: patientsAll,
    });
};

// "start": "nodemon server.js",
// "dev": "nodemon server.js"