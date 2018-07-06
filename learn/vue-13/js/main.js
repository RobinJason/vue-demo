var Event = new Vue();

Vue.component('huahua',{
  template: `
    <div>
      I say: <input @keyup="on_change" v-model="i_said"/>
      <pre>{{i_said}}</pre>
    </div>
  `,
  data: function(){
    return {
      i_said: ''
    };
  },
  methods: {
    on_change(){
      Event.$emit('flower_said_sth',this.i_said)
    }
  }
});
Vue.component('caocao',{
  template: `
    <div>
      She say: {{flower_said}}
    </div>
  `,
  data: function(){
    return {
      flower_said: ''
    };
  },
  
  methods: {

  }
});
new Vue({
  el: '#app'
});