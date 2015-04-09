/**
 * Created by Brenton on 3/17/2015.
 */

/***************************************************
 *  Code used with permission of Dr. Dean Mathias  *
 **************************************************/

var TETRIS = {
    images : {},
    screens : {},
    sounds : {},
    status : {
        preloadRequest : 0,
        preloadComplete : 0
    }
};

window.addEventListener('load', function() {
    console.log('Loading resources...');
    TETRIS.audioExt = '';

    if (Modernizr.audio.mp3 === 'probably') {
        console.log('We have MP3 support');
        TETRIS.audioExt = 'mp3';
    } else if (Modernizr.audio.wav === 'probably') {
        console.log('We have WAV support');
        TETRIS.audioExt = 'wav';
    }

    Modernizr.load([
        {
            load : [
                /* SOUNDS */
                /* sound are causing an unhandled exception ILLEGAL TOKEN */
                'preload!sounds/music/ascendancy_remix.' + TETRIS.audioExt,
                'preload!sounds/music/unsullied_memory.' + TETRIS.audioExt,
                'preload!sounds/music/africa_suite.' + TETRIS.audioExt,
                'preload!sounds/music/promise_the_girl.' + TETRIS.audioExt,
                'preload!sounds/music/unwearied_heart.' + TETRIS.audioExt,
                'preload!sounds/voice/victory.' + TETRIS.audioExt,
                'preload!sounds/effects/boltshot_shot.' + TETRIS.audioExt,
                'preload!sounds/effects/br_scope_in.' + TETRIS.audioExt,
                'preload!sounds/effects/br_scope_out.' + TETRIS.audioExt,
                'preload!sounds/effects/magnum_scope_in.' + TETRIS.audioExt,
                'preload!sounds/effects/magnum_scope_out.' + TETRIS.audioExt,
                'preload!sounds/effects/dmr_scope_out.' + TETRIS.audioExt,
                'preload!sounds/effects/button_noise.' + TETRIS.audioExt,
                'preload!sounds/voice/double_kill.' + TETRIS.audioExt,
                'preload!sounds/voice/triple_kill.' + TETRIS.audioExt,
                'preload!sounds/voice/overkill.' + TETRIS.audioExt,
                'preload!sounds/voice/killtacular.' + TETRIS.audioExt,
                'preload!sounds/voice/killtrocity.' + TETRIS.audioExt,
                'preload!sounds/voice/killimanjaro.' + TETRIS.audioExt,
                'preload!sounds/voice/killtastrophe.' + TETRIS.audioExt,
                'preload!sounds/voice/killpocalypse.' + TETRIS.audioExt,
                'preload!sounds/voice/killionaire.' + TETRIS.audioExt,
                'preload!sounds/voice/gain_the_lead.' + TETRIS.audioExt,
                'preload!sounds/voice/first_strike.' + TETRIS.audioExt,
                'preload!sounds/voice/game_over.' + TETRIS.audioExt,


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
                'preload!images/backgrounds/fud.jpg',

                'preload!images/title.png',

                'preload!images/squares/blue_square.png',
                'preload!images/squares/brown_square.png',
                'preload!images/squares/gray_square.png',
                'preload!images/squares/green_square.png',
                'preload!images/squares/light_blue_square.png',
                'preload!images/squares/navy_square.png',
                'preload!images/squares/orange_square.png',

                'preload!images/shapes/BShape.png',
                'preload!images/shapes/IShape.png',
                'preload!images/shapes/LLShape.png',
                'preload!images/shapes/LZShape.png',
                'preload!images/shapes/RLShape.png',
                'preload!images/shapes/RZShape.png',
                'preload!images/shapes/TShape.png',

                /* SCRIPTS */
                'preload!scripts/objects.js',
                'preload!scripts/random.js',
                'preload!scripts/particleSystem.js',
                'preload!scripts/render.js',
                'preload!scripts/input.js',
                'preload!scripts/controls.js',
                'preload!scripts/credits.js',
                'preload!scripts/AInextMove.js',
                'preload!scripts/AIgame.js',
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
    var isSound = /.+\.(mp3|wav)$/i.test(resource.url);
    resource.noexec = (isImage || isSound);
    resource.autoCallback = function(e) {
        if(isImage) {
            var image = new Image();
            image.src = resource.url;
            TETRIS.images[resource.url] = image;
        } else if(isSound) {
            var sound = new Audio(resource.url);
            console.log('Adding sound: ' + resource.url);
            TETRIS.sounds[resource.url] = sound;
        }
        TETRIS.status.preloadComplete++;

        if(TETRIS.status.preloadComplete === TETRIS.status.preloadRequest) {
            console.log('Preloading complete!');
            TETRIS.main.init();
        }
    };

    return resource;
});