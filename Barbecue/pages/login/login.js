// pages/login/login.js
const apiurl = getApp().globalData.apiurl;
var user_info = getApp().globalData.user;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	submitEvent: function (e) {
		var tel = e.detail.value.tel;
		var password = e.detail.value.password;
		if (tel == '' || password == '') {
			wx.showToast({
				title: '请输入完整信息',
				icon: 'error',
				duration: 2000,
			})
		} else if (tel.length != 11) {
			wx.showToast({
				title: '电话号码不合法',
				icon: 'error',
				duration: 2000
			})
		} else {
			wx.request({
				url: apiurl + 'user/login',
				data: {
					tel: tel,
					password: password,
				},
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
				success: (res) => {
					wx.showLoading({
						title: '请稍等...',
					})
					setTimeout(() => {
						wx.hideLoading();
						if (res.data.length) {
							user_info.id = res.data[0].user_id;
							user_info.name = res.data[0].user_name;
							user_info.sex = res.data[0].user_sex;
							user_info.tel = tel;
							user_info.password = res.data[0].password;
							user_info.points = parseFloat(res.data[0].points).toFixed(2);
							user_info.avatar = res.data[0].avatar;
							user_info.is_receive = res.data[0].is_receive;
							user_info.address = res.data[0].user_address;
							user_info.houseNumber = res.data[0].user_detailed_address;
							user_info.coupon = parseFloat(res.data[0].coupon).toFixed(2);
							wx.showToast({
								title: '登录成功',
								icon: 'success',
								success: (res) => {
									setTimeout(() => {
										wx.switchTab({
										  url: '/pages/my/my',
										})
									}, 2000)
								}
							})
						} else if (res.data.status == '密码错误') {
							wx.showToast({
								title: '密码错误',
								icon: 'error',
								duration: 2000
							})
						} else {
							wx.showToast({
								title: '您尚未注册',
								icon: 'error',
								duration: 2000
							})
						}
					}, 2000);
				}
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		if (options.tel) {
			this.setData({
				tel: options.tel
			})
		}
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