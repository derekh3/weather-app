let weatherData = null;
async function openPromise(location) {
  try {
    dataPromise = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=313a3a7aec6418d32f93d9f3924adc85`,
      {
        mode: "cors",
      }
    );

    const data = await dataPromise.json();
    weatherData = data;
    return data;
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
    loadPage(searchField.value);
  };

  const errorLocationNotFound = () => {
    let weatherContainer = doc.querySelector(".weather-container");
    let errorMessage = doc.createElement("div");
    errorMessage.textContent = "Location not found";
    weatherContainer.appendChild(errorMessage);
  };

  const addName = (container) => {
    let nameText = doc.createElement("div");
    let nameDataObject = unpackData.unpackStringArg(weatherData, ["name"]);
    let name = nameDataObject["name"];

    nameText.textContent = `${name}`;
    container.appendChild(nameText);
  };

  const addIcon = (container) => {
    let icon = doc.createElement("img");
    let iconID = weatherData.weather[0].icon;
    let iconurl = "http://openweathermap.org/img/w/" + iconID + ".png";
    icon.setAttribute("src", iconurl);

    container.appendChild(icon);
  };

  const addDescription = (container) => {
    let descriptionText = doc.createElement("div");
    let descriptionDataObject = weatherData.weather[0].description;
    let description = descriptionDataObject;
    descriptionText.textContent = `Description: ${description}`;
    container.appendChild(descriptionText);
  };

  const addTemperature = (container) => {
    let temperatureText = doc.createElement("div");
    let temperatureDataObject = unpackData.unpackStringArg(weatherData, [
      "main",
      "temp",
    ]);
    let temperatureFahrenheit =
      (temperatureDataObject["temp"] - 273.15) * (9.0 / 5.0) + 32;

    temperatureText.textContent = `Temperature: ${temperatureFahrenheit.toFixed(
      2
    )} \u00B0 F`;
    container.appendChild(temperatureText);
  };

  const addHumidity = (container) => {
    let humidityText = doc.createElement("div");
    let humidityDataObject = unpackData.unpackStringArg(weatherData, [
      "main",
      "humidity",
    ]);
    let humidity = humidityDataObject["humidity"];

    humidityText.textContent = `Humidity: ${humidity.toFixed(0)} %`;
    container.appendChild(humidityText);
  };

  const addCloudiness = (container) => {
    let cloudinessText = doc.createElement("div");
    let cloudinessDataObject = unpackData.unpackStringArg(weatherData, [
      "clouds",
      "all",
    ]);
    let cloudiness = cloudinessDataObject["all"];

    cloudinessText.textContent = `Cloudiness: ${cloudiness.toFixed(0)} %`;
    container.appendChild(cloudinessText);
  };

  return {
    addName,
    addIcon,
    addDescription,
    addTemperature,
    addHumidity,
    addCloudiness,
    errorLocationNotFound,
  };
})(document);

// openPromise().then((result) => {
//   weatherData = result;
// });
async function loadPage(location = "London") {
  let promise = await openPromise(location);
  console.log("HERE");
  console.log(promise.cod);
  console.log(weatherData);
  if (promise.cod !== "404") {
    let nameContainer = document.querySelector(".name-text");
    let iconContainer = document.querySelector(".icon-subcontainer");
    let descriptionContainer = document.querySelector(".description-text");
    let temperatureContainer = document.querySelector(".temperature-text");
    let humidityContainer = document.querySelector(".humidity-text");
    let cloudinessContainer = document.querySelector(".cloudiness-text");
    DOMController.addName(nameContainer);
    DOMController.addIcon(iconContainer);
    DOMController.addDescription(descriptionContainer);
    DOMController.addTemperature(temperatureContainer);
    DOMController.addHumidity(humidityContainer);
    DOMController.addCloudiness(cloudinessContainer);
  } else {
    DOMController.errorLocationNotFound();
  }
}

loadPage();
