// models/status.js
module.exports = (sequelize, DataTypes) => {
	const Status = sequelize.define('Status', {
	  name: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	  }
	});
  
	Status.checkAndInsertDefaultStatuses = async () => {
	  const defaultStatuses = ['Not Started', 'Started', 'Completed', 'Deleted'];
	  const existingStatuses = await Status.findAll({
		where: {
		  name: defaultStatuses
		}
	  });
  
	  const existingStatusNames = existingStatuses.map(status => status.name);
	  const statusesToInsert = defaultStatuses.filter(status => !existingStatusNames.includes(status));
  
	  if (statusesToInsert.length > 0) {
		await Status.bulkCreate(
		  statusesToInsert.map(name => ({ name })),
		  { validate: true }
		);
	  }
	};
  
	Status.associate = function (models) {
		Status.hasMany(models.Todo, {
		  foreignKey: 'StatusId',
		  onDelete: 'SET NULL',
		  onUpdate: 'CASCADE',
		});
	  };
  
	return Status;
  };