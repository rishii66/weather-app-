const square = document.querySelector(".square");
inputPart = document.querySelector(".input-part");
infoText = document.querySelector(".info-text");
inputField = document.querySelector("input");
getLocationBtn = document.querySelector("button");
arrowBack = square.querySelector("header i");
weatherIcon = document.querySelector("weather-part img");

let api;
var apiKey = "00079facfdf69f218dd42e1d2c67ba54";

function requestApi(city) {
  api= `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fectchWeatherData();
}

function fectchWeatherData() {
  infoText.innerText = "Getting weather info...";
  infoText.classList.add("pending");
  //get server and return api response
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result));
}

function weatherDetails(info) {
  infoText.classList.replace("pending", "error");
  if (info.cod == "404") {
    infoText.innerText = `You entered ${inputField.value} which isn't a valid city`; //..checks for validation
  } else {
    //get api data to properties in info-text
    const city = info.name;
    const country = info.sys.country;
    const { description } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    //fill the above values into the html elements
    square.querySelector(".temp, .numb").innerText = Math.floor(temp); //..round up number to nearest Integer
    square.querySelector(".weather").innerHTML = description;
    square.querySelector(".location span").innerHTML = `${city}, ${country}`;
    square.querySelector(".temp .numb-2").innerHTML = Math.floor(feels_like);
    square.querySelector(".humidity span").innerHTML = `${humidity}%`;

    infoText.classList.remove("pending", "error");
    square.classList.add("active");
  }
}

getLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    //..if user's browser supports geolocation
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Browser doesn't support geolocation api");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  //..addded {&units=metric} to the api to round up the number
  fectchWeatherData();
}

function onError(error) {
  infoText.innerText = error.message; //..html text will display error message
  infoText.classList.add("error");
}

inputField.addEventListener("keyup", (e) => {
  //...if user pressed enter btn input value is not empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

arrowBack.addEventListener("click", () => {
  square.classList.remove("active");
});
