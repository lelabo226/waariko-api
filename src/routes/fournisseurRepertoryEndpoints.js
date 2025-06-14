const { FournisseurRepertory } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter un FournisseurRepertory
  app.post("/api/fournisseurRepertories", auth, (req, res) => {
    FournisseurRepertory.create(req.body)
      .then((repertoire) => {
        const message = "Nouveau repertoire ajouté.";
        res.json({ message, data: repertoire });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "Le repertoire n'a pas pu être créé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });

  // Récupérer tous les repertoires
  app.get("/api/fournisseurRepertories", auth, (req, res) => {
    FournisseurRepertory.findAll()
      .then((repertoires) => {
        const message = "La liste des repertoires a été récupérée.";
        res.json({ message, data: repertoires });
      })
      .catch((error) => {
        const message = "La liste des repertoires n'a pas pu être récupérée.";
        res.status(500).json({ message, data: error });
      });
  });

  // Supprimer un repertoire
  app.delete("/api/fournisseurRepertories/:id", auth, (req, res) => {
    FournisseurRepertory.findByPk(req.params.id)
      .then((repertoire) => {
        if (!repertoire) {
          const message = "repertoire non trouvé.";
          return res.status(404).json({ message });
        }
        return FournisseurRepertory.destroy({
          where: { id: req.params.id },
        }).then(() => {
          const message = `repertoire avec l'ID ${req.params.id} supprimé.`;
          res.json({ message });
        });
      })
      .catch((error) => {
        const message = "Erreur lors de la suppression.";
        res.status(500).json({ message, data: error });
      });
  });

  // Récupérer tous les repertoires en fonction de l'userId
  app.get("/api/users/:userId/fournisseurRepertories", auth, (req, res) => {
    const userId = req.params.userId;

    FournisseurRepertory.findAll({ where: { userId: userId } })
      .then((repertoires) => {
        if (!repertoires || repertoires.length === 0) {
          return res.status(404).json({ message: "Aucun repertoire trouvé." });
        }
        const message = `La liste des repertoires a bien été récupérée.`;
        res.json({ message, data: repertoires });
      })
      .catch((error) => {
        const message = `La récupération des repertoires a échoué. Veuillez réessayer dans quelques instants.`;
        res.status(500).json({ message, data: error });
      });
  });

  //Mettre à jour un repertoire
  app.put("/api/fournisseurRepertories/:id", auth, (req, res) => {
    const repertoireId = req.params.id;

    FournisseurRepertory.findByPk(repertoireId)
      .then((repertoire) => {
        if (!repertoire) {
          const message = `repertoire introuvable.`;
          return res.status(404).json({ message });
        }

        return repertoire.update(req.body).then(() => {
          const message = `Le repertoire a été modifié.`;
          res.json({ message, data: repertoire });
        });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message, data: error });
        }

        const message = `Une erreur est survenue lors de la mise à jour du repertoire. Veuillez réessayer plus tard.`;
        res.status(500).json({ message, data: error });
      });
  });
};
