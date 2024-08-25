var express = require('express');
var router = express.Router();
var db = require("../models");
var CategoryService = require("../services/CategoryService");
var categoryService = new CategoryService(db);
var jsend = require('jsend');
var authenticate = require('./authMiddleware');
router.use(jsend.middleware);

// Create a new Category
router.post("/", authenticate, async (req, res, next) => {
    const { name } = req.body;

    if (!name) {
        return res.jsend.fail({ message: "Name is required." });
    }

    try {
        const newCategory = await categoryService.create(name);
        res.jsend.success({ message: "Category created successfully.", data: newCategory });
    } catch (error) {
        res.jsend.error({ message: "Error creating category.", error: error.message });
    }
});

// Retrieve all Categories
router.get("/", authenticate, async (req, res, next) => {
    try {
        const categories = await categoryService.getAll();
        res.jsend.success({ data: categories });
    } catch (error) {
        res.jsend.error({ message: "Error fetching categories.", error: error.message });
    }
});

// Retrieve a single Category by ID
router.get("/:id", authenticate, async (req, res, next) => {
    const { id } = req.params;

    try {
        const category = await categoryService.getById(id);
        if (!category) {
            return res.jsend.fail({ message: "Category not found." });
        }
        res.jsend.success({ data: category });
    } catch (error) {
        res.jsend.error({ message: "Error fetching category.", error: error.message });
    }
});

// Update a Category by ID
router.put("/:id", authenticate, async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedCategory = await categoryService.update(id, { name });
        if (!updatedCategory) {
            return res.jsend.fail({ message: "Category not found or no changes made." });
        }
        res.jsend.success({ message: "Category updated successfully.", data: updatedCategory });
    } catch (error) {
        res.jsend.error({ message: "Error updating category.", error: error.message });
    }
});

// Delete a Category by ID
router.delete("/:id", authenticate, async (req, res, next) => {
    const { id } = req.params;

    try {
        const result = await categoryService.delete(id);

        if (!result.success) {
            return res.jsend.fail({ message: result.message || "Category not found." });
        }

        res.jsend.success({ message: "Category deleted successfully." });
    } catch (error) {
        res.jsend.error({ message: "Error deleting category.", error: error.message });
    }
});

module.exports = router;