var mysql = require('mysql');
var express = require('express');
var app = module.exports = express();

var config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 4
};

//create a connection pool
var pool = mysql.createPool(config);

pool.on('connection', function (connection) {
  console.log('new db connection');

  //create table
  
});

pool.on('enqueue', function () {
  console.log('Waiting for available db connection slot');
});

//insert
app.post('/persons', function (req, res) {
  var values = [ req.body.firstname, req.body.lastname, req.body.age ];
  pool.query('INSERT INTO person (firstname, lastname, age) VALUES(?, ?, ?)', values, function(err, result) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.header('location', '/persons/' + result.insertId);
    res.status(201).send({
      id: result.insertId,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      age: req.body.age
    });
  });
});

//read all
app.get('/persons', function (req, res) {
  var sql = 'SELECT * FROM person ORDER BY lastname, firstname';
  pool.query(sql, function(err, rows, fields) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.send(rows);
  });
});

//read one
app.get('/persons/:id', function (req, res) {
  var sql = 'SELECT * FROM person WHERE id = ?';
  pool.query(sql, [ req.params.id ], function(err, rows, fields) {
    if (err) {
      console.error(err);
      throw err;
    }
    if (rows && rows.length > 0)
      res.send(rows[0]);
    else
      res.status(404).send('person not found');
  });
});

//update
app.put('/persons/:id', function (req, res) {
  var sql = 'UPDATE person SET firstname = ?, lastname = ?, age = ? WHERE id = ?';
  var values = [ req.body.firstname, req.body.lastname, req.body.age, req.params.id ];
  pool.query(sql, values, function(err, rows, fields) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.send(req.body);
  });
});

//delete
app.delete('/persons/:id', function (req, res) {
  var sql = 'DELETE FROM person WHERE id = ?';
  pool.query(sql, [ req.params.id ], function(err, rows, fields) {
    if (err) {
      console.error(err);
      throw err;
    }
    res.send();
  });
});
