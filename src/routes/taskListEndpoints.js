const { Client, TaskList } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter un taskList
  app.post("/api/taskLists", auth, async (req, res) => {
    try {
      const { userId, taskListName, color } = req.body;

      const taskList = await TaskList.create({
        userId,
        taskListName,
        color,
      });

      res
        .status(201)
        .json({ message: "TaskList créée avec succès.", data: taskList });
    } catch (error) {
      console.error("Erreur lors de la création de la TaskList :", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la création de la TaskList.", error });
    }
  });

  // Modifier un taskList
  app.put("/api/taskLists/:id", auth, async (req, res) => {
    try {
      const { id } = req.params;
      const { taskListName, color } = req.body;

      const updatedTaskList = await TaskList.update(
        { taskListName, color },
        { where: { id }, returning: true }
      );

      if (updatedTaskList[0] === 0) {
        return res.status(404).json({ message: "TaskList non trouvée." });
      }

      res.json({
        message: "TaskList mise à jour avec succès.",
        data: updatedTaskList[1][0],
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la TaskList :", error);
      res.status(500).json({
        message: "Erreur lors de la mise à jour de la TaskList.",
        error,
      });
    }
  });
  // supprimer un taskList
  app.delete("/api/taskLists/:id", auth, async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await TaskList.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ message: "TaskList non trouvée." });
      }

      res.json({ message: "TaskList supprimée avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression de la TaskList :", error);
      res.status(500).json({
        message: "Erreur lors de la suppression de la TaskList.",
        error,
      });
    }
  });

  // reccupérer tous les tasklists d'un user
  app.get("/api/taskLists/user/:userId", auth, async (req, res) => {
    try {
      const { userId } = req.params;

      const taskLists = await TaskList.findAll({ where: { userId } });

      res.json({
        message: "TaskLists récupérées avec succès.",
        data: taskLists,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des TaskLists :", error);
      res
        .status(500)
        .json({
          message: "Erreur lors de la récupération des TaskLists.",
          error,
        });
    }
  });
};
