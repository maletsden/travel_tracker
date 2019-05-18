class HelperSetup {
    constructor(traveltracker) {
        this.map = traveltracker.map;
        this.right_menu = traveltracker.right_menu;
        this.left_menu = traveltracker.left_menu;

        // set ids
        this.helper_ids = [
            'help__choose_marker', 'help__search_marker',
            'help__see_duration', 'help__see_distance',
            'help__discover_prices', 'help__book_hotel'
        ];

        // set callbacks
        this.helper_callbacks = [
            () => { // 'Вибери макрер'
                this.right_menu.switch_layers()
            },
            () => { // 'Скористайся пошуком'
                this.right_menu.hide_helper();
                this.right_menu.show_search();
            },
            () => { // 'скільки часу займе подорож'
                this.right_menu.hide_helper();
                this.left_menu.show_tracker();
            },
            () => { // 'кілометраж мандрівки'
                this.right_menu.hide_helper();
                this.left_menu.show_tracker();
            },
            () => { // 'скільки грошей'
                alert('Coming soon');
            },
            () => { // 'де переночувати'
                alert('Coming soon');
            }
        ];

        // set 'click' events
        for (let i = 0; i < this.helper_ids.length; i++) {
            const id = this.helper_ids[i];
            const callback = this.helper_callbacks[i];

            document.getElementById(id).onclick = callback;
        }

    }
}