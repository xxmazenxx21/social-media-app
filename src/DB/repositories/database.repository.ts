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

  async updateOne({
    filter,
    update,
    options,
  }: {
    filter: RootFilterQuery<TDocument>;
    update: UpdateQuery<TDocument>;
    options?: MongooseUpdateQueryOptions<TDocument> | null;
  }): Promise<UpdateWriteOpResult> {
    return await this.model.updateOne(
      filter,
      { ...update, $inc: { __v: 1 } },
      options
    );
  }



 

}


