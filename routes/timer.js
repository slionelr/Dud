var express = require('express'),
    moment = require('moment'),
    scheduler = require('node-schedule'),
    later = require('later');

var router = express.Router();
var self = this;

var dud;
var sched;

router.init = function (sw) {
    dud = sw;
    sched = {
        timer: 0,
        on: {
            start: null,
            isTriggered: false,
            timer: null
        },
        off: {
            end: null,
            isTriggered: false,
            timer: null
        }
    };
}

self.setNewTime = function (startDate, timer) {
    console.log("DEBUG: setNewTime(), startDate=" + startDate + ", timer=" + timer);

    // if (startDate) {
    //     startDate = new Date(startDate);
    // } else {
    //     startDate = new Date;
    // }
    sched.timer = timer;
    sched.on.start = moment(startDate).add(1, 'm').toDate();
    sched.off.end = moment(sched.on.start).add(timer, 'm').toDate();
    checkDate = moment().subtract(timer, 'm');

    // Check if the date is in the past.
    if (checkDate.isAfter(moment(sched.on.start))) {
        console.log("DEBUG: Recvied a date that already passed.");
        return false;
    }

    // TODO: Check if there are already timers in action. - cancel them

    sched.on.timer = scheduler.scheduleJob(sched.on.start, function () {
        sched.on.isTriggered = true;
        self.turnOn();
    });
    console.log("DEBUG: timer param: " + timer);

    // Set the time for turrning the dud ON
    console.log("TIMER# Set the date for turrning on: " + startDate);
    sched.off.timer = scheduler.scheduleJob(sched.off.end, function () {
        sched.off.isTriggered = true;
        self.turnOff();
    });

    return true;
}

self.turnOn = function () {
    console.log("TIMER# Turned [ON] the dud.");
    return dud.turnOn();
}

self.turnOff = function () {
    console.log("TIMER# Turned [OFF] the dud.");
    return dud.turnOff();
}

self.emergencyStop = function () {
    console.log("TIMER# Beggin emergency turning off {at: " + (new Date) + "}");

    // Check if there is no "on" timer functionning right now.
    if (!sched.on.isTriggered) {
        // Cancel the scheduler
        sched.on.timer.cancel();
        console.log("TIMER# Canceling the scheduler of 'turn on'");
    }
    console.log("TIMER# There is 'STARTED' job");

    // Check if the turn off scheduler was triggered
    if (!sched.off.isTriggered) {
        sched.off.timer.cancel();
        console.log("TIMER# Canceling the scheduler of 'turn off'");
    }

    // Turn off the dud if its on
    return turnOff();
}

/* GET the times */
router.get('/get', function(req, res, next) {
    res.send({ "timer": sched.timer, "sched": { "onDate": sched.on.start, "offDate": sched.off.end }});
});

router.post('/set', function(req, res, next) {
    var interval = req.body.interval;
    var toDate = Date.now();
    
    var success = self.setNewTime(toDate, interval);

    // TODO: The ability to change the turn off time

    res.send({ "success": success, "sched": { "onDate": sched.on.start, "offDate": sched.off.end } });
});

router.post('/stop', function(req, res, next) {
    res.send(emergencyStop());
});

module.exports = router;
