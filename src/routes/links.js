const express = require('express');
const router = express.Router();

const pool = require('../database');
const { route } = require('.');
const { request } = require('express');
const help = require('../lib/helpers');
const passport = require('passport');

//cargar vista de inicio
router.get('/', (req, res) =>{
    res.render('links/inicio');
});
//cargar vista de añadir links
router.get('/add', (req, res) =>{
    res.render('links/add');
});
//hacer un select para llenar la lista de link con una query y traer los datos desde la BD
router.get('/list', async (req, res) =>{
    const links = await pool.query('SELECT * FROM links');
    res.render('links/list', {links});
});
//cargar vista de añadir usuario
router.get('/useradd', (req, res) => {
    res.render('links/useradd');
});
//cargar vista de Editar usuario
router.get('/useredit', (req, res) => {
    res.render('links/useredit');
});

//login
router.get('/login', (req, res) =>{
   res.render('links/login'); 
});

router.post('/login', async(req, res) =>{
    const { email,password} = req.body;
    const login = {
        email,
        password
    };

    const rows = await pool.query('SELECT * FROM users WHERE email =?', [email]);
    if (rows.length > 0){
        const user = rows[0];
        const valPass = await help.matchpassword(password, user.password)
        if(valPass){
            console.log('Bienvenido usuario:', user.name)
            res.render('links/inicio')
        }
        else{
            console.log('error de contraseña')
        }
    }
    else{
        console.log('no se encontro ningun usuario')
    }
    
    
});

//restaurantes
router.get('/listarest', (req, res) =>{
    res.render('links/listaRest'); 
 });


//hacer un select para llenar la lista de user con una query y traer los datos desde la BD
router.get('/user', async (req, res) => {
    const users = await pool.query('SELECT * FROM users');
    //console.log(users);
    res.render('links/user', {users});
});
//metodo para la inserccion de la tabla links a la BD con una quiery y el metodo POST en el formulario
//y redireccionar a la vista donde nos muestra la lista de los links con los datos actualizados
router.post('/add', async (req, res) => {
    const { title,url, descripcion } = req.body;
    const newLink = {
        title,
        url,
        descripcion
    };
    //console.log(newLink);
    await pool.query('INSERT INTO links set ?', [newLink]);
    //console.log(req.body);
    //res.send('recivido');
    res.redirect('/links/list');
});
//metodo para la inserccion de la tabla users a la BD con una quiery y el metodo POST en el formulario
//y redireccionar a la vista donde nos muestra la lista de los usuarios con los datos actualizados
router.post('/useradd', async (req, res) => {
    const {name, last_name, email, password} = req.body;
    const newuser = {
        name,
        last_name,
        email,
        password
    };
    //console.log(newuser);
    //res.send('recivido');
    newuser.password = await help.encrypPassword(password);
    const resultado = await pool.query('INSERT INTO users set ?', [newuser]);
    console.log(resultado);
    res.redirect('/links/user');
});
//metodo para la eliminacion de la tabla links a la BD con una quiery y el metodo GET en el formulario
//y redireccionar a la vista donde nos muestra la lista de los links con los datos actualizados
router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
   await pool.query('DELETE FROM links WHERE ID = ?', [id]);

    res.redirect('/links/list');
    //console.log(request.param.id);
    //res.send('ELIMINADO');
});
//metodo para la eliminacion de la tabla user a la BD con una quiery y el metodo GET en el formulario
//y redireccionar a la vista donde nos muestra la lista de los user con los datos actualizados
router.get('/userdelet/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE ID = ?', [id]);

    res.redirect('/links/user');
});
//metodo para la editar de la tabla links a la BD con una quiery y el metodo GET en el formulario
//y redireccionar a la vista donde nos muestra el formulario para editar los datos a nuestro gusto
//esto se logra obteniendo el id de la tabla para lograr la actualizaccion
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    //await pool.query('UPDATE FROM links WHERE ID = ?', [id]);
    const links = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
    //console.log(links);
    res.render('links/edit', {link: links[0]});
    //console.log(request.param.id);
    //res.send('Editado');
});
//metodo para la editar de la tabla user a la BD con una quiery y el metodo GET en el formulario
//y redireccionar a la vista donde nos muestra el formulario para editar los datos a nuestro gusto
//esto se logra obteniendo el id de la tabla para lograr la actualizaccion
router.get('/useredit/:id', async (req, res) => {
    const { id} = req.params;
    const links = await pool.query('SELECT * FROM users WHERE ID = ?', [id]);
    res.render('links/useredit', {link: links[0]})
});

//metodo para la editar de la tabla links a la BD con una quiery y el metodo POST en el formulario
//al momento que le demos clic en el guardado neustros datos viajaran por post y con una query de UPDATE
//vamos a lograr que nuestros datos se actualicen de forma adecuada
//al final nos redireccionara a la vista donde tenemos lalista de los links
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, url, descripcion } = req.body;
    const resid = {id};
    const newLink = {
        title,
        url,
        descripcion
    };
    //console.log(newLink);
    //res.send('Editado');
    //await pool.query('SELECT id FROM links WHERE id = ?', [id]);
    await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
    res.redirect('/links/list');
});

//metodo para la editar de la tabla user a la BD con una quiery y el metodo POST en el formulario
//al momento que le demos clic en el guardado neustros datos viajaran por post y con una query de UPDATE
//vamos a lograr que nuestros datos se actualicen de forma adecuada
//al final nos redireccionara a la vista donde tenemos lalista de los user
router.post('/useredit/:id', async (req, res) => {
    const {id} = req.params;
    const {name, last_name, email, password, } = req.body;
    const resid = {id};
    const edituser = {
        name,
        last_name,
        email,
        password
    };
    //console.log(id)
    //console.log(edituser);
    //res.send('Editado');
    edituser.password = await help.encrypPassword(password);
    const resultado = await pool.query('UPDATE users set ? WHERE id = ?', [edituser, id]);
    console.log(resultado);
    res.redirect('/links/user');
});

module.exports = router;