const { InvoiceTemplate,Facture, FactureItem, Client, Company,  } = require("../db/sequelize");
const auth = require("../auth/auth");
const fs = require("fs");
const Handlebars = require("handlebars");
const puppeteer = require("puppeteer");
 

module.exports = (app) => {
  // Récupérer tous les templates
  app.get("/api/templates", auth, async (req, res) => {
    try {
      const templates = await InvoiceTemplate.findAll({
        attributes: ['id', 'name', 'previewUrl', 'primaryColor', 'secondaryColor']
      });
      const message = "Templates récupérés avec succès.";
      res.json({ message, data: templates });
    } catch (error) {
      const message = "Impossible de récupérer les templates.";
      res.status(500).json({ message, data: error });
    }
  });

  app.post("/api/factures/:factureId/generate-pdf", auth, async (req, res) => {
    try {
      const facture = await Facture.findByPk(req.params.factureId, {
        include: [FactureItem, Client, Company]
      });

      if (!facture) {
        return res.status(404).json({ message: "Facture non trouvée." });
      }

      const template = await InvoiceTemplate.findByPk(facture.Company.factureModelNumber);
      if (!template) {
        return res.status(404).json({ message: "Template non trouvé." });
      }

      // Lecture du fichier HTML
      const templateHtml = fs.readFileSync(template.filePath, "utf8");
      const compiled = Handlebars.compile(templateHtml);

      const htmlWithData = compiled({
        entreprise: facture.Company,
        client: facture.Client,
        facture,
        items: facture.FactureItems
      });

      // Génération PDF avec Puppeteer
      const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
      const page = await browser.newPage();
      await page.setContent(htmlWithData, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      res.setHeader("Content-Type", "application/pdf");
      res.send(pdfBuffer);

    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      res.status(500).json({
        message: "Erreur lors de la génération du PDF.",
        data: error.message
      });
    }
  });
};
