const { User, UserSubscription } = require("../db/sequelize");
const { ValidationError, UniqueConstraintError, Op } = require("sequelize");
const bcrypt = require("bcrypt");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Se connecter
  app.post("/api/login", auth, async (req, res) => {
    try {
      const user = await User.findOne({ where: { email: req.body.email } });

      if (!user) {
        const message = `Cet email ne possède pas de compte`;
        return res.status(404).json({ message });
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.motDePasse,
        user.motDePasse
      );
      if (!isPasswordValid) {
        const message = `Le mot de passe est incorrect.`;
        return res.status(401).json({ message });
      }

      // Récupérer l'abonnement actif de l'utilisateur
      const subscription = await UserSubscription.findOne({
        where: {
          userId: user.id,
          endDate: {
            [Op.gt]: new Date(), // Abonnement qui n'est pas encore expiré
          },
        },
        order: [["endDate", "DESC"]], // Dernier abonnement actif
      });

      const message = `Connexion réussie.`;
      return res.json({
        message,
        data: {
          user,
          subscription: subscription || null, // Retourne null si aucun abonnement actif
        },
      });
    } catch (error) {
      const message = `Impossible de se connecter. Réessayez dans quelques instants.`;
      res.status(500).json({ message, data: error });
    }
  });

  // S'inscrire
  app.post("/api/signup", async (req, res) => {
    try {
      // Créer un mot de passe haché
      const hashedPassword = await bcrypt.hash(req.body.motDePasse, 10);

      // Créer l'utilisateur
      const user = await User.create({
        email: req.body.email,
        nomEtPrenom: req.body.nomEtPrenom,
        motDePasse: hashedPassword,
      });

      // Créer un abonnement d'essai gratuit de 1 mois
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + 1); // Ajouter 1 mois

      const trialSubscription = await UserSubscription.create({
        userId: user.id,
        startDate: `${startDate}`,
        endDate: `${endDate}`,
        reference: "Période d'essai (30 jours)", // Référence d'abonnement d'essai
        paymentMethod: "Système", // Type de paiement pour indiquer un essai
        planAbonnement: 1, // 1 pour indiquer un abonnement mensuel (par exemple)
        montant: 0, // Montant pour un abonnement d'essai gratuit
      });

      const message = `Création de compte réussie.`;
      res.json({
        message,
        data: {
          user,
          subscription: trialSubscription,
        },
      });
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof UniqueConstraintError
      ) {
        return res.status(400).json({ message: error.message });
      }
      const errorMessage = `Impossible de créer un compte. Réessayer dans quelques instants.`;
      res.status(500).json({ message: errorMessage, data: error });
    }
  });
};
