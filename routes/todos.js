var express = require('express');
var router = express.Router();
var db = require("../models");
var TodoService = require("../services/TodoService");
var todoService = new TodoService(db);
var jsend = require('jsend');
var authenticate = require('./authMiddleware');
router.use(jsend.middleware);

// Create a new Todo
router.post("/", authenticate, async (req, res, next) => {
    const { name, description, categoryId, statusId, userId } = req.body;
    
    if (!name || !description || !userId) {
        return res.jsend.fail({ message: "Name, description, and userId are required fields" });
    }

    try {
        const newTodo = await todoService.create(name, description, categoryId, statusId, userId);
        res.jsend.success({ message: "Todo created successfully.", data: newTodo });
    } catch (error) {
        res.jsend.error({ message: "Error creating todo.", error: error.message });
    }
});

// Retrieve all Todos
router.get("/", authenticate, async (req, res, next) => {
    try {
        const todos = await todoService.getAll();
        res.jsend.success({ data: todos });
    } catch (error) {
        res.jsend.error({ message: "Error fetching todos.", error: error.message });
    }
});

// Retrieve a single Todo by ID
router.get("/:id", authenticate, async (req, res, next) => {
    const { id } = req.params;

    try {
        const todo = await todoService.getById(id);
        if (!todo) {
            return res.jsend.fail({ message: "Todo not found." });
        }
        res.jsend.success({ data: todo });
    } catch (error) {
        res.jsend.error({ message: "Error fetching todo.", error: error.message });
    }
});

// Update a Todo by ID
router.put("/:id", authenticate, async (req, res, next) => {
    const { id } = req.params;
    const { name, description, categoryId, statusId, userId } = req.body;

    try {
        const updateData = {
            name,
            description,
            CategoryId: categoryId,
            StatusId: statusId,
            UserId: userId
        };

        const updatedTodo = await todoService.update(id, updateData);
        if (!updatedTodo) {
            return res.jsend.fail({ message: "Todo not found or no changes made." });
        }
        res.jsend.success({ message: "Todo updated successfully.", data: updatedTodo });
    } catch (error) {
        res.jsend.error({ message: "Error updating todo.", error: error.message });
    }
});


// Delete a Todo by ID
router.delete("/:id", authenticate, async (req, res, next) => {
    const { id } = req.params;

    try {
        const deletedStatus = await db.Status.findOne({ where: { name: 'Deleted' } });

        if (!deletedStatus) {
            return res.jsend.fail({ message: "Deleted status not found." });
        }

        const deleted = await todoService.delete(id, deletedStatus.id);
        if (!deleted) {
            return res.jsend.fail({ message: "Todo not found or could not be deleted." });
        }
        res.jsend.success({ message: "Todo marked as deleted successfully." });
    } catch (error) {
        res.jsend.error({ message: "Error marking todo as deleted.", error: error.message });
    }
});

module.exports = router;