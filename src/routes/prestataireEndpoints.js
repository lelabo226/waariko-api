const { Prestataire } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter un prestataire
  app.post("/api/prestataires", auth, (req, res) => {
    Prestataire.create(req.body)
      .then((prestataire) => {
        const message = "Nouveau prestataire ajouté.";
        res.json({ message, data: prestataire });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "Le prestataire n'a pas pu être créé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });
  //Mettre à jour un prestataire
  app.put("/api/prestataires/:id", async (req, res) => {
    const prestataireId = req.params.id;
    const {
      userId,
      prestataireRepertoryId,
      note,
      email,

      nomEtPrenom,
      sexe,
      pays,

      contact,
      fonctionSpecialite,
    } = req.body;

    try {
      const prestataire = await Prestataire.findByPk(prestataireId);

      if (!prestataire) {
        return res.status(404).json({
          message: "Prestataire non trouvé.",
        });
      }

      prestataire.userId = userId !== undefined ? userId : prestataire.userId;

      prestataire.prestataireRepertoryId =
        prestataireRepertoryId !== undefined
          ? prestataireRepertoryId
          : prestataire.prestataireRepertoryId;
      prestataire.note = note !== undefined ? note : prestataire.note;
      prestataire.email = email !== undefined ? email : prestataire.email;
      prestataire.fonctionSpecialite =
        fonctionSpecialite !== undefined
          ? fonctionSpecialite
          : prestataire.fonctionSpecialite;

      prestataire.nomEtPrenom =
        nomEtPrenom !== undefined ? nomEtPrenom : prestataire.nomEtPrenom;
      prestataire.sexe = sexe !== undefined ? sexe : prestataire.sexe;
      prestataire.pays = pays !== undefined ? pays : prestataire.pays;

      prestataire.contact =
        contact !== undefined ? contact : prestataire.contact;

      await prestataire.save();

      return res.status(200).json({
        message: "Le prestataire a été mis à jour avec succès.",
        data: prestataire,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la mise à jour du prestataire.",
        error: error.message,
      });
    }
  });

  // Récupérer tous les prestataires
  app.get("/api/prestataires", auth, (req, res) => {
    Prestataire.findAll()
      .then((prestataires) => {
        const message = "La liste des prestataires a été récupérée.";
        res.json({ message, data: prestataires });
      })
      .catch((error) => {
        const message = "La liste des prestataires n'a pas pu être récupérée.";
        res.status(500).json({ message, data: error });
      });
  });

  // Supprimer un prestataire
  app.delete("/api/prestataires/:id", auth, (req, res) => {
    Prestataire.findByPk(req.params.id)
      .then((prestataire) => {
        if (!prestataire) {
          const message = "Prestataire non trouvé.";
          return res.status(404).json({ message });
        }
        return Prestataire.destroy({ where: { id: req.params.id } }).then(
          () => {
            const message = `Prestataire avec l'ID ${req.params.id} supprimé.`;
            res.json({ message });
          }
        );
      })
      .catch((error) => {
        const message = "Erreur lors de la suppression.";
        res.status(500).json({ message, data: error });
      });
  });

  //Reccupérer tous les prestataires d'un dossier prestataire
  app.get(
    "/api/prestataires/prestataireRepertories/:prestataireRepertoryId",
    auth,
    (req, res) => {
      const prestataireRepertoryId = req.params.prestataireRepertoryId;
      Prestataire.findAll({ where: { prestataireRepertoryId } })
        .then((prestataires) => {
          if (prestataires.length === 0) {
            return res
              .status(404)
              .json({ message: "Aucun prestataire trouvé" });
          }
          const message = "Prestataires récupérés avec succès.";
          res.json({ message, data: prestataires });
        })
        .catch((error) => {
          const message =
            "Une erreur est survenue lors de la récupération des prestataires.";
          res.status(500).json({ message, data: error });
        });
    }
  );

  //Reccupérer tous les prestataires d'un userId
  app.get("/api/prestataires/users/:userId", auth, (req, res) => {
    const userId = req.params.userId;
    Prestataire.findAll({ where: { userId } })
      .then((prestataires) => {
        if (prestataires.length === 0) {
          return res.status(404).json({ message: "Aucun prestataire trouvé" });
        }
        const message = "Prestataires récupérés avec succès.";
        res.json({ message, data: prestataires });
      })
      .catch((error) => {
        const message =
          "Une erreur est survenue lors de la récupération des prestataires.";
        res.status(500).json({ message, data: error });
      });
  });
};
