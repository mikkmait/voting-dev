import express from 'express';
import Debug from 'debug';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const votingRouter = express.Router();
const debug = Debug('app');

// ! Connecting to MongoDB
const url = process.env.DB_URL;
const client = new MongoClient(url);

// ? mongoDB shorthand definitions:
// ? Q = query
// ? P = projection
// ? S = sort
// ? A = return all in Array
// ? sum = sum of all votes
// ? L = limit to the number of top votes

const db = client.db('votingDev');
const people = db.collection('people');
const pages = db.collection('pages');

votingRouter.route('/').get((req, res) => {
  res.render('voting');
});

votingRouter.route('/vote').get((req, res) => {
  const { voteNumber } = req.query;
  let currentVote = '';
  let voteQ = {};
  let voteP = {};
  let voteSum = {};
  let pageQ = {};
  if (voteNumber === 'vote1') {
    currentVote = 'vote1';
    voteQ = { "voting.vote1.valid": true };
    debug(voteQ);
    voteP = { _id: 0, nick: 1, "voting.vote1.count": 1 };
    voteSum = [{$group: { _id: null, sumVote:{$sum:"$voting.vote1.count"}}}];
    pageQ = { pageName: 'vote1'};
  } else if (voteNumber === 'vote2') {
    currentVote = 'vote2';
    voteQ = { 'voting.vote2.valid': true };
    voteP = { _id: 0, nick: 1, name: 1, "voting.vote2.count": 1 };
    voteSum = [{$group: { _id: null, sumVote:{$sum:"$voting.vote2.count"}}}];
  } else if (voteNumber === 'vote3') {
    currentVote = 'vote3';
    voteQ = { 'voting.vote3.valid': true };
    voteP = { _id: 0, nick: 1, "voting.vote3.count": 1 };
    voteSum = [{$group: { _id: null, sumVote:{$sum:"$voting.vote3.count"}}}];
  } else {
    currentVote = 'vote4';
    voteQ = { 'voting.vote4.valid': true };
    voteP = { _id: 0, nick: 1, "voting.vote4.count": 1 };
    voteSum = [{$group: { _id: null, sumVote:{$sum:"$voting.vote4.count"}}}];
  };
  // debug(currentVote);
  (async function mongo(){
    try {
      const votesCount = await people.find(voteQ).project(voteP).toArray();
      const votesSum = await people.aggregate(voteSum).toArray();
      // debug(votesSum);
      const votesArray = votesCount.concat(votesSum);
      // debug(votesArray);
      const votesString = JSON.stringify(votesArray);
      const activePage = await pages.find(pageQ, { _id: 0, pageName: 1, disabled: 1 }).toArray();
      res.render('vote', { votesArray, votesString, currentVote, activePage });
    } catch (error) {
      debug(error.stack);
    };
  }());
});

votingRouter.route('/voteConfirm').get((req, res) => {
  debug(req.query);
  const data = req.query.vote;
  debug(data);
  if (data === undefined) {
    res.redirect('../voting');
  } else {
    const vote = JSON.parse(data);
    debug(vote);
    let update = {};
    if (vote.voteDef === 'vote1') {
      update = {$inc: {"voting.vote1.count": 1}};
    } else if (vote.voteDef === 'vote2') {
      update = {$inc: {"voting.vote2.count": 1}};
    } else if (vote.voteDef === 'vote3') {
      update = {$inc: {"voting.vote3.count": 1}};
    } else {
      update = {$inc: {"voting.vote4.count": 1}};
    };
    (async function mongo(){
      try {
        const query = {nick: vote.chosen};
        people.updateOne(query, update);
        res.redirect('/voting'); 
      } catch (error) {
        debug(error.stack);
      };
    }());
  };
});

export default votingRouter;