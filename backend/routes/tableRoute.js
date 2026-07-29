import express from "express";
import { getAllTables, getTableById, addTable, updateTable, deleteTable, updateTableStatus, bulkCreateTables } from "../controllers/tableController.js";

const tableRouter = express.Router();

tableRouter.get("/list", getAllTables);
tableRouter.get("/:id", getTableById);
tableRouter.post("/add", addTable);
tableRouter.put("/:id", updateTable);
tableRouter.delete("/:id", deleteTable);
tableRouter.patch("/:id/status", updateTableStatus);
tableRouter.post("/bulk-create", bulkCreateTables);

export default tableRouter;