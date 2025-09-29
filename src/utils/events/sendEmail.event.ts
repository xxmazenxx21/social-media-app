import { EventEmitter } from "events";
import Mail from "nodemailer/lib/mailer";
import { template } from "../email/sendEmail.template";
import { SendEmail } from "../email/send.email";





export const emailEvent = new EventEmitter();



interface IEmail extends Mail.Options{
otp : number 
,username:string
}


 emailEvent.on("Confirmemail", async (data: IEmail) => {

    try {
          data.subject="Confirm your email",
    data.html = template(data.otp,data.username,data.subject) 
    await SendEmail(data)
    } catch (error) {
        console.log(error)
    }


})