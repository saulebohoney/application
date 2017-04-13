const apikey = 'a7afa68d4dc2512e1d7bcdf7a20c5a73';
const endpointURL = "http://api.openweathermap.org/data/2.5/forecast/daily";


$(function(){
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth()+1;
  function getData(userInput, userCnt, userUnits, callback){
    const query={
      zip: `${userInput},US`,
      apikey:apikey,
      cnt:userCnt,
      mode:'json',
      units:userUnits
    }

    $.getJSON(endpointURL, query, callback);
  }
  function showData(data){
    let title = data.city.name;
    let dataHTML = ``;
    console.log(data);
    let currentDate=dd;

    data.list.map(function(obj){
      dataHTML += '<h1>'+mm+'/'+currentDate+'</h1><ul><li>'+'Day time temperature: ' +obj.temp.day+'</li><br><li>'+obj.weather[0].main+'</li></ul>';
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
    getData(userInput, userCnt, userUnits, showData);
    console.log(today);
  })

//Render function
// getData(showData);
})
//object.list[0] = today
//list[0].temp.day = today's day temp


//obj.list.weather[0].description
