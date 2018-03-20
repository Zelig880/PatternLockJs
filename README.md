# PatternLockJs

This project is still work in progress and suggestion and help are more than welcome

## Summary

This project will enable you to include a Pattern Lock similar to the one available on mobile phones.

This package uses canvas and export the pattern to a simple hidden field to allow you to use it within your normal form.

At this stage the Pattern Lock include a simple design, but pull request can be accepted for different requirement.

I am hopen to suggestion and am happy to have support if anyone is willing to do so.

## Example Usage

The current version can be used easily by specifying an element with an ID within your page (It is suggested to add it within your form):

<form method="GET" action="#">
    <span id="patternLock"></span>
    
    <input type="submit" value="Submit" />
</form>

And then just initialise it with the following code

```javascript
import PatternLock from "./src/PatternLock"
var patternLockInstance = PatternLock("patternLock");
```

When a pattern is completed the value of an hidden field with the default name of PatternLockHiddenInput (can be changed by overriding config) is set.

## To DO

- Unit Test
- Move All Canvas methods in its own file
- Add Examples usage