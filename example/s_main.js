define(function(require, exports, module) {
  require('alerty');
  document.getElementById('test1').onclick = function () {
    alerty.alert('123', {title: 'Info', time:2222}, function(){alert('callback')})
  }
  document.getElementById('test2').onclick = function () {
    alerty.toasts('123', {bgColor: '#ccc', fontColor: '#000'}, function(){alert('toasts callback')})
  }
  document.getElementById('test3').onclick = function () {
    alerty.confirm(
      'Are you sure?', 
      {title: 'Notes', cancelLabel: 'Cancel', okLabel: 'Confirm'}, 
      function(){
        alerty.toasts('this is ok callback', {place: 'top'})
      },
      function() {
        alerty.toasts('this is cancel callback')
      }
    )
  }
  document.getElementById('test4').onclick = function () {
    alerty.prompt('this is a prompt dialog', 
      {inputType: 'text', inputPlaceholder: 'fill the blank', inputValue: 'default value'},
      function(value){
        alerty.alert('value you typed is: <b>'+value+'</b>')
    })
  }
});