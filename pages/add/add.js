// pages/add/add.js
Page({

  /**
   * 页面的初始数据
   */
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
    weights: ['紧急重要', '紧急不重要', '不紧急重要', '不紧急不重要'],
    newTodo: {},
    weight: '',
    text: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  getTodo: function () {
    let today = new Date().toLocaleDateString();
    let todoObj = wx.getStorageSync('todo_' + today);
    let length = 0;
    //计算缓存中的总数
    if (todoObj instanceof Object) {
      for (var i in todoObj) {
        if (todoObj[i] instanceof Array) {
          length += todoObj[i].length
        }
      }
    }
    if (length) {
      Object.assign(this.data.todo.data, todoObj)
    }
    //todo 获取总数
    this.setData({
      'todo.total': length,
      'todo.data': this.data.todo.data
    })
    console.log(this.data.todo)
  },
  //添加todo
  updateTodo: function () {
    if(this.data.text && this.data.weight){
      let today = new Date().toLocaleDateString();
      let todoObj = this.data.todo.data;
      let weight = this.data.newTodo.weight;
      this.setData({
        'newTodo.done': 0,
        'newTodo.id': this.data.todo.total
      })
      todoObj[weight].push(this.data.newTodo);
      wx.setStorageSync('todo_' + today, todoObj)
      this.getTodo();
      this.setData({
        newTodo: {},
        weight: '',
        text: '',
      })
    }else{
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 1000
      })
    }
  },
  //输入同步
  inputTodo: function (e) {
    this.setData({
      'newTodo.text': e.detail.value,
      'text': e.detail.value
    })
  },
  doneTodo: function (index) {

  },
  delTodo: function (index) {

  },
  bindWeightChange: function (e) {
    let index = e.detail.value;
    this.setData({
      'newTodo.weight': parseInt(index),
      'weight': this.data.weights[index]
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTodo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})