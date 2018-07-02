Vue.component('alert',{
  template: '<button @click="on_click">yoyoyo</button>',
  methods: {
    on_click: function(){
      alert('yo');
    }
  }
});
var Alert = {
  template: '<button @click="on_click">heyheyhey</button>',
  methods: {
    on_click: function(){
      alert('hey');
    }
  }
};
new Vue({
  el: '#seg1',
  components: {
    alert: Alert
  }
});
new Vue({
  el: '#seg2'
});