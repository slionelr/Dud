var express = require('express');
var router = express.Router();

var getStateFunc;
var clickFunc;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('button', { buttonState: getStateFunc() });
});

router.post('/click', function(req, res, next) {
//    TODO: LOGIC HERE
    var action = clickFunc();
    
    res.json({ isSuccess: action.success, state: action.state });
});

module.exports = function(click, getState) {
    // Set variables
    getStateFunc = getState;
    clickFunc = click;
    
    // Return router
    return router;
};