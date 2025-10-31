import imageSchema from "./imageSchema.js";

export const uploadImage = (url) => {
  return imageSchema({ imageUrl: url }).save();
};
