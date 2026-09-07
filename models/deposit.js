module.exports = (sequelize, DataTypes) => {
  const Deposit = sequelize.define('Deposit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('deposit', 'withdrawal'),
      allowNull: false,
      defaultValue: 'deposit'
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'deposits',
    underscored: true,
    timestamps: true
  });

  Deposit.associate = (models) => {
    Deposit.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return Deposit;
};
