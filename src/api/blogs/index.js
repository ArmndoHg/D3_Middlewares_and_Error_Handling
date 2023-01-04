import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import fs from "fs";
import httpErrors from "http-errors";
import { checksBlogsSchema, triggerBadRequest } from "./validator.js";

const { NotFound } = httpErrors;

const blogsRouter = express.Router();

const blogsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogs.json"
);
console.log("Here right hwere!-------------->", blogsJSONPath);

const getBlogs = () => JSON.parse(fs.readFileSync(blogsJSONPath));
const writeBlogs = (blogsArray) =>
  fs.writeFileSync(blogsJSONPath, JSON.stringify(blogsArray));

//POST
blogsRouter.post(
  "/",
  checksBlogsSchema,
  triggerBadRequest,
  (req, res, next) => {
    try {
      const newBlog = { ...req.body, createdAt: new Date(), id: uniqid() };

      const blogsArray = getBlogs();
      blogsArray.push(newBlog);
      writeBlogs(blogsArray);
      res.status(201).send({ id: newBlog.id });
    } catch (error) {
      next(error);
    }
  }
);

//GET
blogsRouter.get("/", (req, res, next) => {
  //   throw new Error("Oh no");
  try {
    const blogsArray = getBlogs();
    res.send(blogsArray);
  } catch (error) {
    next(error);
  }
});

//GET ID
blogsRouter.get("/:blogId", (req, res, next) => {
  try {
    const blogsArray = getBlogs();
    const blog = blogsArray.find((blog) => blog.id === req.params.blogId);
    if (blog) {
      res.send(blog);
    } else {
      next(NotFound(`Book with id ${req.params.blogId} not found!`));
      /* createHttpError(404, `Book with id ${req.params.bookId} not found!`) */
    }
  } catch (error) {
    next(error);
  }
});

//EDIT
blogsRouter.put("/:blogId", (req, res, next) => {
  try {
    const blogs = getBlogs();
    const index = blogs.findIndex((blog) => blog.id === req.params.blogId);

    if (index !== -1) {
      const oldBlog = blogs[index];

      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };

      blogs[index] = updatedBlog;

      writeBlogs(blogs);
      res.send(updatedBlog);
    } else {
      next(NotFound(`Book with id ${req.params.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

//DELETE
blogsRouter.delete("/:blogId", (req, res, next) => {
  try {
    const blogsArray = getBlogs();
    const remainingBlogs = blogsArray.filter(
      (blog) => blog.id !== req.params.blogId
    );

    if (blogsArray.length !== remainingBlogs.length) {
      writeBlogs(remainingBlogs);
      res.status(204).send();
    } else {
      next(NotFound(`Book with id ${req.params.blogId} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
