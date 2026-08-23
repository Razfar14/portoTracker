module.exports = (sequelize, DataTypes) => {
  const FinancialAsset = sequelize.define('FinancialAsset', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sector_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    company_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    market_cap: {
      type: DataTypes.BIGINT,
      allowNull: false,
      get() {
        // Parse bigints returned as string to JavaScript numbers safely
        const value = this.getDataValue('market_cap');
        return value === null ? null : parseFloat(value);
      }
    },
    last_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    per: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    pbv: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    dividend_yield: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    roe: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    debt_to_equity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    revenue_growth: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    }
  }, {
    tableName: 'financial_assets',
    underscored: true,
    timestamps: true
  });

  FinancialAsset.associate = (models) => {
    FinancialAsset.belongsTo(models.StockSector, {
      foreignKey: 'sector_id',
      as: 'sector'
    });
  };

  return FinancialAsset;
};
