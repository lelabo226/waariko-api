module.exports = (sequelize, DataTypes) => {
  const Prestataire = sequelize.define(
    "Prestataire",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      prestataireRepertoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PrestataireRepertories",
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
      note: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      nomEtPrenom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sexe: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pays: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      contact: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fonctionSpecialite: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true } // Ajout de freezeTableName
  );

  Prestataire.associate = (models) => {
    Prestataire.belongsTo(models.PrestataireRepertory, {
      foreignKey: "prestataireRepertoryId",
    });
  };

  return Prestataire;
};
