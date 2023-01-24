import { User } from "./user.schema.js";

export default {
  create : async (payload) => {
    const doc = (await User.create(payload)).toObject();

    delete doc.password;
    return doc;
  },
  findAll : async () => {
    let doc = await User.find().lean().exec();

    doc = doc.map(o => {
      delete o.password;
      return o;
    })

    return doc;
  },
  findOne : async (_id) => {
    const doc = await User.findById(_id).lean().exec();

    if (doc) {
      delete doc.password;
    }
    return doc;
  },
  findByEmail : async (email) => {
    const doc = await User.findOne({ email }).lean();

    return doc;
  },
  update : async (payload) => {
    const {
      _id, ...update
    } = payload;
    const doc = (await User.findByIdAndUpdate(_id, update, { new : true })).toObject();

    delete doc.password;
    return doc;
  },
  delete : async (_id) => {
    return await User.findByIdAndDelete(_id);
  }
}