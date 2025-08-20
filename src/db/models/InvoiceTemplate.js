module.exports = (sequelize, DataTypes) => {
  const InvoiceTemplate = sequelize.define(
    "InvoiceTemplate",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      previewUrl: {
        type: DataTypes.STRING, // URL de l’image miniature pour Flutter
        allowNull: true,
      },
      filePath: {
        type: DataTypes.STRING, // Chemin vers le fichier HTML du template
        allowNull: false,
      },
      primaryColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      secondaryColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      invoiceHeaderImgLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      invoiceFooterImgLink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdBy: {
        type: DataTypes.INTEGER, // Admin ou utilisateur qui a créé le template
        allowNull: true,
      },
    },
    { timestamps: true }
  );

   

  return InvoiceTemplate;
};
