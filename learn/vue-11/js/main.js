Vue.component('alert',{
  template: '<button @click="on_click">弹弹弹</button>',
  props: ['msg'],
  methods: {
    on_click() {
      alert(this.msg);
    }
  }
});
Vue.component('user',{
  template: '<a :href="\'/user/\'+username">@{{username}}</a>',
  props: ['username'],
  methods: {}
});
new Vue({
  el: '#app'
});