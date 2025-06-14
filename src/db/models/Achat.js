module.exports = (sequelize, DataTypes) => {
  const Achat = sequelize.define(
    "Achat",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      achatRepertoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "AchatRepertories",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      date: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  Achat.associate = (models) => {
    Achat.belongsTo(models.AchatRepertory, { foreignKey: "achatRepertoryId" });
  };

  return Achat;
};
