var app = new Vue({
  el: '#app',
  computed:{
    sum() {
      let arr = this.result;
      let sum = 0;
      arr.forEach(a => {
        sum += parseFloat(a.score);
      });
      return sum;
    },
    average() {
      let aver = this.sum / 3;
      return Math.round(aver);
    }
  },
  data: {
    result: [
      {
        subject: 'math',
        score: 90
      },
      {
        subject: 'physical',
        score: 110
      },
      {
        subject: 'english',
        score: 87
      }
    ]
  }
});