import { Router } from 'express';
import IRoute from '../../interfaces/IRoute';
import { UserController } from './user.controller';
import { checkIsLoggedIn, guest } from '../../middleware/auth.middleware';
import { checkAcl } from '../../middleware/acl.middleware';
import { users } from "../acl/acl.module.conf.json";

export class UserRoute implements IRoute{
    private _userController:UserController

    moduleName:string
    
    constructor(){
        this._userController = new UserController()
        this.moduleName = users
    }


    public UserRoutes = ():Router => {

        this._userController.router.get(
            "/",
            this._userController.getUsers
        )
    

        this._userController.router.post(
            "/register",
            //checkIsLoggedIn(),
            //checkAcl(),
            this._userController.addUser
        )

        this._userController.router.post(
            "/role",
            this._userController.createRole
        )

        this._userController.router.get(
            "/role",
            this._userController.getRoles
        )

        this._userController.router.post(
            "/login",
            guest(),
            this._userController.login
        )

        this._userController.router.post(
            "/logout",
            checkIsLoggedIn(),
            this._userController.logout
        )

        this._userController.router.get(
            "/acl",
            checkIsLoggedIn(),
            checkAcl(),
            this._userController.getAcls
        )

        this._userController.router.put(
            "/acl",
            checkIsLoggedIn(),
            checkAcl(),
            this._userController.addRoleToAcl
        )


        return this._userController.router
    }

    public getPath = ():string => {
        return this._userController.path
    }
}