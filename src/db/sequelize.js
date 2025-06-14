// @ts-nocheck
const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();
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

// Appeler les associations après avoir initialisé les modèles
User.associate({ Company });
Company.associate({ User });
Client.associate({ User });
Project.associate({ Client });
Project.hasMany(Facture, { foreignKey: "projectId" });
Facture.associate({ Project });
FactureItem.associate({ Facture });
PersonnelRepertory.associate({ User });
Personnel.associate({ PersonnelRepertory });
PrestataireRepertory.associate({ User });
Prestataire.associate({ PrestataireRepertory });
FournisseurRepertory.associate({ User });
Fournisseur.associate({ FournisseurRepertory });
UserSubscription.associate({ User });
TaskList.associate({ User, Task });
Task.associate({ User, TaskList });
AchatRepertory.associate({ User });
Achat.associate({ AchatRepertory });

const initDb = () => {
  return sequelize.sync().then(() => {
    console.log(`La base de données a bien été initialisée !`);
  });
};

module.exports = {
  initDb,
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
};
