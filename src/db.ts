import mongoose, { Connection, ConnectionOptions } from "mongoose";
import { MONGODB_URI} from "./config";
import { IConnection } from './interfaces/IConnection';

class MongoConnection implements IConnection {
    private uri:string = MONGODB_URI
    
    disconnection(): void {
        mongoose.connection.close(() => {
            console.info("Mongoose default connection is disconnected");
        })
    }
    public async connection(): Promise<void> {
        mongoose.Promise = global.Promise

        const options: ConnectionOptions = {

            noDelay: true,
            ha:true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            autoIndex: false,
            poolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            keepAlive: true,
            keepAliveInitialDelay: 300000
        }
        mongoose.connect(this.uri, options)

        mongoose.connection.on("error", (err) => {
            console.error("Failed to Connect MongoDb")
        })

        mongoose.connection.on("disconnected", () => {
            console.warn("Mongo db disconnected")
        })

        await mongoose.connection.on("connected", () => {
            console.info("mongo db is connected")
        })
    }

}

export default new MongoConnection()