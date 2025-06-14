module.exports = (sequelize, DataTypes) => {
  const TaskList = sequelize.define(
    "TaskList",
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
        onDelete: "CASCADE", // Supprime la liste si l'utilisateur est supprimé
      },
      taskListName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true, // Facultatif
      },
    },
    { timestamps: true } // Ajoute createdAt et updatedAt
  );

  TaskList.associate = (models) => {
    TaskList.belongsTo(models.User, { foreignKey: "userId" }); // Une liste appartient à un utilisateur
    TaskList.hasMany(models.Task, { foreignKey: "taskListId", as: "tasks" }); // Une liste peut avoir plusieurs tâches
  };

  return TaskList;
};
