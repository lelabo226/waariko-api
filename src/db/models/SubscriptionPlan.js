module.exports = (sequelize, DataTypes) => {
  const SubscriptionPlan = sequelize.define("SubscriptionPlan", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    durationInMonths: {
      type: DataTypes.INTEGER, // Durée en mois (1 pour mensuel, 6 pour semestriel, etc.)
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return SubscriptionPlan;
};
