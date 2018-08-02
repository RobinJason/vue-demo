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
      if (!this.item.title) {
        return;
      }
      for(let i in this.item){
        item[i] = this.item[i];
      }
      if(this.isEdit){
        this.$emit('editdata',item,this.itemIndex);
        this.isEdit = false;
      }else{
        this.$emit('subdata',item);
      }
      this.deleteItem();
      //修改提醒功能提示的内容，直接触发父组件函数
      this.$parent.changeAlertList();
    },
    deleteItem(){   //删除数据
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
  data () {
    return {
      isMoreShow: [],
      toDoList: []
    }
  },
  methods: {
    isExtendDetail (index) { //是否展开详情
      this.$set(this.isMoreShow,index,!this.isMoreShow[index]);
      /*TODO 需要改进*/
    },
    editItemBtn (index) { // 触发端，触发事件，修改项目
      eventBus.$emit('editItem',this.toDoList[index],index);
    },
    completeItemBtn (index) { // 触发端，触发事件，完成项目
      let data = this.toDoList;
      eventBus.$emit ('completeItem', data[index]);
      this.$options.methods.deleteItemFromList(this, index);
    },
    deleteItemBtn (index) { // 触发端，触发事件，删除项目到已删除列表
      let data = this.toDoList;
      eventBus.$emit ('deleteItem',data[index],'todo');
      this.$options.methods.deleteItemFromList(this, index);
    },
    deleteItemFromList (vm, index) { // 删除本地的数据
      vm.isMoreShow.splice (index,1); // 删除旧的展开布尔值
      vm.toDoList.splice (index,1);
      //修改提醒功能提示的内容，直接触发父组件函数
      vm.$parent.changeAlertList ();
    },
    pushToList (vm, obj) {
      vm.toDoList.push(obj);
      vm.isMoreShow.push(false); // 新增展开布尔值
    }
  },
  created () {
    this.toDoList = this.todoData.todo;
    this.today = this.todoData.date;
    for(let i=0;i<this.toDoList.length;i++){
      this.isMoreShow.push(false);
    }
    eventBus.$on('cancelComplete',(obj) => {  //接收端，绑定事件，取消完成项目
      this.$options.methods.pushToList(this, obj);
    });
    eventBus.$on('cancelTodoDelete',(obj) => {  //接收端，绑定事件，取消删除项目
      this.$options.methods.pushToList(this, obj);
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
    cancelCompleteBtn(index){ // 触发端，触发事件，取消完成
      let data = this.doneList;
      eventBus.$emit('cancelComplete',data[index]);
      this.$options.methods.deleteItemFromList(this,index);
    },
    deleteItemBtn (index) { // 触发端，触发事件，删除项目到已删除列表
      let data = this.doneList;
      eventBus.$emit ('deleteItem',data[index],'done');
      this.$options.methods.deleteItemFromList(this,index);
    },
    deleteItemFromList (vm, index){ // 删除本地的数据
      vm.isMoreShow.splice (index,1); // 删除旧的展开布尔值
      vm.doneList.splice (index,1);
      //修改提醒功能提示的内容，直接触发父组件函数
      vm.$parent.changeAlertList ();
    },
    pushToList(vm, obj){
      vm.doneList.unshift(obj);
      vm.isMoreShow.unshift(false); // 新增展开布尔值
    }
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
      this.$options.methods.pushToList(this, obj);
    });
    eventBus.$on('cancelDoneDelete',(obj) => {  //接收端，绑定事件，取消删除项目
      this.$options.methods.pushToList(this, obj);
    });
  }
});

