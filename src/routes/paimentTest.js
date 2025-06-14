const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const { SubscriptionPlan, UserSubscription } = require("../db/sequelize");
const auth = require("../auth/auth");

// Clé secrète du webhook (fournie par Yengapay)
const webhookSecret = "49aa37f7-395b-486c-8e58-34ced5c77439";
const organization_id = "10330707";
const project_id = "27491";
const api_key = "Vu3Wh52SiIzHMBfKkZIZSrx4Qq58qRXV";

module.exports = (app) => {
  // Endpoint pour initier un paiement
  app.post("/api/subscription/payment", auth, async (req, res) => {
    const { userId, planId, customerNumber, paymentSource } = req.body;

    try {
      // Récupérer le plan d'abonnement
      const plan = await SubscriptionPlan.findByPk(planId);
      if (!plan) {
        return res
          .status(404)
          .json({ message: "Plan d'abonnement introuvable." });
      }

      // Construire la charge utile pour Yengapay
      const payload = {
        paymentAmount: parseFloat(plan.price),
        reference: `${userId}-${Date.now()}`, // Référence unique
        articles: [
          {
            title: plan.name,
            description: plan.description,
            price: parseFloat(plan.price),
          },
        ],
        customerNumber,
        paymentSource, // Exemple : "Orange Money"
      };

      // Appeler l'API Yengapay
      const response = await axios.post(
        `https://api.yengapay.com/api/v1/groups/${organization_id}/payment-intent/${project_id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": api_key,
          },
        }
      );

      // Retourner l'URL de paiement à l'utilisateur
      const data = response.data;
      return res.status(200).json({
        message: "Paiement initié avec succès.",
        data: {
          checkoutUrl: data.checkoutPageUrlWithPaymentToken,
          paymentReference: data.reference,
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'initiation du paiement :", error.message);
      return res.status(500).json({
        message: `Erreur lors de l'initiation du paiement: ${error}.`,
      });
    }
  });

  // Endpoint pour gérer le webhook de notification
  app.post("/api/subscription/webhook", async (req, res) => {
    const hash = req.headers["x-webhook-hash"];
    const payload = req.body;

    try {
      // Vérifier l'authenticité de l'appel webhook
      const payloadHashed = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(payload))
        .digest("hex");

      if (payloadHashed !== hash) {
        return res.status(400).json({
          message: "Authenticité du webhook invalide.",
        });
      }

      // Vérifier si le paiement est réussi
      if (payload.paymentStatus === "DONE") {
        const { reference, paymentAmount } = payload;

        // Enregistrer ou mettre à jour la souscription
        const [userId] = reference.split("-");
        const now = new Date();
        const endDate = new Date();
        endDate.setMonth(now.getMonth() + (paymentAmount === 9890 ? 3 : 6)); // Durée selon le montant

        await UserSubscription.create({
          userId,
          startDate: now,
          endDate,
          reference,
          paymentMethod: payload.paymentSource,
          planAbonnement:
            paymentAmount === 9890 ? 1 : paymentAmount === 18950 ? 2 : 3, // Plan spécifique
          montant: paymentAmount,
        });

        return res.status(200).json({
          message: "Souscription mise à jour avec succès.",
        });
      } else {
        return res.status(400).json({
          message: "Paiement non réussi.",
        });
      }
    } catch (error) {
      console.error("Erreur lors du traitement du webhook :", error.message);
      return res.status(500).json({
        message: "Erreur interne.",
        error: error.message,
      });
    }
  });
};
