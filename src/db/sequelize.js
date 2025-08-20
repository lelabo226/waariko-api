// @ts-nocheck
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

// Import des modèles
const UserModel = require("./models/User");
const ClientModel = require("./models/Client");
const AdminModel = require("./models/Admin");
const CompanyModel = require("./models/Company");
const FactureModel = require("./models/Facture");
const FactureItemModel = require("./models/FactureItem");
const ProjectModel = require("./models/Project");
const PersonnelRepertoryModel = require("./models/PersonnelRepertory");
const PersonnelModel = require("./models/Personnel");

const PrestataireRepertoryModel = require("./models/PrestataireRepertory");
const PrestataireModel = require("./models/Prestataire");

const FournisseurRepertoryModel = require("./models/FournisseurRepertory");
const FournisseurModel = require("./models/Fournisseur");

const SubscriptionPlanModel = require("./models/SubscriptionPlan");
const UserSubscriptionModel = require("./models/UserSubscription");
const TaskListModel = require("./models/TaskList");
const TaskModel = require("./models/Task");

const AchatRepertoryModel = require("./models/AchatRepertory");
const AchatModel = require("./models/Achat");

const InvoiceTemplateModel = require("./models/InvoiceTemplate");

// Connexion Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

// Initialisation des modèles
const User = UserModel(sequelize, DataTypes);
const Admin = AdminModel(sequelize, DataTypes);
const Client = ClientModel(sequelize, DataTypes);
const Company = CompanyModel(sequelize, DataTypes);
const Facture = FactureModel(sequelize, DataTypes);
const FactureItem = FactureItemModel(sequelize, DataTypes);
const Project = ProjectModel(sequelize, DataTypes);
const PersonnelRepertory = PersonnelRepertoryModel(sequelize, DataTypes);
const Personnel = PersonnelModel(sequelize, DataTypes);

const PrestataireRepertory = PrestataireRepertoryModel(sequelize, DataTypes);
const Prestataire = PrestataireModel(sequelize, DataTypes);

const FournisseurRepertory = FournisseurRepertoryModel(sequelize, DataTypes);
const Fournisseur = FournisseurModel(sequelize, DataTypes);

const SubscriptionPlan = SubscriptionPlanModel(sequelize, DataTypes);
const UserSubscription = UserSubscriptionModel(sequelize, DataTypes);

const TaskList = TaskListModel(sequelize, DataTypes);
const Task = TaskModel(sequelize, DataTypes);

const AchatRepertory = AchatRepertoryModel(sequelize, DataTypes);
const Achat = AchatModel(sequelize, DataTypes);

const InvoiceTemplate = InvoiceTemplateModel(sequelize, DataTypes);

// ======================
// Définition des relations
// ======================

// User / Company
User.hasMany(Company, { foreignKey: "userId" });
Company.belongsTo(User, { foreignKey: "userId" });

// User / Client
User.hasMany(Client, { foreignKey: "userId" });
Client.belongsTo(User, { foreignKey: "userId" });

// Project / Client
Client.hasMany(Project, { foreignKey: "clientId" });
Project.belongsTo(Client, { foreignKey: "clientId" });

// Project / Facture
Project.hasMany(Facture, { foreignKey: "projectId" });
Facture.belongsTo(Project, { foreignKey: "projectId" });

// Facture / Client
Client.hasMany(Facture, { foreignKey: "clientId" });
Facture.belongsTo(Client, { foreignKey: "clientId" });

// Facture / Company
Company.hasMany(Facture, { foreignKey: "companyId" });
Facture.belongsTo(Company, { foreignKey: "companyId" });

// Facture / FactureItem
Facture.hasMany(FactureItem, { foreignKey: "factureId" });
FactureItem.belongsTo(Facture, { foreignKey: "factureId" });

// Personnel
User.hasMany(PersonnelRepertory, { foreignKey: "userId" });
PersonnelRepertory.belongsTo(User, { foreignKey: "userId" });

PersonnelRepertory.hasMany(Personnel, { foreignKey: "repertoryId" });
Personnel.belongsTo(PersonnelRepertory, { foreignKey: "repertoryId" });

// Prestataire
User.hasMany(PrestataireRepertory, { foreignKey: "userId" });
PrestataireRepertory.belongsTo(User, { foreignKey: "userId" });

PrestataireRepertory.hasMany(Prestataire, { foreignKey: "repertoryId" });
Prestataire.belongsTo(PrestataireRepertory, { foreignKey: "repertoryId" });

// Fournisseur
User.hasMany(FournisseurRepertory, { foreignKey: "userId" });
FournisseurRepertory.belongsTo(User, { foreignKey: "userId" });

FournisseurRepertory.hasMany(Fournisseur, { foreignKey: "repertoryId" });
Fournisseur.belongsTo(FournisseurRepertory, { foreignKey: "repertoryId" });

// Abonnements
User.hasMany(UserSubscription, { foreignKey: "userId" });
UserSubscription.belongsTo(User, { foreignKey: "userId" });

SubscriptionPlan.hasMany(UserSubscription, { foreignKey: "planId" });
UserSubscription.belongsTo(SubscriptionPlan, { foreignKey: "planId" });

// Tâches
User.hasMany(TaskList, { foreignKey: "userId" });
TaskList.belongsTo(User, { foreignKey: "userId" });

TaskList.hasMany(Task, { foreignKey: "taskListId" });
Task.belongsTo(TaskList, { foreignKey: "taskListId" });

User.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(User, { foreignKey: "userId" });

// Achats
User.hasMany(AchatRepertory, { foreignKey: "userId" });
AchatRepertory.belongsTo(User, { foreignKey: "userId" });

AchatRepertory.hasMany(Achat, { foreignKey: "repertoryId" });
Achat.belongsTo(AchatRepertory, { foreignKey: "repertoryId" });

// ======================
// Initialisation
// ======================
const initDb = () => {
  return sequelize.sync({  }).then(() => {
    console.log(`✅ La base de données a bien été initialisée !`);
  });
};

// Export
module.exports = {
  initDb,
  sequelize,
  User,
  Admin,
  Client,
  Company,
  Facture,
  FactureItem,
  Project,
  PersonnelRepertory,
  Personnel,
  PrestataireRepertory,
  Prestataire,
  FournisseurRepertory,
  Fournisseur,
  SubscriptionPlan,
  UserSubscription,
  TaskList,
  Task,
  AchatRepertory,
  Achat,
  InvoiceTemplate,
};
