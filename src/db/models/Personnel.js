module.exports = (sequelize, DataTypes) => {
  const Personnel = sequelize.define(
    "Personnel",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      personnelRepertoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "PersonnelRepertories",
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
      dateDeNaissance: {
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
      poste: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contrat: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true } // Ajout de freezeTableName
  );

  Personnel.associate = (models) => {
    Personnel.belongsTo(models.PersonnelRepertory, {
      foreignKey: "personnelRepertoryId",
    });
  };

  return Personnel;
};
