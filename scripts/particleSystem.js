/**
 * Created by Shaun on 3/24/2015.
 */
TETRIS.particleSystem = (function() {
    particles = {};
    nextName = 1;


    beginEffect = function(id) {
        var i = 9,
            x,
            y = (id * 35) + 17.5 + 50;

            for(i; i>=0; i--){
                x = 75 + (i * 35 + 17.5);
                createParticles(x,y);
            }
    };

    //I used a lot of code from Dr. Dean Mathias's in class example I simply changed the
    // the names to protect the innocent
    update = function(elapsedTime){
        var removeParticles = [],
            item,
            particle,
            i = 0;

        for( item in particles) {
            if(particles.hasOwnProperty(item)){
                particle = particles[item];

                particle.alive += elapsedTime;
                particle.center.x +=(elapsedTime * particle.speed * particle.direction.x);
                particle.center.y +=(elapsedTime * particle.speed * particle.direction.y);
                particle.rotation += particle.speed /500;

                if(particle.alive > particle.lifetime){
                    removeParticles.push(item);
                }
            }
        }

        for(i = 0; i < removeParticles.length; i++){
            delete particles[removeParticles[i]];
        }
        removeParticles.length = 0;
        drawParticles();
    };

    createParticles = function(centerX , centerY){
        var particle = {
            image : TETRIS.images['images/fire/warthog_fire_1.png'],
            size : Random.nextGaussian(10,4),
            center : {x: centerX, y: centerY},
            direction : Random.nextCircleVector(),
            speed : Random.nextGaussian(.1,.01),
            rotation : 0,
            lifetime : 500,
            alive : 0
        };

        particle.size = Math.max(1, particle.size);
        particles[nextName++] = particle;
    };

    drawParticles = function(){
        var item,
            particle;

        for(item in particles)
        {
            if(particles.hasOwnProperty(item)){
                particle = particles[item];
                TETRIS.graphics.drawParticles(particle);
            }
        }
    };



    return{
        beginEffect : beginEffect,
        update : update
    };
}());