const CanvasHelper = function(configuration){

    let _animate = false;
    let _startX = null;
    let _startY = null;
    const _configuration = configuration;
    const _mainCanvas = _createCanvas(configuration.mainCanvasId);
    const _animationCanvas = _createCanvas(configuration.animationCanvasId);
    const _mainCanvasCtx = _mainCanvas.getContext('2d');
    const _animationCanvasCtx = _animationCanvas.getContext('2d');

    function drawMainCanvas(buttonInfo){
        _cleanCanvas(_mainCanvasCtx);
        _createPatternButtons(buttonInfo);
    }

    function getCanvas(canvasId){
        
        let canvas;

        switch (canvasId) {
            case _configuration.mainCanvasId:
                canvas = _mainCanvas;
                break;
            case _configuration.animationCanvasId:
                canvas = _animationCanvas;
                break
            default:
                console.error("The canvas specified does not exist");
                break;
        }

        return canvas;
    }

    function drawLineBetweenbuttons(startPositionX, StartPositionY, endPositionX, endPositionY){
        _drawLine(startPositionX, StartPositionY, endPositionX, endPositionY, _mainCanvasCtx);
    }
    
    function createFilledCircle(buttonInfo){
        _mainCanvasCtx.beginPath();
        _mainCanvasCtx.strokeStyle = _configuration.strokeStyle;
        _mainCanvasCtx.arc(buttonInfo.centerX,buttonInfo.centerY,buttonInfo.radius/ 5,0,2*Math.PI);
        _mainCanvasCtx.fillStyle = _configuration.strokeStyle;
        _mainCanvasCtx.fill();
        _mainCanvasCtx.lineWidth = _configuration.lineWidth;
        _mainCanvasCtx.stroke();
    }

    function animationInit(startX, startY){
        _animate = true;
        _startX = startX;
        _startY = startY;
    }

    function animationStop(){
        _animate = false;
        _startX = null;
        _startY = null;
        _cleanCanvas(_animationCanvasCtx);
    }

    function animationUpdate(mousePosition){

        if(!_animate) return;

        _cleanCanvas(_animationCanvasCtx);
        _drawLine(_startX, _startY, mousePosition.x, mousePosition.y, _animationCanvasCtx);
    }

    function _createCanvas(canvasId){
        var canvas;
        
        canvas = document.createElement('canvas');
        canvas.id     = canvasId;
        canvas.width  = _configuration.canvasWidth;
        canvas.height = _configuration.canvasHeight;
        canvas.style.zIndex   = 100;
        canvas.style.position = "absolute";
        canvas.style.border   = _configuration.canvasBorder;

        return canvas;
    }

    function _createPatternButtons(buttonsInfo){
            
            for (let i = 0; i < buttonsInfo.length; i++) {
            
                _createPatternButton(buttonsInfo[i]);

            }
    }

    function _createPatternButton(buttonInfo){
        _mainCanvasCtx.beginPath();
        _mainCanvasCtx.arc(buttonInfo.centerX,buttonInfo.centerY,buttonInfo.radius,0,2*Math.PI);
        _mainCanvasCtx.stroke();
    }    

    function _drawLine(startPositionX, StartPositionY, endPositionX, endPositionY, ctx){
        
        ctx.strokeStyle = _configuration.strokeStyle
        ctx.lineWidth = _configuration.lineWidth
        ctx.beginPath();
        
        ctx.moveTo(startPositionX, StartPositionY);
        ctx.lineTo(endPositionX, endPositionY);
        ctx.stroke();
    }

    function _cleanCanvas(ctx){

        ctx.clearRect(0,0, _configuration.canvasWidth,_configuration.canvasHeight);

    }

    return {
        getCanvas: getCanvas,
        drawMainCanvas:drawMainCanvas,
        drawLineBetweenbuttons: drawLineBetweenbuttons,
        createFilledCircle:createFilledCircle,
        animationInit:animationInit,
        animationUpdate:animationUpdate,
        animationStop:animationStop
    }
};

export default CanvasHelper
