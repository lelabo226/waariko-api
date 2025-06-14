const { User, UserSubscription } = require("../db/sequelize");
const { ValidationError, Op } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter un utilisateur
  app.post("/api/users", auth, (req, res) => {
    User.create(req.body)
      .then((user) => {
        const message = "Nouvel user ajouté.";
        res.json({ message, data: user });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "L'user n'a pas pu être créé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });

  // Récupérer tous les users
  app.get("/api/users", auth, (req, res) => {
    User.findAll()
      .then((users) => {
        const message = "La liste des users a été récupérée.";
        res.json({ message, data: users });
      })
      .catch((error) => {
        const message = "La liste des users n'a pas pu être récupérée.";
        res.status(500).json({ message, data: error });
      });
  });

  // Supprimer un User
  app.delete("/api/users/:id", auth, (req, res) => {
    User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          const message = "user non trouvé.";
          return res.status(404).json({ message });
        }
        return User.destroy({ where: { id: req.params.id } }).then(() => {
          const message = `User avec l'ID ${req.params.id} supprimé.`;
          res.json({ message });
        });
      })
      .catch((error) => {
        const message = "Erreur lors de la suppression.";
        res.status(500).json({ message, data: error });
      });
  });

  // Vérifier si l'utilisateur a un abonnement actif
  app.get("/api/users/:userId/active-subscription", auth, async (req, res) => {
    const userId = req.params.userId;

    try {
      // Recherche du dernier abonnement actif de l'utilisateur
      const activeSubscription = await UserSubscription.findOne({
        where: {
          userId: userId,
          endDate: {
            [Op.gt]: new Date(), // Filtre les abonnements dont la date de fin est supérieure à aujourd'hui
          },
        },
        order: [["endDate", "DESC"]], // Prend le plus récent
      });

      // Vérifie si un abonnement actif est trouvé
      if (activeSubscription) {
        return res.status(200).json({
          hasActiveSubscription: true,
          message: "L'utilisateur a un abonnement actif.",
          subscription: activeSubscription,
        });
      } else {
        return res.status(200).json({
          hasActiveSubscription: false,
          message: "L'utilisateur n'a pas d'abonnement actif.",
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'abonnement actif :",
        error
      );
      return res.status(500).json({
        message:
          "Une erreur est survenue lors de la vérification de l'abonnement.",
        data: error,
      });
    }
  });

  // Récupérer tous les abonnements d'un utilisateur
  app.get("/api/users/:userId/subscriptions", auth, async (req, res) => {
    const userId = req.params.userId;

    try {
      const subscriptions = await UserSubscription.findAll({
        where: { userId: userId },
        order: [["endDate", "DESC"]], // Trier par date de fin, du plus récent au plus ancien
      });

      if (subscriptions.length === 0) {
        return res.status(404).json({
          message: "Aucun abonnement trouvé pour cet utilisateur.",
        });
      }

      res.status(200).json({
        message: "Abonnements récupérés avec succès.",
        data: subscriptions,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des abonnements :", error);
      res.status(500).json({
        message:
          "Une erreur est survenue lors de la récupération des abonnements.",
        data: error,
      });
    }
  });
};
