import { DeleteObjectCommand, DeleteObjectCommandOutput, DeleteObjectsCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { StorageEnum } from "./cloud.multer";
import { v4 as uuid } from "uuid";
import { createReadStream } from "fs";
import { BadRequestException } from "../response/error.response";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3config = () => {
  return new S3Client({
    region: process.env.AWS_REGION as string,
    endpoint: `https://s3.${process.env.AWS_REGION}.wasabisys.com`,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  });
};


export const uploadFile = async ({
  storageApproch = StorageEnum.MEMORY,
  Bucket = process.env.AWS_BUCKET_NAME as string,
  ACL = "private",
  path = "General",
  file,
}: {
  storageApproch?: StorageEnum;
  Bucket?: string;
  ACL?: "private" | "public-read";
  path?: string;
  file: Express.Multer.File;
}) => {
  const s3 = s3config();

  const command = new PutObjectCommand({
    Bucket,
    ACL,
    Key: `${process.env.APPLICATION_NAME}/${path}/${uuid()}-${
      file.originalname
    }`,
    Body:
      storageApproch == StorageEnum.MEMORY
        ? file.buffer
        : createReadStream(file.path),
    ContentType: file.mimetype,
  });

  await s3.send(command);
  if (!command?.input?.Key) {
    throw new BadRequestException("file not uploaded");
  }
  return command.input.Key;
};

export const uploadFiles = async ({
  storageApproch = StorageEnum.MEMORY,
  Bucket = process.env.AWS_BUCKET_NAME as string,
  ACL = "private",
  path = "General",
  files,
}: {
  storageApproch?: StorageEnum;
  Bucket?: string;
  ACL?: "private" | "public-read";
  path?: string;
  files: Express.Multer.File[];
}): Promise<string[]> => {
  let urls: string[] = [];
  urls = await Promise.all(
    files.map((file) => uploadFile({ file, Bucket, ACL, path }))
  );
  return urls;
};





export const PreSignedUrl = async ({
  path = "general",
  originalname,
  ContentType,
  Bucket = process.env.AWS_BUCKET_NAME as string,
  expiresIn = 120,
}: {
  path?: string;
  originalname: string;
  ContentType: string;
  Bucket?: string;
  expiresIn?: number;
}) => {
  const command = new PutObjectCommand({
    Bucket,
    Key: `${
      process.env.APPLICATION_NAME
    }/${path}/${uuid()}-PresignedURl${originalname}`,
    ContentType,
  });

  const url = await getSignedUrl(s3config(), command, { expiresIn });

  if (!url && !command?.input?.Key)
    throw new BadRequestException("failed to geberate presigned url");

  return { url, key: command.input.Key };
};








export const PreSignedUrlGet = async ({
  Bucket = process.env.AWS_BUCKET_NAME as string,
  Key,
  downloadName = "dummy",
  download = "false",
}: {
  Key: string;
  Bucket?: string;
  downloadName?: string;
  download?: string;
}) => {
  const command = new GetObjectCommand({
    Bucket,
    Key,
    ResponseContentDisposition:
      download === "true"
        ? `attachment; filename="${downloadName}"`
        : undefined,
  });

  const url = await getSignedUrl(s3config(), command, { expiresIn: 120 });
  if (!url) throw new BadRequestException("failed to get presigned url");

  return url;
};










export const getFile = async ({
  Bucket = process.env.AWS_BUCKET_NAME as string,
  Key,
}: {
  Bucket?: string;
  Key?: string;
}) => {
  const command = new GetObjectCommand({ Bucket, Key });
  return await s3config().send(command);
};









export const deleteFile = async ({
  Bucket = process.env.AWS_BUCKET_NAME as string,
  Key,
}: {
  Bucket?: string;
  Key?: string;
}):Promise<DeleteObjectCommandOutput> => {
  
const command = new DeleteObjectCommand({ Bucket, Key });

return  await s3config().send(command); 

};




export const deleteFiles = async ({
  Bucket = process.env.AWS_BUCKET_NAME as string,
  urls,
  Quiet = false,
}: {
  Bucket?: string;
urls  : string[] ;
  Quiet?: boolean;
}):Promise<DeleteObjectCommandOutput> => {
  const Objects = urls.map((url)=>{return {Key:url}})

const command = new DeleteObjectsCommand({ Bucket, Delete:{
  Objects ,
  Quiet
} });

return  await s3config().send(command); 

};