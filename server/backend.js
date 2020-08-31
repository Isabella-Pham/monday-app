const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Team = require('./models/mondayTeam');
const mongoose = require('mongoose');

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
    height
  } = req.body;

  if (!teamName || !graphName || !nodes) {
      return res.status(500).json({
          error: true,
          message: 'Missing required fields'
      });
  }

  Team.findOne({ name: teamName })
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
                res.status(200).json({
                  error: false,
                  message: "Added graph successfully",
                  graphId: result.graphs[0].id
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
              team.update(updateOps)
                  .exec()
                  .then(function(result) {
                      res.status(200).json({
                          error: false,
                          message: 'Added graph successfully',
                          graphId: graphId
                      });
                  })
                  .catch(function(err) {
                      res.status(500).json({
                          error: true,
                          message: err.message
                      })
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

function deleteGraph(req, res, next) {
  let {
    teamName,
    graphId,
  } = req.body;

  if (!teamName || !graphId) {
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
            let updateOps = {
                $pull: {
                    graphs: {
                      id: graphId
                    }
                }
            }
            team.update(updateOps)
                .exec()
                .then(function(result) {
                  console.log(team.graphs);
                    res.status(200).json({
                        error: false,
                        message: 'Deleted graph successfully',
                        graphs: team.graphs
                    });
                })
                .catch(function(err) {
                    res.status(500).json({
                        error: true,
                        message: err.message
                    })
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

function editGraph(req, res, next) {
  let {
    teamName,
    graphId,
    graphName,
    nodes,
    width,
    height
  } = req.body;

  if (!teamName || !graphId || !graphName || !nodes || !width || !height) {
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
            let updateOps = {
              "graphs.id": graphId,
            }

            let setOps = {
              "$set": {
                "graphs.$.name": graphName,
                "graphs.$.name": nodes,
                "graphs.$.name": parseInt(width),
                "graphs.$.name": parseInt(height),
              }
            }

            team.update(updateOps, setOps)
                .exec()
                .then(function(result) {
                    res.status(200).json({
                        error: false,
                        message: 'Updated graph successfully'
                    });
                })
                .catch(function(err) {
                    res.status(500).json({
                        error: true,
                        message: err.message
                    })
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
