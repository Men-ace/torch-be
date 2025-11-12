// utils/textEmbedder.js
import {
  AutoTokenizer,
  CLIPTextModelWithProjection,
} from "@xenova/transformers";

export const MODEL_NAME = "Xenova/clip-vit-base-patch32";

let tokenizerPromise = null;
let textModelPromise = null;

async function getTextParts() {
  if (!tokenizerPromise) {
    tokenizerPromise = AutoTokenizer.from_pretrained(MODEL_NAME);
  }
  if (!textModelPromise) {
    textModelPromise = CLIPTextModelWithProjection.from_pretrained(MODEL_NAME);
  }
  const [tokenizer, textModel] = await Promise.all([
    tokenizerPromise,
    textModelPromise,
  ]);
  return { tokenizer, textModel };
}

// L2 normalize to match your image embeddings' normalization
function l2normalize(arr) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) sum += arr[i] * arr[i];
  const denom = Math.sqrt(sum) || 1;
  const out = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) out[i] = arr[i] / denom;
  return out;
}

/**
 * Convert user text into a CLIP text embedding (unit-normalized).
 * Returns a plain JS array of floats.
 */
export async function textToVector(query) {
  if (query === undefined || query === null) {
    throw new Error("Query text is required.");
  }
  const text = String(query).trim();
  if (!text) {
    throw new Error("Query text is empty.");
  }

  const { tokenizer, textModel } = await getTextParts();

  // Tokenize
  const encoded = await tokenizer(text);

  // Forward through CLIP TEXT model (explicitly the text tower)
  const output = await textModel({
    input_ids: encoded.input_ids,
    attention_mask: encoded.attention_mask,
  });

  // output.text_embeds is the projected text embedding
  const vec = Array.from(output.text_embeds.data);

  // Normalize so cosine similarity works with your normalized image vectors
  return l2normalize(vec);
}
