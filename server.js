import express from "express";
import cors from "cors";
import dbConnect from "./config/dbConfig.js";
import imageRouter from "./routers/imageRoute.js";
import { addEmbeddings } from "./model/imageModel.js";
import { addVectorDescription } from "./utils/addVectorDescription.js";

const app = express();
const PORT = process.env.PORT || 8080;

//middleware
app.use(express.json());
app.use(cors());

//routers
app.use("/api/v1/image", imageRouter);

//page not found
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

dbConnect()
  .then(() => {
    app.listen(PORT, (error) => {
      error
        ? console.log(error)
        : console.log("your server is running at http://localhost:" + PORT);
    });
  })
  .catch((error) => console.log(error));


