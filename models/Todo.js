module.exports = (sequelize, DataTypes) => {
	const Todo = sequelize.define(
	  'Todo',
	  {
		name: {
		  type: DataTypes.STRING,
		  allowNull: false,
		},
		description: {
		  type: DataTypes.TEXT,
		  allowNull: false,
		},
		CategoryId: {
		  type: DataTypes.INTEGER,
		  allowNull: true,
		  references: {
			model: 'Categories',
			key: 'id',
		  },
		  onDelete: 'SET NULL',
		  onUpdate: 'CASCADE',
		},
		StatusId: {
			type: DataTypes.INTEGER,
			defaultValue: 1
		  },
		UserId: {
		  type: DataTypes.INTEGER,
		  allowNull: false,
		  references: {
			model: 'Users',
			key: 'id',
		  },
		  onDelete: 'CASCADE',
		  onUpdate: 'CASCADE',
		},
	  },
	  {
		timestamps: false,
	  }
	);
  
	Todo.associate = function (models) {
	  Todo.belongsTo(models.Category, {
		foreignKey: 'CategoryId',
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	  });
	  Todo.belongsTo(models.Status, {
		foreignKey: 'StatusId',
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	  });
	  Todo.belongsTo(models.User, {
		foreignKey: 'UserId',
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	  });
	};
  
	return Todo;
  };