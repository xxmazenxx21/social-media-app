import type { Request, Response, NextFunction } from "express";
import { PostRepository } from "../../DB/repositories/Post.repository";
import {
  ActionEnum,
  AvilbiltyEnum,
  HPostDocument,
  PostModel,
} from "../../DB/Models/post.model";
import { UserRepository } from "../../DB/repositories/User.repository";
import { HUserDocument, UserModel } from "../../DB/Models/User.model";
import {
  BadRequestException,
  NotFoundException,
} from "../../utils/response/error.response";
import { deleteFiles, uploadFiles } from "../../utils/mullter/s3.config";
import { v4 as uuid } from "uuid";
import { Types, UpdateQuery } from "mongoose";
import { likeAndunlikePostDto } from "./post.dto";

export const postAvilabilty = (req: Request) => {
  return [
    { Avilabilty: AvilbiltyEnum.PUBLIC },
    { Avilabilty: AvilbiltyEnum.ONLYME, Createdby: req.user?._id },
    {
      Avilabilty: AvilbiltyEnum.FRIENDS,
      Createdby: { $in: [...(req.user?.friends || []), req.user?._id] },
    },
    { Avilabilty: AvilbiltyEnum.ONLYME, tags: { $in: req.user?._id } },
  ];
};

class postService {
  private _PostModel = new PostRepository(PostModel);
  private _UserModel = new UserRepository(UserModel);

  constructor() {}

  createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    if (
      req.body.tags?.length &&
      (await this._UserModel.find({ filter: { _id: { $in: req.body.tags } } }))
        .length !== req.body.tags.length
    ) {
      throw new BadRequestException("people you mentoned are not found");
    }

    let attachments: string[] = [];
    let assetsPostsFolderid = uuid();
    if (req.body.attachments?.length) {
      attachments = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `user/${req.user?._id}/post/${assetsPostsFolderid}`,
      });
    }

    const [post] =
      (await this._PostModel.create({
        data: [
          {
            ...req.body,
            attachments,
            assetsPostsFolderid,
            Createdby: req.user?._id,
          },
        ],
      })) || [];

    if (!post) {
      if (attachments?.length) {
        await deleteFiles({ urls: attachments });
      }
      throw new BadRequestException("post creation failed");
    }

    return res.status(200).json({ message: "post created succesfuly", post });
  };













  likeAndunlikepost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { postid } = req.params as unknown as { postid: string };
    const { action } = req.query as likeAndunlikePostDto;

    let update: UpdateQuery<HPostDocument> = {
      $addToSet: { likes: req.user?._id },
    };

    if (action === ActionEnum.UNLIKE) {
      update = {
        $pull: { likes: req.user?._id },
      };
    }

    const post = await this._PostModel.findOneAndUpdate({
      filter: { _id: postid, $or: postAvilabilty(req) },
      update,
    });
    if (!post) {
      throw new NotFoundException("post not found");
    }

    return res.status(200).json({ message: "done", post });
  };










  updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { postid } = req.params as unknown as { postid: string };
    const post = await this._PostModel.findone({
      filter: { _id: postid, Createdby: req.user?._id },
    });

    if (!post) {
      throw new NotFoundException("post not found");
    }
    if (
      req.body.tags?.length &&
      (await this._UserModel.find({ filter: { _id: { $in: req.body.tags } } }))
        .length !== req.body.tags.length
    ) {
      throw new BadRequestException("people you mentoned are not found");
    }

    let attachments: string[] = [];
    if (req.body.attachments?.length) {
      attachments = await uploadFiles({
        files: req.files as Express.Multer.File[],
        path: `user/${post.Createdby}/post/${post.assetsPostsFolderid}`,
      });
    }
    const removedTags = req.body.Removetags.map((tag: string) => {
      return Types.ObjectId.createFromHexString(tag);
    });

    const addTags = (req.body.tags || []).map((tag: string) => {
      return Types.ObjectId.createFromHexString(tag);
    });
    // update :
    const updatedPost = await this._PostModel.updateOne({
      filter: { _id: postid },
      update: [
        {
          $set: {
            content: req.body.content,
            allowComments: req.body.allowComments,
            Avilabilty: req.body.Avilabilty,
            attachments: {
              $setUnion: [
                {
                  $setDifference: [
                    "$attachments",
                    req.body.Removeattachments || [],
                  ],
                },
                attachments || [],
              ],
            },

            tags: {
              $setUnion: [
                {
                  $setDifference: ["$tags", removedTags || []],
                },
                addTags || [],
              ],
            },
          },
        },
      ],
    });

    if (!updatedPost.modifiedCount) {
      if (attachments?.length) {
        await deleteFiles({ urls: attachments });
      }
    } else if (req.body.Removeattachments?.length) {
      await deleteFiles({ urls: req.body.Removeattachments });
    }

    return res.status(200).json({ message: "post updated succesfuly" });
  };






  getPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
 const {page,size}=req.query as unknown as {page:number,size:number}
  
const posts = await this._PostModel.paginate({filter:{$or:postAvilabilty(req)},
page,
size
  
})
    return res.status(200).json({ message: "post get succesfuly" ,posts});
  };












  
}

export default new postService();
