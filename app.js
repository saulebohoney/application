const apikey = 'a7afa68d4dc2512e1d7bcdf7a20c5a73';
const endpointURL = "http://api.openweathermap.org/data/2.5/forecast/daily";


$(function(){
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth()+1;
  let userUnitSelection = '';

  function getData(userInput, userCnt, callback){
    let userUnits=$('#unitSelector').val();
    if (userUnits == 'imperial'){
      userUnitSelection = ' F';
    } else if (userUnits =='metric'){
      userUnitSelection = ' C';
    } else{
      userUnitSelection = ' K';
    }

    const query={
      // zip: `${userInput},US`,
      apikey:apikey,
      cnt:userCnt,
      mode:'json',
      units:userUnits
    }
    switch (userInput){
      case typeof userInput == 'number':
        query.zip =`${userInput},US`
        break;
      default:
        query.q=`${userInput},US`
        break;
    }
    $.getJSON(endpointURL, query, callback);
  }
  function showData(data){
    let title = data.city.name;
    let dataHTML = ``;
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

    getData(userInput, userCnt, showData);
    console.log(today);
  })

  // if (userUnits == 'imperial'){
  //   let userUnitSelection = ' F';
  // } else if (userUnits =='metric'){
  //   let userUnitSelection = ' C';
  // } else{
  //   let userUnitSelection = ' K';
  // }


// getData(showData);
})
//object.list[0] = today
//list[0].temp.day = today's day temp


//obj.list.weather[0].description
