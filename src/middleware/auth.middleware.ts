import { NextFunction, Request, Response } from "express";
import { isLoggedIn, logOut } from "../auth";
import { Unauthorized, BadRequest } from "../errors/http-error";
import { SESSION_ABSOLUTE_TIMEOUT } from "../config";
import { AuthRequest } from "../@types";


export const checkIsLoggedIn = () => {
    return async (req:AuthRequest, res:Response, next:NextFunction) => {
        if(!isLoggedIn(req)){
            return next(new Unauthorized("You must be logged in"))
        }

        next()
    }
}


export const guest = () => {
    return async (req:AuthRequest, res:Response, next:NextFunction) => {
        if (isLoggedIn(req)) {
            return next(new BadRequest("You are already logged in"))
        }

        next()
    }
}


export const checkSessionExpire = () => {
    return async (req:AuthRequest, res:Response, next:NextFunction) => {
        if (isLoggedIn(req)){
            const now = Date.now()
            if (now > req.session.createdDate ? undefined : 0 + SESSION_ABSOLUTE_TIMEOUT){
                await logOut(req, res)

                return next(new Unauthorized("Session expired"))
            }
        }

        next()
    }
}