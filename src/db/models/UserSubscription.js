module.exports = (sequelize, DataTypes) => {
  const UserSubscription = sequelize.define(
    "UserSubscription",
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users", // Référence au modèle utilisateur
          key: "id",
        },
        onDelete: "CASCADE",
      },
      startDate: {
        type: DataTypes.STRING, // Utilise STRING pour les formats de dates custom
        allowNull: false,
      },
      endDate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      daysRemaining: {
        type: DataTypes.INTEGER,
        defaultValue: 30, // ou la durée initiale du plan d'abonnement
      },
      reference: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      planAbonnement: {
        type: DataTypes.INTEGER, // Par exemple : 1 pour mensuel, 2 pour semestriel, 3 pour annuel
        allowNull: false,
      },
      montant: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true, // Ajoute createdAt et updatedAt automatiquement
    }
  );

  // Définir la relation avec le modèle User
  UserSubscription.associate = (models) => {
    UserSubscription.belongsTo(models.User, { foreignKey: "userId" });
  };

  return UserSubscription;
};
