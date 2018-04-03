# PatternLockJs

This project allows you to create a Pattern Lock similar to the one available on android mobile phones.

It does not use jquery and is build using canvas.

The pattern created is safely encrypted and the patternString is automatically attached to an hidden text field that can be used normally using form submission.

At this stage the Pattern Lock include a simple design and the above implementation to extract the pattern, but pull request or suggestion for any further development or feature requirement that may support your usage.

There is a full set of configurations available (color, size, line width, rows, column)

## Example Usage

The current version can be used easily by specifying an element with an ID within your page (It is suggested to add it within your form):

<form method="GET" action="#">
    <span id="patternLock"></span>
    
</form>

And then just initialise it with the following code

```javascript
import PatternLock from "./src/PatternLock"
var patternLockInstance = PatternLock("patternLock");
```

When a pattern is completed the value of an hidden field with the default name of PatternLockHiddenInput (can be changed by overriding config) is set.

![alt text](https://github.com/Zelig880/PatternLockJs/patternLockVideo.gif.gif "Example usage video of the pattern lock")

## To DO

- Unit Test
- (COMPLETED)Move All Canvas methods in its own file
- (COMPLETED) Add Examples usage video
- Provide callback on pattern completition