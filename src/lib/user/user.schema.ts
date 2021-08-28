import { compare, hash } from "bcryptjs";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { Document, Schema, model, Model } from 'mongoose';
import { APP_SECRET, BCRYPT_WORK_FACTOR, EMAIL_VERIFICATION_TIMEOUT, PORT } from '../../config';

export interface IUser extends Document{
    email:string
    name_surname:string
    password:string
    roleId:string
    verifiedDate:Date
    matchesPassword(user:IUser, password:string):Promise<Boolean>
}

const UserScheme:Schema<IUser> = new Schema({
    email: {type:String, required:"Email is required parameter", trim:true, unique:true},
    name_surname: {type:String, required:"Name Surname is required parameter", trim:true},
    password: {type:String, required: "Password is required parameter"},
    roleId: {type: Schema.Types.ObjectId, ref: "roles"},
    verifiedDate: {type:Date, required:false}
})


UserScheme.methods.matchesPassword = async (user:IUser, password:string) => {
    return await compare(password, user.password)
}

UserScheme.pre<IUser>('save', async function(){
    if (this.isModified('password')){
        this.password = await hash(this.password, BCRYPT_WORK_FACTOR)
    }
})

const UserDbModel:Model<IUser, Document<IUser>> = model("users", UserScheme)

export default UserDbModel