/**
 * Created by Shaun on 3/24/2015.
 */
TETRIS.particleSystem = (function() {
    particles = {};
    nextName = 1;


    beginEffect = function(ids, theBoard) {
        var i = 0,
            j = 0,
            k = 0,
            x = 0,
            y = 0;
            theGrid = theBoard.getGrid();
        if(ids.length != 0) {
            for (i; i < ids.length; i++) {
                for (j; j < 10; j++) {
                    x = 75 + (j * 35 + 17.5);
                    y = ((ids[i] - 2) * 35) + 17.5 + 50;

                    for (k; k < 4; k++) {
                        createParticles(x, y, theGrid[j][ids[i]].getImage());
                    }
                    k = 0;
                }
                j = 0;
            }
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

    createParticles = function(centerX , centerY, newImage){
        var particle = {
            image : newImage,
            size : Random.nextGaussian(15,2),
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