import express from 'express';
import Debug from 'debug';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const adminRouter = express.Router();
const debug = Debug('app');

// ! Connecting to MongoDB
const url = process.env.DB_URL
const client = new MongoClient(url);

const db = client.db('votingDev');
const people = db.collection('people');
const pages = db.collection('pages');

// ! Get the lists for all the votes
const peopleDB = await people.find( {"validity": {$eq: true} } ).toArray();

// * Reach stuff about VOTE 1
  const vote1Q = { "voting.vote1.valid": true };
  const vote1P = { _id: 0, nick: 1, "voting.vote1.count": 1 };
  const vote1S = { "voting.vote1.count": -1 };

  // const vote1sum = await people.aggregate([{$group: { _id: null, sumVote1:{$sum:"$voting.vote1.count"}}}]).toArray();

// * Reach stuff about VOTE 2
  const vote2Q = { "voting.vote2.valid": true };
  const vote2P = { _id: 0, nick: 1, "voting.vote2.count": 1 };
  const vote2S = { "voting.vote2.count": -1 };

  // const vote2sum = await people.aggregate([{$group: { _id: null, sumVote2:{$sum:"$voting.vote2.count"}}}]).toArray();

// * Reach stuff about VOTE 3
  const vote3Q = { "voting.vote3.valid": true };
  const vote3P = { _id: 0, nick: 1, "voting.vote3.count": 1 };
  const vote3S = { "voting.vote3.count": -1 };

  // const vote3sum = await people.aggregate([{$group: { _id: null, sumVote3:{$sum:"$voting.vote3.count"}}}]).toArray();

// * Reach stuff about VOTE 4
  const vote4Q = { "voting.vote4.valid": true };
  const vote4P = { _id: 0, nick: 1, "voting.vote4.count": 1 };
  const vote4S = { "voting.vote4.count": -1 };

  // const vote4sum = await people.aggregate([{$group: { _id: null, sumVote4:{$sum:"$voting.vote4.count"}}}]).toArray();


const allQ = { $or: {"voting.vote1.valid": true, "voting.vote2.valid": true, "voting.vote3.valid": true, "voting.vote4.valid": true }};
const allP = { _id: 0, nick: 1, "voting.vote1.count": 1, "voting.vote2.count": 1, "voting.vote3.count": 1, "voting.vote4.count": 1 }

// * Return voting results
// console.log(vote1A);
// console.log('Sum all votes from vote 1: ' + vote1sum[0].sumVote1);
// console.log('-----');
// console.log(vote2);
// console.log('Sum all votes from vote 2: ' + vote2sum[0].sumVote2);
// console.log('-----');
// console.log(vote3);
// console.log('Sum all votes from vote 3: ' + vote3sum[0].sumVote3);
// console.log('-----');
// console.log(vote4);
// console.log('Sum all votes from vote 4: ' + vote4sum[0].sumVote4);
// console.log('-----');

//! NEED KÕIK TULEB VÄLJA KUTSUDA ASYNC SEES KUIDAGI
//! KOGU MONGO STRUTUUR TULEB OTSAST PEALE TEHA, ET OLEKS DYNAAMILISEM

let winner = '';

adminRouter.route('/').get((req, res) => {
  (async function mongo(){
    const results1 = await people.find(vote1Q).project(vote1P).sort(vote1S).limit(3).toArray();
    const results2 = await people.find(vote2Q).project(vote2P).sort(vote2S).limit(3).toArray();
    const results3 = await people.find(vote3Q).project(vote3P).sort(vote3S).limit(3).toArray();
    const results4 = await people.find(vote4Q).project(vote4P).sort(vote4S).limit(3).toArray();
    try {
      res.render('admin', {results1, results2, results3, results4});
    } catch (error) {
      debug(error.stack);
    }
  }())
})

adminRouter.route('/initializeAllVotes').get((req, res) => {
  console.log(req.query);
  (async function mongo(){
    const results1 = await people.find(vote1Q).project(vote1P).sort(vote1S).limit(3).toArray();
    const results2 = await people.find(vote2Q).project(vote2P).sort(vote2S).limit(3).toArray();
    const results3 = await people.find(vote3Q).project(vote3P).sort(vote3S).limit(3).toArray();
    const results4 = await people.find(vote4Q).project(vote4P).sort(vote4S).limit(3).toArray();
    try {
      const query = {nick: {$ne: 'xxx'}};
      const update = {$set: {"voting.vote1.count": 0, "voting.vote2.count": 0, "voting.vote3.count": 0,"voting.vote4.count": 0} };
      people.updateMany(query, update);
      // const dancersZero = await dancers.find(query,).project( { _id: 0, nick: 1, vote1Count: 1, vote2Count: 1, vote3Count: 1} ).toArray();
      // const songsZero = await songs.find(query).project( { _id: 0, nick: 1, votes: 1 } ).toArray();
      // debug(dancersZero);
      // debug(songsZero);
      res.render('admin', {results1, results2, results3, results4});
    } catch (error) {
        debug(error.stack);
    }
  }())
})

adminRouter.route('/activateVotes').get((req, res) => {
  // console.log(req.query);
  const data = req.query.push;
  // console.log(data);
  const push = JSON.parse(data);
  // console.log(push);
  // console.log(push.pageName);
  // console.log(push.disabled);
  (async function mongo(){
    const results1 = await people.find(vote1Q).project(vote1P).sort(vote1S).limit(3).toArray();
    const results2 = await people.find(vote2Q).project(vote2P).sort(vote2S).limit(3).toArray();
    const results3 = await people.find(vote3Q).project(vote3P).sort(vote3S).limit(3).toArray();
    const results4 = await people.find(vote4Q).project(vote4P).sort(vote4S).limit(3).toArray();
    
    try {
      const query = { pageName: push.pageName };
      const update = { $set: { disabled: push.disabled }};
      pages.updateOne(query, update);

      res.render('admin', {results1, results2, results3, results4});
    } catch(error) {
      debug(error.stack);
    }
  }())
})

adminRouter.route('/changeWinner').get((req, res) => {
  console.log(req.query);
  winner = req.query.winner;
  console.log(winner);
  (async function mongo(){
    const results1 = await people.find(vote1Q).project(vote1P).sort(vote1S).limit(3).toArray();
    const results2 = await people.find(vote2Q).project(vote2P).sort(vote2S).limit(3).toArray();
    const results3 = await people.find(vote3Q).project(vote3P).sort(vote3S).limit(3).toArray();
    const results4 = await people.find(vote4Q).project(vote4P).sort(vote4S).limit(3).toArray();
    try {
      const query = { trueWinner: true };
      const update = { $set: {'winner': winner}};
      people.updateOne(query, update);
      res.render('admin', {results1, results2, results3, results4});
    } catch(error) {
      debug(error.stack);
    }
  }())
})

export default adminRouter;