import { Router } from "express";
import fs from "fs";
import path from "path"

const dbDir = path.join(process.cwd(), "src", "db");
const todosFilePath = path.join(dbDir, "todos.json");

async function createTodos() {
  const todos = [
    {
      id: 1,
      title: "Todo 1",
      createdAt: "2021-05-22T11:20:22.935Z",
      author: "Anonymous",
      isDone: false,
      note: "Done the course",
    },
    {
      id: 2,
      title: "Todo 2",
      createdAt: "2022-05-22T11:20:22.935Z",
      doneDate: "2022-05-22T11:20:22.935Z",
      author: "Anonymous",
      isDone: true,
      note: "Register to course",
    },
  ];
  try {
    fs.readFileSync(todosFilePath, "utf8");
  } catch (error) {
    await saveTodos(todos, 3);
  }
}

async function getTodos() {
  const file = fs.readFileSync(todosFilePath, "utf8");
  return JSON.parse(file);
}

async function saveTodos(todos, id) {
  const newTodos = {
    todos,
    id,
  };
  try {
    fs.mkdirSync(dbDir);
  } catch (e) { 
    //nothing to do folder already exists
  }
  
  fs.writeFileSync(todosFilePath, JSON.stringify(newTodos));
}

export async function addTodoRoutes() {
  await createTodos();
  const router = Router();

  router.get("/", async (req, resp) => {
    const { todos } = await getTodos();
    resp.send(todos);
  });

  router.post("/", async (req, resp) => {
    const { todos, id } = await getTodos();

    const note = req.body.note || "";
    const author = req.body.author || "Anonymous";
    const createdAt = new Date().toISOString();
    const title = req.body.title || `Todo ${id}`;

    const newTodo = {
      id,
      title,
      note,
      author,
      isDone: false,
      createdAt,
    };

    todos.push(newTodo);
    await saveTodos(todos, id + 1);

    resp.send(newTodo);
  });

  router.get("/:id", async (req, resp) => {
    const { todos } = await getTodos();

    if (index < 0) {
      return resp.status(404).send({ message: "Todo not found" });
    }

    resp.send(todos[index]);
  });

  router.put("/:id/markAsDone", async (req, resp) => {
    const { todos, id } = await getTodos();
    const index = todos.findIndex((todo) => todo.id === +req.params.id);

    if (index < 0) {
      return resp.status(404).send({ message: "Todo not found" });
    }

    const todo = todos[index];

    if (todo?.isDone) {
      return resp.status(400).send({ message: "Todo already done" });
    }

    const editedTodo = {
      ...todo,
      isDone: true,
      doneDate: new Date().toISOString(),
    };

    todos[index] = editedTodo;

    await saveTodos(todos, id);

    resp.send(editedTodo);
  });

  router.put("/:id", async (req, resp) => {
    const { todos, id } = await getTodos();
    const index = todos.findIndex((todo) => todo.id === +req.params.id);

    if (index < 0) {
      return resp.status(404).send({ message: "Todo not found" });
    }

    const todo = todos[index];

    if (todo?.isDone) {
      return resp.status(400).send({ message: "You cannot change done todo" });
    }

    const note = req.body.note || todo.note;
    const author = req.body.author || todo.author;
    const title = req.body.title ? `${req.body.title}` : todo.title;
    const editedTodo = {
      ...todo,
      title,
      note,
      author,
    };

    todos[index] = editedTodo;

    await saveTodos(todos, id);

    resp.send(editedTodo);
  });

  router.delete("/:id", async (req, resp) => {
    const { todos, id } = await getTodos();
    const index = todos.findIndex((todo) => todo.id === +req.params.id);

    if (index < 0) {
      resp.status(404).send({ message: "Todo not found" });
    }

    await saveTodos(
      todos.filter((el) => el.id === index),
      id
    );

    resp.send({ id: req.params.id });
  });

  return router;
}
