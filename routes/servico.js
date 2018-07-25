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
    app.get('/woman/servico', (req, res) => {
        res.json(respostaSucesso);           
    }); 

    /******************************* */
    /** All Servicos                 */
    /******************************* */
    app.get('/woman/servico/all', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            dbo.collection("servico").find({}).toArray(function (err, result) {
                if (err) throw err;
                if (!result) res.json(respostaErro);
                else res.json(result);
                db.close();
            });
        });
    });

    /******************************* */
    /** Insert Servico               */
    /******************************* */
    app.post('/woman/servico/insert', (req, res) => {
        let servico;
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            var query = { nome: req.body.nome };
            dbo.collection("servico").find(query).toArray(function (err, result) {
                if (err) {
                    res.json(respostaErro);
                    throw err;
                }
                if (result.length == 0){
                    dbo.collection("servico").insertOne(req.body, function (err, res) {
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
    /** Update Servico               */
    /******************************* */
    app.post('/woman/servico/update', (req, res) => {
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
                    profissional: req.body.profissional
                }
            };
            dbo.collection("servico").updateOne(myquery, newvalues, function (err, res) {
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
    /** Delete Servico               */
    /******************************* */
    app.post('/woman/servico/delete', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                res.json(respostaErro);
                throw err;
            }
            var dbo = db.db("womandb");
            var myobj = { _id: ObjectID(req.body._id) };
            dbo.collection("servico").deleteOne(myobj, function (err, res) {
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