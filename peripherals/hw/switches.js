//var Gpio = require('onoff').Gpio;
var Gpio = require('../../mock/onoff').Gpio;

function Switches() {
    this.createSwitch = function (number) {
        return new Switch(number);
    }
}


function Switch(pin) {
    var sw = this;
    this.pin = pin;
    
    //TODO: DELETE THIS FAKE STATE VAR FROM ALL FUNCS
    this.s;
    this.gpio;
    
    this.init = function () {
        console.log('HW# INIT switch: ' + sw.pin);
        sw.gpio = new Gpio(sw.pin, 'out');
        sw.turnOff();
        console.log('HW# done "INIT" for switch: ' + sw.pin);
        sw.s = false;
    };
    
    this.turnOn = function () {
        sw.s = true;
        sw.gpio.write(1, sw.err);
        console.log('HW# switch [' + sw.pin + ']: is turned ON.');
        
        return true;
    };
    
    this.turnOff = function () {
        sw.s = false;
        sw.gpio.write(0, sw.err);
        console.log('HW# switch [' + sw.pin + ']: is turned OFF.');
        
        return true;
    };
    
    this.getState = function () {
        //        TODO: Get the state from gpio
        return sw.s;
    }
    
    this.destroy = function () {
        console.log('HW# DESTROY switch: ' + sw.pin);
    }
    
    this.err = function (e) {
        if (e != null) {
            console.log('HW# ERROR Pin ' + sw.pin + ': ' + e);
        }
    }
    
    this.init();
}

module.exports = new Switches;
