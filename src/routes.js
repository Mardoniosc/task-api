import { randomUUID } from 'node:crypto';
import { DataBase } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new DataBase();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const tasks = database.select('tasks')

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end(JSON.stringify(task))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description, completed_at } = req.body;

      const task = {
        title,
        description
      }

      database.update('tasks', id, task)

      return res.end(JSON.stringify(task))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {

      const { id } = req.params;

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
]