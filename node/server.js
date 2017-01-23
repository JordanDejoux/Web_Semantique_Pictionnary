var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var favicon = require('serve-favicon'); // Charge le middleware de favicon
var bodyParser = require('body-parser');
var logger = require('log4js').getLogger('Server');
var mysql = require('mysql');
var session = require('express-session');
var app = express();

app.use(bodyParser());
app.use(morgan('combined')); // Active le middleware de logging
app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)

var sess = {
    secret: 'keyboard cat'
};
app.use(session(sess));

logger.info('server start');
app.listen(1313);

// config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/inscription', function(req, res){
        res.render('inscription');
});

app.get('/deconnexion',function(req, res){
    sess.valid = false;
    res.redirect("/login");
});

app.get('/deleteCompte',function(req, res){
    var pool =  mysql.createPool({
        connectionLimit : 100, //important
        host : 'localhost',
        user : 'test',
        password: 'test',
        database: 'pictionnary'
    });
    pool.getConnection(function(err,connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        }
        var req = "DELETE FROM USERS WHERE id = "+sess.id;
        connection.query(req, function (err, rows) {
            connection.release();
            if (err) throw err;
            else res.redirect("/login")
        });

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        });
    });
});

app.post('/login', function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
	
	var pool =  mysql.createPool({
        connectionLimit : 100, //important
        host : 'localhost',
        user : 'test',
        password: 'test',
        database: 'pictionnary'
    });


    pool.getConnection(function(err,connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        }

        connection.query("SELECT * from users WHERE email='" + username + "' AND password = '" + password + "'", function (err, rows) {
            connection.release();
            if (!err) {
                if (rows.length > 0){
					sess.valid = true;
					sess.profileEpic = rows[0].profilepic;
					sess.prenom = rows[0].prenom;
					sess.id = rows[0].id;
                    sess.couleur = rows.couleur;
					sess.admin = rows[0].admin;
                    sess.email = rows[0].email;
					res.redirect("/dashboard");
				}
				else{
                    sess.valid = false;
                    res.redirect("/login");
				}
            }
        });

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        });
    });

});

app.post('/register', function (req, res) {
	var email = req.body.email;
	var password = req.body.password;
	var nom = req.body.nom;
	var prenom = req.body.prenom;  
	var sexe = req.body.sexe;  
	var telephone = req.body.telephone;  
	var siteweb = req.body.siteweb;  
	var birthdate = req.body.birthdate;  
	var ville = req.body.ville;  
	var taille = req.body.taille;  
	var couleur = req.body.couleur;  
	var profilepic = req.body.profilepic;
	
	var pool =  mysql.createPool({
        connectionLimit : 100, //important
        host : 'localhost',
        user : 'test',
        password: 'test',
        database: 'pictionnary'
    });


    pool.getConnection(function(err,connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        }
		var req = "INSERT INTO users (email, password, nom, prenom, tel, website, sexe, birthdate, ville, taille, couleur, profilepic)VALUES('"+email+"','"+password+"','"+nom+"','"+prenom+"','"+telephone+"','"+siteweb+"','"+sexe+"','"+birthdate+"','"+ville+"',"+taille+",'"+couleur+"','"+profilepic+"')";
        connection.query(req, function (err, rows) {
            connection.release();
			 if (err) throw err;
    else res.redirect("/login")
		});

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        });
    });

    // TODO ajouter un nouveau utilisateur
});

/* On affiche le profile  */
app.get('/dashboard', function (req, res) {
    if (sess.valid) {
        if (sess.admin) {
            res.redirect('dashboardAdmin')
        }else {
            var pool =  mysql.createPool({
                connectionLimit : 100, //important
                host : 'localhost',
                user : 'test',
                password: 'test',
                database: 'pictionnary'
            });

            pool.getConnection(function(err,connection) {
                if (err) {
                    connection.release();
                    res.json({"code": 100, "status": "Erreur de connexion à la DB"});
                    return;
                }

                connection.query("SELECT * from drawings WHERE email='" + sess.email + "' AND reponse is null", function (err, rows) {
                    connection.release();
                    if (!err) {
                        res.render('dashboard', {
                            photo: sess.profileEpic,
                            prenom: sess.prenom,
                            result:rows
                        });
                        }
                        else{
                            throw err;
                        }

                });

                connection.on('error', function (err) {
                    res.json({"code": 100, "status": "Erreur de connexion à la DB"});
                    return;
                });
            });
        }
    }
	else
        res.redirect("/login");
    // On redirige vers la login si l'utilisateur n'a pas été authentifier
    // Afficher le button logout
});

