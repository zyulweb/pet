// pages/search/search.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
  },
  getList() {
    db.collection("publish").where({
      _openid: "oCJ3j5PfDVNqreHSlA-ojIwNPJQk",
    })
      .get()
      .then(res => {
        this.setData({
          list: res.data
        })
      }).catch(err => {
        console.log(err)
      })
  },

  handleDelete(e){
    wx.showModal({
      title: '提示',
      content: '确定要删除发布的消息吗',
      success:(res)=>{
        if (res.confirm) {
          let id = e.target.dataset.id;
          db.collection("publish").doc(id)
            .remove({
              success: res => {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });
                this.getList();               
              },
              fail: res => {
                wx.showToast({
                  title: '删除失败',
                  icon: 'success',
                  duration: 2000
                })
              }
            })
        } else if (res.cancel) {
          return;
        }
      }
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
    this.getList();
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