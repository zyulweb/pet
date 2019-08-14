// pages/publish/publish.js
// 引用云数据库
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: "点击选择,要勾选哦~",
    showUpload : false,
    images: [],
    fileIDs:[],
    concat:"",
    message:"",
    success: true,
    type:""
  },
  //创建保存所获取的地址经纬度的对象
  staticData: {
    name:"publish"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 选择地址
  handleAdressClick() {
    wx.chooseLocation({
      success: this.handleChooseLocationSucc.bind(this)
    })
  },
  // 把选好的地址放在data.address中
  handleChooseLocationSucc(res) {
    this.setData({
      address: res.address
    });
   if(!res.address){
     this.setData({
       address: "点击选择,要勾选哦~"
     })
   }
    // 把获得的经纬度放到staticData中
    Object.assign(this.staticData, {
      latitude: res.latitude,
      longitude: res.longitude
    });
    // console.log(this.staticData)
  },
  // 类型选择
  handleTypeChange(e) {
    this.setData({
      type:e.detail.value
    })
    //用户选择转让可以上传自己的宠物照片
    if(e.detail.value=="buy"){
      this.setData({
        showUpload:false
      })
    } else if(e.detail.value =="sell"){
      this.setData({
        showUpload: true
      })
    }
  },
  // 监听输入的联系方式
  handleContact(e) {
     this.setData({
       contact: e.detail.value
     })
  },
  handleMessage(e) {
     this.setData({
       message: e.detail.value
     })
  },
  //用户选择上传萌宠照片
  handleUpload() {
    wx.chooseImage({
      count:9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res)=>{
        const tempFiles = res.tempFilePaths;
        //预览:将用户选中图片保存
        this.setData({
          images: tempFiles
        })
      },
    })
  },
  // 发布信息 对用户输入的内容进行判断验证
  handleSubmit() {
    if (this.data.address === "点击选择,要勾选哦~" || !this.data.address) {
      wx.showToast({
        title: '请填写地址',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    if (!this.data.type) {
      wx.showToast({
        title: '请填写类型',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    if (!this.data.message) {
      wx.showToast({
        title: '请填写宠物信息',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    var reg = /^[\u4e00-\u9fa5a-zA-Z\d,\.，。]{6,}$/;    //用正则匹配字符
    if(!reg.test(this.data.message)){
      wx.showToast({
        title: '至少填写6位字符',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    if (!this.data.contact) {    
      wx.showToast({
        title: '请填写联系方式',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    var phoneReg = /^1[3-9]\d{9}$/;
    if (!phoneReg.test(this.data.contact)) {
      wx.showToast({
        title: '联系方式有误',
        icon: 'loading',
        duration: 2000
      })
      return;
    }
    
    //显示加载框  正在发布
    wx.showLoading({
      title: '发布中',
    });

    //把用户上传的宠物照片保存到云存储中,保证图片依次上传完毕 创建promise 函数 保存到数组中
    let promiseArr = [];
    for(var i=0;i<this.data.images.length;i++){
      promiseArr.push(new Promise((reslove,reject)=>{
        // 获取当前图片路径
        var item = this.data.images[i];
        //当保存到云存储时给每个图片加文件名
        //先用正则取出图片文件的后缀  .jpg/png
        let suffix = /\.\w+$/.exec(item);
        wx.cloud.uploadFile({
          cloudPath:new Date().getTime() + suffix,   //在云存储中的文件名   云端的路径
          filePath:item,    //文件路径
          success:res=>{
            var ids = this.data.fileIDs.concat(res.fileID);
            this.setData({
              fileIDs:ids
            })
            //成功后继续执行下一次函数
            reslove()
          },
          fail:err=>{
            console.log(err)
          }
        })
      }))
    }


    // 把发布的数据存储到云数据库中 包括图片fileID  
    //只有图片都上传完了再执行下面的
    Promise.all(promiseArr).then(res=>{
      db.collection("publish").add({
        data: {
          address: this.data.address,          //地址
          latitude: this.staticData.latitude,  //维度
          longitude: this.staticData.longitude,//经度
          type: this.data.type,         //类型
          message: this.data.message,    //说明要求
          contact: this.data.contact,     //联系方式
          fileIDs : this.data.fileIDs,
          name : "1"
        }
      }).then(res => {
        wx.hideLoading();//隐藏加载框
        this.setData({
          showUpload: false,
          images:[],
          address: "点击选择,要勾选哦~",
          concat: "",
          message: "",
          success: false,
          fileIDs: [],
          type:""
        })
        var time=setTimeout(()=>{
          this.setData({
            success : true
          })
        },3000)
      }).catch(err => {
        console.log(err)
        wx.hideLoading();//隐藏加载框
        wx.showToast({   //显示提示框
          title: '发布失败'
        })
      })
    });
  },
  handleBack() {
    wx.navigateBack({
      delta: 1
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