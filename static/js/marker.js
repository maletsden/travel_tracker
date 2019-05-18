class Marker {
    constructor(traveltracker) {
        this.traveltracker = traveltracker;
        this.map = traveltracker.map;
    }

    generateMarker(position, title) {
        return new google.maps.Marker({
            map: this.map,
            position,
            title
        });
    }

    setMarker(information, region) {
        const marker = this.generateMarker(information.lanlng, information.title);        

        marker.setVisible(region == this.traveltracker.start_layer);

        const infowindow = new google.maps.InfoWindow({
            content: `<b>${information.title}</b>`
        });

        // save pointers to this marker
        this.traveltracker.layers[region].push(marker);

        marker.information = information;

        marker.addListener('mouseover', (() => infowindow.open(this.map, marker)).bind(this));
        marker.addListener('mouseout', () => infowindow.close());
        marker.addListener('click', (() => this.traveltracker.addPlace(marker)).bind(this));
    }
}