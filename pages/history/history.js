// pages/history/history.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        historyTodo: {},
        weights: ['紧急重要', '紧急不重要', '不紧急重要', '不紧急不重要']
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

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.getHistoryTodo();
    },
    //获取最近7天的todo列表
    getHistoryTodo: function () {
        let historyTodo = wx.getStorageSync('history_todo');
        // console.log(historyTodo);
        this.setData({
            historyTodo: historyTodo
        })
    },
    //获取单独每天的完成率
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})