// pages/search/search.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    skips:0,
    searchMessage:''
  },
  handleSeach(){
    if(!this.data.searchMessage){
      wx.showToast({
        title: '请输入搜搜内容',
        icon: 'none',
        duration: 2000
      })
    }else{
      db.collection("publish").where({
        message: db.RegExp({
        regexp: this.data.searchMessage,
        options: 'i',
        }),  
      }).get()
        .then(res => {
          this.setData({
            list: res.data
          })
          if(res.data.length==0){
            wx.showToast({
              title: '查询的内容不存在',
              icon: 'none',
              duration: 2000
            });
            this.setData({
              list: [],
              skips: 0
            })
            this.getList(1)
          }  
        }).catch(err => {
          console.log(err)
        })
    }
  },

  handleInputChange(e) {
    this.setData({
      searchMessage: e.detail.value
    })
    if(!e.detail.value){
      this.setData({
        list:[],
        skips: 0
      })
      this.getList(0)
    }
  },
  handleItemTap(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.currentTarget.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  getList(n) {
    db.collection("publish").where({
      name: "1",
      // message: this.staticData.message
    }).skip(n) // 跳过结果集中的前 n条，从第 n+1条开始返回
      .limit(20) // 限制返回数量为 20 条
      .get()
      .then(res => {
        var lists = this.data.list.concat(res.data)
        this.setData({
          list:lists
        })
         
      }).catch(err => {
        console.log(err)
      })
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
    this.setData({
      list:[]
    })
    this.getList(0)
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
    this.setData({
      skips: this.data.skips += 20
    })
    var n =this.data.skips
    this.getList(n)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})