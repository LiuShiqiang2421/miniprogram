// pages/order/order.js
const apiurl = getApp().globalData.apiurl;
var user_info = getApp().globalData.user;
var current_time = getApp().globalData.current_time;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	bindFormSubmit: function (e) {
		var that = this;
		var order_id = e.detail.value.order_id;
		var order_time = e.detail.value.order_time;
		var content = e.detail.value.content;
		if (content) {
			wx.showLoading({
				title: '正在提交',
			});
			wx.request({
				url: apiurl + 'evaluation',
				data: {
					e_order_id: order_id,
					e_order_tel: user_info.tel,
					e_order_avatar: user_info.avatar,
					e_order_name: user_info.name,
					e_order_time: order_time,
					e_content: content,
				},
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
				success: (res) => {
					setTimeout(() => {
						wx.hideLoading();
						if (res.data.status == '成功') {
							wx.showToast({
								title: '提交成功',
								icon: "success",
								success: (res) => {
									that.onShow();
								}
							})
						} else {
							console.log(res.data)
							wx.showToast({
								title: '提交失败',
								icon: 'error',
								duration: 2000
							})
						}
					}, 2000)
				}
			})
		} else {
			wx.showToast({
				title: '请先评价~',
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
			url: apiurl + 'order/' + user_info.tel,
			success: (res_order) => {
				for (var i in res_order.data) { //使用JSON.parse()方法将数据转换为JavaScript对象
					res_order.data[i].order_catelist = JSON.parse(res_order.data[i].order_catelist);
				}
				this.setData({
					order: res_order.data,
				});
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