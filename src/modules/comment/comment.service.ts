import type { Request, Response, NextFunction } from "express";
import { PostRepository } from "../../DB/repositories/Post.repository";
import { UserRepository } from "../../DB/repositories/User.repository";
import { UserModel } from "../../DB/Models/User.model";
import { AllowCommnetsEnum, HPostDocument, PostModel } from "../../DB/Models/post.model";
import { CommentModel } from "../../DB/Models/comment.model";
import { CommentRepository } from "../../DB/repositories/comment.repository";
import { postAvilabilty } from "../post/post.service";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/response/error.response";
import { deleteFiles, uploadFiles } from "../../utils/mullter/s3.config";


class commentService {
  private _PostModel = new PostRepository(PostModel);
  private _UserModel = new UserRepository(UserModel);
  private _CommentModel = new CommentRepository(CommentModel);

  constructor() {}

  createComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    // find post
    const { postid } = req.params as unknown as { postid: string };

    const post = await this._PostModel.findone({
      filter: {
        _id: postid,
        allowComments: AllowCommnetsEnum.ALLOW,
        $or: postAvilabilty(req),
      },
    });
    if (!post) throw new NotFoundException("post not found");

    // people you mentoned
    if (
      req.body.tags?.length &&
      (await this._UserModel.find({ filter: { _id: { $in: req.body.tags } } }))
        .length !== req.body.tags.length
    ) {
      throw new BadRequestException("people you mentoned are not found");
    }

    // upload files
    let attachments: string[] = [];

    if (req.body.attachments?.length) {
      attachments = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `user/${post.Createdby}/post/${post.assetsPostsFolderid}`,
      });
    }

    // creat comment
    const [comment] =
      (await this._CommentModel.create({
        data: [
          {
            ...req.body,
            attachments,
            postid,
            Createdby: req.user?._id,
          },
        ],
      })) || [];

    if (!comment) {
      if (attachments?.length) {
        await deleteFiles({ urls: attachments });
      }
      throw new BadRequestException("comment creation failed");
    }

    return res.status(200).json({ message: "comment created succesfuly" });
  };







  ReplyComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    // find post
    const { postid , commentid } = req.params as unknown as { postid: string , commentid : string };

    const Comment = await this._CommentModel.findone({
     filter: {
        _id: commentid,
        postid:postid ,
      },
         options : {
        populate:[{path:'postid',match:{
          allowComments: AllowCommnetsEnum.ALLOW,
        $or: postAvilabilty(req)||[],
        }}]
      }
    });

    if (!Comment?.postid) throw new BadRequestException("failed to match result");

    // people you mentoned
    if (
      req.body.tags?.length &&
      (await this._UserModel.find({ filter: { _id: { $in: req.body.tags } } }))
        .length !== req.body.tags.length
    ) {
      throw new BadRequestException("people you mentoned are not found");
    }

    // upload files
    let attachments: string[] = [];
const post = Comment.postid as Partial<HPostDocument> 
    if (req.body.attachments?.length) {
      attachments = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `user/${post.Createdby}/post/${post.assetsPostsFolderid}`,
      });
    }

    // creat comment
    const [reply] =
      (await this._CommentModel.create({
        data: [
          {
            ...req.body,
            attachments,
            postid,
            commentid,
            Createdby: req.user?._id,
          },
        ],
      })) || [];

    if (!reply) {
      if (attachments?.length) {
        await deleteFiles({ urls: attachments });
      }
      throw new BadRequestException("reply creation failed");
    }

    return res.status(200).json({ message: "reply created succesfuly" });
  };








}

export default new commentService();
