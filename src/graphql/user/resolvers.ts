import { prismaClient } from "../../lib/db";
import { CreateUserPaylaod } from "../../services/user";
import UserService from "../../services/user";

const queries = {
    getUserToken: async (_:any,paylaod:{email:string,password:string})=>{
        const token = await UserService.getUserToken({
            email: paylaod.email,
            password: paylaod.password
        });
        return token;
    }, 
    getCurrentLoggedInUser: async (_:any , parameters : any, context : any )=>{
        if(context && context.user){
            const id = context.user.id;
            const user = await UserService.getUserById(id);
            return user;
        }
        throw  new Error("User not found");
    }
};

const mutations = {
    createUser: async (_:any,paylaod:CreateUserPaylaod)=>{
        const res = await UserService.createUser(paylaod);
        return res.id;
    } 
};

export const resolvers = {queries, mutations};