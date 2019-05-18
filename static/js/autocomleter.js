class Autocomplete {
    constructor(TravelTracker, input_id) {
        this.traveltracker = TravelTracker;
        const map = this.map = TravelTracker.map;

        const input = document.getElementById(input_id);
        this.autocomplete = new google.maps.places.Autocomplete(input);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        this.autocomplete.bindTo('bounds', map);
        // Set the data fields to return when the user selects a place.
        this.autocomplete.setFields(
            ['address_components', 'geometry', 'icon', 'name']);


        const infowindow = new google.maps.InfoWindow();
        const infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        const marker = new google.maps.Marker({
            map,
            anchorPoint: new google.maps.Point(0, -29),
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-pushpin.png'
        });

        this.autocomplete.addListener('place_changed', () => {
            this.place_changed(infowindow, infowindowContent, marker);
        });

    }

    place_changed(infowindow, infowindowContent, marker) {
        infowindow.close();
        this.hide_search();
        marker.setVisible(false);

        // get place
        const place = this.autocomplete.getPlace();

        // If can't find such place
        this.on_fail(place);

        // If 'OK' place marker on the map
        this.on_success(place);

        // custom configuration
        this.custom_config(place, marker);
        

        this.setInfowindowContent(place, infowindow, infowindowContent, marker);
    }

    hide_search() {
        document.getElementById('search').classList.toggle('searc_active');
        document.getElementById('search').value = '';
    }

    on_fail(place) {
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

    }

    on_success(place) {
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            this.map.fitBounds(place.geometry.viewport);
        } else {
            this.map.setCenter(place.geometry.location);
            this.map.setZoom(17); // Why 17? Because it looks good.
        }
    }

    custom_config(place, marker) {
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        marker.information = {
            title: place.name,
            lanlng: marker.position.toJSON()
        };
        marker.addListener('click', (() => {                        
            this.traveltracker.addPlace(marker);
        }).bind(this));
    }

    setInfowindowContent(place, infowindow, infowindowContent, marker) {
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
        infowindow.open(this.map, marker);

    }

}