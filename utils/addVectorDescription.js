// utils/addVectorDescription.js
import { pipeline } from "@xenova/transformers";
import { addEmbeddings } from "../model/imageModel.js";

const MODEL_NAME = "Xenova/clip-vit-base-patch32";

// Load the CLIP model once (cached for reuse)
let extractorPromise = null;
async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline("image-feature-extraction", MODEL_NAME);
  }
  return extractorPromise;
}

// Optional: normalize Cloudinary URL for consistent embeddings
function normalizeCloudinary(url) {
  if (!url?.includes("/upload/")) return url;
  const transform = "w_768,h_768,c_fill,g_auto,f_auto,q_auto";
  return url.replace("/upload/", `/upload/${transform}/`);
}

/**
 * Generate and save vector embedding for an image.
 * @param {Object} image - Must include {_id, imageUrl}
 */
export const addVectorDescription = async (image) => {
  try {
    if (!image || (!image._id && !image.id) || !image.imageUrl) {
      throw new Error("Invalid image object. Must include _id and imageUrl.");
    }

    const id = image._id || image.id;
    const url = normalizeCloudinary(image.imageUrl);

    console.log(` Generating embedding for image ${id} ...`);

    // 1️⃣ Load model
    const extractor = await getExtractor();

    // 2️⃣ Run model directly on Cloudinary URL
    const out = await extractor(url, { pooling: "mean", normalize: true });

    // 3️⃣ Convert output to normal JS array
    const vector = Array.from(out.data);
    const dims = vector.length;

    // 4️⃣ Save embedding into MongoDB
    const updated = await addEmbeddings(id, vector, dims, MODEL_NAME);
    console.log(`Vector stored for image ${id} (${dims} dims)`);

    return updated;
  } catch (err) {
    console.error(" addVectorDescription failed:", err.message);
    throw err;
  }
};
