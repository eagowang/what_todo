//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    todo: {
      total: 0,
      data: {
        0: [],
        1: [],
        2: [],
        3: []
      }
    },
    weights: ['紧急重要', '紧急不重要', '不紧急重要','不紧急不重要'],
    newTodo: {},
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function(){
    this.getTodo()
  },
  getTodo: function() {
    let today = new Date().toLocaleDateString();
    let todoObj = wx.getStorageSync('todo_' + today);
    let length = 0;
    //计算缓存中的总数
    if(todoObj instanceof Object){
      for(var i in todoObj){
        if(todoObj[i] instanceof Array){
          length += todoObj[i].length
        }
      }
    }
    if(length){
      Object.assign(this.data.todo.data,todoObj)
    }
   //todo 获取总数
    this.setData({
      'todo.total': length,
      'todo.data': this.data.todo.data 
    })
    console.log(this.data.todo)
  },
  updateTodo: function () {
    if (this.data.text && this.data.weight) {
      let today = new Date().toLocaleDateString();
      let todoObj = this.data.todo.data;
      let weight = this.data.newTodo.weight;
      this.setData({
        'newTodo.done': 0
      })
      todoObj[weight].push(this.data.newTodo);
      wx.setStorageSync('todo_' + today, todoObj)
      this.getTodo();
      this.setData({
        newTodo: {},
        weight: '',
        text: ''
      })
    } else {
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 1000
      })
    }
  },
  delTodo: function(e){
    let index = e.currentTarget.dataset.index;
    let weight = e.currentTarget.dataset.weight;
    let todoData = this.data.todo.data;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除这条todo吗？',
      success: function (res) {
        if (res.confirm) {
          todoData[weight] = todoData[weight].filter(function (val) {
            return val.id != index
          })
          let today = new Date().toLocaleDateString();
          wx.setStorageSync('todo_' + today, todoData);
          that.getTodo()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  checkboxChange: function(e){
    let index = e.currentTarget.dataset.index;
    let weight = e.currentTarget.dataset.weight;
    console.log(index+'_'+weight)
    let todoData = this.data.todo.data;
    todoData[weight].forEach(function(val){
      if(val.id == index){
        val.done = !val.done;
      }
    })
    let today = new Date().toLocaleDateString();
    wx.setStorageSync('todo_'+today, todoData);
    this.getTodo()
  }
})
