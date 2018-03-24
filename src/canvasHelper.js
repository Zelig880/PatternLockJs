const CanvasHelper = function(canvas, configuration){

    let _animate = false;
    let _startX = null;
    let _startY = null;
    const _canvas = canvas;
    const _ctx = canvas.getContext('2d');

    var animationInit = function(startX, startY){
        _animate = true;
        _startX = startX;
        _startY = startY;
    }

    var animationStop = function(){
        _animate = false;
        _startX = null;
        _startY = null;
        _cleanCanvas();
    }

    var animationUpdate = function(mousePosition){

        if(!_animate) return;

        _drawLine(mousePosition);
    }

    var _drawLine = function(mousePosition){
        
        _cleanCanvas();
        _ctx.strokeStyle = configuration.strokeStyle
        _ctx.lineWidth = configuration.lineWidth
        _ctx.beginPath();
        
        _ctx.moveTo(_startX, _startY);
        _ctx.lineTo(mousePosition.x, mousePosition.y);
        _ctx.stroke();
    }

    var _cleanCanvas = function(){

        _ctx.clearRect(0,0,_canvas.width,_canvas.height);

    }

    return {
        animationInit:animationInit,
        animationUpdate:animationUpdate,
        animationStop:animationStop
    }
};

export default CanvasHelper
