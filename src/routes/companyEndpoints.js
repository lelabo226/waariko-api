const { Company, User } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter une entreprise
  app.post("/api/companiesProfil", auth, async (req, res) => {
    const userId = req.body.userId;

    try {
      // Vérifier si l'utilisateur possède déjà une entreprise
      const existingCompany = await Company.findOne({ where: { userId } });
      if (existingCompany) {
        return res.status(400).json({
          message: "Cet utilisateur possède déjà une entreprise.",
        });
      }
      // Si aucune entreprise n'existe, créer une nouvelle entreprise
      const company = await Company.create(req.body);
      res.status(201).json({
        message: "Nouveau profil entreprise ajouté.",
        data: company,
      });
    } catch (error) {
      res.status(500).json({
        message:
          "Le profil n'a pas pu être crée. Réessayez dans quelques instants.",
        data: error,
      });
    }
  });
  // Récupérer toutes les entreprises
  app.get("/api/companies", auth, (req, res) => {
    Company.findAll()
      .then((entreprises) => {
        const message = "La liste des entreprises a été récupérée.";
        res.json({ message, data: entreprises });
      })
      .catch((error) => {
        const message = "La liste des entreprises n'a pas pu être récupérée.";
        res.status(500).json({ message, data: error });
      });
  });

  // Supprimer une entreprise
  app.delete("/api/companies/:id", auth, (req, res) => {
    Company.findByPk(req.params.id)
      .then((entreprise) => {
        if (!entreprise) {
          const message = "L'entreprise demandée n'existe pas.";
          return res.status(404).json({ message });
        }
        return Company.destroy({ where: { id: req.params.id } }).then(() => {
          const message = `L'entreprise avec l'ID ${req.params.id} a été supprimée.`;
          res.json({ message, data: entreprise });
        });
      })
      .catch((error) => {
        const message = "L'entreprise n'a pas pu être supprimée.";
        res.status(500).json({ message, data: error });
      });
  });

  // Reccuperer le profil entreprise
  app.get("/api/users/:userId/companyProfil", auth, (req, res) => {
    const userId = req.params.userId;

    User.findByPk(userId, {
      include: [
        {
          model: Company,
          as: "company",
        },
      ],
    })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const company = user.company;

        if (!company) {
          return res.status(404).json({
            message: "Aucune compagnie associée à cet utilisateur.",
          });
        }

        res.json({ message: "Profil réccupéré.", data: company });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(500)
          .json({ message: "Erreur de récupération du profil.", data: error });
      });
  });

  //Mettre à jour l'entreprise

  app.put("/api/companies/:id", auth, async (req, res) => {
    const companyId = req.params.id;

    try {
      // Vérifier si l'entreprise existe
      const company = await Company.findByPk(companyId);
      if (!company) {
        return res.status(404).json({ message: "Entreprise non trouvée." });
      }

      // Mettre à jour l'entreprise avec les données fournies dans req.body
      await company.update(req.body);

      res.status(200).json({
        message: "L'entreprise a été mise à jour avec succès.",
        data: company,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'entreprise :", error);
      res.status(500).json({
        message: "Erreur lors de la mise à jour de l'entreprise.",
        data: error,
      });
    }
  });
};
