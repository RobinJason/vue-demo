/* 代理商 - 事件车 */
var eventBus = new Vue({});
/* 新增&修改组件 */
Vue.component('add-input',{
  template: '#add-input',
  data() {
    return {
      isMoreShow: false,
      isInputFocus: false,
      isTextareaFocus: false,
      item: {
        title: '',
        content: '',
        date: '',
        isExpire: 0
      },
      isEdit: false,
      itemIndex: ''
    };
  },
  methods: {
    inputFocus() {
      this.isInputFocus = !this.isInputFocus;
    },
    textareaFocus(){
      this.isTextareaFocus = !this.isTextareaFocus;
    },
    isExtendDetail() {
      this.isMoreShow = !this.isMoreShow;
    },
    appendItem(){   //提交数据到root里
      let item = {};
      for(let i in this.item){
        item[i] = this.item[i];
      }
      if(this.isEdit){
        this.$emit('editdata',item,this.itemIndex);
        this.isEdit = false;
      }else{
        this.$emit('subdata',item);
      }
      for(let i in this.item){
        this.item[i] = '';
      }
    }
  },
  created(){
    eventBus.$on('editItem',(obj,index) => { // 接收端，绑定事件
      for(let i in obj){
        this.item[i] = obj[i];
      }
      this.isEdit = true;     // 修改状态
      this.itemIndex = index; // 存储当前对象的索引位置
      this.isMoreShow = true; // 展开详细面板
    });
  }
});

/* 待做列表组件 */
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
    },
    editItemBtn(index){ // 发送端，触发事件，修改项目
      eventBus.$emit('editItem',this.toDoList[index],index);
    },
    completeItemBtn(index){ // 发送端，触发事件，完成项目
      let alertData;
      eventBus.$emit('completeItem',this.toDoList[index]);
      this.isMoreShow.splice(index,1); // 删除旧的展开布尔值
      this.toDoList.splice(index,1);
      //修改提醒功能提示的内容，直接触发父组件函数
      this.$parent.changeAlertList();
    }
  },
  created(){
    this.toDoList = this.todoData.todo;
    this.today = this.todoData.date;
    for(let i=0;i<this.toDoList.length;i++){
      this.isMoreShow.push(false);
    }
    eventBus.$on('cancelComplete',(obj) => {  //接收端，绑定事件，取消完成项目
      this.toDoList.push(obj);
      this.isMoreShow.push(false); // 新增展开布尔值
    });
  }
});

/* 已完成组件 */
Vue.component('done-list',{
  template: '#done-list',
  props: ['todoData'],
  data(){
    return {
      isMoreShow: [],
      doneList: [],
    }
  },
  methods:{
    isExtendDetail(index) {
      this.$set(this.isMoreShow,index,!this.isMoreShow[index]);
      //this.isMoreShow[index] = !this.isMoreShow[index];
      /* 失败案例，由于js限制，vue不能检测到这种情况下变动的数组
         https://cn.vuejs.org/v2/guide/list.html#
      */
    },
    cancelCompleteBtn(index){ // 发送端，触发事件，取消完成
      eventBus.$emit('cancelComplete',this.doneList[index]);
      this.doneList.splice(index,1);
      this.isMoreShow.splice(index,1);
      //修改提醒功能提示的内容，直接触发父组件函数
      this.$parent.changeAlertList();
    },

  },
  created(){
    /*如果使用下面的写法，相当于深拷贝，子组件修改，父组件就不会变了*/
    /*for(let a in this.todoData.done){
      this.doneList.push(this.todoData.done[a]);
    }*/
    this.doneList = this.todoData.done; // 浅拷贝，引用
    this.today = this.todoData.date;
    for(let i=0;i<this.doneList.length;i++){
      this.isMoreShow.push(false);
    }
    eventBus.$on('completeItem',(obj) => { // 接收端，绑定事件
      this.doneList.unshift(obj);
      this.isMoreShow.unshift(false);
    });
  }
});

/* 回收站组件 */
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

