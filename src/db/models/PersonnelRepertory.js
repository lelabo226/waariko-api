module.exports = (sequelize, DataTypes) => {
  const PersonnelRepertory = sequelize.define(
    "PersonnelRepertory",
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

  PersonnelRepertory.associate = (models) => {
    PersonnelRepertory.belongsTo(models.User, { foreignKey: "userId" });
  };

  return PersonnelRepertory;
};
