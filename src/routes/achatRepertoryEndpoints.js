const { AchatRepertory, Achat } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  //Ajouter un dossier Achat
  app.post("/api/achat-repertories", auth, (req, res) => {
    AchatRepertory.create(req.body)
      .then((repertoire) => {
        const message = "Nouveau repertoire ajouté.";
        res.json({ message, data: repertoire });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "Le dossier d'achats n'a pas pu être créé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });

  //Modifier un dossier Achat
  app.put("/api/achat-repertories/:id", auth, (req, res) => {
    const id = req.params.id;

    AchatRepertory.update(req.body, { where: { id } })
      .then(([updated]) => {
        if (!updated) {
          return res
            .status(404)
            .json({ message: "Le dossier d'achats n'a pas été trouvé." });
        }

        return AchatRepertory.findByPk(id).then((repertoire) => {
          const message = "Le repertoire a été modifié.";
          res.json({ message, data: repertoire });
        });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "Le dossier d'achats n'a pas pu être modifié. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });

  //Supprimer un dossier Achat
  app.delete("/api/achat-repertories/:id", auth, (req, res) => {
    const id = req.params.id;

    AchatRepertory.findByPk(id)
      .then((repertoire) => {
        if (!repertoire) {
          return res
            .status(404)
            .json({ message: "Le dossier d'achats n'a pas été trouvé." });
        }

        return AchatRepertory.destroy({ where: { id } }).then(() => {
          const message = "Dossier d'achats supprimé avec succès.";
          res.json({ message });
        });
      })
      .catch((error) => {
        const message =
          "Le dossier d'achats n'a pas pu être supprimé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });

  //Reccupérer tous les dossier d'achats d'un utilisateur
  app.get("/api/achat-repertories/:userId", auth, (req, res) => {
    const userId = req.params.userId;

    AchatRepertory.findAll({ where: { userId } })
      .then((repertories) => {
        if (!repertories || repertories.length === 0) {
          return res.status(404).json({ message: "Aucun repertoire trouvé." });
        }
        const message = `La liste des repertoires a bien été récupérée.`;
        res.json({ message, data: repertories });
      })
      .catch((error) => {
        const message =
          "Les dossiers d'achats n'ont pas pu être récupérés. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });
};
