module.exports = (sequelize, DataTypes) => {
	const Category = sequelize.define(
	  'Category',
	  {
		name: {
		  type: DataTypes.STRING,
		  allowNull: false,
		  unique: true,
		},
	  },
	  {
		timestamps: false,
	  }
	);
  
	Category.associate = function (models) {
	  Category.hasMany(models.Todo, {
		foreignKey: 'CategoryId',
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	  });
	};
  
	return Category;
  };