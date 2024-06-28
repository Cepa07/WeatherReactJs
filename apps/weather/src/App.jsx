import { fetchData, url } from "./assets/js/api.js";
import * as module from "./assets/js/module.js";
import "./App.css";


const addEventOnElements = (elements, eventType, callback) => {
	for (const element of elements)
		element.addEventListener(eventType, callback);
};

const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);

const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", function () {
	searchTimeout ?? clearTimeout(searchTimeout);

	if (!searchField.value) {
		searchResult.classList.remove("active");
		searchResult.innerHTML = "";
		searchField.classList.remove("searching");
	} else {
		searchField.classList.add("searching");
	}

	if (searchField.value) {
		searchTimeout = setTimeout(() => {
			fetchData(url.geo(searchField.value), (locations) => {
				searchField.classList.remove("searching");
				searchResult.classList.add("active");
				searchResult.innerHTML = `
                    <ul class="view-list" data-search-list></ul>
                `;

				const items = [];

				for (const { name, lat, lon, country, state } of locations) {
					const searchItem = document.createElement("li");
					searchItem.classList.add("view-item");

					searchItem.innerHTML = `
                        <span class="m-icon">location_on</span>

                        <div>
                            <p class="item-title">${name}</p>
                            <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                        </div>

                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
                    `;

					searchResult.querySelector("[data-search-list]").appendChild(searchItem);
					items.push(searchItem.querySelector("[data-search-toggler]"));
				}

				addEventOnElements(items, "click", () => {
					toggleSearch();
					searchResult.classList.remove("active");
				})
			});
		}, searchTimeoutDuration);
	}
});





const  container = document.querySelector("[data-container]");
const  loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector("[data-current-location-btn]");
const errorContainer = document.querySelector("[data-error-content]");


