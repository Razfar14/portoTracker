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
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'client'),
      defaultValue: 'client'
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'users',
    underscored: true,
    timestamps: true
  });

  User.associate = (models) => {
    User.belongsTo(models.User, {
      foreignKey: 'admin_id',
      as: 'admin'
    });
    User.hasMany(models.User, {
      foreignKey: 'admin_id',
      as: 'clients'
    });
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
