const { Client,Project } = require("../db/sequelize");
const { ValidationError } = require("sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  // Ajouter un client
  app.post("/api/clients", auth, (req, res) => {
    Client.create(req.body)
      .then((client) => {
        const message = "Nouveau client ajouté.";
        res.json({ message, data: client });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message });
        }
        const message =
          "Le client n'a pas pu être créé. Réessayez dans quelques instants.";
        res.status(500).json({ message, data: error });
      });
  });

  // Récupérer tous les clients
  app.get("/api/clients", auth, (req, res) => {
    Client.findAll()
      .then((clients) => {
        const message = "La liste des clients a été récupérée.";
        res.json({ message, data: clients });
      })
      .catch((error) => {
        const message = "La liste des clients n'a pas pu être récupérée.";
        res.status(500).json({ message, data: error });
      });
  });

  // Supprimer un client
  app.delete("/api/clients/:id", auth, (req, res) => {
    Client.findByPk(req.params.id)
      .then((client) => {
        if (!client) {
          const message = "Client non trouvé.";
          return res.status(404).json({ message });
        }
        return Client.destroy({ where: { id: req.params.id } }).then(() => {
          const message = `Client avec l'ID ${req.params.id} supprimé.`;
          res.json({ message });
        });
      })
      .catch((error) => {
        const message = "Erreur lors de la suppression.";
        res.status(500).json({ message, data: error });
      });
  });

  // Récupérer tous les clients en fonction de l'userId
  app.get("/api/users/:userId/clients", auth, (req, res) => {
    const userId = req.params.userId;

    Client.findAll({ where: { userId: userId } })
      .then((clients) => {
        if (!clients || clients.length === 0) {
          return res.status(404).json({ message: "Aucun client trouvé." });
        }
        const message = `La liste des clients a bien été récupérée.`;
        res.json({ message, data: clients });
      })
      .catch((error) => {
        const message = `La récupération des clients a échoué. Veuillez réessayer dans quelques instants.`;
        res.status(500).json({ message, data: error });
      });
  });

  //Mettre à jour un client
  app.put("/api/clients/:id", auth, (req, res) => {
    const clientId = req.params.id;

    Client.findByPk(clientId)
      .then((client) => {
        if (!client) {
          const message = `Client introuvable.`;
          return res.status(404).json({ message });
        }

        return client.update(req.body).then(() => {
          const message = `Le client a été modifié.`;
          res.json({ message, data: client });
        });
      })
      .catch((error) => {
        if (error instanceof ValidationError) {
          return res.status(400).json({ message: error.message, data: error });
        }

        const message = `Une erreur est survenue lors de la mise à jour du client. Veuillez réessayer plus tard.`;
        res.status(500).json({ message, data: error });
      });
  });
   // Récupérer le client assigné à un projet donné
  app.get("/api/projects/:projectId/client", auth, (req, res) => {
    const projectId = req.params.projectId;

    Project.findByPk(projectId, {
      include: [
        {
          model: Client,
          as: "Client",  
        },
      ],
    })
      .then((project) => {
        if (!project) {
          return res.status(404).json({ message: "Projet introuvable." });
        }

        if (!project.Client) {
          return res.status(404).json({ message: "Aucun client associé à ce projet." });
        }

        const message = `Client récupéré.`;
        res.json({ message, data: project.Client });
      })
      .catch((error) => {
        const message = "Impossible de récupérer le client du projet.";
        res.status(500).json({ message, data: error });
      });
  });
};
