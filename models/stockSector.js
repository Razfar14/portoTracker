module.exports = (sequelize, DataTypes) => {
  const StockSector = sequelize.define('StockSector', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'stock_sectors',
    underscored: true,
    timestamps: true
  });

  StockSector.associate = (models) => {
    StockSector.hasMany(models.FinancialAsset, {
      foreignKey: 'sector_id',
      as: 'assets',
      onDelete: 'RESTRICT'
    });
  };

  return StockSector;
};
