const { DataTypes } = require("sequelize");
const Cliente = require("./cliente");
const { connection } = require("./database");

const Pet = connection.define("pet", {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  porte: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dataNasc: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
});
// Relacionamento 1:N
Cliente.hasMany(Pet);
Pet.belongsTo(Cliente);

module.exports = Pet;
