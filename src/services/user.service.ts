import { IUser, User } from "../models/User.model";

export class UserService {
    static async getAllPatients(): Promise<IUser[]> {
        const patients = await User.find({ role: "PATIENT" }).select("-password");
        return patients;
    }
}