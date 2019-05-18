class Track {
    constructor(traveltracker) {
        this.traveltracker = traveltracker;
        this.map = traveltracker.map;
        this.track = [];
        this.left_menu = traveltracker.left_menu;        

        // Directions Service
        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer;
        this.directionsDisplay.setMap(this.map);
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

        this.left_menu.tracker_distance.innerHTML = distance.toFixed(2);
        this.left_menu.tracker_duration.innerHTML = (duration[0] > 0 ? duration[0] + ' год ' : '') + duration[1] + ' хв';
    }

    push(information) {
        this.track.push(information);
    }
}