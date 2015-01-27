var gpio = require('rpi-gpio');

function Switches() {
    this.createSwitch = function(number) {
        return new Switch(number);
    }
}


function Switch(pin) {
    this.sw = this;
    this.pin = pin;
    
    //TODO: DELETE THIS FAKE STATE VAR FROM ALL FUNCS
    this.s;
    
    this.init = function() {
        console.log('INIT switch: ' + this.pin);
        s = false;
    };
    
    this.turnOn = function() {
        s = true;
        console.log('Switch ['+this.pin+']: is turned ON.');
        
        return true;
    };
    
    this.turnOff = function() {
        s = false;
        console.log('Switch ['+this.pin+']: is turned OFF.');
        
        return true;
    };
    
    this.getState = function() {
//        TODO: Get the state from gpio
        return s;
    }
    
    this.destroy = function() {
        console.log('DESTROY switch: ' + this.pin);
    }
    
    this.init();
}

module.exports = new Switches;