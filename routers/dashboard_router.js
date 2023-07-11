import { Router } from "express";
import dashboardController from "../controllers/dashboard_controller.js";

const router = Router();

router.get("/dashboard", dashboardController);
router.get("/", function (req, res) {
  res.render("index");
});

export default router;
