const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repository = { id: uuid(), url, title, techs, likes: 0};

  repositories.push(repository);

  return response.status(200).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs} = request.body; 

  let repository = repositories.find(repository => repository.id === id);

  if (repository === undefined){
    return response.status(400).json({ error: 'Repository Id not found.'});
  }

  const likes = repository.likes;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repository = { id, url, title, techs, likes };    

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({ error: 'Repository Id not found.'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
  
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;  

  const repository = repositories.find(repository => repository.id === id);

  if (repository === undefined){
    return response.status(400).json({ error: 'Repository Id not found.'});
  }

  repository.likes +=1;

  return response.send(repository);

});

module.exports = app;
