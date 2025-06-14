module.exports = (sequelize, DataTypes) => {
  const Fournisseur = sequelize.define(
    "Fournisseur",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      fournisseurRepertoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "FournisseurRepertories",
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

  Fournisseur.associate = (models) => {
    Fournisseur.belongsTo(models.FournisseurRepertory, {
      foreignKey: "fournisseurRepertoryId",
    });
  };

  return Fournisseur;
};
