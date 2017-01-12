var express = require('express');
var morgan = require('morgan'); // Charge le middleware de logging
var favicon = require('serve-favicon'); // Charge le middleware de favicon
var bodyParser = require('body-parser');
var logger = require('log4js').getLogger('Server');
var mysql = require('mysql');
var app = express();

app.use(bodyParser());
app.use(morgan('combined')); // Active le middleware de logging

app.use(express.static(__dirname + '/public')); // Indique que le dossier /public contient des fichiers statiques (middleware chargé de base)


logger.info('server start');
app.listen(1313);

// config
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

var fs = require("fs");
var vm = require('vm');
vm.runInThisContext(fs.readFileSync(__dirname + "/connexionBdd.js"));
/* On affiche le formulaire d'enregistrement */

app.get('/', function(req, res){
    res.redirect('/login');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.get('/inscription', function(req, res){
    res.render('inscription');
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
					logger.info("oui");		
					res.redirect("/session?valid=true");
				}
				else{
					logger.info("non");
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
    else res.send('success');
		});

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Erreur de connexion à la DB"});
            return;
        });
    });

    // TODO ajouter un nouveau utilisateur
});
/* On affiche le profile  */
app.get('/profile', function (req, res) {
    // TODO
	var sess = req.session;

	if(valid)
		logger.info("oui");
	else
		logger.info("non");
    // On redirige vers la login si l'utilisateur n'a pas été authentifier
    // Afficher le button logout
});



