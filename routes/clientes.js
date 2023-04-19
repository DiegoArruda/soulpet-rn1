const Cliente = require("../database/cliente");
const Endereco = require("../database/endereco");

const { Router } = require("express");

//Criar o grupo de rotas (/clientes)
const router = Router();

router.get("/clientes", async (req, res) => {
  //SELECT * from clientes;
  const listaClientes = await Cliente.findAll();
  res.json(listaClientes);
});

router.get("/clientes/:id", async (req, res) => {
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
router.post("/clientes", async (req, res) => {
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
router.put("/clientes/:id", async (req, res) => {
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
router.delete("/clientes/:id", async (req, res) => {
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

module.exports = router;
