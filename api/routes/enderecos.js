const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const EnderecoModel = mongoose.model("Endereco");
const PessoaModel = mongoose.model("Pessoa");

router.get("/", async (req, res, next) => {
  try {
    const enderecos = await EnderecoModel.find({}).populate("pessoa", "nome");

    res.status(200).json({
      count: enderecos.length,
      enderecos: enderecos.map((endereco) => {
        return {
          pessoa: endereco.pessoa,
          cep: endereco.cep,
          logradouro: endereco.logradouro,
          numero: endereco.numero,
          complemento: endereco.complemento,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          uf: endereco.uf,
          _id: endereco._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/enderecos/" + endereco._id,
          },
        };
      }),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.body.pessoaId) {
      res.status(404).json({ message: "Pessoa não existe" });
      return;
    }

    let pessoa = null;
    try {
      pessoa = await PessoaModel.findOne({ _id: req.body.pessoaId });
      if (!pessoa) {
        res.status(404).json({ message: "Pessoa não existe" });
        return;
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }

    if (pessoa) {
      let endereco = new EnderecoModel({
        pessoa: req.body.pessoaId,
        cep: req.body.cep,
        logradouro: req.body.logradouro,
        numero: req.body.numero,
        complemento: req.body.complemento,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        uf: req.body.uf,
      });
      endereco = await endereco.save();
      res.status(201).json({
        message: "Endereço criado com sucesso!",
        createdendereco: {
          pessoa: endereco.pessoa,
          cep: endereco.cep,
          _id: endereco._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/enderecos/" + endereco._id,
          },
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/:enderecoId", async (req, res, next) => {
  const id = req.params.enderecoId;
  try {
    const endereco = await EnderecoModel.findOne({ _id: id }).populate("pessoa");
    if (endereco) {
      res.status(200).json({
        endereco: endereco,
        request: {
          type: "GET",
          url: "http://localhost:3000/enderecos",
        },
      });
    } else {
      res.status(404).json("Endereço não existe!");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:enderecoId", async (req, res, next) => {
  const id = req.params.enderecoId;
  try {
    const status = await EnderecoModel.deleteOne({ _id: id });
    res.status(200).json({
      message: "Delete endereco",
      status: status,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
