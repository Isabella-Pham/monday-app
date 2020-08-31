const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Team = require('./models/mondayTeam');
const mongoose = require('mongoose');
const { update } = require('./models/mondayTeam');
const { sendMessageToClients } = require('./wsServer');

function getGraphId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

router.use(bodyParser.json());

function createNewGraph(req, res, next) {
  let {
    teamName,
    graphName,
    nodes,
    width,
    height,
    clientId
  } = req.body;

  if (!teamName || !graphName || !nodes) {
      return res.status(500).json({
          error: true,
          message: 'Missing required fields'
      });
  }

  let graphId = getGraphId()
  let updateOps = {
      $push: {
          graphs: {
            name: graphName,
            nodes: nodes,
            id: graphId,
            width: width,
            height: height
          }
      }
    }

  Team.findOneAndUpdate({ name: teamName }, updateOps, { new: true })
      .exec()
      .then(function(team) {
          if (!team) {
            team = new Team({
              _id: new mongoose.Types.ObjectId(),
              name: teamName,
              graphs: [{
                name: graphName,
                nodes: nodes,
                id: getGraphId(),
                width: width,
                height: height
              }]
            });

            team
              .save()
              .then(function(result) {
                let graph = result.graphs[0];

                for (let i = 0; i < graph.nodes.length; i++) {
                  for (let j = 0; j < graph.nodes[i].tasks.length; j++) {
                    for (let k = 0; k < graph.nodes[i].tasks[j].people.length; k++) {
                      graph.nodes[i].tasks[j].people[k].hasBeenNotified = true;
                    }
                  }
                }

                res.status(200).json({
                  error: false,
                  message: "Added graph successfully",
                  graph: graph,
                  graphs: result.graphs
                })
              })
              .catch(function(err) {
                  res.status(500).json({
                      error: true,
                      message: err.message
                  })
              })
          }
          else {
            let graph = team.graphs[team.graphs.length - 1];

            for (let i = 0; i < graph.nodes.length; i++) {
              for (let j = 0; j < graph.nodes[i].tasks.length; j++) {
                for (let k = 0; k < graph.nodes[i].tasks[j].people.length; k++) {
                  graph.nodes[i].tasks[j].people[k].hasBeenNotified = true;
                }
              }
            }

            res.status(200).json({
              error: false,
              message: 'Added graph successfully',
              graph: graph,
              graphs: team.graphs
            });

            sendMessageToClients(JSON.stringify({
              message: 'new',
              graphs: team.graphs
            }), clientId);
          }
      })
      .catch(function(err) {
          res.status(500).json({
              error: true,
              message: err.message
          })
      })
}

function deleteGraph(req, res, next) {
  let {
    teamName,
    graphId,
    clientId
  } = req.body;

  if (!teamName || !graphId) {
      return res.status(500).json({
          error: true,
          message: 'Missing required fields'
      });
  }

  let updateOps = {
    $pull: {
        graphs: {
          id: graphId
        }
    }
  }

  Team.findOneAndUpdate({ name: teamName }, updateOps, { new: true })
      .exec()
      .then(function(team) {
          if (!team) {
            res.status(500).json({
              error: true,
              message: "Team not found"
            })
          }
          else {
              res.status(200).json({
                  error: false,
                  message: 'Deleted graph successfully',
                  graphs: team.graphs
              });

              sendMessageToClients(JSON.stringify({
                message: 'delete',
                graphs: team.graphs,
                graphId: graphId
              }), clientId);
          }
      })
      .catch(function(err) {
          res.status(500).json({
              error: true,
              message: err.message
          })
      })
}

function editGraph(req, res, next) {
  let {
    teamName,
    graphId,
    graphName,
    nodes,
    width,
    height,
    clientId
  } = req.body;

  if (!teamName || !graphId || !graphName || !nodes || !width || !height) {
      return res.status(500).json({
          error: true,
          message: 'Missing required fields'
      });
  }

  let setOps = {
    "$set": {
      "graphs.$.name": graphName,
      "graphs.$.nodes": nodes,
      "graphs.$.width": parseInt(width),
      "graphs.$.height": parseInt(height),
    }
  }

  Team.findOneAndUpdate({ name: teamName, "graphs.id": graphId}, setOps, { new: true })
      .exec()
      .then(function(team) {
          if (!team) {
            res.status(500).json({
              error: true,
              message: "Team not found"
            })
          }
          else {
            let graph = team.graphs.find((graph) => graph.id === graphId);

            for (let i = 0; i < graph.nodes.length; i++) {
              for (let j = 0; j < graph.nodes[i].tasks.length; j++) {
                for (let k = 0; k < graph.nodes[i].tasks[j].people.length; k++) {
                  graph.nodes[i].tasks[j].people[k].hasBeenNotified = true;
                }
              }
            }
            
            res.status(200).json({
              error: false,
              message: 'Updated graph successfully',
              graphs: team.graphs,
              graph: graph
            });

            sendMessageToClients(JSON.stringify({
              message: 'update',
              graphs: team.graphs,
              graph: graph
            }), clientId);
          }
      })
      .catch(function(err) {
          res.status(500).json({
              error: true,
              message: err.message
          })
      })
}

function getAllGraphs(req, res, next) {
  let {
    teamName,
  } = req.body;

  if (!teamName) {
      return res.status(500).json({
          error: true,
          message: 'Missing required fields'
      });
  }

  Team.findOne({ name: teamName })
      .exec()
      .then(function(team) {
          if (!team) {
            res.status(500).json({
              error: true,
              message: "Team not found"
            })
          }
          else {
            res.status(200).json({
              error: false,
              message: "Graphs found",
              graphs: team.graphs
            })
          }
      })
      .catch(function(err) {
          res.status(500).json({
              error: true,
              message: err.message
          })
      })
}

router.post('/create', createNewGraph);
router.post('/delete', deleteGraph);
router.post('/edit', editGraph);
router.post('/getAll', getAllGraphs);

module.exports = router;
