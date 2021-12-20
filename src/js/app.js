const transistApiKey = "P2GVpHiR1qkobm0apljH";
const transitUrl = "https://api.winnipegtransit.com/v3/trip-planner.json?";
const mapBoxApiKey =
  "pk.eyJ1IjoiZnJvc3RoeXBlcmlvbiIsImEiOiJja3g2cHBiNjEybjZpMm9xM2JtbXVkYWZhIn0.9DjO_74S4amjtTlq3PJboA";
const mapBoxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
const originForm = document.querySelector(`.origin-form`);
const originInput = document.querySelector(".input-origin");
const searchedList = document.querySelector(".origins");
const destinationInput = document.querySelector(".destination-input");
const destinationForm = document.querySelector(".destination-form");
const destinations = document.querySelector(".destinations");
const planMyTrip = document.querySelector(".plan-trip");
const busContainer = document.querySelector(".bus-container");
let origin = {};
let destination = {};
const coords = {
  longitude: 0,
  latitude: 0,
};
navigator.geolocation.getCurrentPosition((position) => {
  coords.longitude = position.coords.longitude;
  coords.latitude = position.coords.latitude;
});

const getGeoLocation = async function (searchPlace) {
  // getting a gecode
  const targetUrl = `${mapBoxUrl}${searchPlace}.json?bbox=-97.32972, 49.762789, -96.951241, 49.994007&limit=8&proximity=${coords.longitude},${coords.latitude}&access_token=${mapBoxApiKey}`;
  const response = await fetch(targetUrl);
  const data = await response.json();
  return data;
};  
const getMyTrip = async function (
  originLong,
  originLat,
  destinationlong,
  destinationLat
) {
  const finalUrl = `${transitUrl}api-key=${transistApiKey}&origin=geo/${originLat},${originLong}&destination=geo/${destinationLat},${destinationlong}`;
  const response = await fetch(finalUrl);
  const data = await response.json();
  return data;
};

originForm.addEventListener("submit", function (e) {
  e.preventDefault();
  getGeoLocation(originInput.value).then((search) => {
    searchedList.innerHTML = "";

    htmlSearchedList(search.features);
  });
});

function htmlSearchedList(features) {
  features.forEach((element) => {
    const lat = element.center[0];
    const long = element.center[1];
    const name = element.place_name.split(",").map((item) => item.trim());
    searchedList.insertAdjacentHTML(
      `beforeend`,
      `<li data-long=${long} data-lat=${lat}>
            <div class="name">${name[0]}</div>
            <div>${name[1]}</div>
          </li>`
    );
  });
  document.querySelectorAll(".origins li").forEach((item) =>
    item.addEventListener("click", () => {
      document.querySelectorAll(".origins li").forEach((i) => {
        if (i.classList.contains("selected")) {
          i.classList.remove("selected");
        }
      });
      item.classList.add("selected");
      origin = item.dataset;
    })
  );
}

destinationForm.addEventListener("submit", function (e) {
  e.preventDefault();
  getGeoLocation(destinationInput.value).then((search) => {
    destinations.innerHTML = "";

    htmldestinationList(search.features);
  });
});

function htmldestinationList(features) {
  features.forEach((element) => {
    const lat = element.center[0];
    const long = element.center[1];
    const name = element.place_name.split(",").map((item) => item.trim());
    destinations.insertAdjacentHTML(
      `beforeend`,
      `<li data-long=${long} data-lat=${lat}>
            <div class="name">${name[0]}</div>
            <div>${name[1]}</div>
          </li>`
    );
  });
  document.querySelectorAll(".destinations li").forEach((item) =>
    item.addEventListener("click", () => {
      document.querySelectorAll(".destinations li").forEach((i) => {
        if (i.classList.contains("selected")) {
          i.classList.remove("selected");
        }
      });
      item.classList.add("selected");
      destination = item.dataset;
    })
  );
}
function myTrip() {
  getMyTrip(origin.lat, origin.long, destination.lat, destination.long)
    .then((data) => {
      data.plans[0].segments.forEach((segment) => {
        if (segment.type === "walk") {
          if (segment.to.stop) {
            let description = `Walk for ${segment.times.durations.total} minutes to stop #${segment.to.stop.key} - ${segment.to.stop.name}`;
            TripsToHTML("walking", description);
          } else if (segment.to.destination) {
            let description = `Walk for ${segment.times.durations.total} minutes to your destination.`;
            TripsToHTML("walking", description);
          }
        } else if (segment.type === "ride") {
          if (segment.route.name === undefined) {
            let description = `Ride the ${segment.route.number} for ${segment.times.durations.total} minutes.`;
            TripsToHTML("bus", description);
          } else {
            let description = `Ride the ${segment.route.name} for ${segment.times.durations.total} minutes.`;
            TripsToHTML("bus", description);
          }
        } else if (segment.type === "transfer") {
          let description = `Transfer from stop #${segment.from.stop.key} - ${segment.from.stop.name} to stop #${segment.to.stop.key} - ${segment.to.stop.name}`;
          TripsToHTML("ticket-alt", description);
        } else {
          let description = `Walk for ${segment.times.durations.total} minutes to your destination.`;
          TripsToHTML("walking", description);
        }
      });
      // TripsToHTML()
    })
    .catch((error) => console.error(error));
}
planMyTrip.addEventListener("click", myTrip);

function TripsToHTML(type, description) {
  document.getElementsByClassName("my-trip")[0].insertAdjacentHTML(
    "beforeend",
    `
  <li>
    <i class="fas fa-${type}" aria-hidden="true"></i>${description}
  </li>
  `
  );
}