app.get('/dashboardAdmin', function (req, res) {
    if (sess.valid) {
        var pool =  mysql.createPool({
            connectionLimit : 100, //important
            host : 'localhost',
            user : 'test',
            password: 'test',
            database: 'pictionnary'
        });

        pool.getConnection(function(err,connection) {
            if (err) {
                connection.release();
                res.json({"code": 100, "status": "Erreur de connexion à la DB"});
                return;
            }

            connection.query("SELECT * from drawings", function (err, rows) {
                connection.release();
                if (!err) {
                    res.render('dashboardAdmin', {
                        photo: sess.profileEpic,
                        prenom: sess.prenom,
                        result: rows
                    });
                }
                else {
                    throw err;
                }
            });
        });
    }else
        res.redirect("/login");
});

app.get('/paint', function(req, res){
    if (sess.valid) {
        res.render('paint', {couleur: sess.couleur});
    }else
        res.redirect("/login");
});

app.post('/paint', function (req, res) {

    var drawingCommands=req.body.drawingCommands;
    var picture=req.body.picture;
    var userId = sess.id;
    var email = req.body.destinataire;
    var mot = req.body.mot;
    var pool =  mysql.createPool({
        connectionLimit : 100, //important
        host : 'localhost',
        user : 'test',
        password: 'test',
        database: 'pictionnary'
    });


    pool.getConnection(function(err,connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        }
        var req = "INSERT INTO drawings(commandes, images, u_id, email, mot) VALUES ('"+drawingCommands+"','"+ picture +"',"+ userId+",'"+email+"','"+mot+"')";
        connection.query(req, function (err, rows) {
            connection.release();
            if (err) throw err;
            else res.redirect("/dashboard")
        });

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        });
    });
    // TODO ajouter un nouveau utilisateur
});

app.post('/updateInfo', function (req, res) {
    var password = req.body.password;
    var siteweb = req.body.siteweb;
    var ville = req.body.ville;
    var couleur = req.body.couleur;
    var profilepic = req.body.profilepic;

    sess.profileEpic = profilepic;
    sess.couleur = couleur;

    var pool =  mysql.createPool({
        connectionLimit : 100, //important
        host : 'localhost',
        user : 'test',
        password: 'test',
        database: 'pictionnary'
    });

    pool.getConnection(function(err,connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        }
        var req = "UPDATE Users SET `password` ='"+password+"' ,`website` = '"+siteweb+"',`ville` ='"+ville+"',`couleur` = '"+couleur+"',`profilepic` = '"+profilepic+"' WHERE `id` = "+sess.id;
        connection.query(req, function (err, rows) {
            connection.release();
            if (err) throw err;
            else res.redirect("/dashboard")
        });

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        });
    });
});

app.get('/modificationInfo', function(req, res){
    if (sess.valid) {
    res.render('modificationInfo');
    }else
        res.redirect("/login");
});

app.get('/reponse', function(req, res){
    if (sess.valid) {
        sess.idImage = req.query.id;
        var pool =  mysql.createPool({
            connectionLimit : 100, //important
            host : 'localhost',
            user : 'test',
            password: 'test',
            database: 'pictionnary'
        });

        pool.getConnection(function(err,connection) {
            if (err) {
                connection.release();
                res.json({"code": 100, "status": "Erreur de connexion à la DB"});
                return;
            }

            connection.query("SELECT * from drawings where id="+sess.idImage, function (err, rows) {
                connection.release();
                if (!err) {
                    res.render('reponse', {
                        image: rows[0].images
                    });
                }
                else {
                    throw err;
                }
            });
        });
    }else
        res.redirect("/login");
});

app.post('/reponse', function (req, res) {
    var reponse = req.body.reponse;

    var pool =  mysql.createPool({
        connectionLimit : 100, //important
        host : 'localhost',
        user : 'test',
        password: 'test',
        database: 'pictionnary'
    });

    pool.getConnection(function(err,connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        }
        var req = "UPDATE drawings SET reponse='"+reponse+"' WHERE id = "+sess.idImage;
        connection.query(req, function (err, rows) {
            connection.release();
            if (err) throw err;
            else res.redirect("/dashboard")
        });

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        });
    });
});
