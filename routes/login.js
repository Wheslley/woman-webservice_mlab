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
    app.get('/woman/login', (req, res) => {
        res.json(respostaSucesso);           
    }); 

    /******************************* */
    /** Validate Login               */
    /******************************* */
    app.post('/woman/login/validate', (req, res) => {
        let usuario;
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            var query = { email: req.body.email };
            dbo.collection("usuario").find(query).toArray(function (err, result) {
                if (err) throw err;
                result.forEach(re => usuario = re);
                if (usuario) {
                    if (req.body.senha === usuario.senha) res.json(usuario);
                    else res.status(403).end();//res.json(respostaErro);
                }
                else res.json(respostaErro);
                db.close();
            });
        });
    });

    /******************************* */
    /** All Usuarios Login           */
    /******************************* */
    app.get('/woman/login/all', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            dbo.collection("usuario").find({}).toArray(function (err, result) {
                if (err) throw err;
                if (!result) res.json(espostaErro);
                else res.json(result);
                db.close();
            });
        });
    });

    /******************************* */
    /** Insert Usuario               */
    /******************************* */
    app.post('/woman/login/insert', (req, res) => {
        let usuario;
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("womandb");
            var query = { email: req.body.email };
            dbo.collection("usuario").find(query).toArray(function (err, result) {
                if (err) {
                    res.json(respostaErro);
                    throw err;
                }
                result.forEach(re => usuario = re);
                if (!usuario) {
                    dbo.collection("usuario").insertOne(req.body, function (err, res) {
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
    /** Update Usuario               */
    /******************************* */
    app.post('/woman/login/update', (req, res) => {
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
                    dataNascimento: req.body.dataNascimento,
                    telefone: req.body.telefone,
                    email: req.body.email,
                    senha: req.body.senha
                }
            };
            dbo.collection("usuario").updateOne(myquery, newvalues, function (err, res) {
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
    /** Delete Usuario               */
    /******************************* */
    app.post('/woman/login/delete', (req, res) => {
        MongoClient.connect(url, function (err, db) {
            if (err) {
                res.json(respostaErro);
                throw err;
            }
            var dbo = db.db("womandb");
            var myobj = { _id: ObjectID(req.body._id) };
            dbo.collection("usuario").deleteOne(myobj, function (err, res) {
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