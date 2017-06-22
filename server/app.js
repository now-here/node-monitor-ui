/**
 * Created by vignesh on 09/09/16.
 */

'use strict';

const path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var debug = require('debug')('node-monitor-ui:app')

app.use('/ui', express.static(path.resolve('node_modules/node-monitor-ui/ui')));

io.on('connect', (socket) => {
  debug('Client Connected');

  socket.on('logs', (log)=> {
    socket.broadcast.emit('logs',log);
    debug('00>', log);
  })
});

app.get('/', (req, res)=> {
  debug('Req logger....');

  var file = app.get('node-monitor-ui') || 'node_modules/node-monitor-ui/ui/index.html';
  res.sendFile(path.resolve(file));
});

module.exports.server = http;
module.exports.express = app;
module.exports.io = io;