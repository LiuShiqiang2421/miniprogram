const apiurl = getApp().globalData.apiurl;
var user_info = getApp().globalData.user;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		windowHeight: 0,
		cateList: [],
		mealList: [],
		allMeal: [],
		active: 0,
		scrollTop: 0,
		mealCategory: '全部美食',
		showModal: false,
		hiddencartimg: false,
		hiddenmodalbuy: false,
		hiddenmodalbuyinfo: true,

		// 购物车
		cartList: [],
		hasList: false, // 列表是否有数据
		totalPrice: 0, // 总价，初始为0
		totalNum: 0, //总数，初始为0

		maskVisual: "hidden",
		maskFlag: true,
	},

	activeChanged: function (e) {
		var currentIndex = e.currentTarget.dataset.index;
		var newMealList = [];

		// 展示菜品页面的内容
		if (currentIndex == 0) {
			this.setData({
				mealList: this.data.allMeal,
				active: 0
			})
		} else {
			for (var i in this.data.allMeal) {
				if (this.data.allMeal[i].meal_category == currentIndex + 1) {
					newMealList.push(this.data.allMeal[i])
				}
			}
			this.setData({
				scrollTop: 0,
				mealList: newMealList,
				active: currentIndex,
				mealCategory: this.data.cateList[currentIndex].cate_name,
			})
		}
	},

	// 显示模态框
	showModal: function (e) {
		var index = e.currentTarget.dataset.index;
		var allMeal = this.data.allMeal;

		this.setData({
			modalMealName: allMeal[index - 1].meal_name,
			modalMealPic: allMeal[index - 1].meal_pic,
			modalMealInfo: allMeal[index - 1].meal_info,
			modalMealPrice: allMeal[index - 1].meal_price,
			showModal: true
		})
	},

	//弹出框蒙层截断touchmove事件
	preventTouchMove: function () {},

	//隐藏模态对话框
	hideModal: function () {
		this.setData({
			showModal: false,
		})
	},

	showcartinfo: function (e) {
		var animation = wx.createAnimation({
			duration: 300,
			timingFunction: 'ease-in-out',
			delay: 0
		});
		this.animation = animation;
		animation.translateX(-365).step();
		this.setData({
			ejectAnimation: animation.export(),
			hiddencartimg: true
		});
	},

	hiddencartinfo: function (e) {
		var animation = wx.createAnimation({
			duration: 300,
			timingFunction: 'ease-in-out',
			delay: 0
		});
		this.animation = animation;
		animation.translateX(365).step();
		this.setData({
			ejectAnimation: animation.export(),
			hiddencartimg: false
		});
	},

	addshoppingcart: function (e) {
		var meal_id = e.currentTarget.dataset.meal_id;
		var arr = wx.getStorageSync('cart') || [];
		var trueOrfalse = false;

		for (var i in this.data.mealList) { // 遍历菜单找到被点击的菜品，数量加1
			if (this.data.mealList[i].meal_id == meal_id) {
				this.data.mealList[i].meal_purchase_quantity += 1;
				if (arr.length > 0) {
					for (var j in arr) { // 遍历购物车找到被点击的菜品，数量加1
						if (arr[j].meal_id == meal_id) {
							arr[j].meal_purchase_quantity += 1;
							trueOrfalse = true;
							try {
								wx.setStorageSync('cart', arr)
							} catch (e) {
								console.log(e)
							}
							break;
						}
					}
					if (!trueOrfalse) {
						arr.push(this.data.mealList[i]);
					}
				} else {
					arr.push(this.data.mealList[i]);
				}
				try {
					wx.setStorageSync('cart', arr)
				} catch (e) {
					console.log(e)
				}
				break;
			}
		}
		this.setData({
			cartList: arr,
			mealList: this.data.mealList,
		})
		this.getTotalPrice();
	},

	// 定义根据id删除数组的方法
	removeByValue: function (array, val) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].meal_id == val) {
				array.splice(i, 1);
				break;
			}
		}
	},

	// 购物车减少数量
	substractshoppingcart: function (e) {
		var meal_id = e.currentTarget.dataset.meal_id;
		var arr = wx.getStorageSync('cart') || [];
		for (var i in this.data.mealList) {
			if (this.data.mealList[i].meal_id == meal_id) {
				this.data.mealList[i].meal_purchase_quantity -= 1;
				if (this.data.mealList[i].meal_purchase_quantity <= 0) {
					this.data.mealList[i].meal_purchase_quantity = 0;
				}
				if (arr.length > 0) {
					for (var j in arr) {
						if (arr[j].meal_id == meal_id) {
							arr[j].meal_purchase_quantity -= 1;
							if (arr[j].meal_purchase_quantity <= 0) {
								this.removeByValue(arr, meal_id)
							}
							if (arr.length <= 0) {
								this.setData({
									mealList: this.data.mealList,
									cartList: [],
									totalNum: 0,
									totalPrice: 0,
								})
								if (this.data.maskVisual == 'show') {
									this.cascadeDismiss()
								}
							}

							try {
								wx.setStorageSync('cart', arr)
							} catch (e) {
								console.log(e)
							}
						}
					}
				}
			}
		}
		this.setData({
			cartList: arr,
			mealList: this.data.mealList
		})
		this.getTotalPrice();
	},

	// 获取购物车总价、总数
	getTotalPrice: function () {
		var cartList = this.data.cartList; // 获取购物车列表
		var totalP = 0;
		var totalN = 0
		for (var i in cartList) { // 循环列表得到每个数据
			totalP += cartList[i].meal_purchase_quantity * cartList[i].meal_price; // 所有价格加起来     
			totalN += cartList[i].meal_purchase_quantity
		}
		this.setData({ // 最后赋值到data中渲染到页面
			cartList: cartList,
			totalNum: totalN,
			totalPrice: totalP.toFixed(2)
		});
	},

	// 清空购物车
	cleanList: function (e) {
		for (var i in this.data.mealList) {
			this.data.mealList[i].meal_purchase_quantity = 0;
		}
		try {
			wx.setStorageSync('cart', "")
		} catch (e) {
			console.log(e)
		}
		this.setData({
			mealList: this.data.mealList,
			cartList: [],
			cartFlag: false,
			totalNum: 0,
			totalPrice: 0,
		})
		this.cascadeDismiss()
	},

	//删除购物车单项
	deleteOne: function (e) {
		var meal_id = e.currentTarget.dataset.meal_id;
		var index = e.currentTarget.dataset.index;
		var arr = wx.getStorageSync('cart')
		for (var i in this.data.mealList) {
			if (this.data.mealList[i].meal_id == meal_id) {
				this.data.mealList[i].meal_purchase_quantity = 0;
			}
		}
		arr.splice(index, 1);
		if (arr.length <= 0) {
			this.setData({
				mealList: this.data.mealList,
				cartList: [],
				cartFlag: false,
				totalNum: 0,
				totalPrice: 0,
			})
			this.cascadeDismiss()
		}
		try {
			wx.setStorageSync('cart', arr)
		} catch (e) {
			console.log(e)
		}

		this.setData({
			cartList: arr,
			mealList: this.data.mealList
		})
		this.getTotalPrice()
	},

	//切换购物车开与关
	cascadeToggle: function () {
		var that = this;
		var arr = this.data.cartList;
		if (arr.length) {
			if (that.data.maskVisual == "hidden") {
				that.cascadePopup()
			} else {
				that.cascadeDismiss()
			}
		}
	},

	// 打开购物车方法
	cascadePopup: function () {
		var that = this;
		var animation = wx.createAnimation({
			duration: 200,
			timingFunction: 'ease-in-out',
			delay: 0
		});
		that.animation = animation;
		animation.translateY(-285).step();

		var animationMask = wx.createAnimation({
			duration: 200,
			timingFunction: 'linear',
		});
		that.animationMask = animationMask;
		animationMask.opacity(0.8).step();

		that.setData({
			animationData: that.animation.export(),
			animationMask: that.animationMask.export(),
			maskVisual: "show",
			maskFlag: false,
		});
	},

	// 关闭购物车方法
	cascadeDismiss: function () {
		var that = this;
		that.animation.translateY(285).step();
		that.animationMask.opacity(0).step();
		that.setData({
			animationData: that.animation.export(),
			animationMask: that.animationMask.export(),
			maskVisual: "hidden",
			maskFlag: true
		});
	},

	// 跳转确认订单页面
	gotoOrder: function (e) {
		var totalprice = e.currentTarget.dataset.totalprice;
		if (totalprice == 0) {
			wx.showToast({
				title: '不可结算',
				icon: 'error',
				duration: 2000
			})
		} else if (totalprice < 15) {
			wx.showToast({
				title: '￥15起送',
				icon: 'error',
				duration: 2000
			})
		} else {
			if (user_info.tel) {
				wx.showLoading({
					title: '加载中...',
				});
				setTimeout(function () {
					wx.hideLoading();
					wx.navigateTo({
						url: '/pages/confirmOrder/confirmOrder',
					})
				}, 2000)
			} else {
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
			}
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		var that = this;

		// 购物车总量、总价
		var totalPrice = this.data.totalPrice;
		var totalNum = this.data.totalNum;

		// 获取购物车缓存数据
		var arr = wx.getStorageSync('cart') || [];

		const sysInfo = wx.getSystemInfoSync();

		// 获取商品分类数据
		wx.request({
			url: apiurl + 'category',
			success: (res) => {
				that.setData({
					cateList: res.data,
				});
			},
		});

		// 获取全部商品信息
		wx.request({
			url: apiurl + 'meal',
			success: (res) => {
				var resMealList = res.data;
				//进入页面后判断购物车是否有数据，如果有，将菜单与购物车quantity数据统一
				if (arr.length > 0) {
					for (var i in arr) {
						for (var j in resMealList) {
							if (resMealList[j].meal_id == arr[i].meal_id) {
								resMealList[j].meal_purchase_quantity = arr[i].meal_purchase_quantity;
							}
						}
					}
				}

				// 进入页面计算购物车总价、总数
				if (arr.length > 0) {
					for (var i in arr) {
						totalPrice += arr[i].meal_price * arr[i].meal_purchase_quantity;
						totalNum += Number(arr[i].meal_purchase_quantity);
					}
				}
				that.setData({
					hasList: true,
					cartList: arr,
					mealList: resMealList,
					allMeal: resMealList,
					totalPrice: totalPrice.toFixed(2),
					totalNum: totalNum,
					windowHeight: sysInfo.windowHeight
				})
			}
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
		wx.request({
			url: apiurl + 'category',
			success: (res) => {
				this.setData({
					cateList: res.data,
				});
			},
		});
		wx.request({
			url: apiurl + 'meal',
			success: (res) => {
				this.data.allMeal = res.data;
				var newMealList = [];
				if (this.data.active == 0) {
					this.setData({
						mealList: this.data.allMeal,
					})
				} else {
					for (var i in this.data.allMeal) {
						if (this.data.allMeal[i].meal_category == this.data.active + 1) {
							newMealList.push(this.data.allMeal[i])
						}
					}
					this.setData({
						scrollTop: 0,
						mealList: newMealList,
						mealCategory: this.data.cateList[this.data.active].cate_name,
					})
				}
			},
		});
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