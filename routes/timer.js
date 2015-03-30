var express = require('express');
var later = require('later');

var router = express.Router();

var dud;
var sched;

router.init = function (sw) {
    dud = sw;
    sched = {
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

function setNewTime(startDate, timer) {
    console.log("DEBUG: setNewTime(), startDate=" + startDate + ", timer=" + timer);

    startDate = new Date(startDate);

    // Check if the date is in the past.
    if (startDate <= (new Date().setMilliseconds(1000))) {
        console.log("DEBUG: Recvied a date that already passed.");
        return false;
    }

    // TODO: Check if there are already timers in action. - cancel them

    var time = later.parse.recur().on(startDate).fullDate();
    console.log("DEBUG: later.time: " + JSON.stringify(time));
    console.log("DEBUG: timer param: " + timer);

    // Set the time for turrning the dud ON
    console.log("TIMER# Set the date for turrning on: " + startDate);
    sched.on.isTriggered = false;
    sched.on.timer = later.setTimeout(function () {
        sched.on.isTriggered = true;
        turnOn(timer);
    }, time);
    sched.on.start = startDate;
    // Set the timeout interval
    sched.off.end = timer;

    console.log("TIMER# The SCHEDULE setted: " + JSON.stringify(sched.on));

    return true;
}

function turnOn() {
    console.log("TIMER# Turned [ON] the dud by timer {later}");
    dud.turnOn();

    // Set timer parameters for turrning the dud OFF
    sched.off.isTriggered = false;
    sched.off.timer = setTimeout(function () {
        sched.off.isTriggered = true;
        turnOff();
    }, sched.off.end);
}

function turnOff() {
    console.log("TIMER# Beggin turning off {at: " + new Date() + "}");
    console.log("TIMER# Object:'Sched':: " + JSON.stringify(sched));

    console.log("TIMER# Turned [OFF] the dud by timer {buildin}");
    dud.turnOff();
}

function emergencyStop() {
    var ret = null;

    console.log("TIMER# Beggin emergency turning off {at: " + new Date() + "}");

    // Check if there is no "on" timer functionning right now.
    if (!sched.on.isTriggered) {
        // Clear the "on" timer
        sched.on.timer.clear();
        console.log("TIMER# Deleting the 'START' job {later}");
    }
    console.log("TIMER# There is 'STARTED' job {later}");

    // Check if there is "off" timer functionning right now.
    if (sched.off.isTriggered) {
        // There is an end job
        console.log("TIMER# The is 'OFF' job {buildin}");
    } else {
        // Clear the "off" timer
        console.log("TIMER# Deleting the 'OFF' job {buildin}");
        ret = clearTimeout(sched.off.timer);
    }

    // Turn off the dud if its on
    turnOff();

    return ret;
}

/* GET the time left */
router.get('/', function(req, res, next) {
    var offDate = new Date(sched.on.start);
    offDate.setMilliseconds(sched.off.end);
    res.send({ "sched": { "onDate": sched.on.start, "offDate": offDate } });
});

router.post('/set', function(req, res, next) {
    var toDate = req.body.date;
    var toTime = req.body.time;

    var success = setNewTime(toDate, toTime);

    var offDate = new Date(sched.on.start);
    offDate.setMilliseconds(sched.off.end);

    res.send({ "success": success, "sched": { "onDate": sched.on.start, "offDate": offDate } });
});

module.exports = router;
