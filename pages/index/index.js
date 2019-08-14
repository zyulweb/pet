// pages/index/index.js
const db = wx.cloud.database()
//获取全局变量
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '',
    latitude: '',
    markers: []
  },
  // 设置可以转发
  onShareAppMessage() {
    return {
      title: '萌宠交易平台',
      path: '/pages/index/index'
    }
  },
  //回到原来位置
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getlocation()
    this.getMessage()
  },
  getMessage() {     //从数据库查询信息,拿到发布的信息后显示在地图上
    db.collection("publish").where({
      name: "1",
    }).get()
      .then(res => {
        // 显示sell 的信息  

        const markers = res.data.map((value, index) => {
          return {
            iconPath: "/images/"+value.type+".png",
            id: value._id,
            latitude: value.latitude,
            longitude: value.longitude,
            width: 40,
            height: 40
          }
        });
     
        this.setData({
          markers: markers
        });
      }).catch(err => {
        console.log(err)
      })
  },
  // 获取当前位置函数
  getlocation() {
    wx.getLocation({
      type: 'gcj02',
      success: this.handleGetLocationSucc.bind(this)
    });
  },
  handleGetLocationSucc(res) {
    // console.log(res)
    this.setData({
      longitude: res.longitude,
      latitude: res.latitude
    })
  },
  // 点击回到站立点
  controltap() {
    this.mapCtx.moveToLocation()
  },
  //点击狗狗图标跳转到详情
  markertap(e) {
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + e.markerId

    })
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