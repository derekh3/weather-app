let weatherTodayData = null;
let weather5DayData = null;
async function openPromise(location) {
  try {
    dataPromise = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=313a3a7aec6418d32f93d9f3924adc85`,
      {
        mode: "cors",
      }
    );

    const data = await dataPromise.json();
    weatherTodayData = data;
    return data;
  } catch (error) {
    console.log(error);
    if (error.cod === "404") {
      return error;
    }
  }
}

async function open5DayPromise(lat, lon) {
  try {
    dataPromise2 = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=313a3a7aec6418d32f93d9f3924adc85`,
      {
        mode: "cors",
      }
    );

    const data2 = await dataPromise2.json();
    weather5DayData = data2;
    return data2;
  } catch (error) {
    console.log(error);
    if (error.cod === "404") {
      return error;
    }
  }
}

const unpackData = (() => {
  const unpackStringArg = (dataObject, stringArray) => {
    let currentObject = dataObject;
    let i = 0;
    let currentString = "data";
    while (i < stringArray.length) {
      currentObject = currentObject[stringArray[i]];
      currentString = stringArray[i];
      i++;
    }
    let returnObject = {};
    returnObject[currentString] = currentObject;
    return returnObject;
  };
  return { unpackStringArg };
})();

const DOMController = ((doc) => {
  let searchButton = doc.querySelector(".submit-search");
  let searchField = doc.querySelector("#search-location");
  searchButton.onclick = () => {
    let textSubcontainers = doc.querySelectorAll(".subcontainer-text");
    textSubcontainers.forEach((subcontainer) => {
      subcontainer.innerHTML = "";
    });
    let forecastContainer = doc.querySelector(".five-day-forecast-container");
    forecastContainer.innerHTML = "";
    loadPage(searchField.value);

    let errorMessage = doc.querySelector(".error-message");
    errorMessage.remove();
  };

  // program to convert first letter of a string to uppercase
  const capitalizeFirstLetter = (str) => {
    // converting first letter to uppercase
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

    return capitalized;
  };

  const errorLocationNotFound = () => {
    let weatherContainer = doc.querySelector(".weather-container");
    let errorMessage = doc.createElement("div");
    errorMessage.classList.add("error-message");
    errorMessage.textContent = "Location not found";
    weatherContainer.appendChild(errorMessage);
  };

  const addName = (container, weatherData = weatherTodayData) => {
    let nameText = doc.createElement("div");
    let nameDataObject = unpackData.unpackStringArg(weatherData, ["name"]);
    let name = nameDataObject["name"];

    nameText.textContent = `${name}`;
    container.appendChild(nameText);
  };

  const addDateTime = (container, weatherData = weatherTodayData) => {
    let dateTimeText = doc.createElement("div");
    let dateTime = weatherData.dt_txt;

    let dateObject = new Date(Date.parse(dateTime));
    let dayOfWeek = dateTimeModule.days[dateObject.getDay()];
    let dayOfMonth = dateObject.getDate();
    let month = dateTimeModule.months[dateObject.getMonth()];
    let hours = dateObject.getHours();
    let minutes = dateObject.getMinutes();

    dateTimeText.textContent = `${dayOfWeek}`;
    // dateTimeText.textContent = `${dayOfWeek}, ${month} ${dayOfMonth}`;
    container.appendChild(dateTimeText);
  };

  const addIcon = (container, weatherData = weatherTodayData) => {
    let icon = doc.createElement("img");
    let iconID = weatherData.weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconID + ".png";
    icon.setAttribute("src", iconurl);

    container.appendChild(icon);
  };

  const addDescription = (container, weatherData = weatherTodayData) => {
    let descriptionText = doc.createElement("div");
    let description = weatherData.weather[0].description;
    let descriptionCapitalized = capitalizeFirstLetter(description);
    descriptionText.textContent = `${descriptionCapitalized}`;
    container.appendChild(descriptionText);
  };

  const addTemperature = (
    container,
    decimalPlaces = 2,
    weatherData = weatherTodayData
  ) => {
    let temperatureText = doc.createElement("div");
    let temperatureDataObject = unpackData.unpackStringArg(weatherData, [
      "main",
      "temp",
    ]);
    let temperatureFahrenheit =
      (temperatureDataObject["temp"] - 273.15) * (9.0 / 5.0) + 32;

    temperatureText.textContent = `${temperatureFahrenheit.toFixed(
      decimalPlaces
    )} \u00B0F`;
    container.appendChild(temperatureText);
  };

  const addHumidity = (container, weatherData = weatherTodayData) => {
    let humidityText = doc.createElement("div");
    let humidityDataObject = unpackData.unpackStringArg(weatherData, [
      "main",
      "humidity",
    ]);
    let humidity = humidityDataObject["humidity"];

    humidityText.textContent = `Humidity: ${humidity.toFixed(0)} %`;
    container.appendChild(humidityText);
  };

  const addCloudiness = (container, weatherData = weatherTodayData) => {
    let cloudinessText = doc.createElement("div");
    let cloudinessDataObject = unpackData.unpackStringArg(weatherData, [
      "clouds",
      "all",
    ]);
    let cloudiness = cloudinessDataObject["all"];

    cloudinessText.textContent = `Cloudiness: ${cloudiness.toFixed(0)} %`;
    container.appendChild(cloudinessText);
  };

  const initialize5DayForecast = (container) => {
    for (let i = 0; i < 5; i++) {
      let newSubcontainer = doc.createElement("div");
      newSubcontainer.classList.add(`five-day-subcontainer`);
      newSubcontainer.classList.add(`day-${i}`);

      let dateTimeField = doc.createElement("div");
      dateTimeField.classList.add(`five-day-dateTime-${i}`);
      dateTimeField.classList.add(`five-day-dateTime-field`);
      newSubcontainer.appendChild(dateTimeField);

      let descriptionField = doc.createElement("div");
      descriptionField.classList.add(`five-day-description-${i}`);
      descriptionField.classList.add(`five-day-description-field`);

      newSubcontainer.appendChild(descriptionField);

      let temperatureField = doc.createElement("div");
      temperatureField.classList.add(`five-day-temperature-${i}`);
      temperatureField.classList.add(`five-day-temperature-field`);

      newSubcontainer.appendChild(temperatureField);

      let iconField = doc.createElement("div");
      iconField.classList.add(`five-day-icon-${i}`);
      iconField.classList.add(`five-day-icon-field`);
      newSubcontainer.appendChild(iconField);

      container.appendChild(newSubcontainer);
    }
  };

  return {
    addName,
    addDateTime,
    addIcon,
    addDescription,
    addTemperature,
    addHumidity,
    addCloudiness,
    errorLocationNotFound,
    initialize5DayForecast,
  };
})(document);

