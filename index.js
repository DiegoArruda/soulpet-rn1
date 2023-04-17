//Vai disponibilizar o uso de variáveis de ambiente
require("dotenv").config();
const express = require("express");

//Configuração do App
const app = express();
app.use(express.json()); //Possibilitar transitar dados usando JSON

//Configuração do Banco de Dados
const { connection, authenticate } = require("./database/database");
authenticate(connection);
const Cliente = require("./database/cliente");
const Endereco = require("./database/endereco");

//Definição de rotas
app.post("/clientes", async (req, res) => {
  // - Coletar informação do req.body;
  const { nome, email, telefone, endereco } = req.body;

  try {
    // Dentro de 'novo' estará o objeto criado
    const novo = await Cliente.create(
      { nome, email, telefone, endereco },
      { include: [Endereco] }
    );
    res.status(201).json(novo);
  } catch (err) {
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

//Escuta de eventos (listen)
app.listen(4000, () => {
  // Gerar as tabelas a partir do model
  //Force = apaga tudo e recria as tabelas
  connection.sync({ force: true });
  console.log("http://localhost:3000/");
});
