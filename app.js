

const apiKey = "30fc95645dc68e285ad9645a701aab6b";
const cityInput=document.getElementById("cityInput");
const weatherResult=document.getElementById("weatherResult");
const forecastSection=document.getElementById("forecast");
const button=document.querySelector("button");
const locationBtn=document.getElementById("locationBtn");


//When the button is clicked.
locationBtn.addEventListener("click",function(){
  if(navigator.geolocation){
    //to get users current location
    navigator.geolocation.getCurrentPosition(
      function(position){
        //getting latitude and lomgitude
        const latitude= position.coords.latitude;
        const longitude= position.coords.longitude;

        //Calling function to fetch weather using these coordinates
        getWeatherByCoords(latitude, longitude);
      },
      function(error){
        //if the user denies or it fails, this message will be dispplayed.
        weatherResult.innerHTML= "<p class='text-red-600'>Location access denied.</p>";
      }
    );
  } else{
    //when geolocation is not supported, this message will be displayed
    weatherResult.innerHTML="<p class='text-red-600'>Geolocation is not supported by your browser.</p>";
  }

});



//Adding a click event listener to the button
button.addEventListener("click",function(){
  const city= cityInput.value.trim();  //Getting the entered city
  if(city !==""){
    getWeather(city); // if city is not empty, this function will be called.
  }
})


function getWeather(city){
  const weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";
  const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=metric";

  weatherResult.innerHTML= "<p>Loading Weather Data!...</p>";
  forecastSection.innerHTML= "";

  //Fetching current weather
  fetch(weatherURL)
  .then(function(response){
    return response.json();
  })
  .then(function(data){
    if (data.cod=== 200){
      // Displaying weather info
      weatherResult.innerHTML= "<h2 class='text-2xl font-semibold'>"+ data.name + ", "+ data.sys.country+ "</h2>"+
      "<p>"+ data.weather[0].main+ "-" + data.weather[0].description+ "</p>"+
      "<p> \uD83C\uDF21 Temp: "+ data.main.temp+ "°C</p>"+
      "<p>💧 Humidity: " + data.main.humidity + "%</p>";
    } else{
      weatherResult.innerHTML="<p class='text-red-600'>City not found.Please try again.</p>";
    }  
  });

  //Fetching 5-Days Forecaste
  fetch(forecastURL)
  .then(function(response){
    return response.json();
  })
  .then(function(forecastData){
    // Filtering forecasts to one per day at 12PM
    const dailyForecasts= forecastData.list.filter(function(item){
      return item.dt_txt.includes("12:00:00");
    });

    forecastSection.innerHTML="";

    // Loop through first 5 days and creating forecast cards
    for(let i= 0; i< 5 && i< dailyForecasts.length;i++){
      const day= dailyForecasts[i];
      const date= new Date(day.dt_txt);
      const weekday= date.toLocaleDateString(undefined,{ weekday: "short"});

      const forecastCard= "<div class= 'bg-blue-100 rounded-x1 p-4 text-sm text-center shadow w-full'>"+ "<p class='font-medium'>" + weekday + "</p>"+
      "<img class='mx-auto' src='https://openweathermap.org/img/wn/"+day.weather[0].icon + "@2x.png' alt='" + day.weather[0].description + "'/>" + 
     "<p>"+ day.main.temp.toFixed(1)+ "°C</p>"+ "<p class='capitalize'>"+ day.weather[0].description+ "</p>"+ "</div>";

      forecastSection.innerHTML+= forecastCard;
    }
  });
}





//getting weather using user's latitude and longitude.

function getWeatherByCoords(lat, lon){
  //URLs for current weather and 5-day forecast
  const weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat="+ lat+ "&lon="+ lon+ "&appid="+ apiKey+ "&units=metric";
  const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?lat="+ lat+ "&lon="+ lon+ "&appid="+ apiKey+ "&units=metric";

  weatherResult.innerHTML= "<p>Loading weather data...</p>";
  forecastSection.innerHTML= "";

  //Fetching Current Weather.
  fetch(weatherURL)
    .then(function(response){
    return response.json(); // Converting the response into JSON
  })
  .then(function(data){
    //If request is successful(code 200)
    if(data.cod === 200){
      // Showing weather details in the result area
      weatherResult.innerHTML=
      "<h2 class='text-2xl font-semibold'>"+ data.name+", "+ data.sys.country+ "</h2>"+
      "<p class='text-sm text-gray-500'>📍 Coordinates:"+ lat.toFixed(2)+", "+ lon.toFixed(2)+ "</p>"+
      "<p>"+ data.weather[0].main+ "-"+ data.weather[0].description+ "</p>"+
      "<p>🌡 Temp: "+ data.main.temp+ "°C</p>"+
      "<p>💧 Humidity:"+ data.main.humidity+ "%</p>";

    }else{
      // Show error if something went wrong
      weatherResult.innerHTML = "<p class='text-red-600'>Unable to fetch weather from location.</p>";
    }
  });

  // ===== Get 5-Day Forecast =====
  fetch(forecastURL)
  .then(function(response){
    return response.json(); // Converting response to JSON
  })
  .then(function(forecastData){
    //it will keep only one forecast per day at 12pm.
    const dailyForecasts= forecastData.list.filter(function(item){
      return item.dt_txt.includes("12:00:00");
    });

    forecastSection.innerHTML = ""; // It Clears previous forecast

    //Loop through the next 5 days and create forecast cards
    for (let i= 0; i<5 && i< dailyForecasts.length; i++){
      const day = dailyForecasts[i];
      const date = new Date(day.dt_txt);
      const weekday = date.toLocaleDateString(undefined,{ weekday:"short"});

      const forecastCard= "<div class='bg-blue-50 backdrop-blur-sm rounded-xl p-4 text-sm text-center shadow w-full border border-blue-200 hover:scale-105 transition-transform duration-300'>"+
      "<p class='font-medium'>"+ weekday+ "</p>"+
      "<img class='mx-auto' src='https://openweathermap.org/img/wn/" + day.weather[0].icon+ "@2x.png' alt='"+ day.weather[0].description + "' />"+
      "<p>" + day.main.temp.toFixed(1)+ "°C</p>" +
      "<p class='capitalize'>"+ day.weather[0].description+"</p>" +
      "</div>";

      //Adding this forecast card to the forecast section
      forecastSection.innerHTML += forecastCard;
    }
  });

}


