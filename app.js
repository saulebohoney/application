const apikey = 'a7afa68d4dc2512e1d7bcdf7a20c5a73';
const endpointURL = "api.openweathermap.org/data/2.5/forecast/daily";


$(function(){

  function getData(callback){
    const query={
      id:4699066,
      key:apikey,
      cnt:7
    }
    $.getJSON(endpointURL, query, callback);
  }
  function showData(data){
    console.log(data);

  }
getData(showData);
})
