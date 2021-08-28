import express, { Application, Response, Request, NextFunction } from "express";
import session ,{ Store } from "express-session";
import connectRedis,{ RedisStore } from "connect-redis";
import Redis from "ioredis";
import { REDIS_OPTIONS, SESSION_OPTIONS } from './config';
import { AppRoute } from "./routes/app.route";
import mongo_connection from "./db";
import moduleNameConf from "./lib/acl/acl.module.conf.json";

class App {
    public app: Application

    constructor(){
        this.app = express()
        this.config();
        this.sessionSetup();
        this.routeConfig()
        this.mongoSetup();
    }

    private config = () => {
        this.app.use(express.json())
        this.app.use(express.urlencoded({extended: true}))
    }

    private routeConfig = () => {
        this.app.use("/", new AppRoute().Routes())
    }

    private mongoSetup = async () => {
        await mongo_connection.connection()
    }

    private redisSetup = async () => {
        const RedisStore = connectRedis(session)
        const client = new Redis(REDIS_OPTIONS)
        await client.set("module_name", JSON.stringify(moduleNameConf))
        return new RedisStore({client})
    }

    private sessionSetup = async () => {
        const store:Store = await this.redisSetup()
        this.app.use(session({...SESSION_OPTIONS, store}))
    }
}

export default new App().app