import { Request, Response } from "express";
import { User } from "../../../models/User.model";

export const getPatients = async(req : Request, res: Response) => {
    const patientsAll = await User.find({ role: 'PATIENT' }).select('-password');

    res.status(200).json({
        success: true,
        data: patientsAll,
    });
};

