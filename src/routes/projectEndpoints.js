const { Project, Client, Facture } = require("../db/sequelize");
const { ValidationError, Op, Sequelize } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter un projet
  app.post("/api/projects", auth, (req, res) => {
    Project.create(req.body)
      .then((projet) => {
        const message = "Nouveau projet ajouté.";
        res.json({ message, data: projet });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "Le projet n'a pas pu être créé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });
  //Mettre à jour un projet
  app.put("/api/projects/:id", async (req, res) => {
    const projectId = req.params.id;
    const {
      userId,
      clientId,
      projectName,
      createDate,
      validateDate,
      statut,
      clientName,
      versementType,
    } = req.body;

    try {
      const project = await Project.findByPk(projectId);

      if (!project) {
        return res.status(404).json({
          message: "Projet non trouvé.",
        });
      }

      project.userId = userId !== undefined ? userId : project.userId;
      project.clientId = clientId !== undefined ? clientId : project.clientId;
      project.projectName =
        projectName !== undefined ? projectName : project.projectName;
      project.createDate =
        createDate !== undefined ? createDate : project.createDate;
      project.validateDate =
        validateDate !== undefined ? validateDate : project.validateDate;

      project.clientName =
        clientName !== undefined ? clientName : project.clientName;
      project.statut = statut !== undefined ? statut : project.statut;
      project.versementType =
        versementType !== undefined ? versementType : project.versementType;
      versementType;

      await project.save();

      return res.status(200).json({
        message: "Le projet a été mis à jour avec succès.",
        data: project,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la mise à jour du projet.",
        error: error.message,
      });
    }
  });

  // Récupérer tous les projects
  app.get("/api/projects", auth, (req, res) => {
    Project.findAll()
      .then((projects) => {
        const message = "La liste des projects a été récupérée.";
        res.json({ message, data: projects });
      })
      .catch((error) => {
        const message = "La liste des projects n'a pas pu être récupérée.";
        res.status(500).json({ message, data: error });
      });
  });

  // Supprimer un projet
  app.delete("/api/projects/:id", auth, (req, res) => {
    Project.findByPk(req.params.id)
      .then((projet) => {
        if (!projet) {
          const message = "Projet non trouvé.";
          return res.status(404).json({ message });
        }
        return Project.destroy({ where: { id: req.params.id } }).then(() => {
          const message = `Projet avec l'ID ${req.params.id} supprimé.`;
          res.json({ message });
        });
      })
      .catch((error) => {
        const message = "Erreur lors de la suppression.";
        res.status(500).json({ message, data: error });
      });
  });

  //Reccupérer tous les projets d'un client
  app.get("/api/projects/client/:clientId", auth, (req, res) => {
    const clientId = req.params.clientId;
    Project.findAll({ where: { clientId } })
      .then((projects) => {
        if (projects.length === 0) {
          return res.status(404).json({ message: "Aucun projet trouvé" });
        }
        const message = "Projets récupérés avec succès.";
        res.json({ message, data: projects });
      })
      .catch((error) => {
        const message =
          "Une erreur est survenue lors de la récupération des projets.";
        res.status(500).json({ message, data: error });
      });
  });

  //Reccupérer tous les projets d'un userId
  app.get("/api/projects/users/:userId", auth, (req, res) => {
    const userId = req.params.userId;
    Project.findAll({ where: { userId } })
      .then((projects) => {
        if (projects.length === 0) {
          return res.status(404).json({ message: "Aucun projet trouvé" });
        }
        const message = "Projets récupérés avec succès.";
        res.json({ message, data: projects });
      })
      .catch((error) => {
        const message =
          "Une erreur est survenue lors de la récupération des projets.";
        res.status(500).json({ message, data: error });
      });
  });

  // Récupérer tous les projets terminés d'un utilisateur dans une plage de dates
  app.get("/api/users/:userId/completed-projects", auth, async (req, res) => {
    const userId = req.params.userId;
    let { startDate, endDate } = req.query;

    try {
      let whereCondition = {
        userId: userId,
        statut: "Projet terminé",
      };

      // Vérifier que startDate et endDate sont fournis
      if (startDate && endDate) {
        whereCondition[Op.and] = [
          Sequelize.where(
            Sequelize.fn(
              "STR_TO_DATE",
              Sequelize.col("createDate"),
              "%d/%m/%Y"
            ),
            {
              [Op.between]: [
                Sequelize.fn("STR_TO_DATE", startDate, "%d/%m/%Y"),
                Sequelize.fn("STR_TO_DATE", endDate, "%d/%m/%Y"),
              ],
            }
          ),
        ];
      }

      const completedProjects = await Project.findAll({
        where: whereCondition,
        include: [
          {
            model: Client,
            attributes: [
              "id",
              "type",
              "userId",
              "clientName",
              "clientPays",
              "clientSecteurActivite",
              "clientEmail",
              "clientAdresse",
              "contactInterneNameSurname",
              "contactInterneEmail",
              "contactInternePoste",
              "contactInterneContact",
            ],
          },
          {
            model: Facture,
            where: {
              type: "Proforma",
            },
            required: false,
            attributes: [
              "id",
              "projectId",
              "clientId",
              "userId",
              "proformaId",
              "type",
              "factureType",
              "remise",
              "tva",
              "paiementModality",
              "detailsSupp",
              "totalAmount",
              "createDate",
              "validateDate",
            ],
            limit: 1,
          },
        ],
        order: [
          [
            Sequelize.fn(
              "STR_TO_DATE",
              Sequelize.col("createDate"),
              "%d/%m/%Y"
            ),
            "DESC",
          ],
        ],
      });

      res.status(200).json({
        message: "Projets terminés récupérés avec succès.",
        data: completedProjects,
      });
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des projets terminés :",
        error
      );
      res.status(500).json({
        message:
          "Une erreur est survenue lors de la récupération des projets terminés.",
        data: error,
      });
    }
  });
};
