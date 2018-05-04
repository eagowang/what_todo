//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        today: '',
        todo: {
            completeRate: 0,
            complete: 0,
            total: 0,
            data: {}
        },
        weights: ['紧急重要', '紧急不重要', '不紧急重要', '不紧急不重要'],
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
        } else if (this.data.canIUse) {
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
    onShow: function () {
        this.getTodo()
    },
    getTodo: function() {
        let today = new Date().toLocaleDateString(),   //当天日期
            todoObj = wx.getStorageSync('todo_' + today),   //获取缓存数据
            total = 0,  //todo总数
            complete = 0;    //完成总数
        //清除历史数据
        let storageInfo = wx.getStorageInfoSync();
        // console.log(storageInfo)
        storageInfo.keys.forEach((val) => {
            if(val !== 'todo_'+today){
                if(val.indexOf('todo_') !== -1){
                    wx.removeStorageSync(val);
                }
            }
        })
        //todo 上报服务器该用户的完成率
        //当天第一次进入小程序，初始化数据格式，只处理一次
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
        // console.log(complete/total)
        this.setData({
            'todo.total': total,
            'todo.data': todoObj,
            'todo.complete': complete,
            'todo.completeRate': total>0 ? Math.floor(complete/total*100) : 0
        })
    },
    checkboxChange: function(e){
        let index = e.currentTarget.dataset.index,
            weight = e.currentTarget.dataset.weight;
        console.log(weight + '_' + index)
        let todoData = this.data.todo.data;
        todoData[weight].forEach(function (val,idx) {
            if (idx == index) {
                val.done = !val.done;
            }
        })
        let today = new Date().toLocaleDateString();
        wx.setStorageSync('todo_' + today, todoData);
        this.updateHistory();
        this.getTodo()
    },
    delTodo: function(e) {
        let index = e.currentTarget.dataset.index,
            weight = e.currentTarget.dataset.weight,
            todoObj = this.data.todo.data,
            that = this;
        wx.showModal({
            title: '提示',
            content: '确定要删除这条todo吗？',
            success: function (res) {
                if (res.confirm) {
                    todoObj[weight] = todoObj[weight].filter(function (val, idx) {
                        return idx != index
                    })
                    let today = new Date().toLocaleDateString();
                    wx.setStorageSync('todo_' + today, todoObj);
                    that.updateHistory();
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
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
});
