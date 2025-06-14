module.exports = (sequelize, DataTypes) => {
  const AchatRepertory = sequelize.define(
    "AchatRepertory",
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
      repertoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  AchatRepertory.associate = (models) => {
    AchatRepertory.belongsTo(models.User, { foreignKey: "userId" });
  };

  return AchatRepertory;
};
