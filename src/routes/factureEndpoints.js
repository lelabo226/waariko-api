const { Facture, Project } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter une facture
  app.post("/api/factures", auth, (req, res) => {
    Facture.create(req.body)
      .then((facture) => {
        const message = "Nouvelle facture ajoutée.";
        res.json({ message, data: facture });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "La facture n'a pas pu être créée. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
        console.log(error);
      });
  });

  // Récupérer toutes les factures
  app.get("/api/factures", auth, (req, res) => {
    Facture.findAll()
      .then((factures) => {
        const message = "La liste des factures a été récupérée.";
        res.json({ message, data: factures });
      })
      .catch((error) => {
        const message = "La liste des factures n'a pas pu être récupérée.";
        res.status(500).json({ message, data: error });
      });
  });

  // Supprimer une facture
  app.delete("/api/factures/:id", auth, (req, res) => {
    Facture.findByPk(req.params.id)
      .then((facture) => {
        if (!facture) {
          const message = "Facture non trouvée.";
          return res.status(404).json({ message });
        }
        return Facture.destroy({ where: { id: req.params.id } }).then(() => {
          const message = `Facture avec l'ID ${req.params.id} supprimée.`;
          res.json({ message });
        });
      })
      .catch((error) => {
        const message = "Erreur lors de la suppression.";
        res.status(500).json({ message, data: error });
      });
  });
  //Reccuperer toutes les factures d'un projet
  app.get("/api/factures/project/:projectId", auth, (req, res) => {
    const projectId = req.params.projectId;

    Facture.findAll({ where: { projectId } })
      .then((factures) => {
        if (factures.length === 0) {
          return res.status(404).json({ message: "Aucune facture trouvée" });
        }
        const message = "Factures récupérées avec succès.";
        res.json({ message, data: factures });
      })
      .catch((error) => {
        const message =
          "Une erreur est survenue lors de la récupération des factures.";
        res.status(500).json({ message, data: error });
      });
  });

  //Mettre à jour une facture
  app.put("/api/factures/:id", auth, async (req, res) => {
    const factureId = req.params.id;

    try {
      // Vérifier si la facture existe
      const facture = await Facture.findByPk(factureId);
      if (!facture) {
        return res
          .status(404)
          .json({ message: "La facture n'a pas été trouvée." });
      }

      // Mettre à jour la facture avec les données fournies dans req.body
      await facture.update(req.body);

      res.status(200).json({
        message: "La facture a été mise à jour avec succès.",
        data: facture,
      });
    } catch (error) {
      console.error(
        "Une erreur est survenue lors de la mise à jour de la facture.",
        error
      );
      res.status(500).json({
        message:
          "Une erreur est survenue lors de la mise à jour de la facture.",
        data: error,
      });
    }
  });

  // Supprimer les factures où le type est "Facture" ou "Bordereau"
  app.delete("/api/factures/project/:projectId", auth, async (req, res) => {
    const projectId = req.params.projectId;

    try {
      const deletedCount = await Facture.destroy({
        where: {
          projectId: projectId,
          type: ["Facture", "Bordereau"], // On cible les types "Facture" et "Bordereau"
        },
      });

      return res.status(200).json({
        message: `factures supprimées avec succès.`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression des factures:", error);
      return res.status(500).json({
        message: "Erreur lors de la suppression des factures.",
        error: error.message,
      });
    }
  });
  // Requête pour récupérer toutes les factures dont le statut du projet est "Proforma validé" et l'utilisateur donné
  app.get("/api/factures/user/:userId/:statut", auth, async (req, res) => {
    const userId = req.params.userId;
    const statut = req.params.statut;

    try {
      const factures = await Facture.findAll({
        include: [
          {
            model: Project,
            where: { statut: statut },
            attributes: [],
          },
        ],
        where: { userId: userId, type: "Proforma" },
      });

      if (factures.length === 0) {
        return res.status(404).json({
          message:
            "Aucune facture trouvée pour cet utilisateur avec le statut de projet 'Proforma validé'.",
        });
      }

      res
        .status(200)
        .json({ message: "Factures récupérées avec succès.", data: factures });
    } catch (error) {
      console.error("Erreur lors de la récupération des factures :", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des factures.",
        data: error,
      });
    }
  });
};
