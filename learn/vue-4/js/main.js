var app = new Vue({
  el: '#app',
  methods: {
    onClick() {
      console.log('hey')
    },
    onEnter() {
      console.log('in');
    },
    onOut() {
      console.log('out');
    },
    onSubmit() {
      console.log("sub");
    },
    onKeyEnter() {
      console.log('enter');
    }
  }
});