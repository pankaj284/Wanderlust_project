

const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v12',
        center: listing.geometry.coordinates,
        zoom: 9
    });

//create the popup
const popup = new mapboxgl.Popup({offset:25})
            .setHTML(
            `<b>${listing.title}</b>, <br/> Exact location Provided after booking.`
            )

//create the custom marker element
const markerEl = document.createElement('img');

markerEl.src = "../marker.svg";
console.log(markerEl)
markerEl.style.width = "40px";
markerEl.style.height = "40px";
markerEl.style.objectFit = "contain";
markerEl.style.cursor = "pointer";

//create marker element

const marker = new mapboxgl.Marker({
    element: markerEl,
    anchor: "center"
})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(popup)
    .addTo(map)
