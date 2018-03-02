/*
 * Author: Simone Cuomo
 * Website: www.Zelig880.com
 * License: MIT
 * Description: Pattern Lock library to emulate Mobile phones lock screen in websites
 * 
 */
(function (global) {
    'use strict';

    var PatternLock = function (elementId, customConfiguration) {
        
        let _destinationElement;
        let _canvasContext;

        let _configuration = {
            elementId: '',
            canvasWidth: '400',
            canvasHeight: '400',
            canvasBorder: "1px solid",
            destinationInputName: "PatternLockHiddenInput",
            buttonsRow: 3,
            buttonsColumn: 3,
            buttonsPadding: 10
        };

        if(_elementIdIsValid(elementId))
        {
            _configuration.elementId = elementId;
            _destinationElement = document.getElementById(elementId);
        }

        if(customConfiguration !== undefined && typeof customConfiguration !== 'object')
            return "Error: the defined customConfiguration variable is not an object";

        Object.assign(_configuration, customConfiguration);
        
        var canvas = _createCanvas();
        var hiddenInput = _createHiddenInput();

        _canvasContext = canvas.getContext("2d");
        _createPatternButtons();

        _appendToDestinationElement(canvas);
        _appendToDestinationElement(hiddenInput);

        function getConfig(){
            return _configuration;
        }

        function _elementIdIsValid(){

            if (elementId === undefined)
            {
                console.error("Error: The destination element must be defined");
                return false;
            }

            if(document.getElementById(elementId) === null){
                console.error("Error: The destination element provided does not exist");
                return false;
            }

            return true;
        }

        function _createCanvas(){
            var canvas;
            
            canvas = document.createElement('canvas');
            canvas.id     = "PatterLock";
            canvas.width  = _configuration.canvasWidth;
            canvas.height = _configuration.canvasHeight;
            canvas.style.zIndex   = 100;
            canvas.style.position = "absolute";
            canvas.style.border   = _configuration.canvasBorder;

            return canvas;
        }

        function _createHiddenInput(){
            var input;

            input = document.createElement("input");
            input.type = 'hidden';
            input.name = _configuration.destinationInputName

            return input;
        }

        function _appendToDestinationElement(elementToAppend){
            _destinationElement.append(elementToAppend);
        }

        function _createPatternButtons(){

            for (let row = 0; row < _configuration.buttonsRow; row++) {
                
                for (let column = 0; column < _configuration.buttonsColumn; column++) {
                
                    const buttonInfo = _calculateButtonPositionAndSize(row, column);
                    _createPatternButton(buttonInfo);

                }
                
            }
        }

        function _createPatternButton(buttonInfo){
            _canvasContext.beginPath();
            _canvasContext.arc(buttonInfo.x,buttonInfo.y,buttonInfo.radius,0,2*Math.PI);
            _canvasContext.stroke();
        }

        function _calculateButtonPositionAndSize(row, column){

            var values = {};

            values.unitWidth = _configuration.canvasWidth / _configuration.buttonsColumn;
            values.unitHeight = _configuration.canvasHeight / _configuration.buttonsRow;
            values.radius = _calculateButtonRadius(values.unitWidth, values.unitHeight, _configuration.buttonsPadding);
            values.x = (values.unitWidth / 2 ) + ( column * values.unitWidth);
            values.y = (values.unitHeight / 2 ) + ( row * values.unitHeight);
            
            return values;
        }

        function _calculateButtonRadius(unitWidth, unitHeight, padding){

            var minSize = Math.min(unitWidth, unitHeight);
            var size = (minSize / 2) - padding;

            return size;
        }

        return {
            getConfig: getConfig
        }
    };

    if (typeof define === 'function' && define.amd) {
        define(function () { return PatternLock; });
    } else if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PatternLock;
        }
        exports.PatternLock = PatternLock;
    } else {
        global.PatternLock = PatternLock;
    }
})(this);