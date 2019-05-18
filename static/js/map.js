function initMap() {
    map = new TravelTracker('map');
    map.setMarkers();

    console.log(map.layers);


}

// ADD CLICK Event for the sidebar
const navbar_open = document.getElementById('navbar_open');
navbar_open.addEventListener('click', () => {
    document.body.classList.toggle('move_left');
    navbar_open.classList.toggle('navbar_open-active');
});

const layers_open = document.getElementById('layers_open');
layers_open.addEventListener('click', () => {
    document.body.classList.toggle('move_right');
});

const search_open = document.getElementById('search_open');
search_open.addEventListener('click', () => {
    document.getElementById('search').classList.toggle('searc_active');
});

class TravelTracker {
    constructor(map_id) {
        // Map Container
        this.map_container = document.getElementById(map_id);

        // Map Configurations
        this.map_config = {
            center: {
                lat: 48.8,
                lng: 30.5238
            },
            zoom: 6.3
        };

        // Map
        const map = this.map = new google.maps.Map(this.map_container, this.map_config);

        // Track LinkedList
        this.track = [];
        // this.track = new LinkedList();

        // Left Menu
        this.tracker_places = document.getElementById('left_menu__places');
        this.tracker_distance = document.getElementById('left_menu__distance');
        this.tracker_duration = document.getElementById('left_menu__duration');

        // Layers Menu
        this.layers_places = document.getElementById('layer_menu__places');
        this.layers = {};
        this.start_layer = 'Тернопілля';


        // Geocoder
        this.geocoder = new google.maps.Geocoder();

        // Directions Service
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);


        var input = document.getElementById('search');
        // var types = document.getElementById('type-selector');
        // var strictBounds = document.getElementById('strict-bounds-selector');

        // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input);

        var autocomplete = new google.maps.places.Autocomplete(input);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', map);

        // Set the data fields to return when the user selects a place.
        autocomplete.setFields(
            ['address_components', 'geometry', 'icon', 'name']);


        var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
            map,
            anchorPoint: new google.maps.Point(0, -29),
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-pushpin.png'
        });


        const that = this;
        autocomplete.addListener('place_changed', function () {
            infowindow.close();
            document.getElementById('search').classList.toggle('searc_active');
            document.getElementById('search').value = '';
            marker.setVisible(false);
            const place = autocomplete.getPlace();
            console.log(place);

            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17); // Why 17? Because it looks good.
            }


            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
            marker.information = {
                title: place.name,
                lanlng: marker.position.toJSON()
            };
            marker.addListener('click', () => that.addPlace(marker));


            let address = '';
            if (place.address_components) {
                address = [
                    (place.address_components[0] && place.address_components[0].short_name || ''),
                    (place.address_components[1] && place.address_components[1].short_name || ''),
                    (place.address_components[2] && place.address_components[2].short_name || '')
                ].join(' ');
            }

            infowindowContent.children['place-icon'].src = place.icon;
            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = address;
            infowindow.open(map, marker);
        });

    }

    setMarkers() {
        for (const area of CASTLES) {
            this.addLayer(area.address);
            this.layers[area.address] = [];

            for (const region of area.locations) {
                if (!region) continue;

                for (const location of region.locations) {
                    const marker = this.setMarker(location, area.address);
                }
            }
        }
    }

    addLayer(title) {
        // Add To Layer Menu
        this.layers_places.appendChild(this.createLayer(title,
            title === this.start_layer ? 'fa-minus' : 'fa-plus'));
    }
    setMarker(information, region) {
        const that = this;

        const marker = new google.maps.Marker({
            map: this.map,
            position: information.lanlng,
            title: information.title
        });

        marker.setVisible(region == this.start_layer);

        const infowindow = new google.maps.InfoWindow({
            content: `<b>${information.title}</b>`
        });

        // save pointers to this marker
        this.layers[region].push(marker);

        marker.information = information;

        marker.addListener('mouseover', () => infowindow.open(that.map, marker));
        marker.addListener('mouseout', () => infowindow.close());
        marker.addListener('click', () => that.addPlace(marker));
    }

    addPlace(marker) {        
        // Prevent adding the same marker suborder
        if (marker.information == this.track[this.track.length - 1]) return;

        // Add To Left Menu        
        this.tracker_places.appendChild(this.createPlaceElement(marker.information));

        // Add To Track LinkedList
        this.track.push(marker.information);

        // Open Left Menu
        const body_classes = document.body.classList;
        body_classes.remove('move_right'); // close right menu
        if (!(body_classes.contains('move_left'))) {
            // move left
            body_classes.add('move_left');
            navbar_open.classList.toggle('navbar_open-active');
        }

        // Calculate Direction
        this.calculateDirection();
    }

    createPlaceElement(information) {
        let place = document.createElement('div');
        place.classList.add('place');
        place.information = information;
        place.innerHTML = `
        <i class="place__icon fas fa-map-marker-alt"></i>
        <div class='place__text'>
            ${information.title}
        </div>
        `;

        return place;
    }

    createLayer(title, icon_type) {
        let layer = document.createElement('div');
        layer.classList.add('place');
        let i = document.createElement('i');
        i.className = `place__icon fas ${icon_type}`;
        i.layer = title;
        layer.appendChild(i);
        let div = document.createElement('div');
        div.className = 'place__text';
        div.innerText = title;
        layer.appendChild(div);

        i.addEventListener('click', (e) => {
            let setVisible = e.target.classList.contains('fa-plus');

            const layer_name = e.target.layer;
            e.target.classList.toggle('fa-plus');
            e.target.classList.toggle('fa-minus');

            for (const marker of this.layers[layer_name]) {
                marker.setVisible(setVisible);

            }
        });

        return layer;
    }

    calculateDirection() {
        // Check if there are enough choosen markers
        if (this.track.length <= 1) {
            return;
        }

        // get start
        const origin = this.track[0].lanlng;

        // get waypoints
        const waypoints = this.track.slice(1, -1).map(place => {
            return {
                location: place.lanlng,
                stopover: true
            }
        });

        // get finish
        const destination = this.track[this.track.length - 1].lanlng;

        const that = this;

        // get direction
        this.directionsService.route({
            origin,
            destination,
            waypoints,
            travelMode: 'DRIVING'
        }, function (response, status) {
            if (status === 'OK') {
                that.directionsDisplay.setDirections(response);
                that.updateDistanceDuration(response);

            }
        });
    }

    updateDistanceDuration(response) {
        const legs = response.routes[0].legs;

        let distance = 0,
            duration = [0, 0];

        for (const leg of legs) {
            distance += parseFloat(leg.distance.text.slice(0, -3).replace(',', '.'));

            let duration_text = leg.duration.text.split('год');
            const hours = duration_text.length === 2 ? parseInt(duration_text[0].trim()) : 0;
            const minutes = parseInt(duration_text[duration_text.length - 1].slice(0, -3).trim());

            duration[1] += minutes;
            duration[0] += hours + Math.trunc(duration[1] / 60);
            duration[1] %= 60;
        }

        this.tracker_distance.innerHTML = distance.toFixed(2);
        this.tracker_duration.innerHTML = (duration[0] > 0 ? duration[0] + ' год ' : '') + duration[1] + ' хв';
    }
}