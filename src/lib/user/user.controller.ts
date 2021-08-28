import { NextFunction, Response, Router } from 'express';
import { AuthRequest } from '../../@types';
import IController from '../../interfaces/IController';
import UserDbModel from "./user.schema";
import RoleDbModel from "../acl/role-manager/role.schema";
import { BadRequest, Unauthorized } from "../../errors/http-error";
import { logIn, logOut } from "../../auth";
import AclDbModel from '../acl/acl.schema';
import mongoose from 'mongoose';

export class UserController implements IController{
    path = "/user"
    router = Router()

    public addUser = async (req:AuthRequest, res:Response, next:NextFunction) => {
        try {
            let result

            result = await new UserDbModel({
                name_surname:req.body.name_surname, 
                email: req.body.email,
                password: req.body.password,
                roleId: req.body.roleId
            }).save()

            res.status(201).json({
                status: "success",
                data: result,
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
            });
        }
    }

    public getUsers = async (req:AuthRequest, res:Response, next:NextFunction) => {
        try {
            let result = await UserDbModel.find({}, {}, {populate:{path:"roleId", model:RoleDbModel, match:true}})

            res.status(200).json({
                status: "success",
                data: result
            })
        } catch (error) {
            res.status(400).json({
                status: "error",
            });
        }
    }

    public createRole = async (req:AuthRequest, res:Response, next:NextFunction) => {
        try {
            const result = await RoleDbModel.create({
                 roleName: req.body.roleName,
                 isActive: req.body.isActive
            })

            res.status(201).json({
                status:"success",
                data: result
            })
        } catch (error) {
            res.status(400).json({
                status:"error",
                data:error
            })
        }
    }

    public getRoles = async (req:AuthRequest, res:Response, next:NextFunction) => {
        try {
            const result = await RoleDbModel.find()

            res.status(200).json({
                status: "success",
                data: result
            })
        } catch (error) {
            res.status(400).json({
                status: "error"
            })
        }
    }

    public login = async (req:AuthRequest, res:Response, next:NextFunction) => {

        try {
            const {email, password} = req.body
            const user = await UserDbModel.findOne({email:email}, {}, {})

            if (user) {
                if (!(await user.matchesPassword(user, password))) {
                    throw new BadRequest("Incorrect email or password");
                } else {
                    logIn(req, user._id.toHexString(), (user.roleId as unknown as string));
                }
            }
            
            res.status(200).json({
                status: "success",
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
            });
        }
    }

    public register = async (req:AuthRequest, res:Response, next:NextFunction) => {}

    public logout = async (req:AuthRequest, res:Response, next:NextFunction) => {
        try {
            await logOut(req, res)

            res.status(200).json({
                status: "success",
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
            });
        }
    }

    public getAcls = async (req:AuthRequest, res:Response, next:NextFunction) => {
        try {
            const result = await AclDbModel.find({}, {}, {lean:true, populate: {path:"aclSchema.role", match:true, model:RoleDbModel}})

            res.status(200).json({
                status: "success",
                data: result
            })
        } catch (error) {
            res.status(400).json({
                status: "error"
            })
        }
    }

    public addRoleToAcl = async (req:AuthRequest, res:Response, next:NextFunction) => {

    /**
     * Request data schema: 
     * {
     *    aclId: <aclId>
     *    roleId: "<roleId value>"
     *    permissions:{
     *      GET: true or false
     *      POST: true or false
     *      PUT: true or false
     *      DELETE: true or false
     *    }
     * }
     */
        const mongoose_session = mongoose.startSession()
        try {
            (await mongoose_session).startTransaction();
            const checkAcl = await AclDbModel.findOne({$and: [{_id:req.body.aclId}, {'aclSchema.role': req.body.roleId}]}, {}, {lean:true, session:await mongoose_session});

            let result;

            if(checkAcl == null) {
                result = await AclDbModel.update({_id: req.body.aclId}, {$addToSet: {aclSchema: {
                    role: req.body.roleId, permission: req.body.permissions
                }}}, {session: await mongoose_session});
            } else {
                result = await AclDbModel.update({$and: [{_id: req.body.aclId}, {'aclSchema.role': req.body.roleId}]}, {$set: {'aclSchema.$': {'permission': req.body.permissions, 'role': req.body.roleId}}}, {session: await mongoose_session})
            }

            await (await mongoose_session).commitTransaction();
            (await mongoose_session).endSession();
            res.status(201).json({
              status: "success",
              data: result
            })
        } catch (error) {
            (await mongoose_session).abortTransaction();
            (await mongoose_session).endSession();
            res.status(400).json({
              status:"error",
              data:error
            })
        }
    }


}