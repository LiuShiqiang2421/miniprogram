// pages/couponCenter/couponCenter.js
const apiurl = getApp().globalData.apiurl;
var user_info = getApp().globalData.user;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	couponEvent: function (e) {
		if (user_info.points >= e.currentTarget.dataset.c_points) {
			user_info.points = Number(user_info.points) - e.currentTarget.dataset.c_points;
			user_info.coupon = Number(user_info.coupon) + e.currentTarget.dataset.c_money;

			wx.request({
				url: apiurl + 'user/updatePoints',
				data: {
					user_tel: user_info.tel,
					points: user_info.points
				},
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
			});
			wx.request({
				url: apiurl + 'user/updateCoupon',
				data: {
					user_tel: user_info.tel,
					coupon: user_info.coupon
				},
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
			});
			wx.showToast({
				title: '领取成功~',
				icon: "success",
			})
			this.onShow();
			setTimeout(() => {
				wx.hideToast();
			}, 2000)
		} else {
			wx.showToast({
				title: '积分不够哦~',
				icon: 'error',
				duration: 2000
			})
		}
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
		wx.request({
			url: apiurl + 'coupon',
			success: (res) => {
				this.setData({
					coupon: res.data,
					user_info: user_info
				})
				
			}
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