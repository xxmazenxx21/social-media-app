import mongoose, { HydratedDocument, model, models, Types } from "mongoose" 
import { generateHash } from "../../utils/security/hash";
import { emailEvent } from "../../utils/events/sendEmail.event";


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
friends : Types.ObjectId[];
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
Freezedby?:Types.ObjectId; 
FreezedAt?:Date;
restoredBy?:Types.ObjectId;
restoredAt?:Date;

}


export const userSchema = new mongoose.Schema<IUser>({
  firstName : {type : String , required : true,minLength:3,maxLength:25},
  lastName : {type : String , required : true,minLength:3,maxLength:25},
  email : {type : String , required : true,unique : true},
  password : {type : String , required : true},
  confirmEmailOTP :  String ,
  confirmAt : Date,
  friends : [{type : mongoose.Schema.Types.ObjectId , ref:"User"}],
  resetPasswordOTP : String,
  changeCredentilesTime : Date,
  phone : String,
  address : String,
  gender : {type:String,enum:Object.values(genderEnum),default:genderEnum.Male},
  role : {type:String,enum:Object.values(RoleEnum),default:RoleEnum.User},
  Freezedby : {type : mongoose.Schema.Types.ObjectId , ref:"User"},
    FreezedAt : Date ,
    restoredBy : {type : mongoose.Schema.Types.ObjectId , ref:"User"},
    restoredAt : Date
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

userSchema.pre('save',async function(this:HUserDocument&{wasnew:boolean,confirmEmailOtpPlain?:string},next){
 this.wasnew = this.isNew
    if(this.isModified('password')){
this.password = await generateHash(this.password);

    }

if(this.isModified('confirmEmailOTP')){
    this.confirmEmailOtpPlain = this.confirmEmailOTP as string
    this.confirmEmailOTP = await generateHash(this.confirmEmailOTP as string)  ;

}

next();
})

userSchema.post('save',async function (doc,next) {
const that = this as HUserDocument & {wasnew:boolean,confirmEmailOtpPlain?:string}
if(that.wasnew){
    emailEvent.emit("Confirmemail", { to: this.email, username:this.username,otp : that.confirmEmailOtpPlain });
    
}        
next();
})


userSchema.pre(['findOne','find'], function(next){
const query = this.getQuery();

if(query.paranoid===false){
this.setQuery({...query})

}else{

    this.setQuery({...query,FreezedAt:{$exists:false}})
}

next();

})

export const UserModel = models.User || model<IUser>("User",userSchema);


export type HUserDocument = HydratedDocument<IUser> 
 