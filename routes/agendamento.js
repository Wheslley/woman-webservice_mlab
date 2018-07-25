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
    app.get('/woman/agendamento', (req, res) => {
        res.json(respostaSucesso);           
    }); 

    /******************************* */
    /** All Agendamento              */
    /******************************* */
    app.get('/woman/agendamento/all', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            dbo.collection("agendamento").find({}).toArray(function (err, result) {
                if (err) throw err;
                if (!result) res.json(respostaErro);
                else res.json(result);
                db.close();
            });
        });
    });

    /******************************* */
    /** Day Agendamento              */
    /******************************* */
    app.post('/woman/agendamento/day', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            var query = { data: req.body.data };
            dbo.collection("agendamento").find(query).toArray(function (err, result) {
                if (err) throw err;
                if (!result) res.json(respostaErro);
                else res.json(result);
                db.close();
            });
        });
    });

    /******************************* */
    /** Day Agendamento              */
    /******************************* */
    app.post('/woman/agendamento/pessoa', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            var query = { nomePessoa: req.body.nomePessoa };
            dbo.collection("agendamento").find(query).toArray(function (err, result) {
                if (err) throw err;
                if (!result) res.json(respostaErro);
                else res.json(result);
                db.close();
            });
        });
    });

    /******************************* */
    /** Day Agendamento              */
    /******************************* */
    app.post('/woman/agendamento/dataHora', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            var query = { data: req.body.data, hora: req.body.hora };
            dbo.collection("agendamento").find(query).toArray(function (err, result) {
                if (err) throw err;
                if (!result) res.json(respostaErro);
                else res.json(result);
                db.close();
            });
        });
    });

    /******************************* */
    /** Insert Agendamento           */
    /******************************* */
    app.post('/woman/agendamento/insert', (req, res) => {
        let servico;
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            console.log("1");
            var query = { nomePessoa: req.body.nomePessoa, hora: req.body.hora };
            console.log("2");
            console.log(query);
            dbo.collection("agendamento").find(query).toArray(function (err, result) {
                if (err) {
                    res.json(respostaErro);
                    throw err;
                }
                console.log("3");
                if (result.length == 0) {
                    console.log("4");
                    dbo.collection("agendamento").insertOne(req.body, function (err, res) {
                        if (err) {
                            res.json(respostaErro);
                            throw err;
                        }
                    });
                    console.log("5");
                    res.json(respostaSucesso);
                }
                else res.json(respostaErro);
                db.close();
            });
        });
    });

    /******************************* */
    /** Update Agendamento           */
    /******************************* */
    app.post('/woman/agendamento/update', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                res.json(respostaErro);
                throw err;
            }
            var dbo = db.db("womandb");
            var myquery = { _id: ObjectID(req.body._id) };
            var newvalues = {
                $set: {
                    data: req.body.data,
                    hora: req.body.hora,
                    nomePessoa: req.body.nomePessoa,
                    servicos: req.body.servicos
                }
            };
            dbo.collection("agendamento").updateOne(myquery, newvalues, function (err, res) {
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
    /** Delete Agendamento           */
    /******************************* */
    app.post('/woman/agendamento/delete', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                res.json(respostaErro);
                throw err;
            }
            var dbo = db.db("womandb");
            var myobj = { _id: ObjectID(req.body._id) };
            dbo.collection("agendamento").deleteOne(myobj, function (err, res) {
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