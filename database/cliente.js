//Modelo para gerar a tabela de clientes no MySQL
//Mapeamento: cada propriedade vira uma colunda da tabela

//DataTypes = serve para definir qual o tipo da coluna
const { DataTypes } = require("sequelize");
const { connection } = require("./database");

const Cliente = connection.define("cliente", {
  nome: {
    // nome VARCHAR NOT NULL
    // Configurar a coluna 'nome'
    type: DataTypes.STRING,
    allowNull: false, // NOT FULL
  },
  email: {
    // email VARCHAR UNIQUE NOT NULL
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefone: {
    // telefone VARCHAR NOT NULL
    type: DataTypes.STRING,
    allowNull: false,
  },
});
const Endereço = require("./endereco");

Cliente.hasOne(Endereço, { onDelete: "CASCADE" });
//CASCADE = apagar o cliente, faz o endereço associado ser apagado junto
Endereço.belongsTo(Cliente);

module.exports = Cliente;
