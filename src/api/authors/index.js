import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";

const authorsRouter = express.Router();

//1
console.log("CURRENTS FILE URL: ", import.meta.url);
console.log("CURRENTS FILE PATH: ", fileURLToPath(import.meta.url));

//2
console.log("PARENT FOLDER PATH: ", dirname(fileURLToPath(import.meta.url)));

//3
console.log(
  "TARGET: ",
  join(dirname(fileURLToPath(import.meta.url)), "authors.json")
);

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);

//1. Get http://localhost:3001/authors/

authorsRouter.get("/", (req, res) => {
  //READ CONTENT
  const fileContent = fs.readFileSync(authorsJSONPath);
  const authorsArray = JSON.parse(fileContent);

  //END IT BACK
  res.send(authorsArray);
});

//2. Get single

authorsRouter.get("/:authorId", (req, res) => {
  const authorId = req.params.authorId;
  /*  console.log(authorId); */
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const author = authorsArray.find((author) => author.id === authorId);
  res.send(author);
});

//3. Post

authorsRouter.post("/", (req, res) => {
  console.log("REQ BODY", req.body);
  const newAuthor = { ...req.body, createdAt: new Date(), id: uniqid() };
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  authorsArray.push(newAuthor);
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));
  res.status(201).send({ id: newAuthor.id });
});

//4. Put

authorsRouter.put("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));

  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  );
  const oldAuthor = authorsArray[index];
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
  authorsArray[index] = updatedAuthor;

  //saving
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsArray));

  res.send(updatedAuthor);
});

//5. Delete

authorsRouter.delete("/:authorId", (req, res) => {
  const authorsArray = JSON.parse(fs.readFileSync(authorsJSONPath));
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

  res.status(204).send("Now it's gone");
});

export default authorsRouter;
