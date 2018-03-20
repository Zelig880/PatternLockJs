/*
 * Author: Simone Cuomo
 * Website: www.Zelig880.com
 * License: MIT
 * Description: Pattern Lock library to emulate Mobile phones lock screen in websites
 * 
 */
import crypto from "../node_modules/crypto-js/index.js";

(function (global) {
    'use strict';

    var animationHelper = function(canvas){

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
            _ctx.strokeStyle = 'blue';
            _ctx.lineWidth = 5;
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

    var PatternEncryptionHadler = function(pattern){

        const randomWords = ["witty","scratch","sack","tree","assorted","unhealthy","tricky","advertisement","stomach","light","tease","stretch","lush","judicious","stingy","stop","tire","joke","tough","corn","history","big","lake","hurt","things"];

    }

    var PatternLock = function (elementId, customConfiguration) {
        
        let _destinationElement;
        let _canvasContext;
        let _buttonsInfo = [];
        let _mouseButtonDown = false;
        let _lastClickedButton = null;
        let _selectedPattern = [];

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
        
        var mainCanvas = _createCanvas("PatterLock");
        var animationCanvas = _createCanvas("animationCanvas");
        var hiddenInput = _createHiddenInput();

        _canvasContext = mainCanvas.getContext("2d");
        _calculateButtonInfo();
        _createPatternButtons();

        _appendToDestinationElement(animationCanvas);
        _appendToDestinationElement(mainCanvas);
        _appendToDestinationElement(hiddenInput);
        _addlistenerToClickEvents(mainCanvas, _buttonsInfo);
        const _animationHelper = animationHelper(animationCanvas);

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

        function _createCanvas(id){
            var canvas;
            
            canvas = document.createElement('canvas');
            canvas.id     = id;
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

        function _calculateButtonInfo(){

            for (let row = 0; row < _configuration.buttonsRow; row++) {
                
                for (let column = 0; column < _configuration.buttonsColumn; column++) {
                
                    _buttonsInfo.push(_calculateButtonPositionAndSize(row, column));

                }
                
            }
        }

        function _createPatternButtons(){
            
                for (let i = 0; i < _buttonsInfo.length; i++) {
                
                    _createPatternButton(_buttonsInfo[i]);

                }
        }

        function _createPatternButton(buttonInfo){
            _canvasContext.beginPath();
            _canvasContext.arc(buttonInfo.centerX,buttonInfo.centerY,buttonInfo.radius,0,2*Math.PI);
            _canvasContext.stroke();
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
                    _drawLine(lastButton.centerX, lastButton.centerY, button.centerX, button.centerY );
                    _animationHelper.animationStop();

                }
                _createFilledCircle(button);
                _animationHelper.animationInit(button.centerX, button.centerY);

                _lastClickedButton = index;
                console.log("Button Clicked", index);
            }
        }

        function _postPatten(){
            
            console.log("Button Clicked", index);
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

                _animationHelper.animationUpdate(mousePos);
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
                _animationHelper.animationStop();
                _postPattern();

            }, false);
        }

        function  _drawLine(startPositionX, StartPositionY, endPositionX, endPositionY){
           
            _canvasContext.strokeStyle = 'blue';
            _canvasContext.lineWidth = 5;
            _canvasContext.beginPath();
            
            _canvasContext.moveTo(startPositionX, StartPositionY);
            _canvasContext.lineTo(endPositionX, endPositionY);
            _canvasContext.stroke();
        }
        
        function _createFilledCircle(buttonInfo){
            _canvasContext.beginPath();
            _canvasContext.strokeStyle = 'blue';
            _canvasContext.arc(buttonInfo.centerX,buttonInfo.centerY,buttonInfo.radius/ 5,0,2*Math.PI);
            _canvasContext.fillStyle = 'green';
            _canvasContext.fill();
            _canvasContext.lineWidth = 5;
            _canvasContext.stroke();
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