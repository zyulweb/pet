// pages/detail/detail.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "",
    type: "",
    message: "",
    contact: "",
    fileIDs:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {  //options 接受跳转传的参数
    db.collection("publish").where({
      _id: options.id
    }).get()
      .then(res => {
        const data = res.data[0]
        this.setData({
          address: data.address,
          type: data.type,
          message: data.message,
          contact: data.contact,
          fileIDs: data.fileIDs
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