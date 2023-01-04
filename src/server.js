import express from "express";
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import blogsRouter from "./api/blogs/index.js";
import {
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
  badRequestHandler,
} from "./api/errorHandlers.js";

const server = express();

const port = 3001;

//****************** MIDDLEWARES **************************** */

const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request Medhod ${req.method} -- url ${req.url} -- ${new Date()}`
  );
  next();
};

server.use(loggerMiddleware);
server.use(express.json());

//***************************** End Points *********************

server.use("/authors", loggerMiddleware, authorsRouter);
server.use("/blogs", loggerMiddleware, blogsRouter);

//********************** Error Handlers ***************** */

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port: ", port);
});
