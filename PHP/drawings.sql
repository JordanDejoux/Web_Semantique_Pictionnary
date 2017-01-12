DROP TABLE IF EXISTS `users`;  
CREATE TABLE IF NOT EXISTS `users` (  
`id` int(11) NOT NULL AUTO_INCREMENT,  
`email` varchar(65) NOT NULL,  
`password` varchar(65) NOT NULL,  
`nom` varchar(65) DEFAULT NULL,  
`prenom` varchar(65) DEFAULT NULL,  
`tel` varchar(16) DEFAULT NULL,  
`website` varchar(65) DEFAULT NULL,  
`sexe` char(1) DEFAULT NULL,  
`birthdate` date NOT NULL,  
`ville` varchar(65) DEFAULT NULL,  
`taille` smallint(6) DEFAULT NULL,  
`couleur` char(6) DEFAULT '000000',  
`profilepic` blob DEFAULT NULL,  
PRIMARY KEY (`id`),  
UNIQUE KEY `email` (`email`)  
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

create table if not exists drawings(
	id int auto_increment,
	u_id int not null,
    commandes blob not null,
    images blob not null,
    primary key(id)
);