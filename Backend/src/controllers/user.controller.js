import { User } from "../models/user.model.js";
import httpStatus from "http-status";
import bcrypt, {hash} from "bcrypt";
import crypto from "crypto";

const login = async (req, res)=>{
    const {username, password} = req.body;
    if(!username || !password){
        res.status(httpStatus.NOT_FOUND).json({message:`Please Enter Username and Password`});
    }
    try {
        const user = await User.findOne({username});
        if(!user){
             res.status(httpStatus.NOT_FOUND).json({message:`Not Found`});
        }
        if(bcrypt.compare(password, user.password)){
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            res.status(httpStatus.OK).json({token: token});
        }
    } catch (error) {
        return res.status(500).json({message:"Somthing Went Wrong ${error}"})
    }
}


const register = async (req, res)=>{
    const {name, username, password} = req.body;
    try {
        let existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(httpStatus.FOUND).json({message:"User alredy exist"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User(
            {
                name: name,
                username: username,
                password: hashedPassword
            }
        )
        await newUser.save();
        res.status(httpStatus.CREATED).json({message:"User Registerd"})
    } catch (error) {
        res.json({message:`Somthing Went Wrong ${error}`})
    }
}

export {login, register};