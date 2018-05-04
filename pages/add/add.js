// pages/add/add.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        todo: {
            completeRate: 0,
            complete: 0,
            total: 0,
            data: {}
        },
        weights: ['紧急重要', '紧急不重要', '不紧急重要', '不紧急不重要'],
        newTodo: {}
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
    getTodo: function() {
        let today = new Date().toLocaleDateString(),   //当天日期
            todoObj = wx.getStorageSync('todo_' + today),   //获取缓存数据
            total = 0,  //todo总数
            complete = 0;
        //特殊情况，只处理一次
        if (todoObj === '') {
            todoObj = {
                0: [],
                1: [],
                2: [],
                3: []
            }
        } else {
            for(let i in todoObj){
                total += todoObj[i].length;
                for(let j = 0,len = todoObj[i].length; j < len; j++){
                    if(todoObj[i][j].done){
                        complete += 1;
                    }
                }
            }
        }
        this.setData({
            'todo.total': total,
            'todo.data': todoObj,
            'todo.complete': complete,
            'todo.completeRate': Math.floor(complete/total*100)
        })
    },
    updateTodo: function() {
        let newTodo = this.data.newTodo,
            today = new Date().toLocaleDateString(),
            todoObj = this.data.todo.data;
        if(newTodo.text && newTodo.weight !== ''){
            let weight = newTodo.weight;
            this.setData({
                'newTodo.done': false
            })
            //在该权重数组推进新的项
            todoObj[weight].push(newTodo);
            //存储修改后的数据
            wx.setStorageSync('todo_' + today, todoObj);

            this.updateHistory();
            this.setData({
                newTodo: {}
            })
        }else{
            wx.showToast({
                title: '请填写完整',
                icon: 'none',
                duration: 1000
            })
        }
    },
    //更新历史
    updateHistory: function(){
        this.getTodo();
        let today = new Date().toLocaleDateString(),
            todoObj = this.data.todo.data,
            completeRate = this.data.todo.completeRate;
        let historyTodo = wx.getStorageSync('history_todo') ? wx.getStorageSync('history_todo') : [];
        // console.log(historyTodo);
        //如果time是当天，将todo移出
        for(var i in historyTodo){
            if(historyTodo[i].time == today){
                historyTodo.splice(i,1)
            }
        }
        if(historyTodo.length >= 7){
            historyTodo.pop()
        }
        historyTodo.unshift({
            completeRate: completeRate,
            time: today,
            data: todoObj
        });
        wx.setStorageSync('history_todo',historyTodo);
    },
    //同步输入
    inputTodo: function(e){
        this.setData({
            'newTodo.text': e.detail.value,
        })
    },
    //选择权重
    bindWeightChange: function(e){
        let index = e.detail.value;
        // console.log(index)
        this.setData({
            'newTodo.weight': parseInt(index),
        })
    },
    goback: function(e){

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getTodo();
        let historyTodo = wx.getStorageSync('history_todo') ? wx.getStorageSync('history_todo') : [];
        console.log(historyTodo)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})