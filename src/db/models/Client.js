module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define(
    "Client",
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
        onDelete: "CASCADE", // Supprime le client si l'utilisateur est supprimé
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clientName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clientPays: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clientSecteurActivite: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clientEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      clientAdresse: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactInterneNameSurname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactInterneEmail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactInternePoste: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactInterneContact: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: true }
  );

  Client.associate = (models) => {
    // Un client est associé à un utilisateur
    Client.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Client;
};
