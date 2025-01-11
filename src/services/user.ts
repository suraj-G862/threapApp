import {createHash , createHmac, randomBytes} from 'node:crypto';
import { prismaClient } from "../lib/db";
import JWT from 'jsonwebtoken';

const JWT_SECRET = "mysecretkey";

export interface CreateUserPaylaod {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface GetUserTokenPaylaod {
    email: string;
    password: string;
}

class UserService {
    private static generateHash(password: string, salt: string){
        return createHmac('sha256',salt).update(password).digest('hex');
    }

    private static getUserByEmail(email: string){
        return prismaClient.user.findUnique({
            where: {email}
        });
    }

    public static createUser(paylaod: CreateUserPaylaod){
        const {firstName, lastName, email, password} = paylaod;
        const salt = randomBytes(32).toString("hex");
        const hashedPassword = UserService.generateHash(password, salt);

        return prismaClient.user.create({
            data:{
                firstName,
                lastName,
                email,
                salt,
                password: hashedPassword,
            }
        })
    }
    
    public static async getUserToken(paylaod: GetUserTokenPaylaod){
        const {email, password} = paylaod;
        const user = await UserService.getUserByEmail(email);
        if(!user) throw new Error("User not found");
        const userSalt = user.salt;
        const userHashPassword = UserService.generateHash(password, userSalt);

        if(userHashPassword !== user.password) throw new Error("Incorrect password");

        const token = JWT.sign({id:user.id, email:user.email}, JWT_SECRET)
        return token;
    }

    public static decodeJWTToken(token: string){
        return JWT.verify(token, JWT_SECRET);
    }

    public static getUserById(id: string){
        return prismaClient.user.findUnique({
            where: {id}
        });
    }
}

export default UserService;