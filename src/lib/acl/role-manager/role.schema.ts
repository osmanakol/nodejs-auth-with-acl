import { Schema, model, Model, Document } from "mongoose";

export interface IRole extends Document{
    roleName:string
    isActive:boolean
}


const RoleSchema:Schema = new Schema({
    roleName: {type: String, required: 'Role name is required parameter', trim:true},
    isActive: {type: Boolean, default:true}
})

const RoleDbModel:Model<Document<IRole>> = model('roles', RoleSchema);

export default RoleDbModel