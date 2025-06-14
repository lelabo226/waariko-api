module.exports = (sequelize, DataTypes) => {
  const PrestataireRepertory = sequelize.define(
    "PrestataireRepertory",
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
          model: "Users", // Référence au modèle utilisateur
          key: "id",
        },
        onDelete: "CASCADE",
      },
      repertoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: true } // Ajout de freezeTableName
  );

  PrestataireRepertory.associate = (models) => {
    PrestataireRepertory.belongsTo(models.User, { foreignKey: "userId" });
  };

  return PrestataireRepertory;
};
