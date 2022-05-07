// pages/updateAddress/updateAddress.js
const apiurl = getApp().globalData.apiurl;
var user_info = getApp().globalData.user;
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		
	},

	submitEvent: function (e) {
		var name = e.detail.value.name;
		var sex = e.detail.value.sex;
		var address = e.detail.value.address;
		var houseNumber = e.detail.value.houseNumber;

		if (name == '' || address == '' || houseNumber == '') {
			wx.showToast({
				title: '请输入完整信息',
				icon: 'error',
				duration: 2000,
			}) 
		} else {
			wx.showModal({
				title: '是否修改？',
				success: (res) => {
					if (res.confirm) {
						wx.showLoading({
							title: '正在上传数据...',
							mask: true,
						});
						wx.request({
							url: apiurl + 'user/' + user_info.id,
							data: {
								id: user_info.id,
								name: name,
								sex: sex,
								address: address,
								houseNumber: houseNumber
							},
							method: 'PUT',
							success: (res) => {
								console.log(res.data)
								if (res.data.status == '成功') {
									user_info.name = name;
									user_info.sex = sex;
									user_info.address = address;
									user_info.houseNumber = houseNumber;
									setTimeout(() => {
										wx.hideLoading();
										wx.showToast({
											title: '修改成功！',
											success: (res) => {
												setTimeout(() => {
													wx.navigateBack();
												}, 2000);
											}
										});
									}, 2000);
								} else {
									wx.showToast({
										icon: 'error',
										title: '修改失败',
										duration: 2000
									})
								}
							}
						})
					}
				}
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.id = options.id;
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