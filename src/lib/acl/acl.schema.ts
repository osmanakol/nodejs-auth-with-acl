import { Schema, model, Document, Model } from "mongoose";

export interface IAclSchema extends Document{
    permission: {[key:string]:boolean}
    roleId:String    
}

export interface IAcl extends Document {
    moduleName:String
    aclSchema: IAclSchema[]
}



export const AclSchema:Schema = new Schema({
    moduleName: {type:String, required:"Module name is required parameter", trim:true},
    aclSchema: [{
        permission: {
            GET: {type: Boolean, required:true, default:false},
            POST: {type: Boolean, required:true, default:false},
            PUT: {type: Boolean, required:true, default:false},
            DELETE: {type: Boolean, required:true, default:false}
        },
        roleId: {type: Schema.Types.ObjectId, ref: "roles"}
    }]
})

const AclDbModel:Model<Document<IAcl>> = model("acls", AclSchema)

export default AclDbModel