//Vai disponibilizar o uso de variáveis de ambiente
require("dotenv").config();
const express = require("express");

//Configuração do App
const app = express();
app.use(express.json()); //Possibilitar transitar dados usando JSON

//Configuração do Banco de Dados
const { connection, authenticate } = require("./database/database");
authenticate(connection);

//Definição de rotas
const rotasClientes = require("./routes/clientes");
const rotasPets = require("./routes/pets");

//Juntar ao app as rotas
app.use(rotasClientes);
app.use(rotasPets);

//Escuta de eventos (listen)
app.listen(4000, () => {
  // Gerar as tabelas a partir do model
  //Force = apaga tudo e recria as tabelas
  connection.sync({ force: true });
  console.log("http://localhost:4000/");
});

// Crud = CREATE RED UPDATE DELETE
