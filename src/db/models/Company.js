module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
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
        onDelete: "CASCADE", // Si l'utilisateur est supprimé, la compagnie sera aussi supprimée
      },
      nomEntreprise: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      secteurActivite: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      siegeSocial: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      adresseEmailEntreprise: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      indicatifContactPrimaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactPrimaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rccm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      statutJuridique: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ifu: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bankNumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ifu2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      indicatifContactSecondaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contactSecondaire: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      logo: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      signature: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      factureModelNumber: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      factureModelPrimaryColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      factureModelSecondaryColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },

    { timestamps: true } // Ajoute createdAt et updatedAt par défaut
  );

  Company.associate = (models) => {
    Company.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Company;
};
