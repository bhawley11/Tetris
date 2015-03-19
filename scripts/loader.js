/**
 * Created by Brenton on 3/17/2015.
 */

/***************************************************
 *  Code used with permission of Dr. Dean Mathias  *
 **************************************************/

var TETRIS = {
    images : {},
    screens : {},
    status : {
        preloadRequest : 0,
        preloadComplete : 0
    }
};

window.addEventListener('load', function() {
    console.log('Loading resources...');
    Modernizr.load([
        {
            load : [
                /* SOUNDS */
                /* sound are causing an unhandled exception ILLEGAL TOKEN */
                'preload!sounds/music/title_theme.mp3',
                'preload!sounds/voice/victory.mp3',

                /* IMAGES */
                'preload!images/fire/warthog_fire_1.png',
                'preload!images/fire/warthog_fire_2.png',
                'preload!images/fire/warthog_fire_3.png',
                'preload!images/fire/warthog_fire_4.png',
                'preload!images/fire/warthog_fire_5.png',
                'preload!images/fire/warthog_fire_6.png',
                'preload!images/fire/warthog_fire_7.png',

                'preload!images/warthog/warthog_angle_flat.png',
                'preload!images/warthog/warthog_angle_large.png',
                'preload!images/warthog/warthog_angle_low.png',
                'preload!images/warthog/warthog_angle_medium.png',
                'preload!images/warthog/warthog_angle_small.png',

                'preload!images/backgrounds/delta_halo.jpg',

                'preload!images/title.png',

                /* SCRIPTS */
                'preload!scripts/render.js',
                'preload!scripts/persistence.js',
                'preload!scripts/input.js',
                'preload!scripts/controls.js',
                'preload!scripts/credits.js',
                'preload!scripts/game.js',
                'preload!scripts/highScores.js',
                'preload!scripts/menu.js',
                'preload!scripts/main.js'
            ],
            complete : function() {
                console.log('All files requested for loading...');
            }
        }
    ]);
}, false);

yepnope.addPrefix('preload', function(resource) {
    console.log('preloading: ' + resource.url);

    TETRIS.status.preloadRequest++;

    var isImage = /.+\.(jpg|png|gif)$/i.test(resource.url);
    resource.noexec = isImage;
    resource.autoCallback = function(e) {
        if(isImage) {
            var image = new Image();
            image.src = resource.url;
            TETRIS.images[resource.url] = image;
        }
        TETRIS.status.preloadComplete++;

        if(TETRIS.status.preloadComplete === TETRIS.status.preloadRequest) {
            console.log('Preloading complete!');
            TETRIS.main.init();
        }
    };

    return resource;
});