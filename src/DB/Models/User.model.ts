import mongoose, { HydratedDocument, model, models, Types } from "mongoose" 
import { generateHash } from "../../utils/security/hash";


export enum genderEnum {
    Male = "Male",
    Female = "Female",

}

export enum RoleEnum {
    User = "User",
    Admin = "Admin",
}


export  interface IUser  {
_id :Types.ObjectId;
firstName : string;
lastName : string;
username?:string;
email : string;
password : string;
confirmEmailOTP? : string;
confirmAt ? : Date;
resetPasswordOTP ? : string;
changeCredentilesTime ?: string;
phone?:string ;
address?:string;
gender:genderEnum;
role :RoleEnum;
createdAt : Date;
updatedAt? : Date;

}


export const userSchema = new mongoose.Schema<IUser>({
  firstName : {type : String , required : true,minLength:3,maxLength:25},
  lastName : {type : String , required : true,minLength:3,maxLength:25},
  email : {type : String , required : true,unique : true},
  password : {type : String , required : true},
  confirmEmailOTP :  String ,
  confirmAt : Date,
  resetPasswordOTP : String,
  changeCredentilesTime : Date,
  phone : String,
  address : String,
  gender : {type:String,enum:Object.values(genderEnum),default:genderEnum.Male},
  role : {type:String,enum:Object.values(RoleEnum),default:RoleEnum.User},
  
},{
    timestamps:true,
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    }
})

userSchema.virtual("username").set(function(Value:String){
   
const [firstName,lastName] = Value.split(" ")||[];
this.set({firstName,lastName})

})
.get(function(){
    return `${this.firstName} ${this.lastName}`
})


userSchema.pre("save",async function(next){
    if(this.isModified("password")){
this.password = await generateHash(this.password); 
    }
    next();
})


export const UserModel = models.User || model<IUser>("User",userSchema);


export type HUserDocument = HydratedDocument<IUser> 
 