/* 提醒组件 */
Vue.component('alert',{
  template: '#alert',
  props: ['alertList'],
  data(){
    return {

    }
  }
});
// header root
new Vue({
  el: '#header',
  data: {
    isAlert: false,
    alertList: []
  },
  computed: {
    alertItem() {
      let arr = this.alertList,
          title = '';
      title = arr.length? arr.join('、') : 'ToDoList';
      //debugger
      return title;
    },
    alertClass() {
      return this.isAlert;
    }
  },
  methods: {
    changeAlertItem(arr,vm){
      var data = vm.$data;
      setTimeout(()=>{ //延时添加动画效果
        data.isAlert = true; // 修改class
        data.alertList.length = 0
        for(var a in arr){
          data.alertList.push(arr[a]); // 修改提示数组
        }
      },1000);
    },
    changeDefaultTitle(vm){
      vm.alertList.splice(0)
      vm.isAlert = false;
    }
  },
  created(){
    eventBus.$on('alertItem',(arr) => {
      if(arr.length){
        this.$options.methods.changeAlertItem(arr,this);
      }else{
        this.$options.methods.changeDefaultTitle(this);
      }
    });
  }
});

// toDoList root
new Vue({
  el: '#todolist',
  data: {
    todoData: {
      todo: [
        {
          title: '读书',
          content: '读📕',
          date: '2018-07-12',
          isExpire: 0
        },
        {
          title: '编程',
          content: 'coding🍳',
          date: '2018-07-12',
          isExpire: 1
        },
        {
          title: '弹吉他',
          content: '吉他吉他吉他🎸',
          date: '2018-07-12',
          isExpire: 2
        },
        {
          title: '画个画',
          content: '🎨',
          date: '2018-07-12',
          isExpire: 2
        }
      ],
      done: [
        {
          title: '买西红柿',
          content: '',
          date: '2018-07-10',
          isExpire: 2
        },
        {
          title: '买茄子',
          content: '买一个圆茄子、长茄子',
          date: '',
          isExpire: 0
        }
      ],
      trash: [
        {
          title: '用烤箱做一个蛋糕🎂',
          content: '美滋滋~',
          date: '',
          isExpire: 0
        }
      ],
      date: ''
    },
    alertData: []
  },
  computed:{
    alertList(){ //监听todo数据的变化
      let arr = [],
          data = this.todoData;
      data.todo.forEach((item) => {
        if(item.date===data.date){
          arr.push(item.title);
        }
      });
      return arr; //返回今天的任务数组
    }
  },
  methods: {
    formatDate(){ //格式化日期，yyyy-MM-dd
      let today = new Date(),y,m,d;

      y = today.getFullYear();
      m = today.getMonth() + 1 + '';
      d = today.getDate() + '';

      m = m.length>1? m : 0+m;
      d = d.length>1? d : 0+d;

      return y+'-'+m+'-'+d;
    },
    compareDate(todayStr,pastDateStr){ //比较日期
      let isExpire = 0,
          compareSec;
      compareSec = (new Date(todayStr).valueOf() - 0) - (new Date(pastDateStr).valueOf() - 0);
      if(pastDateStr!==''){
        if(compareSec>0){
          isExpire = 2;
        }else if(compareSec==0){
          isExpire = 1;
        }
      }
      return isExpire;
    },
    addToDo(obj){ // addInput子组件调用方法：新增项
      let todo = this.todoData.todo;
      todo.push(obj);
    },
    editToDo(obj,index){ //  addInput子组件调用方法：修改项
      let todo = this.todoData.todo;
      this.$set(todo,index,obj);
      /* TODO 需要改进 */
    },
    changeAlertList(){
      eventBus.$emit('alertItem',this.alertList);  // 触发alert组件事件
    }
  },
  created(){
    let data = this.todoData,
        alertData = this.alertData;
    data.date = this.$options.methods.formatDate();
    for(let a in data){
      let itemData = data[a];
      if(a == 'date'){
        break;
      }
      for(let i = 0; i < itemData.length; i++ ){
        let itemSubObj = itemData[i],
            num = this.$options.methods.compareDate(data.date,itemSubObj.date);
        itemSubObj.isExpire = num; // 修改更新所有item对应的过期提示
        if(a == 'todo' && num == 1) { // 初始化，今日有提醒时，触发事件
          //this.alertData.push(itemSubObj);
          alertData.push(itemSubObj.title);
        }
      }
    }
    if(alertData.length){
      eventBus.$emit('alertItem',alertData);
    }
  }
});


/*vue踩坑总结：
* 1、$emit触发事件时，事件名不能用驼峰或连线写法，只能小写
* 2、由于js限制，vue有两种情况下，不能检测到数组的变动
* 3、使用事件车时，中间人vue实例应该提前初始化，否则借助它的方法绑定的两个组件，会报找不到vue实例的错
*
*
* */

// DONE 过期显示功能、提醒功能

// TODO 清除功能、回收站功能、localstorage的引入

// FIXED 待做列表和已完成列表，如果有项目是展开的状态，把它加进另外一个列表，再回到曾经的列表，它仍旧是展开的