class TodoService {
    constructor(db) {
        this.client = db.sequelize;
        this.Todo = db.Todo;
        this.User = db.User;
        this.Category = db.Category;
        this.Status = db.Status;
    }

    // Create a new Todo
    async create(name, description, categoryId, statusId, userId) {
        try {
            const newTodo = await this.Todo.create({
                name,
                description,
                CategoryId: categoryId,
                StatusId: statusId,
                UserId: userId
            });
            return newTodo;
        } catch (error) {
            throw new Error('Error creating Todo: ' + error.message);
        }
    }

    // Retrieve all Todos
    async getAll() {
        try {
            const todos = await this.Todo.findAll({
                include: [
                    { model: this.User, as: 'User' },
                    { model: this.Category, as: 'Category' },
                    { model: this.Status, as: 'Status' }
                ]
            });
            return todos;
        } catch (error) {
            throw new Error('Error fetching Todos: ' + error.message);
        }
    }

    // Retrieve a single Todo by ID
    async getById(id) {
        try {
            const todo = await this.Todo.findOne({
                where: { id },
                include: [
                    { model: this.User, as: 'User' },
                    { model: this.Category, as: 'Category' },
                    { model: this.Status, as: 'Status' }
                ]
            });
            return todo;
        } catch (error) {
            throw new Error('Error fetching Todo by ID: ' + error.message);
        }
    }

    // Update a Todo by ID
    async update(id, updateData) {
        try {
            const [affectedRows] = await this.Todo.update(updateData, {
                where: { id }
            });

            if (affectedRows === 0) {
                return null;
            }

            return await this.getById(id);
        } catch (error) {
            throw new Error('Error updating Todo: ' + error.message);
        }
    }

    // Delete a Todo by ID
    async delete(id, deletedStatusId) {
        try {
            const [affectedRows] = await this.Todo.update(
                { StatusId: deletedStatusId },
                { where: { id } }
            );
    
            return affectedRows > 0;
        } catch (error) {
            throw new Error('Error updating Todo status to Deleted: ' + error.message);
        }
    }
}

module.exports = TodoService;