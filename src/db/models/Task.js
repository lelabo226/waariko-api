module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    "Task",
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
          model: "Users", // Référence au modèle User
          key: "id",
        },
        onDelete: "CASCADE", // Supprime la tâche si l'utilisateur est supprimé
      },
      taskListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "TaskLists", // Référence au modèle TaskList
          key: "id",
        },
        onDelete: "CASCADE", // Supprime la tâche si la liste associée est supprimée
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true, // Facultatif
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true, // Facultatif
      },
      date: {
        type: DataTypes.STRING, // Format attendu : DD/MM/YYYY
        allowNull: true,
      },
      hour: {
        type: DataTypes.STRING, // Format attendu : HH:mm
        allowNull: true,
      },
    },
    { timestamps: true } // Ajoute createdAt et updatedAt
  );

  Task.associate = (models) => {
    Task.belongsTo(models.User, { foreignKey: "userId" }); // Une tâche appartient à un utilisateur
    Task.belongsTo(models.TaskList, {
      foreignKey: "taskListId",
      as: "taskList",
    }); // Une tâche appartient à une liste de tâches
  };

  return Task;
};
