/**
 * Created by Vignesh on 14/09/16.
 */


'use strict';

const pidusage = require('pidusage');
const profiler = require('gc-profiler');
const io = require('./app').io;
const shortId = require('shortid');
const timestamp = require('monotonic-timestamp');

class Metrics {

  constructor(interval = 1500) {
    this.interval = interval;
  }

  init() {
    this.initProfiler();
    this.initMetric()
  }

  initMetric() {
    setInterval(()=> {
      this.sendMetric({})
    }, this.interval)
  }

  initProfiler() {
    profiler.on('gc', info => {
      if (info.type) this.sendMetric({gc: info})
    });
  }

  sendMetric({gc = undefined, event = undefined}) {
    this.getCPU((err, cpu)=> {
      if (err) return console.error('Error Occurred when getting cpu usage...', err);
      io.emit('stat', {
        _id: shortId.generate(),
        timestamp: timestamp(),
        memory: this.getMemory(),
        cpu: cpu,
        gc: gc,
        event: event
      })

    });
  }

  getMemory() {
    var memory = process.memoryUsage();
    return {
      rss: memory.rss / 1048576,
      heapUsed: memory.heapUsed / 1048576,
      heapTotal: memory.heapTotal / 1048576
    };
  }

  getCPU(done) {
    pidusage(process.pid, (err, stat) => {
      if (done) return done(err, stat.cpu);
    })
  }


}

module.exports = new Metrics();
