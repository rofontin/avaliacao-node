const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PessoaModel = mongoose.model('Pessoa');

router.get('/', async (req, res, next) => {
    try {
        const pessoas = await PessoaModel.find()
        .select("nome sobrenome email status _id");
        res.status(200).json({
            count: pessoas.length,
            pessoas: pessoas.map(pessoa => {
                return {
                    nome: pessoa.nome,
                    sobrenome: pessoa.sobrenome,
                    email: pessoa.email,
                    status: pessoa.status,
                    _id: pessoa._id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/pessoas/"
                         + pessoa._id
                    }
                }
            })
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.post('/', async (req, res, next) => {
    try{
        const pessoa = new PessoaModel({
            nome: req.body.nome,
            sobrenome: req.body.sobrenome,
            telefone: req.body.telefone,
            email: req.body.email,
            status: req.body.status
        });
        await pessoa.save();
        res.status(201).json({
            message: 'Pessoa criada com sucesso!',
            createdPessoa: {
                nanomeme: pessoa.nome,
                sobrenome: pessoa.sobrenome,
                telefone: pessoa.telefone,
                email: pessoa.email,
                status: pessoa.status,
                _id: pessoa._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/pessoas/"
                        + pessoa._id
                }
            }
        })  
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/:pessoaId', async (req, res, next) => {
    const id = req.params.pessoaId;

    try {
        const pessoa = await PessoaModel.findOne({_id: id});
        if (pessoa) {
            res.status(200).json({
                pessoa: pessoa,
                request: {
                  type: "GET",
                  url: "http://localhost:3000/pessoas"
                }
              });
        } else {
            res.status(404).json("Pessoa não existe!");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.patch('/:pessoaId', async (req, res, next) => {
    const id = req.params.pessoaId;
    const updateCampos = {};
    Object.entries(req.body).map (item => {
        updateCampos[item[0]] = item[1];
    })
    try {
        let status = await PessoaModel.updateOne({_id: id}, 
            { $set: updateCampos});

        res.status(200).json({
            message: 'Update pessoa',
            status: status,
            request: {
              type: "GET",
              url: "http://localhost:3000/pessoas/" + id
            }
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

})

router.delete('/:pessoaId', async (req, res, next) => {
    const id = req.params.pessoaId;

    try {
        let status = await PessoaModel.deleteOne({_id: id});
        
            res.status(200).json({
                message: 'Pessoa deletada',
                status: status
            })
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
})

module.exports = router;