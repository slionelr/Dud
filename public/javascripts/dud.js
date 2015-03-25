$(document).ready(function(){
    var state = JSON.parse($('#state').val());
    console.log('Current switch state is: ' + state);

    $('#switch').click(function() {
        var toState = !state;
        console.log(toState);

        $.ajax({
            type: 'POST',
            url: window.location.href + '/click',
            data: "{ \"changeTo\": " + toState + " }",
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function(data) {
                // TODO: Logic
                console.log(data);

                var changedTo = data.state;
                state = changedTo;
            },
        });
    });
});
