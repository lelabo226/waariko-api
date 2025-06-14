const { FactureItem } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter un item de facture
  app.post("/api/factureItems", auth, (req, res) => {
    FactureItem.create(req.body)
      .then((facture) => {
        const message = "Nouveau item ajouté.";
        res.json({ message, data: facture });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "L'item n'a pas pu être crée. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });
  //reccuperer tous les items d'une facture
  app.get("/api/factureItems/facture/:factureId", auth, (req, res) => {
    const factureId = req.params.factureId;

    FactureItem.findAll({ where: { factureId } })
      .then((factureItems) => {
        if (factureItems.length === 0) {
          return res.status(404).json({
            message: "Aucun item de facture trouvé pour cette facture.",
          });
        }
        const message = "Items de facture récupérés avec succès.";
        res.json({ message, data: factureItems });
      })
      .catch((error) => {
        const message =
          "Une erreur est survenue lors de la récupération des items de facture.";
        res.status(500).json({ message, data: error });
      });
  });

  //Supprimer tous les items d'une facture

  app.delete("/api/factureItems/facture/:factureId", auth, (req, res) => {
    const factureId = req.params.factureId;

    FactureItem.destroy({ where: { factureId } })
      .then((deletedItemsCount) => {
        if (deletedItemsCount === 0) {
          return res.status(404).json({
            message: "Aucun item de facture trouvé pour cette facture.",
          });
        }
        const message = `${deletedItemsCount} items de facture ont été supprimés avec succès.`;
        res.json({ message });
      })
      .catch((error) => {
        const message =
          "Une erreur est survenue lors de la suppression des items de facture.";
        res.status(500).json({ message, data: error });
      });
  });
};
