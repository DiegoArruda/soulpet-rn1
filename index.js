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
const Pet = require("./database/pet");

//Definição de rotas
app.get("/clientes", async (req, res) => {
  //SELECT * from clientes;
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes);
});

app.get("/clientes/:id", async (req, res) => {
  //Select * from clientes where id = cliente
  const cliente = await Cliente.findOne({
    where: { id: req.params.id },
    include: [Endereco],
  });
  if (cliente) {
    res.json(cliente);
  } else res.status(404).json({ message: "Usuário não encontrado." });
});

//Adicionar novo cliente
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

//Atualizando um cliente
app.put("/clientes/:id", async (req, res) => {
  const { nome, email, telefone, endereco } = req.body;
  const { id } = req.params;
  try {
    const cliente = await Cliente.findOne({ where: { id } });
    if (cliente) {
      if (endereco) {
        await Endereco.update(endereco, { where: { clienteId: id } });
      }
      await Cliente.update({ nome, email, telefone });
      res.status(200).json({ message: "Cliente editado com sucesso" });
    } else res.status(404).json({ message: "Cliente não encontrado" });
  } catch (err) {
    res.status(500).json({ message: "Um erro ocorreu." });
  }
});

//Excluir um cliente
app.delete("/clientes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await Cliente.findOne({ where: { id } });
    if (cliente) {
      await cliente.destroy();
      res.status(200).json({ message: "Cliente excluido com sucesso." });
    } else res.status(404).json({ message: "Cliente não encontrado." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Adicionar pet
app.post("/pets", async (req, res) => {
  const { nome, tipo, porte, dataNasc, clienteId } = req.body;

  try {
    const cliente = await Cliente.findByPk(clienteId);
    if (cliente) {
      const pet = await Pet.create({ nome, tipo, porte, dataNasc, clienteId });
      res.status(201).json(pet);
    } else res.status(404).json({ message: "Não encontrado" });
  } catch (err) {
    res.status(500).json({ message: "erro" });
  }
});

//Escuta de eventos (listen)
app.listen(4000, () => {
  // Gerar as tabelas a partir do model
  //Force = apaga tudo e recria as tabelas
  connection.sync({ force: true });
  console.log("http://localhost:4000/");
});

// Crud = CREATE RED UPDATE DELETE
