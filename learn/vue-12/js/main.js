Vue.component('balance',{
  template: `
    <div>
      <show @show-balance="show_balance"></show>
      <p v-if="show">您的余额已不足10元</p>
    </div>
  `,
  data: function(){
    return {
      show: false
    };
  },
  methods: {
    show_balance(data) {
      this.show = true;
      console.log('data',data);
    }
  }
});
Vue.component('show',{
  template: `
    <button @click="on_click">显示余额</button>
  `,
  methods: {
    on_click() {
      this.$emit('show-balance',{a: 1,b: 2});
    }
  }
});
new Vue({
  el: '#app'
});