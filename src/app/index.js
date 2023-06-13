import { Router } from 'express'

import { echoRouter } from './echo.js'
import { addTodoRoutes } from './todos.js'

export async function addAppRouters() {
  const router = Router()
  const routes = await addTodoRoutes();

  const myMiddleware = (req, res, next) => {
    if (Math.random() < 0.1) {
      return res.status(500).send({message: 'Server error'})
    }
    next();
  };

  router.use(myMiddleware);

  router.use('/echo', echoRouter)
  router.use('/todo', routes)

  return router
}
