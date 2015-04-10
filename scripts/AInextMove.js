/**
 * Created by Shaun on 4/8/2015.
 */
//I am using resources I found at this URL: https://codemyroad.wordpress.com/2013/04/14/tetris-ai-the-near-perfect-player/
TETRIS.AI = (function(){
var a = -.66569,
    b = .99275,
    c = -.46544,
    d = -.24077;




findBestMove = function(board, workingShape) {
    var best = null,
        bestScore = null,
        returnRotationState,
        returnLocationState = {};

    for (var rotation = 0; rotation < 4; rotation++) {
        workingShape.rotate(board, 'r');

        while (workingShape.moveLeft(board)) {
        }
        do {
            workingShape.hardDrop(board);

            var score = null;
            score = -a * board.returnAggregateHeight() + b * board.returnCompletedLines() - c * board.returnHoles() - d * board.returnBumpiness();

            if (score > bestScore || bestScore == null) {
                bestScore = score;
                returnLocationState = workingShape.getLowerLeftLocation();
                returnRotationState = workingShape.getRotateState();
            }
        } while (workingShape.moveRight());
    }
    return {
        location: returnLocationState,
        rotation: returnRotationState
    };
};

return{
    findBestMove : findBestMove
}

}());