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

//Lista dos pets
app.get("/pets", async (req, res) => {
  const listaPets = await Pet.findAll();
  res.json(listaPets);
});

//Procura de pet
app.get("pet/:id", async (req, res) => {
  const { id } = req.params;
  const pet = await Pet.findByPk(id);
  if (pet) {
    res.json(pet);
  } else res.status(404).json({ message: "Pet não encontrado" });
});

//Atualizar pet
app.put("/pets/:id", async (req, res) => {
  // Esses são os dados que virão no corpo JSON
  const { nome, tipo, dataNasc, porte } = req.body;

  // É necessário checar a existência do Pet
  // SELECT * FROM pets WHERE id = "req.params.id";
  const pet = await Pet.findByPk(req.params.id);

  // se pet é null => não existe o pet com o id
  try {
    if (pet) {
      // IMPORTANTE: Indicar qual o pet a ser atualizado
      // 1º Arg: Dados novos, 2º Arg: Where
      await Pet.update(
        { nome, tipo, dataNasc, porte },
        { where: { id: req.params.id } } // WHERE id = "req.params.id"
      );
      // await pet.update({ nome, tipo, dataNasc, porte });
      res.json({ message: "O pet foi editado." });
    } else {
      // caso o id seja inválido, a resposta ao cliente será essa
      res.status(404).json({ message: "O pet não foi encontrado." });
    }
  } catch (err) {
    // caso algum erro inesperado, a resposta ao cliente será essa
    console.log(err);
    res.status(500).json({ message: "Um erro aconteceu." });
  }
});

app.delete("/pets/:id", async (req, res) => {
  const pet = await Pet.findByPk(req.params.id);

  if (pet) {
    await pet.destroy();
    res.json({ message: "O pet foi removido" });
  } else {
    res.status(404).json({ message: "O pet não foi encontrado" });
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
