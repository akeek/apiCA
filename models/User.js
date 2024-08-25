module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        Name: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        Email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        EncryptedPassword: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false
        },
        Salt: {
            type: Sequelize.DataTypes.BLOB,
            allowNull: false
        },
    },{
        timestamps: false
    });
    User.associate = function (models) {
		User.hasMany(models.Todo, {
		  foreignKey: 'UserId',
		  onDelete: 'CASCADE',
		  onUpdate: 'CASCADE',
		});
	  };
    return User
}