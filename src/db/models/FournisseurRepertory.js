module.exports = (sequelize, DataTypes) => {
  const FournisseurRepertory = sequelize.define(
    "FournisseurRepertory",
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

  FournisseurRepertory.associate = (models) => {
    FournisseurRepertory.belongsTo(models.User, { foreignKey: "userId" });
  };

  return FournisseurRepertory;
};
