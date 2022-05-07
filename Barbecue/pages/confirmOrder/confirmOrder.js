// pages/confirmOrder/confirmOrder.js
const apiurl = getApp().globalData.apiurl;
var user_info = getApp().globalData.user;
var current_time = getApp().globalData.current_time;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		hiddenAddress: true,
		hiddenTableNumbers: false,
		mealMethod: 'eat-in',
		tablewareNumbers: ['无需餐具', '1份', '2份', '3份', '4份', '5份', '6份', '7份', '8份', '9份', '10份', '10份以上'],
		tableNumbers: ['请选择', '1', '2', '3', '4', '5', '7', '8', '9', '10', '11', '12', '13', '14', '15', '17', '18', '19', '20'],
		tablewareNumbersIndex: 0,
		tableNumbersIndex: 0,
		select_time: '',
		// 购物车数据
		cartList: {},
		totalPrice: 0.00,
		totalNum: 0,
		payPrice: 0.00,
		// 备注信息
		remarks: '',
	},

	mealMethod: function (e) {
		if (e.detail.value == 'take-away') {
			this.setData({
				hiddenAddress: false,
				hiddenTableNumbers: true
			})
		} else {
			this.setData({
				hiddenAddress: true,
				hiddenTableNumbers: false
			})
		}
		this.setData({
			mealMethod: e.detail.value
		})
	},

	bindTableNumbersChange: function (e) {
		this.data.tableNumbersIndex = e.detail.value;
		this.setData({
			tableNumbersIndex: e.detail.value
		})
	},

	updateAddress: function (e) {
		wx.navigateTo({
			url: '/pages/updateAddress/updateAddress',
		})
	},

	selectTimeEvent: function (e) {
		this.data.select_time = e.detail.value;
		this.setData({
			select_time: e.detail.value
		})
	},

	//小于10的拼接上0字符串
	addZero: function (s) {
		return s < 10 ? ('0' + s) : s;
	},

	bindTablewareChange: function (e) {
		this.data.tablewareNumbersIndex = e.detail.value;
		this.setData({
			tablewareNumbersIndex: e.detail.value
		})
	},

	getRemarks: function (e) {
		this.data.remarks = e.detail.value;
		this.setData({
			remarks: e.detail.value
		})
	},

	goToPay: function (e) {
		if (this.data.mealMethod == 'eat-in' && this.data.tableNumbersIndex == 0) {
			wx.showToast({
				title: '请选择桌号~',
				icon: 'error',
				duration: 2000
			})
		} else {
			wx.showLoading({
				title: '正在支付',
			});
			var mealMethod = this.data.mealMethod;
			var tableNumber = this.data.tableNumbers[this.data.tableNumbersIndex] == '请选择' ? '' : this.data.tableNumbers[this.data.tableNumbersIndex];
			var select_time = this.data.select_time;
			var arr = wx.getStorageSync('cart') || [];
			var tablewareNumbers = this.data.tablewareNumbers[this.data.tablewareNumbersIndex];
			var remarks = this.data.remarks;
			var payPrice = this.data.payPrice;

			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var day = date.getDate();
			var hour = date.getHours();
			var minute = date.getMinutes();
			var second = date.getSeconds();
			current_time = year + '-' + this.addZero(month) + '-' + this.addZero(day) + ' ' + this.addZero(hour) + ':' + this.addZero(minute) + ':' + this.addZero(second);

			wx.request({
				url: apiurl + 'order',
				data: {
					order_user_name: user_info.name,
					order_user_sex: user_info.sex,
					order_user_tel: user_info.tel,
					order_catelist: JSON.stringify(arr),
					order_time: current_time,
					order_meal_method: mealMethod,
					order_remarks: remarks,
					order_tableware_numbers: tablewareNumbers,
					order_coupon: user_info.coupon,
					order_pay_price: payPrice,
					order_table_number: tableNumber,
					order_address: user_info.address + user_info.houseNumber,
					order_receiving_time: select_time,
				},
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
				success: (res) => {
					setTimeout(() => {
						wx.hideLoading();
						if (res.data.status == '成功') {
							user_info.points = Number(user_info.points) + Number(payPrice * 0.10);
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
							})
							if (this.data.payPrice < this.data.totalPrice) {
								user_info.coupon = 0.00;
								wx.request({
									url: apiurl + 'user/clearCoupon',
									data: {
										tel: user_info.tel,
									},
									method: 'POST',
									header: {
										'content-type': 'application/x-www-form-urlencoded',
									},
								})
							}
							wx.showToast({
								icon: 'success',
								title: '支付成功',
								success: (res) => {
									setTimeout(() => {
										wx.hideToast();
										wx.switchTab({
											url: '/pages/order/order',
										})
									}, 2000)
								}
							});
						} else {
							wx.showToast({
								title: '支付失败',
								icon: 'error',
								success: (res) => {
									setTimeout(() => {
										wx.hideToast();
									}, 2000)
								}
							})
						}
					}, 2000)
				},
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		var date = new Date();

		var hour = date.getHours();
		var minute = date.getMinutes();

		date.setMinutes(minute + 30);
		var m = date.getMinutes();

		var start_time = this.addZero(hour) + ':' + this.addZero(m);
		var arr = wx.getStorageSync('cart') || [];

		for (var i in arr) {
			this.data.totalNum += arr[i].meal_purchase_quantity;
			this.data.totalPrice += arr[i].meal_purchase_quantity * arr[i].meal_price;
		}

		if (this.data.totalPrice >= 200 && user_info.coupon > 0) {
			this.data.payPrice = this.data.totalPrice - user_info.coupon;
		} else {
			this.data.payPrice = this.data.totalPrice;
		}

		this.setData({
			select_time: start_time,
			start_time: start_time,
			cartList: arr,
			totalNum: this.data.totalNum,
			totalPrice: this.data.totalPrice.toFixed(2),
			payPrice: this.data.payPrice.toFixed(2),

		})
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