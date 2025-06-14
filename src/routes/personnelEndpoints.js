const { Personnel } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter un personnel
  app.post("/api/personnels", auth, (req, res) => {
    Personnel.create(req.body)
      .then((personnel) => {
        const message = "Nouveau personnel ajouté.";
        res.json({ message, data: personnel });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "Le personnel n'a pas pu être créé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });
  //Mettre à jour un personnel
  app.put("/api/personnels/:id", async (req, res) => {
    const personnelId = req.params.id;
    const {
      userId,
      personnelRepertoryId,
      note,
      email,
      dateDeNaissance,
      nomEtPrenom,
      sexe,
      pays,

      contact,
      poste,
      contrat,
    } = req.body;

    try {
      const personnel = await Personnel.findByPk(personnelId);

      if (!personnel) {
        return res.status(404).json({
          message: "personnel non trouvé.",
        });
      }

      personnel.userId = userId !== undefined ? userId : personnel.userId;

      personnel.personnelRepertoryId =
        personnelRepertoryId !== undefined
          ? personnelRepertoryId
          : personnel.personnelRepertoryId;
      personnel.note = note !== undefined ? note : personnel.note;
      personnel.email = email !== undefined ? email : personnel.email;
      personnel.dateDeNaissance =
        dateDeNaissance !== undefined
          ? dateDeNaissance
          : personnel.dateDeNaissance;

      personnel.nomEtPrenom =
        nomEtPrenom !== undefined ? nomEtPrenom : personnel.nomEtPrenom;
      personnel.sexe = sexe !== undefined ? sexe : personnel.sexe;
      personnel.pays = pays !== undefined ? pays : personnel.pays;

      personnel.contact = contact !== undefined ? contact : personnel.contact;

      personnel.poste = poste !== undefined ? poste : personnel.poste;

      personnel.contrat = contrat !== undefined ? contrat : personnel.contrat;

      await personnel.save();

      return res.status(200).json({
        message: "Le personnel a été mis à jour avec succès.",
        data: personnel,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la mise à jour du personnel.",
        error: error.message,
      });
    }
  });

  // Récupérer tous les personnels
  app.get("/api/personnels", auth, (req, res) => {
    Personnel.findAll()
      .then((personnels) => {
        const message = "La liste des personnels a été récupérée.";
        res.json({ message, data: personnels });
      })
      .catch((error) => {
        const message = "La liste des personnels n'a pas pu être récupérée.";
        res.status(500).json({ message, data: error });
      });
  });

  // Supprimer un personnel
  app.delete("/api/personnels/:id", auth, (req, res) => {
    Personnel.findByPk(req.params.id)
      .then((personnel) => {
        if (!personnel) {
          const message = "Personnel non trouvé.";
          return res.status(404).json({ message });
        }
        return Personnel.destroy({ where: { id: req.params.id } }).then(() => {
          const message = `Personnel avec l'ID ${req.params.id} supprimé.`;
          res.json({ message });
        });
      })
      .catch((error) => {
        const message = "Erreur lors de la suppression.";
        res.status(500).json({ message, data: error });
      });
  });

  //Reccupérer tous les personnels d'un dossier personnel
  app.get(
    "/api/personnels/personnelRepertories/:personnelRepertoryId",
    auth,
    (req, res) => {
      const personnelRepertoryId = req.params.personnelRepertoryId;
      Personnel.findAll({ where: { personnelRepertoryId } })
        .then((personnels) => {
          if (personnels.length === 0) {
            return res.status(404).json({ message: "Aucun personnel trouvé" });
          }
          const message = "Personnels récupérés avec succès.";
          res.json({ message, data: personnels });
        })
        .catch((error) => {
          const message =
            "Une erreur est survenue lors de la récupération des personnels.";
          res.status(500).json({ message, data: error });
        });
    }
  );

  //Reccupérer tous les personnels d'un userId
  app.get("/api/personnels/users/:userId", auth, (req, res) => {
    const userId = req.params.userId;
    Personnel.findAll({ where: { userId } })
      .then((personnels) => {
        if (personnels.length === 0) {
          return res.status(404).json({ message: "Aucun personnel trouvé" });
        }
        const message = "Personnels récupérés avec succès.";
        res.json({ message, data: personnels });
      })
      .catch((error) => {
        const message =
          "Une erreur est survenue lors de la récupération des personnels.";
        res.status(500).json({ message, data: error });
      });
  });
};
