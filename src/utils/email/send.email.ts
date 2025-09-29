import { createTransport } from "nodemailer"
import Mail from "nodemailer/lib/mailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { Transporter } from "nodemailer"
import { BadRequestException } from "../response/error.response"



export const SendEmail = async (data:Mail.Options) => {
    if(!data.html&& !data.text && !data.attachments?.length) throw new BadRequestException("html or text or attachments is required");

const transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>  = createTransport({
   
    service: "gmail"
    , auth :{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    }
})


const info = await transporter.sendMail({...data,from:`"hello from social media"  <${process.env.EMAIL}>`,})


}