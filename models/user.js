module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'client'),
      defaultValue: 'client'
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.PortfolioTransaction, {
      foreignKey: 'user_id',
      as: 'portfolio'
    });
    User.hasMany(models.Deposit, {
      foreignKey: 'user_id',
      as: 'deposits'
    });
  };

  return User;
};
