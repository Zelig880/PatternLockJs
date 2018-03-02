var PatternLock = require('../src/PatternLock');

describe("PatternLock", function() {
  it("return error message when called without element", function() {
    var patternInstance = new PatternLock();
    var expectedErrorMessage = 'Error: The destination element must be defined';

    expect(patternInstance).toBe(expectedErrorMessage);
  });

  it("return object when called succesfully", function() {
    var patternInstance = new PatternLock("element");
    var expectedErrorMessage = 'Error: The destination element must be defined';

    expect(typeof patternInstance).toEqual('object');
  });

  
  it("contains GetConfig Method", function(){
    var patternInstance = new PatternLock("element");
    
    expect(typeof patternInstance.getConfig).toBe('function');
  });
});

describe("GetConfig", function() {

  it("to return default object", function(){
    var patternInstance = new PatternLock();
    var expectedDefaultConfig = {
        canvasWidth: '300px',
        canvasHeight: '300px'
    };   

    var returnedConfig = patternInstance.getConfig();
    
    expect(returnedConfig).toEqual(expectedDefaultConfig);
  });
});

