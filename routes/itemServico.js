const https = require('https');

module.exports = app => {

    const MongoClient = require('mongodb').MongoClient;
    const ObjectID = require('mongodb').ObjectID;
    const url = 'mongodb://wheslley:senha123@ds231589.mlab.com:31589/womandb';
    const respostaSucesso = "{status:SUCESSO}";
    const respostaErro = "{status:ERRO}";

    /******************************* */
    /** Teste                        */
    /******************************* */
    app.get('/woman/servico/item', (req, res) => {
        res.json(respostaSucesso);           
    }); 

    /******************************* */
    /** All Item Servico             */
    /******************************* */
    app.get('/woman/servico/item/all', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            dbo.collection("itemServico").find({}).toArray(function (err, result) {
                if (err) throw err;
                if (!result) res.json(respostaErro);
                else res.json(result);
                db.close();
            });
        });
    });

    /******************************* */
    /** Insert Item Servico          */
    /******************************* */
    app.post('/woman/servico/item/insert', (req, res) => {
        let servico;
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            var query = { nome: req.body.nome };
            dbo.collection("itemServico").find(query).toArray(function (err, result) {
                if (err) {
                    res.json(respostaErro);
                    throw err;
                }
                if (result.length == 0) {
                    dbo.collection("itemServico").insertOne(req.body, function (err, res) {
                        if (err) {
                            res.json(respostaErro);
                            throw err;
                        }
                    });
                    res.json(respostaSucesso);
                }
                else res.json(respostaErro);
                db.close();
            });
        });
    });

    /******************************* */
    /** Update Item Servico          */
    /******************************* */
    app.post('/woman/servico/item/update', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                res.json(respostaErro);
                throw err;
            }
            var dbo = db.db("womandb");
            var myquery = { _id: ObjectID(req.body._id) };
            var newvalues = {
                $set: {
                    nome: req.body.nome,
                    tempo: req.body.tempo,
                    preco: req.body.preco
                }
            };
            dbo.collection("itemServico").updateOne(myquery, newvalues, function (err, res) {
                if (err) {
                    res.json(respostaErro);
                    throw err;
                }
                db.close();
            });
            res.json(respostaSucesso);
        });
    });

    /******************************* */
    /** Delete Item Servico          */
    /******************************* */
    app.post('/woman/servico/item/delete', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                res.json(respostaErro);
                throw err;
            }
            var dbo = db.db("womandb");
            var myobj = { _id: ObjectID(req.body._id) };
            dbo.collection("itemServico").deleteOne(myobj, function (err, res) {
                if (err) {
                    res.json(respostaErro);
                    throw err;
                }
                db.close();
            });
            res.json(respostaSucesso);
        });
    });

}