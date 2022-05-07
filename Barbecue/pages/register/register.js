// pages/register/register.js
const apiurl = getApp().globalData.apiurl;
var user_info = getApp().globalData.user;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		address: ''
	},

	chooseLocation: function (e) {
		var _this = this;
		wx.chooseLocation({
			success: function (res) {
				_this.setData({
					address: res.address
				})
			},
		})
	},

	submitEvent: function (e) {
		var name = e.detail.value.name;
		var sex = e.detail.value.sex;
		var tel = e.detail.value.tel;
		var password = e.detail.value.password;
		var confirmPassword = e.detail.value.confirmPassword;
		var address = e.detail.value.address;
		var houseNumber = e.detail.value.houseNumber;

		// 正则表达式判断手机号码是否合法
		// 1.第一位以1开头，用^[1]表示
		// 2.第二位不能为0、1、2，将范围锁定[3-9]
		// 3.手机号码只能为11位数字，后面9位只要位数字就行，因此为[0-9]，但是只要9位，用{9}表示出现9次
		// 4.除了11位数字没有别的了，用结束符号$
		var reg = /^[1][3-9][0-9]{9}$/;

		if (name == '' || tel == '' || password == '' || confirmPassword == '' || address == '' ||houseNumber == '') {
			wx.showToast({
				title: '请输入完整信息',
				icon: 'error',
				duration: 2000,
			})
		} else if (!reg.test(tel)) {
			wx.showToast({
				title: '电话号码不合法',
				icon: 'error',
				duration: 2000
			})
		} else {
			if (password == confirmPassword) {
				wx.request({
					url: apiurl + 'user',
					data: {
						name: name,
						sex: sex,
						tel: tel,
						password: password,
						address: address,
						houseNumber: houseNumber
					},
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success: (res) => {
						wx.showLoading({
							title: '正在注册...',
						})
						setTimeout(() => {
							wx.hideLoading();
							if (res.data.length) {
								wx.showToast({
									icon: 'none',
									title: '您已经注册过啦',
									success: (res) => {
										setTimeout(() => {
											wx.hideToast();
											wx.showLoading({
												title: '请登录...',
												success: (res) => {
													setTimeout(() => {
														wx.navigateTo({
															url: '/pages/login/login?tel=' + tel,
														})
													}, 2000)
												}
											});
											setTimeout(() => {
												wx.hideLoading();
											}, 2000)
										}, 2000)
									}
								}, 2000)
							} else {
								user_info.name = name;
								user_info.sex = sex;
								user_info.tel = tel;
								user_info.password = password;
								user_info.avatar = sex == '男' ? 'https://cdn.jsdelivr.net/gh/LiuShiqiang2421/images/Barbecue/男.png' : 'https://cdn.jsdelivr.net/gh/LiuShiqiang2421/images/Barbecue/女.png';
								user_info.address = address;
								user_info.houseNumber = houseNumber;
								wx.showToast({
									title: '注册成功！',
									icon: 'success',
									success: (res) => {
										setTimeout(() => {
											wx.switchTab({
												url: '/pages/home/home',
											})
										}, 2000)
									}
								});
							}
						}, 2000);
					}
				})
			} else {
				wx.showToast({
					title: '两次密码不一致',
					icon: 'error',
					duration: 2000
				})
			}
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