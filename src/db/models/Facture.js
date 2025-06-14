module.exports = (sequelize, DataTypes) => {
  const Facture = sequelize.define(
    "Facture",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Projects", // Référence au modèle Project
          key: "id",
        },
        onDelete: "CASCADE", // Supprime la facture si le projet est supprimé
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Clients", // Référence au modèle Client
          key: "id",
        },
        onDelete: "CASCADE", // Supprime la facture si le client est supprimé
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Référence au modèle User
          key: "id",
        },
        onDelete: "CASCADE", // Supprime la facture si l'utilisateur est supprimé
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      proformaId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      detailsSupp: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      factureType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      remise: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      tva: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      paiementModality: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
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
    },
    { timestamps: true }
  );

  Facture.associate = (models) => {
    // Associer Facture avec Project
    Facture.belongsTo(models.Project, { foreignKey: "projectId" });
  };

  return Facture;
};
