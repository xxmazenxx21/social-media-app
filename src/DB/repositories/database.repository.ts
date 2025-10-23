import {
  HydratedDocument,
  Model,
  ProjectionType,
  QueryOptions,
  CreateOptions,
  RootFilterQuery,
  PopulateOptions,
  UpdateQuery,
  UpdateWriteOpResult,
  MongooseUpdateQueryOptions,
} from "mongoose";

export abstract class DatabaseRepository<TDocument> {
  // constractuor
  constructor(protected readonly model: Model<TDocument>) {}

  // methods
  async create({
    data,
    options,
  }: {
    data: Partial<TDocument>[];
    options?: CreateOptions | undefined;
  }): Promise<HydratedDocument<TDocument>[] | undefined> {
    return await this.model.create(data, options);
  }

  // methods
  async findone({
    filter,
    options,
    select,
  }: {
    filter: RootFilterQuery<TDocument>;
    options?: QueryOptions<TDocument> | null;
    select?: ProjectionType<TDocument> | null;
  }): Promise<any | HydratedDocument<TDocument> | null> {
    const doc = this.model.findOne(filter).select(select || "");
    if (options?.populate) {
      doc.populate(options.populate as PopulateOptions[]);
    }
    if (options?.lean) {
      doc.lean(options.lean);
    }
    return await doc.exec();
  }

  async find({
    filter,
    options,
    select,
  }: {
    filter: RootFilterQuery<TDocument>;
    options?: QueryOptions<TDocument> | null;
    select?: ProjectionType<TDocument> | null;
  }): Promise<any | HydratedDocument<TDocument> | null> {
    const doc = this.model.find(filter).select(select || "");
    if (options?.populate) {
      doc.populate(options.populate as PopulateOptions[]);
    }
    if (options?.lean) {
      doc.lean(options.lean);
    }
    if (options?.limit) {
      doc.limit(options.limit);
    }
    if (options?.skip) {
      doc.skip(options.skip);
    }
    return await doc.exec();
  }

  async paginate({
    filter = {},
    options = {},
    select = {},
    page = 1,
    size = 5,
  }: {
    filter: RootFilterQuery<TDocument>;
    options?: QueryOptions<TDocument> | undefined;
    select?: ProjectionType<TDocument> | undefined;
    page?: number | undefined;
    size?: number | undefined;
  }) {
    let docCount: number | undefined = undefined;
    let pages: number | undefined = undefined;
    page = Math.floor(page < 1 ? 1 : page);

    options.limit = Math.floor(size < 1 || !size ? 5 : size);
    options.skip = (page - 1) * size;

    docCount = await this.model.countDocuments(filter);
    pages = Math.ceil(docCount / options.limit);
    const result = await this.find({ filter, select, options });

    return await {
      docCount,
      pages,
      currentpage: page,
      limit : options.limit,
      result,
    };
  }

  async updateOne({
    filter,
    update,
    options,
  }: {
    filter: RootFilterQuery<TDocument>;
    update: UpdateQuery<TDocument>;
    options?: MongooseUpdateQueryOptions<TDocument> | null;
  }): Promise<UpdateWriteOpResult> {
    if (Array.isArray(update)) {
      update.push({
        $set: {
          __V: {
            $add: ["$__v", 1],
          },
        },
      });
      return await this.model.updateOne(filter, update, options);
    }

    return await this.model.updateOne(filter, update, options);
  }

  async findOneAndUpdate({
    filter,
    update,
    options = { new: true },
  }: {
    filter: RootFilterQuery<TDocument>;
    update: UpdateQuery<TDocument>;
    options?: QueryOptions<TDocument> | null;
  }): Promise<any | HydratedDocument<TDocument> | null> {
    return await this.model.findOneAndUpdate(
      filter,
      { ...update, $inc: { __v: 1 } },
      options
    );
  }


  
}