export const updateWeather =function (lat ,lon ){
    loading.style.display= "grid";
    container.style.overflowY= "hidden";
    container.classList.remove("fade-in");
    errorContainer.style.display= "none";

    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
	const hourlySection = document.querySelector("[data-hourly-forecast]");
	const forecastSection = document.querySelector("[data-5-day-forecast]");

	currentWeatherSection.innerHTML = "";
	highlightSection.innerHTML = "";
	hourlySection.innerHTML = "";
	forecastSection.innerHTML = "";

    if (window.location.hash === "#/current-location") {
		currentLocationBtn.setAttribute("disabled", "");
	} else {
		currentLocationBtn.removeAttribute("disabled");
	}
      
       fetchData(url.currentWeather(lat, lon), function(currentWeather){
        const {
            weather,
            dt:dateUnix,
            sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
            main: { temp, feels_like, pressure, humidity },
			visibility,
			timezone
        }= currentWeather;
        const [{description,icon}] =weather;
        const card = document.createElement("div");
		card.classList.add("card", "card-lg", "current-weather-card");

		const mel = Math.floor(pressure * 0.75);

        card.innerHTML = `

        <h2 class="title-2 card-title">Сейчас</h2>
            <div class="weapper">
                <p class="heading">${parseInt(temp)}°c<sup></sup></p>
                <img src="./src/assets/images/weather_icons/${icon}.png" alt="${description}" width="64" height="64" class="weather-icon">
            </div>
            <p class="body-3">${description}</p>
            <ul class="meta-list">

                <li class="meta-item">
                    <span class="m-icon">calendar_today</span>
                       <p class="title-3 meta-text">${module.getDate(dateUnix,timezone)}</p>
                </li>
                <li class="meta-item">
                    <span class="m-icon">location_on</span>
                       <p class="title-3 meta-text" data-location></p>
                </li>
            </ul>
        
        `;

		fetchData(url.reverseGeo(lat, lon), function(data) {
			const name = data[0].local_names.ru;
			const country = data[0].country;
			card.querySelector("[data-location]").innerHTML = `${name}, ${country}`;
		});

        currentWeatherSection.appendChild(card);

  
		fetchData(url.airPollution(lat, lon), (airPollution) => {
			const [{
				
			}] = airPollution.list;

            const card = document.createElement("div");
			card.classList.add("card", "card-lg");

            card.innerHTML = `
				<h2 class="title-2" id="highlights-label">Основные события сегодняшнего дня</h2>


					<div class="card card-sm highlight-card two">
						<h3 class="title-3">Восход и закат солнца</h3>

						<div class="card-list">
							<div class="card-item">
								<span class="m-icon">clear_day</span>

								<div>
									<p class="label-1">Восход</p>
									<p class="title-1">${module.getTime(sunriseUnixUTC, timezone)}</p>
								</div>
							</div>

							<div class="card-item">
								<span class="m-icon">clear_night</span>

								<div>
									<p class="label-1">Закат</p>
									<p class="title-1">${module.getTime(sunsetUnixUTC, timezone)}</p>
								</div>
							</div>
						</div>
					</div>

					<div class="card card-sm highlight-card">
						<h3 class="title-3">Влажность</h3>

						<div class="wrapper">
							<span class="m-icon">humidity_percentage</span>

							<p class="title-1">${humidity}<sub>%</sub></p>
						</div>
					</div>

					<div class="card card-sm highlight-card">
						<h3 class="title-3">Давление</h3>

						<div class="wrapper">
							<span class="m-icon">airwave</span>

							<p class="title-1">${mel}<sub>mmHg</sub></p>
						</div>
					</div>

					<div class="card card-sm highlight-card">
						<h3 class="title-3">Видимость</h3>

						<div class="wrapper">
							<span class="m-icon">visibility</span>

							<p class="title-1">${visibility / 1000}<sub>km</sub></p>
						</div>
					</div>

					<div class="card card-sm highlight-card">
						<h3 class="title-3">Ощущается</h3>

						<div class="wrapper">
							<span class="m-icon">thermostat</span>

							<p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
						</div>
					</div>
				</div>
			`;

			highlightSection.appendChild(card)



         });

		fetchData(url.forecast(lat, lon), (forecast) => {
			const {
				list: forecastList,
				city : { timezone }
			} = forecast;

			hourlySection.innerHTML = `

            
				<h2 class="title-2">Сегодня в</h2>

				<div class="slider-container">
					<ul class="slider-list" data-temp></ul>

					<ul class="slider-list" data-wind></ul>
				</div>
			`;

            
			for (const [index, data] of forecastList.entries()) {

				if (index > 7) break;

				const {
					dt: dateTimeUnix,
					main : { temp },
					weather,
					wind : { deg: windDirection, speed: windSpeed }
				} = data;
				const [{ icon, description }] = weather;

				const tempLi = document.createElement("li");
				tempLi.classList.add("slider-item");

                tempLi.innerHTML = `
					<div class="card card-sm slider-card">
						<p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

						<img src="./src/assets/images/weather_icons/${icon}.png" alt="${description}" class="weather-icon"
						width="48" height="48" loading="lazy" title="${description}">

						<p class="body-3">${parseInt(temp)}&deg;</p>
					</div>
				`;

				hourlySection.querySelector("[data-temp]").appendChild(tempLi)

				const windLi = document.createElement("li");
				windLi.classList.add("slider-item");

				windLi.innerHTML = `
					<div class="card card-sm slider-card">
						<p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

						<img src="./src/assets/images/weather_icons/direction.png" alt="direction" class="weather-icon"
							width="48" height="48" loading="lazy" title="" style="transform: rotate(${windDirection - 180}deg)">

						<p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} м/c</p>
					</div>
				`;

				hourlySection.querySelector("[data-wind]").appendChild(windLi)
			


            }  
            
			forecastSection.innerHTML = `
            <h2 class="title-2" id="forecast-label">Прогноз на 5 дней</h2>

            <div class="card card-lg forecast-card">
                <ul data-forecast-list></ul>
            </div>
        `;

        for (let i = 7, len = forecastList.length; i < len; i += 8) {
            const {
                main: { temp_max },
                weather,
                dt_txt
            } = forecastList[i];
            const [{ icon, description }] = weather;
            const date = new Date(dt_txt);

            const li = document.createElement("li");
            li.classList.add("card-item");

            li.innerHTML = `
                <div class="icon-wrapper">
                    <img src="./src/assets/images/weather_icons/${icon}.png" alt="${description}"
                        class="weather-icon" width="36" height="36" title="${description}">

                    <span class="span">
                        <p class="title-2">${parseInt(temp_max)}&deg;</p>
                    </span>
                </div>

                <p class="label-1">${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>

                <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
            `;

            forecastSection.querySelector("[data-forecast-list]").appendChild(li);
        }



        loading.style.display = "none";
        container.style.overflowY = "overlay";
        container.classList.add("fade-in");

        });

});

}

export const error404 = () => errorContent.style.display = "flex";
