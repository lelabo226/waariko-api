const {
  InvoiceTemplate,
  Facture,
  FactureItem,
  Client,
  Company,
  Project,
} = require("../db/sequelize");
const auth = require("../auth/auth");
const formatAmount = require("../utilsFunctions/formatNumber").formatAmount;
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer-core");
const chromium = require("chromium");
const n2words = require("n2words").default;

 


module.exports = (app) => {
  // Récupérer tous les templates
  app.get("/api/templates", auth, async (req, res) => {
    try {
      const templates = await InvoiceTemplate.findAll({
      });
      res.json({
        message: "Templates récupérés avec succès.",
        data: templates,
      });
    } catch (error) {
      console.log(`Impossible de récupérer les templates: ${error.message}`);
      res.status(500).json({
        message: "Impossible de récupérer les templates.",
        data: error,
      });
    }
  });

  // Génération PDF
  app.post(
    "/api/factures/:factureId/:type/generate-pdf",
    auth,
    async (req, res) => {
      try {
        // 1. Charger la facture avec ses relations
        const facture = await Facture.findByPk(req.params.factureId, {
          include: [FactureItem, Client, Company, Project],
        });

        if (!facture)
          return res.status(404).json({ message: "Facture non trouvée." });

        // Modifier createDate
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Mois de 0 à 11
        const year = today.getFullYear();

        // ID formaté pour affichage uniquement

        facture.createDate = `${day}/${month}/${year}`;
        facture.type = req.params.type;
        const plainFacture = facture.get({ plain: true });
        plainFacture.formattedId = facture.id.toString().padStart(4, "0");

        // ---- Calculs financiers ----

        // 1. Total HT (somme des items prix * quantité)
        const totalHT = facture.totalAmount;

        // 2. Remise
        const discountRate = plainFacture.remise || 0; // en %
        const discountAmount = totalHT * (discountRate / 100);

        // 3. Total après remise
        const totalAfterDiscount = totalHT - discountAmount;

        // 4. TVA
        const vatRate = plainFacture.tva || 0; // en %
        const vatAmount = totalAfterDiscount * (vatRate / 100);

        // 5. Total après taxe
        const totalAfterTax = totalAfterDiscount + vatAmount;

        // Ajouter ces valeurs dans l’objet envoyé au template
        plainFacture.remiseAmount = formatAmount(discountAmount);
        plainFacture.tvaAmount = formatAmount(vatAmount);
        plainFacture.totalAmountAfterTax = formatAmount(totalAfterTax);
        plainFacture.totalAmount = formatAmount(totalHT);

        plainFacture.totalAmountInLetter = n2words(totalHT, { lang: "fr" });
        plainFacture.totalAmountAfterTaxInLetter = n2words(totalAfterTax, {
          lang: "fr",
        });
        // 2. Charger le template défini par l’entreprise
        const template = await InvoiceTemplate.findByPk(
          plainFacture.Company.factureModelNumber
        );

        if (!template)
          return res.status(404).json({ message: "Template non trouvé." });

        // 3. Récupérer le HTML via son url
        let templateHtml;
        if (
          (plainFacture.type=="BORDEREAU" ? template.blFilePath : template.invoiceFilePath).startsWith("http") ||
          (plainFacture.type=="BORDEREAU" ? template.blFilePath : template.invoiceFilePath).startsWith("https")
        ) {
          const response =  plainFacture.type==="BORDEREAU" ? await  axios.get(template.blFilePath) :  await axios.get(template.invoiceFilePath);
          templateHtml = response.data;
        } else {
          templateHtml = fs.readFileSync(
            path.resolve( plainFacture.type==="BORDEREAU" ? template.blFilePath : template.invoiceFilePath),
            "utf8"
          );
        }

        // Vérifier que le HTML n'est pas vide
        if (!templateHtml || templateHtml.trim().length === 0) {
          console.error("Template HTML vide !");
          return res.status(500).json({ message: "Template HTML vide." });
        }

        // 4. Compiler avec Handlebars
        const compiled = Handlebars.compile(templateHtml, { noEscape: true });
        const htmlWithData = compiled({
          company: plainFacture.Company,
          client: plainFacture.Client,
          facture: plainFacture,
          project: plainFacture.Project,
          items: plainFacture.FactureItems,
        });

        // 5. Génération du PDF avec Puppeteer
        const browser = await puppeteer.launch({
          executablePath: chromium.path,
          args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        const page = await browser.newPage();
        await page.setContent(htmlWithData, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
        });
        await browser.close();
        console.log("✅ Taille PDF généré :", pdfBuffer.length);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=facture.pdf"
        );
        res.end(pdfBuffer);
      } catch (error) {
        console.error("Erreur lors de la génération du PDF :", error);
        res.status(500).json({
          message: "Erreur lors de la génération du PDF.",
          data: error.message,
        });
      }
    }
  );
};
