const { InvoiceTemplate, Facture, FactureItem, Client, Company } = require("../db/sequelize");
const auth = require("../auth/auth");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer-core");
const chromium = require("chromium");




module.exports = (app) => {
  // Récupérer tous les templates
  app.get("/api/templates", auth, async (req, res) => {
    try {
      const templates = await InvoiceTemplate.findAll({
        attributes: ['id', 'name', 'previewUrl', 'primaryColor', 'secondaryColor']
      });
      res.json({ message: "Templates récupérés avec succès.", data: templates });
    } catch (error) {
      res.status(500).json({ message: "Impossible de récupérer les templates.", data: error });
    }
  });

  // Génération PDF
  app.post("/api/factures/:factureId/generate-pdf", auth, async (req, res) => {
    try {
      // 1. Charger la facture avec ses relations
      const facture = await Facture.findByPk(req.params.factureId, {
        include: [FactureItem, Client, Company],
      });

      if (!facture) return res.status(404).json({ message: "Facture non trouvée." });

      const plainFacture = facture.get({ plain: true });

      // 2. Charger le template défini par l’entreprise
      const template = await InvoiceTemplate.findByPk(
        plainFacture.Company.factureModelNumber
      );

      if (!template) return res.status(404).json({ message: "Template non trouvé." });

      // 3. Récupérer le HTML depuis une URL (ou local si besoin)
      let templateHtml;
      if (template.filePath.startsWith("http")) {
        const response = await axios.get(template.filePath);
        templateHtml = response.data;
      } else {
        templateHtml = fs.readFileSync(path.resolve(template.filePath), "utf8");
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
        margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" }
      });

      await browser.close();

      if (!pdfBuffer || pdfBuffer.length < 100) {
        console.error("PDF généré vide !");
      }
   
      // 6. Retourner le PDF au client
      res.setHeader("Content-Type", "application/pdf");
      res.send(pdfBuffer);

    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      res.status(500).json({
        message: "Erreur lors de la génération du PDF.",
        data: error.message,
      });
    }
  });
};
