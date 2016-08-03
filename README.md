# Alerty [![npm](https://img.shields.io/npm/v/alerty.svg?style=flat-square)](https://www.npmjs.org/package/alerty)

A simple, light and pretty pure javascript for developing browser dialogs and notifications which is following Google's Material Design guidelines. Obviously, it is responsive and no need other library.
 
## Usage
you can install alerty with npm
```bash
npm install alerty
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
Documentation & Examples

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