// Totally perosnal preference, but having all of your app-wide variables at the top makes for more readable code
const appState = {
	endpointURL: 'http://api.openweathermap.org/data/2.5/forecast/daily',
	cityObj: {},
	query: {
		apikey: 'a7afa68d4dc2512e1d7bcdf7a20c5a73',
		cnt: '',
		mode: 'json',
		units: ''
	}
};
//Consider renaming some of these variables. maybe something like 'currentDate' instead of 'dd'. When you reference the variables later in the app, it maybe be hard to figure out what 'dd' does.
const today = new Date();
const dd = today.getDate();
const mm = today.getMonth() + 1;
let userUnitSelection = '';

//numerical input -if the text box has a number > 1 (so that we can run our if statement below and check for one type of invalid numerical in one step),
// we assume it is a zip code, pass zip info into appState.query.zip, formating our query
//char input - autocomplete listener - on three chars entered, query geobytes autocomplete API for 13 results. on click of item from the queried list,
// run a new query for city-specific details API from geobytes. pass lat/lon into appState.cityObj, to be formatted in getData
//on Submit -> pass user input variables into getData, parse input, run some logic to finalize query, query openweather API for results, display results
//-------since the openweather API and the geobytes APi sometimes identify the same lat/lon as different places, if we auto complete, we pull the name
//-------from geobytes,
//--------if zip, we pull name from openweather object.
//$(document).ready(function)

//getting our date, setting an empty string fo rglobal scope on userUnitSelection

function resetState() {
	appState.cityObj = {};
	appState.query.cnt = '';
	if (appState.query.lon) {
		delete appState.query.lon;
		delete appState.query.lat;
	}
	if (appState.query.zip) {
		delete appState.query.zip;
	}
}


function getData(userInput, userCnt, userUnits, callback) {
    //check what units they picked and set a string to print with our HTML

    //careful here. having Kelvin be your fallback case for everything might be dangerous. This code is essentially saying that if NONE of the first 2 cases run, then it's gotta be Kelvin. Any errors or logical flaws would cause you to automatically output in the most obscure temp measurement of the 3.

	if (appState.query.units === 'imperial') {
		userUnitSelection = ' F';
	} else if (appState.query.units === 'metric') {
		userUnitSelection = ' C';
	} else {
		userUnitSelection = ' K';
	}
	if (parseInt(userInput) > 1) {
		appState.query.zip = `${userInput},US`;
	} else {
		appState.query.lon = `${appState.cityObj.geobyteslongitude}`;
		appState.query.lat = `${appState.cityObj.geobyteslatitude}`;
	}
	$.getJSON(appState.endpointURL, appState.query, callback);

}
// get JSON works because it calls 'callback' which is passed into getData as showData(line 61).
//when showData is called as the callback on $.getJSON (line 37), showData is called with the object we got from the API set to (data) in the function.
//we can then manipulate the manipulate the object as 'data' in showData
function showData(data) {
    //consider renaming your variables like 'x'. the more descriptive you can be, the better. Especially when you're dealing with things like coordinates, 'x' could mean any number of things
	let x = $('#search-box').val();
	let title = '';
	if (appState.cityObj.geobytesipaddress === x) {
		title = $('#search-box').val();
	} else {
		title = data.city.name;
	}
	let dataHTML = '';
	let currentDate = dd;
	data.list.map(function(obj) {
		dataHTML += '<h1>' + mm + '/' + currentDate + '</h1><ul><li>' + 'Day time temperature: ' + obj.temp.day + userUnitSelection + '</li><br><li>' + obj.weather[0].main + '</li></ul>';
		currentDate++;
	});
	$('.js-titleContainer').append(`<h1>${title}</h1>`);
	$('.js-container').append(dataHTML);
	resetState();

}
//}

// Make sure that your document ready function only includes the functions that are dependent on a loaded doc such as "on" events

//For some reason I can't make multiple requests to the API for the same city without refreshing the page. I get a 'Failed to load resource: the server responded with a status of 400 (Bad Request)'. This may have something to do with the resetState function. Maybe check to make sure you're NOT resetting the value of input if it's the same.

$(function() {
	$('.search-form').submit(function(event) {
        //prevent default should always go at the top
		event.preventDefault();
		$('.js-container').empty();
		$('.js-titleContainer').empty();
		appState.userInput = $('#search-box').val();
		appState.query.cnt = $('#cntSelector').val();
		appState.query.units = $('#unitSelector').val();
        //get all input values, pass into getData
		getData(appState.userInput, appState.query.cnt, appState.query.units, showData);
	});
    //Search box auto complete function complete with API query and return to box
	$('#search-box').autocomplete({
		source: function(request, response) {
			$.getJSON('http://gd.geobytes.com/AutoCompleteCity?callback=?&q=' + request.term,
                function(data) {
	response(data);
}
            );
		},
		minLength: 3,
		select: function(event, ui) {
			var selectedObj = ui.item;
			$('#search-box').val(selectedObj.value);
			getcitydetails(selectedObj.value);

		},
		open: function() {
			$(this).removeClass('ui-corner-all').addClass('ui-corner-top');
		},
		close: function() {
			$(this).removeClass('ui-corner-top').addClass('ui-corner-all');
		}
	});
	$('#search-box').autocomplete('option', 'delay', 100);

	function getcitydetails(fqcn) {
		if (typeof fqcn === 'undefined') fqcn = jQuery('#search-box').val();
		cityfqcn = fqcn;
		if (cityfqcn) {
			jQuery.getJSON(
                'http://gd.geobytes.com/GetCityDetails?callback=?&fqcn=' + cityfqcn,
                function(data) {
	appState.cityObj = data;
});
		}
	}

});
