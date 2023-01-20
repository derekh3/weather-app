console.log("test");
async function openPromise() {
  dataPromise = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=London&APPID=313a3a7aec6418d32f93d9f3924adc85",
    {
      mode: "cors",
    }
  );

  const data = await dataPromise.json();
  console.log(data);
}

openPromise();
