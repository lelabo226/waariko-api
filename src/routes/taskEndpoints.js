const { TaskList, Task } = require("../db/sequelize");
const { ValidationError, Op } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter un task
  app.post("/api/tasks", auth, async (req, res) => {
    try {
      const { userId, taskListId, title, color, description, date, hour } =
        req.body;

      const task = await Task.create({
        userId,
        taskListId,
        title,
        color,
        description,
        date,
        hour,
      });

      res.status(201).json({ message: "Task créée avec succès.", data: task });
    } catch (error) {
      console.error("Erreur lors de la création de la Task :", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la création de la Task.", error });
    }
  });

  // Modifier un task
  app.put("/api/tasks/:id", auth, async (req, res) => {
    try {
      const { id } = req.params;
      const { title, color, description, date, hour } = req.body;

      const updatedTask = await Task.update(
        { title, color, description, date, hour },
        { where: { id }, returning: true }
      );

      if (updatedTask[0] === 0) {
        return res.status(404).json({ message: "Task non trouvée." });
      }

      res.json({
        message: "Task mise à jour avec succès.",
        data: updatedTask[1][0],
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la Task :", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de la Task.", error });
    }
  });

  // supprimer un task
  app.delete("/api/tasks/:id", auth, async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await Task.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ message: "Task non trouvée." });
      }

      res.json({ message: "Task supprimée avec succès." });
    } catch (error) {
      console.error("Erreur lors de la suppression de la Task :", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression de la Task.", error });
    }
  });

  // reccupérer tous les tasks d'un tasklist
  app.get("/api/tasks/taskList/:taskListId", auth, async (req, res) => {
    try {
      const { taskListId } = req.params;

      const tasks = await Task.findAll({ where: { taskListId } });

      res.json({ message: "Tasks récupérées avec succès.", data: tasks });
    } catch (error) {
      console.error("Erreur lors de la récupération des Tasks :", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des Tasks.", error });
    }
  });

  // reccupérer tous les tasks d'un tasklist
  app.get("/api/tasks/user/:userId", auth, async (req, res) => {
    try {
      const { userId } = req.params;

      const tasks = await Task.findAll({ where: { userId } });

      res.json({ message: "Tasks récupérées avec succès.", data: tasks });
    } catch (error) {
      console.error("Erreur lors de la récupération des Tasks :", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des Tasks.", error });
    }
  });
  // Reccupérer tous les tasks de la semaine

  app.get("/api/tasks/user/:userId/week", auth, async (req, res) => {
    try {
      const { userId } = req.params;

      const startOfWeek = new Date();
      const endOfWeek = new Date();
      const dayOfWeek = startOfWeek.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      // Formater les dates en "DD/MM/YYYY"
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const start = formatDate(startOfWeek);
      const end = formatDate(endOfWeek);

      const taskLists = await TaskList.findAll({
        where: { userId },
        include: [
          {
            model: Task,
            as: "tasks", // Spécifiez l'alias utilisé dans votre relation
            where: {
              date: {
                [Op.between]: [start, end],
              },
            },
            required: true, // Inclure les taskLists même si elles n'ont pas de tasks cette semaine
          },
        ],
      });

      const result = taskLists.map((taskList) => ({
        taskListId: taskList.id,
        taskListName: taskList.taskListName,
        color: taskList.color,

        tasks: (taskList.tasks || []).map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          date: task.date,
          hour: task.hour,
          color: task.color,
        })),
      }));

      res.status(200).json({
        message:
          "Tasks de la semaine classées par taskList récupérées avec succès.",
        data: result,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des tasks :", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des tasks.",
        error,
      });
    }
  });

  app.get("/api/tasks/user/:userId/day", auth, async (req, res) => {
    try {
      const { userId } = req.params;

      // Obtenir la date du jour au format "DD/MM/YYYY"
      const today = new Date();
      const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      const todayFormatted = formatDate(today);

      // Récupérer les taskLists et les tasks associées
      const taskLists = await TaskList.findAll({
        where: { userId },
        include: [
          {
            model: Task,
            as: "tasks",
            where: { date: todayFormatted },
            required: true,
          },
        ],
      });

      // Structurer les données
      const result = taskLists.map((taskList) => ({
        taskListId: taskList.id,
        taskListName: taskList.taskListName,
        color: taskList.color,
        tasks: (taskList.tasks || []).map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          date: task.date,
          hour: task.hour,
          color: task.color,
        })),
      }));

      res.status(200).json({
        message: "Tasks du jour classées par TaskList récupérées avec succès.",
        data: result,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des tasks :", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des tasks.",
        error,
      });
    }
  });
};
