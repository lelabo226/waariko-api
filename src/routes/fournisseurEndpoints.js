const { Fournisseur } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter un fournisseur
  app.post("/api/fournisseurs", auth, (req, res) => {
    Fournisseur.create(req.body)
      .then((fournisseur) => {
        const message = "Nouveau fournisseur ajouté.";
        res.json({ message, data: fournisseur });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "Le fournisseur n'a pas pu être créé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });
  //Mettre à jour un fournisseur
  app.put("/api/fournisseurs/:id", async (req, res) => {
    const fournisseurId = req.params.id;
    const {
      userId,
      fournisseurRepertoryId,
      note,
      email,

      nomEtPrenom,
      sexe,
      pays,

      contact,
      fonctionSpecialite,
    } = req.body;

    try {
      const fournisseur = await Fournisseur.findByPk(fournisseurId);

      if (!fournisseur) {
        return res.status(404).json({
          message: "Fournisseur non trouvé.",
        });
      }

      fournisseur.userId = userId !== undefined ? userId : fournisseur.userId;

      fournisseur.fournisseurRepertoryId =
        fournisseurRepertoryId !== undefined
          ? fournisseurRepertoryId
          : fournisseur.fournisseurRepertoryId;
      fournisseur.note = note !== undefined ? note : fournisseur.note;
      fournisseur.email = email !== undefined ? email : fournisseur.email;
      fournisseur.fonctionSpecialite =
        fonctionSpecialite !== undefined
          ? fonctionSpecialite
          : fournisseur.fonctionSpecialite;

      fournisseur.nomEtPrenom =
        nomEtPrenom !== undefined ? nomEtPrenom : fournisseur.nomEtPrenom;
      fournisseur.sexe = sexe !== undefined ? sexe : fournisseur.sexe;
      fournisseur.pays = pays !== undefined ? pays : fournisseur.pays;

      fournisseur.contact =
        contact !== undefined ? contact : fournisseur.contact;

      await fournisseur.save();

      return res.status(200).json({
        message: "Le fournisseur a été mis à jour avec succès.",
        data: fournisseur,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Erreur lors de la mise à jour du fournisseur.",
        error: error.message,
      });
    }
  });

  // Récupérer tous les fournisseurs
  app.get("/api/fournisseurs", auth, (req, res) => {
    Fournisseur.findAll()
      .then((fournisseurs) => {
        const message = "La liste des fournisseurs a été récupérée.";
        res.json({ message, data: fournisseurs });
      })
      .catch((error) => {
        const message = "La liste des fournisseurs n'a pas pu être récupérée.";
        res.status(500).json({ message, data: error });
      });
  });

  // Supprimer un fournisseur
  app.delete("/api/fournisseurs/:id", auth, (req, res) => {
    Fournisseur.findByPk(req.params.id)
      .then((fournisseur) => {
        if (!fournisseur) {
          const message = "Fournisseur non trouvé.";
          return res.status(404).json({ message });
        }
        return Fournisseur.destroy({ where: { id: req.params.id } }).then(
          () => {
            const message = `Fournisseur avec l'ID ${req.params.id} supprimé.`;
            res.json({ message });
          }
        );
      })
      .catch((error) => {
        const message = "Erreur lors de la suppression.";
        res.status(500).json({ message, data: error });
      });
  });

  //Reccupérer tous les fournisseurs d'un dossier fournisseur
  app.get(
    "/api/fournisseurs/fournisseurRepertories/:fournisseurRepertoryId",
    auth,
    (req, res) => {
      const fournisseurRepertoryId = req.params.fournisseurRepertoryId;
      Fournisseur.findAll({ where: { fournisseurRepertoryId } })
        .then((fournisseurs) => {
          if (fournisseurs.length === 0) {
            return res
              .status(404)
              .json({ message: "Aucun fournisseur trouvé" });
          }
          const message = "fournisseurs récupérés avec succès.";
          res.json({ message, data: fournisseurs });
        })
        .catch((error) => {
          const message =
            "Une erreur est survenue lors de la récupération des fournisseurs.";
          res.status(500).json({ message, data: error });
        });
    }
  );

  //Reccupérer tous les fournisseurs d'un userId
  app.get("/api/fournisseurs/users/:userId", auth, (req, res) => {
    const userId = req.params.userId;
    Fournisseur.findAll({ where: { userId } })
      .then((fournisseurs) => {
        if (fournisseurs.length === 0) {
          return res.status(404).json({ message: "Aucun fournisseur trouvé" });
        }
        const message = "fournisseurs récupérés avec succès.";
        res.json({ message, data: fournisseurs });
      })
      .catch((error) => {
        const message =
          "Une erreur est survenue lors de la récupération des fournisseurs.";
        res.status(500).json({ message, data: error });
      });
  });
};
