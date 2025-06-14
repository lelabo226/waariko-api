// @ts-ignore
const express = require("express");
const axios = require("axios");
// @ts-ignore
const crypto = require("crypto");
const { SubscriptionPlan, UserSubscription } = require("../db/sequelize");
const auth = require("../auth/auth");
const { sendMailTo } = require("../utilsFunctions/sendMailTo");

const provider = "yengapay";

const site_id = "5884044";
const secret_key = "1360248057675855c88446f7.26302722";
// @ts-ignore
const webhookSecret =
  // @ts-ignore
  provider == "yengapay" ? "49aa37f7-395b-486c-8e58-34ced5c77439" : secret_key;
// @ts-ignore
const organization_id = provider == "yengapay" ? "10330707" : site_id;

// @ts-ignore
const project_id = provider == "yengapay" ? "86840" : "";
// @ts-ignore
const project_id_test = provider == "yengapay" ? "27491" : "";
const api_key =
  // @ts-ignore
  provider == "yengapay"
    ? "Vu3Wh52SiIzHMBfKkZIZSrx4Qq58qRXV"
    : "12001103106758547e0f7881.78817412";

const payment_url =
  // @ts-ignore
  provider == "yengapay"
    ? `https://api.yengapay.com/api/v1/groups/${organization_id}/payment-intent/${project_id}`
    : "https://api-checkout.cinetpay.com/v2/payment";
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
      const payload =
        // @ts-ignore
        provider == "yengapay"
          ? {
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
              paymentSource,
            }
          : {
              apikey: api_key,
              site_id: organization_id,
              transaction_id: `${userId}-${Date.now()}`, // Référence unique
              amount: parseFloat(plan.price),
              currency: "XOF",
              customer_phone_number: customerNumber,
              notify_url:
                "https://waariko-api.onrender.com/api/subscription/webhook",
              return_url: "https://waariko-app.lelabo-du-numerique.com",
              channels: "ALL",
              lang: "FR",
              description: "ABONNEMENT WARRIKO",
              customer_id: "172",
              customer_name: "USER",
              customer_surname: "USER",
              customer_email: "user@gmail.com",
              customer_address: "Antananarivo",
              customer_city: "Antananarivo",
              customer_country: "CM",
              customer_state: "CM",
              customer_zip_code: "065100",
              invoice_data: {
                title: plan.name,
                description: plan.description,
                price: parseFloat(plan.price),
              },
            };

      // Appeler l'API
      const response = await axios.post(payment_url, payload, {
        headers:
          // @ts-ignore
          provider == "yengapay"
            ? {
                "Content-Type": "application/json",
                "x-api-key": api_key,
              }
            : {
                "Content-Type": "application/json",
                "x-api-key": api_key,
              },
      });

      // Retourner l'URL de paiement à l'utilisateur
      const data =
        // @ts-ignore
        provider == "yengapay" ? response.data : response.data.data;
      console.log(`${data}`);
      return res.status(200).json({
        message: "Paiement initié avec succès.",
        data: {
          checkoutUrl: data.checkoutPageUrlWithPaymentToken || data.payment_url,
          paymentReference: `${userId}-${Date.now()}`,
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'initiation du paiement :", error);
      return res.status(500).json({
        message: `Erreur lors de l'initiation du paiement: ${error}.`,
      });
    }
  });

  // Endpoint pour gérer le webhook de notification
  app.post("/api/subscription/webhook", async (req, res) => {
    // Appeler l'API
    const response =
      provider == "yengapay"
        ? {}
        : await axios.post(
            "https://api-checkout.cinetpay.com/v2/payment/check",
            {
              apikey: api_key,
              site_id: site_id,
              transaction_id: req.cpm_trans_id,
            },
            {
              headers:
                // @ts-ignore
                provider == "yengapay"
                  ? {
                      "Content-Type": "application/json",
                      "x-api-key": api_key,
                    }
                  : {
                      "Content-Type": "application/json",
                      "x-api-key": api_key,
                    },
            }
          );
    const payload = response.data || req.body;

    try {
      console.log(`PAIMENT EFFECTUE: ${payload}`);
      // Vérifier si le paiement est réussi
      if ((payload.paymentStatus || payload.status) === "DONE" || "ACCEPTED") {
        const { reference, paymentAmount, amount } = payload;

        // Enregistrer ou mettre à jour la souscription
        const [userId] = (req.cpm_trans_id || reference).split("-");
        const now = new Date();
        const endDate = new Date();
        endDate.setMonth(
          now.getMonth() +
            (parseFloat(amount || paymentAmount) >= 0 &&
            parseFloat(amount || paymentAmount) <= 9890
              ? 3
              : parseFloat(amount || paymentAmount) > 9890 &&
                parseFloat(amount || paymentAmount) <= 18950
              ? 6
              : 12)
        ); // Durée selon le montant

        await UserSubscription.create({
          userId,
          startDate: `${now}`,
          endDate: `${endDate}`,
          // @ts-ignore
          daysRemaining: (endDate - now) / (1000 * 60 * 60 * 24),
          reference: req.cpm_trans_id || reference,
          paymentMethod: payload.payment_method || payload.paymentSource,
          planAbonnement:
            (amount || paymentAmount) >= 0 && (amount || paymentAmount) <= 9890
              ? 1
              : (amount || paymentAmount) > 9890 &&
                (amount || paymentAmount) <= 18950
              ? 2
              : 3, // Plan spécifique
          montant:
            (amount || paymentAmount) >= 0 && (amount || paymentAmount) <= 9890
              ? 9890
              : (amount || paymentAmount) > 9890 &&
                (amount || paymentAmount) <= 18950
              ? 18950
              : 34950,
        });

        sendMailTo(
          "harounakinda.pro@gmail.com",
          `ID_Utilisateur: ${userId}<br/>Paiment par: ${
            payload.payment_method || payload.paymentSource
          }<br/>Montant payé: ${
            (amount || paymentAmount) >= 0 && (amount || paymentAmount) <= 9890
              ? 9890
              : (amount || paymentAmount) > 9890 &&
                (amount || paymentAmount) <= 18950
              ? 18950
              : 34950
          }<br/>Plan: ${
            (amount || paymentAmount) >= 0 && (amount || paymentAmount) <= 9890
              ? "3 MOIS"
              : (amount || paymentAmount) > 9890 &&
                (amount || paymentAmount) <= 18950
              ? "6 MOIS"
              : "12 MOIS"
          }`
        );
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
        message: `Erreur interne. ${error.message}`,
      });
    }
  });
};
