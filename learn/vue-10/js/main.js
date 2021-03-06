Vue.component('like',{
  template: '<button :class="{liked: liked}" @click="toggle_like">👍{{like_count}}</button>',
  data: function(){
    return {
      like_count: 10,
      liked: false
    };
  },
  methods: {
    toggle_like() {
      if(!this.liked)
        this.like_count++;
      else
        this.like_count--;
      this.liked = !this.liked;
    }
  }
});
new Vue({
  el: '#app'
});