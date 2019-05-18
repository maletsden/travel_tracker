function initMap() {
    map = new TravelTracker('map');
    map.setMarkers();
}

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

        // Marker client
        this.marker = new Marker(this);
        // Left Menu
        this.left_menu = new LeftMenu();

        // Track LinkedList
        this.track = new Track(this);

        // Layers Menu
        this.layers_places = document.getElementById('layer_menu__places');
        this.layers = {};
        this.start_layer = 'Тернопілля';

        // Right Menu
        this.right_menu = new RightMenu(this);

        // Autocomplete
        this.autocomplete = new Autocomplete(this, 'search');

        // Healper
        this.helper = new HelperSetup(this);
    }

    setMarkers() {
        for (const area of CASTLES) {
            this.addLayer(area.address);
            this.layers[area.address] = [];

            for (const region of area.locations) {
                if (!region) continue;

                for (const location of region.locations) {
                    const marker = this.marker.setMarker(location, area.address);
                }
            }
        }
    }

    allMarkersSetVisibility(visible) {
        for (const region in this.layers) {
            if (this.layers.hasOwnProperty(region)) {
                // const element = this.layers[region];
                for (const marker of this.layers[region]) {
                    marker.setVisible(visible);
                }
            }
        }

        const layers = document.getElementsByClassName('layer_class');
        for (const layer of layers) {
            if (visible) {
                layer.classList.remove('fa-plus');
                layer.classList.add('fa-minus');
            } else {
                layer.classList.add('fa-plus');
                layer.classList.remove('fa-minus');
            }
        }

    }
    addLayer(title) {
        // Add To Layer Menu
        this.layers_places.appendChild(this.createLayer(title,
            title === this.start_layer ? 'fa-minus' : 'fa-plus'));
    }

    addPlace(marker) {
        // Prevent adding the same marker suborder
        if (marker.information == this.track[this.track.length - 1]) return;

        // Add To Left Menu        
        this.left_menu.tracker_places.appendChild(this.left_menu.createPlaceElement(marker.information));

        // Add To Track LinkedList
        this.track.push(marker.information);

        // Open Left Menu
        this.left_menu.show_tracker();

        // Calculate Direction
        this.track.calculateDirection();
    }

    createLayer(title, icon_type) {
        let layer = document.createElement('div');
        layer.classList.add('place');
        let i = document.createElement('i');
        i.className = `place__icon layer_class fas ${icon_type}`;
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
}