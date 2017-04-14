const appState = {
    endpointURL: "http://api.openweathermap.org/data/2.5/forecast/daily",
    cityObj: {},
    query: {
        apikey: 'a7afa68d4dc2512e1d7bcdf7a20c5a73',
        cnt: '',
        mode: 'json',
        units: ''
    }
}



function resetState() {
  appState.cityObj = {};
  appState.query.cnt='';
  if (appState.query.lon){
    delete appState.query.lon;
    delete appState.query.lat;
  }if (appState.query.zip) {
    delete appState.query.zip;
  }
}

//numerical input -if the text box has a number > 1 (so that we can run our if statement below and check for one type of invalid numerical in one step),
// we assume it is a zip code, pass zip info into appState.query.zip, formating our query
//char input - autocomplete listener - on three chars entered, query geobytes autocomplete API for 13 results. on click of item from the queried list,
// run a new query for city-specific details API from geobytes. pass lat/lon into appState.cityObj, to be formatted in getData
//on Submit -> pass user input variables into getData, parse input, run some logic to finalize query, query openweather API for results, display results
//-------since the openweather API and the geobytes APi sometimes identify the same lat/lon as different places, if we auto complete, we pull the name 
//-------from geobytes,
//--------if zip, we pull name from openweather object.
//$(document).ready(function)
$(function() {
    //getting our date, setting an empty string fo rglobal scope on userUnitSelection
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    let userUnitSelection = '';

    function getData(userInput, userCnt, userUnits, callback) {
        //check what units they picked and set a string to print with our HTML
        if (appState.query.units == 'imperial') {
            userUnitSelection = ' F';
        } else if (appState.query.units == 'metric') {
            userUnitSelection = ' C';
        } else{
            userUnitSelection = ' K';
        }
        console.log(typeof userInput);
        if  (parseInt(userInput) > 1){
          appState.query.zip = `${userInput},US`
        } else{
          appState.query.lon = `${appState.cityObj.geobyteslongitude}`
          appState.query.lat = `${appState.cityObj.geobyteslatitude}`
        }
            $.getJSON(appState.endpointURL, appState.query, callback);

        }
     // get JSON works because it calls 'callback' which is passed into getData as showData(line 61).
    //when showData is called as the callback on $.getJSON (line 37), showData is called with the object we got from the API set to (data) in the function.
    //we can then manipulate the manipulate the object as 'data' in showData
    function showData(data) {
      let x = $('#search-box').val();
        let title = '';
        if (appState.cityObj.geobytesipaddress == x) {
            title = $('#search-box').val();
        } else {
            title = data.city.name;
        }

        let dataHTML = '';
        console.log(data);
        let currentDate = dd;
        data.list.map(function(obj) {
            dataHTML += '<h1>' + mm + '/' + currentDate + '</h1><ul><li>' + 'Day time temperature: ' + obj.temp.day + userUnitSelection + '</li><br><li>' + obj.weather[0].main + '</li></ul>';
            currentDate++;
        })
        $('.js-titleContainer').append(`<h1>${title}</h1>`)
        $('.js-container').append(dataHTML);
        resetState();

    }
//}
$('.search-form').submit(function(event) {
    $('.js-container').empty();
    $('.js-titleContainer').empty();
    event.preventDefault();
    appState.userInput = $('#search-box').val();
    appState.query.cnt = $('#cntSelector').val();
    appState.query.units = $('#unitSelector').val();
    //get all input values, pass into getData
    getData(appState.userInput, appState.query.cnt, appState.query.units, showData);
    console.log(today);
})
//Search box auto complete function complete with API query and return to box
$("#search-box").autocomplete({
    source: function(request, response) {
        $.getJSON(
            "http://gd.geobytes.com/AutoCompleteCity?callback=?&q=" + request.term,
            function(data) {
                response(data);
                console.log(data);
            }
        );
    },
    minLength: 3,
    select: function(event, ui) {
        var selectedObj = ui.item;
        console.log(selectedObj);
        $("#search-box").val(selectedObj.value);
        console.log(selectedObj.value);
        getcitydetails(selectedObj.value);
        console.log(appState.cityObj);

    },
    open: function() {
        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    },
    close: function() {
        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
    }
}); $("#search-box").autocomplete("option", "delay", 100);

function getcitydetails(fqcn) {

    if (typeof fqcn == "undefined") fqcn = jQuery("#search-box").val();

    cityfqcn = fqcn;

    if (cityfqcn) {

        jQuery.getJSON(
            "http://gd.geobytes.com/GetCityDetails?callback=?&fqcn=" + cityfqcn,
            function(data) {
                appState.cityObj = data;
            }
        );
    }
}

})
