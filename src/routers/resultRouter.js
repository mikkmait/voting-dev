import express from 'express';
import Debug from 'debug';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const resultRouter = express.Router();
const debug = Debug('app');

// ! Connecting to MongoDB
const url = process.env.DB_URL;
const client = new MongoClient(url);

const db = client.db('votingDev');
const people = db.collection('people');

resultRouter.route('/').get((req, res) => {
  (async function mongo(){
    let winner = await people.find({trueWinner: true}).project( { _id: 0, winner: 1 } ).toArray();
    // debug(winner);
    try {
      res.render('result', {winner});
    } catch (error) {
      debug(error.stack);
    }
  }());
});

export default resultRouter;