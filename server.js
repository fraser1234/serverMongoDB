const express = require('express');
const parser = require('body-parser');
const server = express();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

server.use(parser.json());
server.use(express.static('client/build'));
server.use(parser.urlencoded({extended: true}));


MongoClient.connect('mongodb://localhost:27017', function(err, client){

  if(err){
    console.log(err);
    return;
  };

  const db = client.db('rangers_players'); // this will create the ranegrs database
  console.log('connected to the database');

  server.post('/api/players', function(req, res){
    db.collection('players').save(req.body, function(err, result){
      if(err){
        console.log(err);
        res.status(500);
      };
      res.status(201);
      res.json(result.ops[0]);
      console.log('saved to database');
    });
  });

  server.get('/api/players', function(req, res){
  db.collection('players').find().toArray(function(err, results){
    if(err){
      console.log(err);
      res.status(500); //sends back if the api fails
    }
    res.json(results);
  });
});

server.put('/api/players/:id', function(req, res){
    db.collection('players').update({_id: ObjectID(req.params.id)}, req.body, function(err, results){
      if(err){
        console.log(err);
        res.status(500);//sends back if the api fails
      }
      res.status(204);
      res.send();
    });
  });

  server.delete('/api/players', function(req, res){
    db.collection('players').remove({}, function(err, result){
      if(err){
        console.log(err);
        res.status(500); //sends back if the api fails
      }
      res.status(204);
      res.send();
    });
  });

  server.listen(3000, function(){
    console.log("Listening on port 3000");
  });
});
