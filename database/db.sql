create database pruebas;
use pruebas;

create table users(
id int primary key auto_increment,
name varchar(150), 
last_name varchar(200),
email varchar(255),
password varchar(255),
rol varchar(100)
);

create table tipo_res(
id int primary key auto_increment,
name varchar(255)
);
create table restaurantes(
id int primary key auto_increment,
name varchar(200),
address varchar(255),
description varchar(255),
phone_numbre varchar(20),
fk_tipo int, foreign key (fk_tipo) references tipo_res(id)
);
create table reservaciones(
id int primary key auto_increment,
fk_user int, foreign key (fk_user) references users(id),
fk_rest int, foreign key (fk_rest) references restaurantes(id),
fecha varchar(100),
per_adicional varchar(10)
);

