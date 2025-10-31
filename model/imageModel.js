import imageSchema from "./imageSchema.js";

export const uploadImage = (url) => {
  return imageSchema({ imageUrl: url }).save();
};

export const addEmbeddings = (id, vector, dims, modelName) => {
  return imageSchema.findByIdAndUpdate(
    id,
    {
      $set: {
        imageVector: vector,
        dims,
        model: modelName,
      },
    },
    { new: true }
  );
};