/* 已删除组件 */
Vue.component('del-list',{
  template: '#del-list',
  props: ['todoData'],
  data () {
    return {
      isMoreShow: [],
      delList: [],
      isDelShow: false
    }
  },
  computed: {
    isDelListShow () { //ul的v-show绑定值
      let arr = this.delList.filter( item => {
        return item !== undefined
      });
      // console.log('delComputed')
      return arr.length;
    }
  },
  methods: {
    isExtendDetail (index) {
      this.$set (this.isMoreShow, index, !this.isMoreShow[index]);
    },
    cancelDeleteBtn (index) { // 触发端，触发事件，取消删除
      let str = index%2 === 0 ? 'Done': 'Todo';
      eventBus.$emit ('cancel' + str + 'Delete', this.delList[index]); // 把项目送回todo或done数组
      this.$options.methods.deleteItemBtn (index, this);
      this.$parent.changeAlertList();
    },
    deleteItemBtn (index, vm) { // 删除todo项，并把此项设置为空字符串，变为稀疏数组
      let that = vm || this;
      that.$set (that.delList, index, undefined);
      // console.log('delMethod')
    },
    calcIndexPos(origin, vmData){ // 计算添加时，数组索引的位置
      let len = (vmData || this.delList )['length'],
          index;
      switch (origin) {
        case 'todo': //奇数索引位置
          index = len%2 === 0 ? len+1 : len;
          break;
        case 'done': //偶数索引位置
          index = len%2 === 0 ? len : len+1;
          break;
      }
      return index;
    }
  },
  watch: {
    isDelListShow (val) { // 检测isDelListShow属性，返回值为0时，清空数组的值
      let len = this.delList.length;
      if (!val) {
        for (let a=len-1; a>-1 ;a--) {
          this.$delete (this.delList,a);
        }
      }
      // console.log('delWatch')
    }
  },
  created () {
    this.delList = this.todoData.del; // 浅拷贝，引用
    this.today = this.todoData.date;
    for (let i=0; i<this.delList.length; i++) {
      this.isMoreShow.push(false);
    }
    eventBus.$on('changeDelDisplay',() => {
      this.isDelShow = !this.isDelShow;
    })
    eventBus.$on('deleteItem', (obj,origin) => { // 接收端，添加删除项到稀疏数组
      let index = this.$options.methods.calcIndexPos(origin, this.delList); // 获取数据应当放置位置的数组索引
      console.log(index);
      this.$set (this.delList, index,obj);
    })
  }
});

/* 回收站组件 */
Vue.component('rubbish',{
  template: '#rubbish',
  props: ['todoData'],
  data(){
    return {
      trashList: []
    }
  },
  computed: {
    calcNum(){
      let arr = this.trashList.filter( item => {
        return item !== undefined
      });
      return arr.length;
    }
  },
  methods:{
    toggleShow(){
      eventBus.$emit('changeDelDisplay');
    }
  },
  created(){
    this.trashList = this.todoData.del;
  }
});

/* 提醒组件 */
Vue.component('alert',{
  template: '#alert',
  props: ['alertList'],
  data(){
    return {}
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
      },500);
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
          title: 'todo:读书',
          content: '读📕',
          date: '2018-07-12',
          isExpire: 0
        },
        {
          title: 'todo:编程',
          content: 'coding🍳',
          date: '2018-07-12',
          isExpire: 1
        },
        {
          title: 'todo:弹吉他',
          content: '吉他吉他吉他🎸',
          date: '2018-07-12',
          isExpire: 2
        },
        {
          title: 'todo:画个画',
          content: '🎨',
          date: '2018-07-12',
          isExpire: 2
        }
      ],
      done: [
        {
          title: 'done:买西红柿',
          content: '',
          date: '2018-07-10',
          isExpire: 2
        },
        {
          title: 'done:买茄子',
          content: '买一个圆茄子、长茄子',
          date: '',
          isExpire: 0
        }
      ],
      del: [
        {
          title: '用烤箱做一个蛋糕🎂',
          content: '美味的蛋糕~',
          date: '',
          isExpire: 0
        },
        undefined
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
      if(a == 'date'|| a == 'del'){
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
* 4、执行垃圾桶删除功能时，使用了computed计算item数组已存在值的长度，使用了method绑定到按钮执行删除操作，使用了watch监测computed返回值。
* 执行删除操作时，以上的执行顺序为，method（清除）->computed（计算）->watch（监测变动，改动item数组）->computed（重新计算）
* 操作顺序没有问题，但是在执行watch操作的时候，使用了forEach+delete删除功能，删掉数组的第一位的值时，数组长度减少一位，第二位变为第一位，
* 此时的索引值已经到第二位了，因此又跳过了曾经的第二位（删除后的第三位），在曾经的第三位（删除后的第二位）上进行操作。因此不能使用这个方式进行删除,
* this.delList = []也不行，相当于换了一个引用，原代码未被修改。最后使用了for循环的倒序方式
*
* */

// DONE 过期显示功能、提醒功能、清除功能、回收站功能

// TODO localstorage的引入

// FIXED 待做列表和已完成列表，如果有项目是展开的状态，把它加进另外一个列表，再回到曾经的列表，它仍旧是展开的