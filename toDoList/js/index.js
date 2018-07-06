/* 新增列表 */
Vue.component('add-input',{
  template: '#add-input',
  data() {
    return {
      isMoreShow: false,
      isInputFocus: false,
      newItem: {
        title: '',
        content: '',
        date: ''
      }
    };
  },
  methods: {
    inputFocus() {
      this.isInputFocus = true;
    },
    inputBlur() {
      this.isInputFocus = false;
    },
    isExtendDetail() {
      this.isMoreShow = !this.isMoreShow;
    },
    appendItem(){   //提交数据到root里
      let item = {};
      for(let i in this.newItem){
        item[i] = this.newItem[i];
      }
      this.$emit('subdata',item);
      for(let i in this.newItem){
        this.newItem[i] = '';
      }
    }
  }
});
/* 待做列表 */
Vue.component('todo-list',{
  template: '#todo-list',
  props: ['todoData'],
  data(){
    return {
      isMoreShow: [],
      toDoList: []
    }
  },
  methods:{
    isExtendDetail(index) { //是否展开详情
      this.$set(this.isMoreShow,index,!this.isMoreShow[index]);
      /*TODO 需要改进*/
    }
  },
  created(){
    this.toDoList = this.todoData.todo;
    for(let i=0;i<this.toDoList.length;i++){
      this.isMoreShow.push(false);
    }
  }
});
Vue.component('done-list',{
  template: '#done-list',
  props: ['todoData'],
  data(){
    return {
      isMoreShow: [],
      doneList: []
    }
  },
  methods:{
    isExtendDetail(index) {
      this.$set(this.isMoreShow,index,!this.isMoreShow[index]);
      //this.isMoreShow[index] = !this.isMoreShow[index];
      /* 失败案例，由于js限制，vue不能检测到这种情况下变动的数组
         https://cn.vuejs.org/v2/guide/list.html#
      */
    }
  },
  created(){
    this.doneList = this.todoData.done;
    for(let i=0;i<this.doneList.length;i++){
      this.isMoreShow.push(false);
    }
  }
});
Vue.component('rubbish',{
  template: '#rubbish',
  props: ['todoData'],
  data(){
    return {
      isMoreShow: false,
      trashList: []
    }
  },
  methods:{
    isExtendDetail() {
      this.isMoreShow = !this.isMoreShow;
    }
  },
  created(){
    this.trashList = this.todoData.trash;
  }
});

new Vue({
  el: '#todolist',
  data: {
    todoData: {
      todo: [
        {
          title: '弹吉他',
          content: '吉他吉他吉他🎸',
          date: '2018-7-6',
          isExpire: true
        }
      ],
      done: [
        {
          title: '买西红柿',
          content: '',
          date: '2018-05-12',
          isExpire: true
        },
        {
          title: '买茄子',
          content: '买一个圆茄子、长茄子',
          date: '',
          isExpire: false
        }
      ],
      trash: [
        {
          title: '用烤箱做一个蛋糕🎂',
          content: '美滋滋~',
          date: '',
          isExpire: false
        }
      ]
    }
  },
  methods: {
    addToDo(obj){
      console.log(obj);
      this.todoData.todo.push(obj);
    }
  }
});
/* 代理商 - 事件车 */
var eventBus = new Vue({

});
/*vue踩坑总结：
* 1、$emit触发事件时，事件名不能用驼峰或连线写法，只能小写
* 2、由于js限制，vue有两种情况下，不能检测到数组的变动
*
*
* */