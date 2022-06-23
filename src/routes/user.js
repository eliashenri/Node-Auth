import express from "express";
import UserController from "../controllers/userController.js";

const router = express.Router();

router
  .post("/register", UserController.registerUser)
  .post("/authenticate", UserController.userAuth)

const routes = (app) => {
    app.route('/').get((req, res) => {
      res.status(200)
    })
  
    app.use(
      express.json(),
      router,
    )
  }
  
  export default routes