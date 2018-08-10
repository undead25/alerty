# Alerty [![npm](https://img.shields.io/npm/v/alerty.svg?style=flat-square)](https://www.npmjs.org/package/alerty)

A simple, light and pretty pure javascript for developing browser dialogs and notifications which is following Google's Material Design guidelines. Obviously, it is responsive and no need other library.
 
## Usage
you can install alerty with npm
```bash
npm install alerty
```
```js
var alerty = require('alerty');
```
or with bower
```bash
bower install alerty
```

Alternatively, download the package and reference the JavaScript and CSS files manually:

```html
<script src="dist/js/alerty.min.js"></script>
<link rel="stylesheet" type="text/css" href="dist/css/alerty.min.css">
```

## Examples

you can run example local with gulp if node has been installed:

```bash
cd alerty
npm install
gulp
```
or test it on [jsfiddle](https://jsfiddle.net/fzwporfe/)


## Usage
>For alert dialog

```js
alerty.alert('Hello, World!');
```

>For toasts

```js
alerty.toasts('Something has been done!');
```

>For confirm dialog

```js
alerty.confirm('Are you sure?', funtion() {
  console.log('ok callback'); // do something
}, function(){
  console.log('cancel callback'); // do something
})
```

>For prompt dialog

```js
alerty.prompt(
  'Please write some thing', 
  {
    inputType: 'email', // input type
    inputPlaceholder: 'fill the blank'
  },
  function(value){
    alerty.alert('value you typed is: <b>'+value+'</b>')
  }
)
```

## API
### alerty.toasts(content[, opts], callback)

|param|type|description|
|-----|----|-----------|
|content|string|message to display|
|opts|object|options, optional|
|callback|function|callback after alerty closed|

**opts:**

|name|type|default|description|
|----|----|-------|-----------|
|place|string|'bottom'|'top' can be choosed|
|bgColor|string|'#323232'|background color of dialog body|
|fontColor|string|'#fff'|font color of dialog message|
|time|number|2000|time delay for dialog auto closed|

----------

### alerty.alert(content[, opts], onOk)

|param|type|description|
|-----|----|-----------|
|content|string|message to display|
|opts|object|options, optional|
|onOk|function|callback after click ok button|

**opts:**

|name|type|default|description|
|----|----|-------|-----------|
|title|string|''|title of dialog|
|okLabel|string|确定|ok button text|

----------

### alerty.confirm(content[, opts], onOk, onCancel)

|param|type|description|
|-----|----|-----------|
|content|string|message to display|
|opts|object|options|
|onOk|function|callback after click ok button|
|onCancel|function|callback after click cancel button|

**opts:**

|name|type|default|description|
|----|----|-------|-----------|
|title|string|''|title of dialog|
|okLabel|string|确定|ok button text|
|cancelLabel|string|取消|cancel button text|

----------

### alerty.prompt(content[, opts], onOk, onCancel)

|param|type|description|
|-----|----|-----------|
|content|string|message to display|
|opts|object|options|
|onOk|function|callback after click ok button, argument value, like above example|
|onCancel|function|callback after click cancel button|

**opts:**

|name|type|default|description|
|----|----|-------|-----------|
|title|string|''|title of dialog|
|okLabel|string|确定|ok button text|
|cancelLabel|string|取消|cancel button text|
|inputType|string|'text'|input type, such as 'password', 'email'|
|inputPlaceholder|'text'|''|input placeholder text|
|inputValue|'text'|''|default input value|

## Browser support
Alerty is tested and works in:
- IE8+
- Latest Stable: Firefox, Chrome, Safari, Edge
- Android 4.0 and Latest
- iOS7 and Latest

## Contributing
If you have good ideas or suggestions, please issue or pull request

## License
Alerty is licensed under [MIT](http://http://opensource.org/licenses/MIT "MIT")
