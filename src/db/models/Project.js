module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Clients", // Référence au modèle Client
          key: "id",
        },
        onDelete: "CASCADE", // Supprime le projet si le client est supprimé
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Référence au modèle User
          key: "id",
        },
        onDelete: "CASCADE", // Supprime le projet si l'utilisateur est supprimé
      },
      projectName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clientName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      statut: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      validateDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      versementType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  Project.associate = (models) => {
    Project.belongsTo(models.Client, { foreignKey: "clientId" });
  };

  return Project;
};
