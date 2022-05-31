// pages/my/my.js
const apiurl = getApp().globalData.apiurl;
var user_info = getApp().globalData.user;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {},

	couponCenter: function (e) {
		if (user_info.tel) {
			wx.navigateTo({
				url: '/pages/couponCenter/couponCenter',
			})
		} else {
			wx.showToast({
				title: '登录或注册账号',
				icon: "error",
				duration: 2000
			})
		}
	},

	myAddress: function () {
		if (user_info.tel) {
			wx.navigateTo({
				url: '/pages/takeOut/takeOut',
			})
		} else {
			wx.showToast({
				title: '登录或注册账号',
				icon: "error",
				duration: 2000
			})
		}
	},

	register: function () {
		wx.navigateTo({
			url: '/pages/register/register',
		})
	},

	login: function () {
		wx.navigateTo({
			url: '/pages/login/login',
		})
	},

	logout: function () {
		wx.showLoading({
			title: '请稍等...',
		});
		setTimeout(() => {
			wx.hideLoading();
			this.setData({
				user_info: Object.keys(user_info).forEach(key => {
					user_info[key] = ''
				}),
			});
			this.onShow();
		}, 1500);
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		this.setData({
			user_info: user_info
		})
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})