var express = require('express');
var router = express.Router();

var pinNumber = 4;
var dud = require('../peripherals/hw/switches').createSwitch(pinNumber);

router.get('/', function(req, res, next) {
    res.render('dud', { state: dud.getState() });
});

router.post('/click', function(req, res, next) {
    var changeTo = req.body.changeTo;
    console.log("Recived click for changing the Dud to: " + changeTo);

    var success = false;
    if (changeTo) {
        success = dud.turnOn();
    } else {
        success = dud.turnOff();
    }

    var state = dud.getState();
    
    res.json({ isSuccess: success, state: state });
});

router.getDud = function () {
    return dud;
}

module.exports = router;