const dateTimeModule = (() => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return { months, days };
})();

// openPromise().then((result) => {
//   weatherData = result;
// });
async function loadPage(location = "London") {
  let promise = await openPromise(location);

  console.log("HERE");
  console.log(promise.cod);
  if (promise.cod === 200) {
    //call the 5 day weather API
    let latitude = weatherTodayData.coord.lat;
    let longitude = weatherTodayData.coord.lon;
    let promise5Day = await open5DayPromise(latitude, longitude);
    console.log(weather5DayData);

    //load the data for today's weather
    let nameContainer = document.querySelector(".name-text");
    let iconContainer = document.querySelector(".icon-subcontainer");
    let descriptionContainer = document.querySelector(".description-text");
    let temperatureContainer = document.querySelector(".temperature-text");
    let humidityContainer = document.querySelector(".humidity-text");
    let cloudinessContainer = document.querySelector(".cloudiness-text");
    DOMController.addName(nameContainer, weatherTodayData);
    DOMController.addIcon(iconContainer);
    DOMController.addDescription(descriptionContainer);
    DOMController.addTemperature(temperatureContainer);
    DOMController.addHumidity(humidityContainer);
    DOMController.addCloudiness(cloudinessContainer);

    //load the data for 5 day weather forecast
    let forecastContainer = document.querySelector(
      ".five-day-forecast-container"
    );

    let weather5DayDataArray = [];
    for (let i = 0; i < 5; i++) {
      weather5DayDataArray.push(weather5DayData.list[(i + 1) * 8 - 1]);
    }
    console.log(weather5DayDataArray);
    DOMController.initialize5DayForecast(forecastContainer);

    for (let i = 0; i < 5; i++) {
      let dateTimeContainer = document.querySelector(`.five-day-dateTime-${i}`);
      DOMController.addDateTime(dateTimeContainer, weather5DayDataArray[i]);

      let iconContainer = document.querySelector(`.five-day-icon-${i}`);
      DOMController.addIcon(iconContainer, weather5DayDataArray[i]);

      let descriptionContainer = document.querySelector(
        `.five-day-description-${i}`
      );
      DOMController.addDescription(
        descriptionContainer,
        weather5DayDataArray[i]
      );

      let temperatureContainer = document.querySelector(
        `.five-day-temperature-${i}`
      );
      DOMController.addTemperature(
        temperatureContainer,
        0,
        weather5DayDataArray[i]
      );
    }
  } else {
    DOMController.errorLocationNotFound();
  }
}

loadPage();
