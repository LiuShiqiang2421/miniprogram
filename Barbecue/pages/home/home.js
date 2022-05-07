// pages/home/home.js
const apiurl = getApp().globalData.apiurl;
var user_info = getApp().globalData.user;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isHidden: false,
	},

	order: function () {
		wx.switchTab({
			url: '/pages/category/category',
		})
	},

	takeOut: function () {
		if (user_info.tel) {
			wx.navigateTo({
			  url: '/pages/takeOut/takeOut',
			})
		} else {
			wx.showModal({
				title: '请先注册或登录账号',
				success(res) {
					if (res.confirm) {
						wx.switchTab({
							url: '/pages/my/my',
						})
					} else if (res.cancel) {
						wx.switchTab({
							url: '/pages/home/home',
						})
					}
				}
			})
		}
	},

	membershipInterests: function () {
		if (user_info.tel) {
			wx.navigateTo({
			  url: '/pages/couponCenter/couponCenter',
			})
		} else {
			wx.showModal({
				title: '请先注册或登录账号',
				success(res) {
					if (res.confirm) {
						wx.switchTab({
							url: '/pages/my/my',
						})
					} else if (res.cancel) {
						wx.switchTab({
							url: '/pages/home/home',
						})
					}
				}
			})
		}
	},

	review: function () {
		wx.navigateTo({
			url: '/pages/diningEvaluation/diningEvaluation',
		})
	},

	receive: function () {
		if (user_info.tel == '') {
			wx.showModal({
				title: '注册或登录账号',
				content: '登录账号可享更多权益~',
				success: (res) => {
					if (res.confirm) {
						wx.switchTab({
							url: '/pages/my/my',
						})
					}
				}
			})
		} else {
			user_info.is_receive = 1;
			user_info.coupon = 50.00;
			wx.request({
				url: apiurl + 'user/receive',
				data: {
					tel: user_info.tel,
				},
				method: 'POST',
				header: {
					'content-type': 'application/x-www-form-urlencoded',
				},
				success: (res) => {
					wx.showToast({
						title: '领取成功',
						icon: 'success',
						success: (res) => {
							setTimeout(() => {
								wx.hideToast();
								this.setData({
									isHidden: true,
								})
							}, 2000)
						}
					});
				},
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var info = wx.getSystemInfoSync();
		var width = info.windowWidth;
		var height = width / 974 * 630;
		this.setData({
			width: width,
			height: height,
		});
		
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
		if (user_info.is_receive == 1) {
			this.setData({
				isHidden: true
			})
		}
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