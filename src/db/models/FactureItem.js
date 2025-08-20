module.exports = (sequelize, DataTypes) => {
  const FactureItem = sequelize.define(
    "FactureItem",
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
        onDelete: "CASCADE", // Supprime les items si le projet est supprimé
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Clients", // Référence au modèle Client
          key: "id",
        },
        onDelete: "CASCADE", // Supprime les items si le client est supprimé
      },
      factureId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Factures", // Référence au modèle Facture
          key: "id",
        },
        onDelete: "CASCADE", // Supprime les items si la facture est supprimée
      },
      designation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      unitPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Référence au modèle User
          key: "id",
        },
        onDelete: "CASCADE", // Supprime les items si l'utilisateur est supprimé
      },
    },
    { timestamps: true }
  );

 FactureItem.associate = (models) => {
  FactureItem.belongsTo(models.Facture, { foreignKey: "factureId" });

  // si tu veux naviguer aussi depuis Facture vers FactureItem
  models.Facture.hasMany(models.FactureItem, { foreignKey: "factureId" });
};

  return FactureItem;
};
