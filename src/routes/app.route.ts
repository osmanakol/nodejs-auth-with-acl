import express from "express";
import { UserRoute } from "../lib/user/user.route";

export class AppRoute{
    protected route: express.Router
    private _userRoute: UserRoute

    constructor(){
        this.route = express.Router()
        this._userRoute = new UserRoute()
    }


    public Routes = ():express.Router => {
        this.route.get(
            "/",
            (
              req: express.Request,
              res: express.Response,
              next: express.NextFunction
            ) => {
              res.status(200).json({
                status: "success",
                message: "Api is working",
              });
            }
        );

        this.route.use(this._userRoute.getPath(), this._userRoute.UserRoutes())


        return this.route
    }
}