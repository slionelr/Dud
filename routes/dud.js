var express = require('express');
var router = express.Router();

var pinNumber = 1;
var dud = require('../peripherals/hw/switches').createSwitch(pinNumber);

router.get('/', function(req, res, next) {
    res.render('dud', { state: dud.getState() });
});

router.post('/turnOn', function(req, res, next) {
    var success = dud.turnOn();
    var state = dud.getState();
    
    res.json({ isSuccess: success, state: state });
});

router.post('/turnOff', function(req, res, next) {
    var success = dud.turnOff();
    var state = dud.getState();
    
    res.json({ isSuccess: success, state: state });
});

module.exports = router;