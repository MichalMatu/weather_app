// request data from the API by city name:
// https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// request for 5 day every 3 hours forecast:
// https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

// get current date from momnet.js day/month/year
var current_date = moment().format('DD/MM/YYYY');
// API key
var api_key = 'ff063c2259903253352ff5af1c451860';

var icon_link = 'http://openweathermap.org/img/wn/'
// get the search input, search button and history button array
var search_button = $('#search-button');
var search_input = $('#search-input');
var btn_city = [];
// getting data from input trim it and pass it to display_weather function
search_button.on('click', function (event) {
    event.preventDefault();
    var city = search_input.val().trim();
    display_weather(city);
});
// display weather function
function display_weather(city) {
    if (city) {
        $.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`)
            // if city not found alert
            .fail(function () {
                alert('City not found');
            })
            // then get the data and store it in data variable
            .then(function (data) {
                // clear the search input
                search_input.val(' ');
                // get the today div and append the data to it
                var today = $('#today');
                today.html(' ');
                today.append(`
                <div class='container_top'>
                <h1>${data.name}(${current_date})<img src='${icon_link}${data.weather[0].icon}.png'></h1>
                <p>Temp: ${Math.round(data.main.temp)} &#8451;</p>
                <p>Wind: ${data.wind.speed} KPH</p>
                <p>Humidity: ${data.main.humidity} %</p>
                </div>
                `);
                // get data for 5 day forecast
                $.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${api_key}&units=metric`)
                    .then(function (data_forecast) {
                        // get the forecast div and append the data to it
                        var forecast = $('#forecast');
                        forecast.html(' ');
                        forecast.append(`<div class='container'><h4>5-Day Forecast:</4></div>`);
                        // loop through the data and append it to the forecast div
                        for (i = 8; i < data_forecast.list.length; i++) {
                            forecast.append(`
                        <div class="card" style="width: 12rem;">
                        <div class="card-body">
                        <h5 class="card-title">${data_forecast.list[i].dt_txt.substring(0, 10).replaceAll('-', '/')}</h5>
                        <h6 class="card-title">${data_forecast.list[i].dt_txt.substring(11, 16)}</h6>
                        <p><img src='${icon_link}${data_forecast.list[i].weather[0].icon}.png'></p>
                        <p class="card-text">Temp: ${Math.round(data_forecast.list[i].main.temp)} &#8451;</p>
                        <p class="card-text">Wind: ${data_forecast.list[i].wind.speed} KPH</p>
                        <p class="card-text">Humidity: ${data_forecast.list[i].main.humidity} %</p>
                        </div>
                        </div>
                        `);
                        }
                    })
                // if the city name is not in the array or array is empty push it to the array and call history_btn function
                if (!btn_city.includes(data.name) || btn_city.length == 0) {
                    btn_city.push(data.name);
                    history_btn(data.name);
                }
            });
    }
}

// store city name in local storage and append it to the history div as clickable button
function history_btn(city) {
    localStorage.setItem('city', JSON.stringify(btn_city));
    var history = $('#history');
    history.append(`<button class='btn btn-secondary btn-block'>${city}</button>`);
    // if the history div has more than 10 buttons remove the first one
    if (history.children().length > 10) {
        history.children().first().remove();
    }
}

// get the data from local storage and call display_weather function
function get_history(city) {
    var city = JSON.parse(localStorage.getItem('city'));
    if (city) {
        btn_city = city;
        for (i = 0; i < city.length; i++) {
            history_btn(city[i]);
        }
        display_weather(city[city.length - 1]);
    }
}

// get the history div and add event listener to it

$('#history').on('click', function (event) {
    event.preventDefault();
    var city = event.target.textContent;

    // if the city name is less than 28 characters call display_weather function
    if (city.length < 28) {
        display_weather(city);
    }
});

// when right click on the history button remove it from the array and local storage
$('#history').on('contextmenu', function (event) {
    event.preventDefault();
    var city = event.target.textContent;
    if (city.length < 28) {
    var index = btn_city.indexOf(city);
    btn_city.splice(index, 1);
    localStorage.setItem('city', JSON.stringify(btn_city));
    event.target.remove();
    }
});

// call get_history function
get_history();




















