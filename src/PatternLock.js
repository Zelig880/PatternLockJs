/*
 * Author: Simone Cuomo
 * Website: www.Zelig880.com
 * License: MIT
 * Description: Pattern Lock library to emulate Mobile phones lock screen in websites
 * 
 */
import CryptoJS from "crypto-js"
import CanvasHelper from "./canvasHelper.js"
console.log(CanvasHelper);
(function (global) {
    'use strict';

    var PatternLock = function (elementId, customConfiguration) {
        
        let _destinationElement;
        let _canvasContext;
        let _buttonsInfo = [];
        let _mouseButtonDown = false;
        let _lastClickedButton = null;
        let _selectedPattern = [];
        const _randomWords = ["witty","scratch","sack","tree","assorted","unhealthy","tricky","advertisement","stomach","light","tease","stretch","lush","judicious","stingy","stop","tire","joke","tough","corn","history","big","lake","hurt","things"];

        let _configuration = {
            elementId: '',
            canvasWidth: '400',
            canvasHeight: '400',
            canvasBorder: "1px solid",
            destinationInputName: "PatternLockHiddenInput",
            buttonsRow: 3,
            buttonsColumn: 3,
            buttonsPadding: 10,
            strokeStyle : 'black',
            lineWidth : 2,
            mainCanvasId: "PatternLock",
            animationCanvasId: "PatternLockAnimation"
        };

        if(_elementIdIsValid(elementId))
        {
            _configuration.elementId = elementId;
            _destinationElement = document.getElementById(elementId);
        }

        if(customConfiguration !== undefined && typeof customConfiguration !== 'object')
            return "Error: the defined customConfiguration variable is not an object";

        Object.assign(_configuration, customConfiguration);
        
        const _canvasHelper = new CanvasHelper(_configuration);
        var hiddenInput = _createHiddenInput();

        _buttonsInfo = _calculateButtonInfo();
        _canvasHelper.drawMainCanvas(_buttonsInfo);

        const mainCanvas = _canvasHelper.getCanvas(_configuration.mainCanvasId)
        _appendToDestinationElement(_canvasHelper.getCanvas(_configuration.animationCanvasId));
        _appendToDestinationElement(mainCanvas);
        _appendToDestinationElement(hiddenInput);
        _addlistenerToClickEvents(mainCanvas, _buttonsInfo);

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

        function _createHiddenInput(){
            var input;

            input = document.createElement("input");
            input.type = 'hidden';
            input.name = _configuration.destinationInputName;

            return input;
        }

        function _appendToDestinationElement(elementToAppend){
            _destinationElement.append(elementToAppend);
        }

        function _calculateButtonInfo(){

            let buttonInfo = [];

            for (let row = 0; row < _configuration.buttonsRow; row++) {
                
                for (let column = 0; column < _configuration.buttonsColumn; column++) {
                
                    buttonInfo.push(_calculateButtonPositionAndSize(row, column));

                }
                
            }

            return buttonInfo;
        }

        function _calculateButtonPositionAndSize(row, column){

            var values = {};

            values.row = row;
            values.column = column;
            values.unitWidth = _configuration.canvasWidth / _configuration.buttonsColumn;
            values.unitHeight = _configuration.canvasHeight / _configuration.buttonsRow;
            values.radius = _calculateButtonRadius(values.unitWidth, values.unitHeight, _configuration.buttonsPadding);
            values.x = ( column * values.unitWidth);
            values.y = ( row * values.unitHeight);
            values.centerX = (values.unitWidth / 2) + ( column * values.unitWidth);
            values.centerY = (values.unitHeight / 2) + ( row * values.unitHeight);
            
            return values;
        }

        function _calculateButtonRadius(unitWidth, unitHeight, padding){

            var minSize = Math.min(unitWidth, unitHeight);
            var size = (minSize / 2) - padding;

            return size;
        }

        function _getMousePos(canvas, event) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        }

        function _isButton(pos, button){
            var buttonAccuracy = 0.3;
            var buttonAccutacyX = buttonAccuracy * button.unitWidth;
            var buttonAccutacyY = buttonAccuracy * button.unitHeight;

            return pos.x > (button.x + buttonAccutacyX) && pos.x < (button.x+button.unitWidth -  buttonAccutacyX) && pos.y < (button.y+button.unitHeight - buttonAccutacyY) && pos.y > (button.y + buttonAccutacyY);
        }

        function _clickButton(button, index){

            if(index !== _lastClickedButton && _selectedPattern.indexOf(index) === -1){
               
                _selectedPattern.push(index);
                

                if(_lastClickedButton !== null){
                    var lastButton = _buttonsInfo[_lastClickedButton];
                    _canvasHelper.drawLineBetweenbuttons(lastButton.centerX, lastButton.centerY, button.centerX, button.centerY );
                    _canvasHelper.animationStop();

                }
                _canvasHelper.createFilledCircle(button);
                _canvasHelper.animationInit(button.centerX, button.centerY);

                _lastClickedButton = index;
                console.log("Button Clicked", index);
            }
        }

        function _postPattern(){
            
            const hashedPattern = _generatePatternHash();
            _assignGeneratedHashToInput(hashedPattern);
        }

        function _generatePatternHash(){
            var concatenatedString = "";

            _selectedPattern.forEach((value)=>{
                concatenatedString += _randomWords[value];
            });
            
            const hashedPattern = CryptoJS.SHA1(concatenatedString);
            const patternInBase64 = hashedPattern.toString(CryptoJS.enc.Base64);

            return patternInBase64;

        }

        function _assignGeneratedHashToInput(hashedPattern){
            let hiddenInput = document.getElementsByName(_configuration.destinationInputName)[0];
            hiddenInput.value = hashedPattern;
        }

        function _addlistenerToClickEvents(canvas, buttonInfo){
            _mouseDownEventListener(canvas, buttonInfo);
            _mouseMoveEventListener(canvas, buttonInfo);
            _mouseUpEventListener(canvas, buttonInfo);
        }

        function _mouseDownEventListener(canvas, buttonInfo){

            canvas.addEventListener('mousedown', function(evt) {
                var mousePos = _getMousePos(canvas, evt);

                buttonInfo.forEach(function(button, index) {

                    if(_isButton(mousePos, button)){

                        _mouseButtonDown = true;
                        _clickButton(button, index);
                        return true;
                    }

                }, this);

            }, false);
        }
        
        function _mouseMoveEventListener(canvas, buttonInfo){

            canvas.addEventListener('mousemove', function(evt) {
                var mousePos = _getMousePos(canvas, evt);
                
                if(!_mouseButtonDown) return;

                _canvasHelper.animationUpdate(mousePos);
                buttonInfo.forEach(function(button, index) {

                    if(_isButton(mousePos, button)){

                        _clickButton(button, index);
                        return true;
                    }

                }, this);

            }, false);
        }
        
        function _mouseUpEventListener(canvas, buttonInfo){

            canvas.addEventListener('mouseup', function(evt) {
                var mousePos = _getMousePos(canvas, evt);
                _mouseButtonDown = false;
                _canvasHelper.animationStop();
                _postPattern();

            }, false);
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