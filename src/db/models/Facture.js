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
          model: "Projects",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      clientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Clients",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      companyId: { // Nouveau champ pour l’entreprise émettrice
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Companies",
          key: "id",
        },
        onDelete: "CASCADE",
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
    // Facture → Project
    Facture.belongsTo(models.Project, { foreignKey: "projectId" });

    // Facture → Client
    Facture.belongsTo(models.Client, { foreignKey: "clientId" });

    // Facture → Company
    Facture.belongsTo(models.Company, { foreignKey: "companyId" });

    // Facture → User
    Facture.belongsTo(models.User, { foreignKey: "userId" });

    // Facture → FactureItem (une facture peut avoir plusieurs items)
    Facture.hasMany(models.FactureItem, { foreignKey: "factureId" });
  };

  return Facture;
};
