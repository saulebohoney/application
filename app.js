const apikey = 'a7afa68d4dc2512e1d7bcdf7a20c5a73';
const endpointURL = "http://api.openweathermap.org/data/2.5/forecast/daily";

//$(document).ready(function)
$(function(){
  //getting our date, setting an empty string for global scope on userUnitSelection
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth()+1;
  let userUnitSelection = '';
//GetData is querry function
  function getData(userInput, userCnt, userUnits, callback){
    //check what units they picked and set a string to print with our HTML
    if (userUnits == 'imperial'){
      userUnitSelection = ' F';
    } else if (userUnits =='metric'){
      userUnitSelection = ' C';
    } else{
      userUnitSelection = ' K';
    }

    const query={
      apikey:apikey,
      cnt:userCnt,
      mode:'json',
      units:userUnits
    }
    //switch statement to detect if user input was a number, if it was add .zip property, if not, add q property for city search. US = country code
    switch (typeof userInput){
      case 'number':
        query.zip =`${userInput},US`
        break;
      default:
        query.q=`${userInput},US`
        break;
    }
    $.getJSON(endpointURL, query, callback);
  } // get JSON works because it calls 'callback' which is passed into getData as showData(line 61).
  //when showData is called as the callback on $.getJSON (line 37), showData is called with the object we got from the API set to (data) in the function.
  //we can then manipulate the manipulate the object as 'data' in showData
  function showData(data){
    let title = data.city.name;
    let dataHTML = '';
    console.log(data);
    let currentDate=dd;
    data.list.map(function(obj){
      dataHTML += '<h1>'+mm+'/'+currentDate+'</h1><ul><li>'+'Day time temperature: ' +obj.temp.day+userUnitSelection+'</li><br><li>'+obj.weather[0].main+'</li></ul>';
      currentDate++;
    })
    $('.js-titleContainer').append(`<h1>${title}</h1>`)
    $('.js-container').append(dataHTML);


  }
  $('.search-form').submit(function(event){
    $('.js-container').empty();
    $('.js-titleContainer').empty();
    event.preventDefault();
    let userInput = $('#search-box').val();
    let userCnt = $('#cntSelector').val();
    let userUnits=$('#unitSelector').val();
    //get all input values, pass into getData
    getData(userInput, userCnt, userUnits, showData);
    console.log(today);
  })

    $(function () 
 {
   $("#search-box").autocomplete({
    source: function (request, response) {
     $.getJSON(
      "http://gd.geobytes.com/AutoCompleteCity?callback=?&q="+request.term,
      function (data) {
       response(data);
      }
     );
    },
    minLength: 3,
    select: function (event, ui) {
     var selectedObj = ui.item;
     $("#search-box").val(selectedObj.value);
    getcitydetails(selectedObj.value);
     return false;
    },
    open: function () {
     $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
    },
    close: function () {
     $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
    }
   });
   $("#search-box").autocomplete("option", "delay", 100);
  });




})
