function initMap() {
    map = new TravelTracker('map');
    map.setMarkers();

    console.log(map.layers);

    new HelperSetup(map);

}

// ADD CLICK Event for the sidebar
// const navbar_open = document.getElementById('navbar_open');
// const layers_open = document.getElementById('layers_open');
// const search_open = document.getElementById('search_open');
// const help_open = document.getElementById('help_open');
// const layers_menu = document.getElementById('layer_menu');
// const helper_menu = document.getElementById('helper_menu');
// const body_classes = document.body.classList;


// navbar_open.addEventListener('click', () => {
//     document.body.classList.toggle('move_right');
//     navbar_open.classList.toggle('navbar_open-active');
// });

// search_open.addEventListener('click', () => {
//     document.getElementById('search').classList.toggle('searc_active');
// });

// let timer = setTimeout(() => {}, 380);
// layers_open.addEventListener('click', () => {
    
//     if (helper_menu.active) { // switch tab
//         (() => {
//             clearTimeout();
//             helper_menu.active = true;
//             layers_menu.active = false;
//         })();
//         document.body.classList.toggle('move_left');
        
        
//         timer = setTimeout(() => {            
//             layers_menu.style.zIndex = 20;
//             helper_menu.style.zIndex = 10;
//             helper_menu.active = false;
//             layers_menu.active = true;
//             document.body.classList.toggle('move_left');
//         }, 370);
//     } else if (layers_menu.active) { // close tab
//         layers_menu.active = false;
//         helper_menu.active = false;
//         document.body.classList.toggle('move_left');
//     } else { // open the tab
//         layers_menu.style.zIndex = 20;
//         helper_menu.style.zIndex = 10;
//         layers_menu.active = true;
//         helper_menu.active = false;
//         document.body.classList.toggle('move_left');
//     }
// });


// help_open.addEventListener('click', () => {
//     if (layers_menu.active) { // switch tab
//         (() => {
//             clearTimeout(timer);
//             helper_menu.active = false;
//             layers_menu.active = true;
//         })();
//         document.body.classList.toggle('move_left');
//         timer = setTimeout(() => {

//             layers_menu.style.zIndex = 10;
//             helper_menu.style.zIndex = 20;
//             layers_menu.active = false;
//             helper_menu.active = true;
//             document.body.classList.toggle('move_left');
//         }, 370);
//     } else if (helper_menu.active) { // close tab
//         helper_menu.active = false;
//         layers_menu.active = false;
//         document.body.classList.toggle('move_left');
//     } else { // open the tab
//         helper_menu.style.zIndex = 20;
//         layers_menu.style.zIndex = 10;
//         layers_menu.active = true;
//         helper_menu.active = false;
//         document.body.classList.toggle('move_left');
//     }
// });

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
        this.right_menu = new RightMenu();

        // Geocoder
        this.geocoder = new google.maps.Geocoder();

        // Autocomplete
        this.autocomplete = new Autocomplete(this, 'search');
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
}