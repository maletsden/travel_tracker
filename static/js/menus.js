class Actions {
    constructor() {
        this.move_left = 'move_left';
        this.move_rigth = 'move_right';
    }
    
    body_add_move_left() {
        document.body.classList.add(this.move_left);
    }

    body_remove_move_left() {
        document.body.classList.remove(this.move_left);
    }

    body_toggle_move_left() {
        document.body.classList.toggle(this.move_left);
    }

    body_add_move_rigth() {
        document.body.classList.add(this.move_rigth);
    }

    body_remove_move_rigth() {
        document.body.classList.remove(this.move_rigth);
    }

    body_toggle_move_rigth() {
        document.body.classList.toggle(this.move_rigth);
    }
}

class LeftMenu extends Actions {
    constructor() {
        super();
        this.tracker_places = document.getElementById('left_menu__places');
        this.tracker_distance = document.getElementById('left_menu__distance');
        this.tracker_duration = document.getElementById('left_menu__duration');
        this.navbar_open = document.getElementById('navbar_open');

        this.navbar_open.onclick = () => {
            this.toggle_tracker();
        };

        // Track details
        this.tracker_places = document.getElementById('left_menu__places');
        this.tracker_distance = document.getElementById('left_menu__distance');
        this.tracker_duration = document.getElementById('left_menu__duration');
        
    }

    show_tracker() {
        this.body_add_move_rigth();
        this.navbar_open.classList.add('navbar_open-active');
    }

    hide_tracker() {
        this.body_remove_move_right();
        this.navbar_open.classList.remove('navbar_open-active');
    }

    toggle_tracker() {
        this.body_toggle_move_rigth();
        this.navbar_open.classList.toggle('navbar_open-active');
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
}


class RightMenu extends Actions {
    constructor() {
        super();
        this.layers_open = document.getElementById('layers_open');
        this.layers_menu = document.getElementById('layer_menu');
        this.help_open = document.getElementById('help_open');
        this.helper_menu = document.getElementById('helper_menu');
        this.search_open = document.getElementById('search_open');
        this.search = document.getElementById('search');

        // add listeners
        this.buttons_ids = [
            'layers_open',
            'search_open',
            'help_open'
        ];

        this.buttons_callbacks = [
            () => {
                this.switch();
            },
            () => {
                this.toggle_search();
            },
            () => {
                this.switch();
            }
        ];

        // set 'click' events
        for (let i = 0; i < this.buttons_ids.length; i++) {
            const id = this.buttons_ids[i];
            const callback = this.buttons_callbacks[i];

            document.getElementById(id).onclick = callback;
        }
    }

    hide_layers() {
        this.disactive(this.layers_menu);
        this.disactive(this.helper_menu);
        this.body_remove_move_left();
    }

    hide_helper() {        
        this.disactive(this.layers_menu);
        this.disactive(this.helper_menu);
        this.body_remove_move_left();
    }

    show_layers() {
        this.active(this.layers_menu);
        this.body_add_move_left();
    }

    show_helper() {
        this.active(this.helper_menu);
        this.body_add_move_left();
    }

    active(menu) {
        menu.active = true;
    }

    disactive(menu) {
        menu.active = false;
    }

    switch() {

    }

    show_search() {
        this.search.classList.add('searc_active');
    }

    hide_search() {
        this.search.classList.remove('searc_active');
    }

    toggle_search() {
        this.search.classList.toggle('searc_active');
    }
}