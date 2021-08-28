import { Response } from "express";
import { AuthRequest } from "./@types";
import { SESSION_NAME } from "./config";

export const isLoggedIn = (req:AuthRequest) => {
    if (req.session.userId != undefined) {
        return true
    }
    return false
}

export const logIn = (req:AuthRequest, userId:string, roleId:string) => {
    req.session.userId = userId
    req.session.roleId = roleId
    req.session.createdDate = Date.now()
}

export const logOut = (req:AuthRequest, res:Response) => {
    return new Promise((resolve, reject) => {
        req.session!.destroy((err:Error) => {
            if(err){
                reject(err)
            }
            res.clearCookie(SESSION_NAME)

            resolve(res)
        })
    })
}