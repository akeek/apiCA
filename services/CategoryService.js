class CategoryService {
    constructor(db) {
        this.client = db.sequelize;
        this.Category = db.Category;
        this.Todo = db.Todo;
    }

    // Create a new category
    async create(name) {
        try {
            const newCategory = await this.Category.create({ name });
            return newCategory;
        } catch (error) {
            throw new Error('Error creating category: ' + error.message);
        }
    }

    // Retrieve all categories
    async getAll() {
        try {
            const categories = await this.Category.findAll();
            return categories;
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message);
        }
    }

    // Retrieve a single category by ID
    async getById(id) {
        try {
            const category = await this.Category.findOne({ where: { id } });
            return category;
        } catch (error) {
            throw new Error('Error fetching category by ID: ' + error.message);
        }
    }

    // Update a category by ID
    async update(id, updateData) {
        try {
            const [affectedRows] = await this.Category.update(updateData, { where: { id } });

            if (affectedRows === 0) {
                return null;
            }

            return await this.getById(id);
        } catch (error) {
            throw new Error('Error updating category: ' + error.message);
        }
    }

    // Delete a category by ID
    async delete(id) {
        try {
            const todosWithCategory = await this.Todo.findAll({ where: { categoryId: id } });

            if (todosWithCategory.length > 0) {
                return { success: false, message: "Cannot delete category as it is attached to one or more Todos." };
            }

            const result = await this.Category.destroy({ where: { id } });
            return { success: result > 0 };
        } catch (err) {
            console.error("Error in categoryService.delete:", err);
            throw err;
        }
    }
    
}

module.exports = CategoryService;