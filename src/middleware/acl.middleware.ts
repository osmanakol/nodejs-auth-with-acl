import { AuthRequest } from "../@types";
import Redis from "ioredis";
import { REDIS_OPTIONS } from "../config";
import { NextFunction, Response } from "express";
import { Unauthorized } from "../errors/http-error";
import AclDbModel, { IAcl } from '../lib/acl/acl.schema';
import redisUtil from "../utils/redis.utils";

//const redis_connection = new Redis(REDIS_OPTIONS)

export const checkAcl = () => {
    return async (req:AuthRequest, res:Response, next:NextFunction) => {
        const acls = await getAcls() as unknown as IAcl[]
        const moduleAcl = acls.find(x=>x.moduleName == req.baseUrl.split('/')[1])
        if (moduleAcl){
            
            const roleAcl = moduleAcl.aclSchema.find(x=>x.roleId == req.session.roleId)
            
            if (roleAcl && roleAcl.permission[req.method] === true){
                return next()
            }
        }
        next(new Unauthorized("Unauthorized process"))
    }   
}


const getAcls = async ():Promise<string> => {
    let result;
    result = await redisUtil.getAcls("acls")
    if (result == null){
        const acl = await AclDbModel.find({},{},{lean:true, populate: "aclSchema.role"})
        await redisUtil.setAcls("acls", JSON.stringify(acl), "EX", 60 * 60 * 6)
        result = await redisUtil.getAcls("acls")
    }
    return JSON.parse(result || "")
}


/*const setAcls = async () => {
    // Todo : yeni bir acl eklendiğinde, bir kullanıcıya rol atandığında vb. durumlarda redisdeki veride güncellenmeli.
    const acl = await AclDbModel.find({},{},{lean:true, populate: "aclSchema.role"})
    
    await redis_connection.set("acls", JSON.stringify(acl), "EX", 60 * 60 * 6)
}*/