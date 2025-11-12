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

export const searchImage = (queryVector, limit = 12, opts = {}) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 50);

  const { modelName, dims } = opts; // optional filters

  const pipeline = [
    {
      $vectorSearch: {
        index: "imageVectorIndex", // your Atlas vector index name
        path: "imageVector",
        queryVector,
        numCandidates: Math.max(400, safeLimit * 20),
        limit: safeLimit,
        similarity: "cosine", // optional (Atlas defaults to index’s similarity)
      },
    },
    // Optional: ensure we only return records that match model/dims
    ...(modelName || dims
      ? [
          {
            $match: {
              ...(modelName ? { model: modelName } : {}),
              ...(dims ? { dims } : {}),
            },
          },
        ]
      : []),
    {
      $project: {
        _id: 1,
        imageUrl: 1,
        model: 1,
        dims: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ];

  return imageSchema.aggregate(pipeline);
};