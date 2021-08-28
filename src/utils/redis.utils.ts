import Redis from "ioredis";
import { REDIS_OPTIONS } from "../config";
class RedisUtils{
    
    private redis_connection:Redis.Redis

    constructor(){
        this.redis_connection = new Redis(REDIS_OPTIONS)
    }

    public setAcls = async (key:string, cache_data:any, expire_mode:string="" ,expire_time:number=0):Promise<void> => {
        if (expire_mode == "" && expire_time == 0) {
            // for unlimited expire time
            await this.redis_connection.set(key, JSON.stringify(cache_data))
        } else {
            await this.redis_connection.set(key, JSON.stringify(cache_data), expire_mode, expire_time)
        }
    }


    public getAcls = async (key:string):Promise<string> => {
        let result;
        result = await this.redis_connection.get(key)
        return JSON.parse(result || "")
    }
}

export default new RedisUtils()