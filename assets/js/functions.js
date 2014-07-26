/*
* author: shuyi.wu
*/
// 阻止拖动 img 元素
(function() {
	function imgdragstart() {
		return false;
	}

	for (i in document.images)
	document.images[i].ondragstart = imgdragstart;
})();
// 公共方法
(function(pubfun, constructor) {
	constructor[pubfun] = {
		// 加载js文件
		loadJs : function(scriptSrc) {
			var js = document.createElement('script');
			var s = document.getElementsByTagName('script')[0];
			js.type = 'text/javascript';
			js.src = scriptSrc;
			s.parentNode.insertBefore(js, s);
		},
		merge : function(obj) {
			var len = obj.length;
			var arr = [];
			for (var i = 0; i < len; i++) {
				obj[i].each(function(i) {
					arr.push(this);
				});
			}
			return $(arr);
		}
	};
})('pubfun', this);

(function(wushuyi, constructor) {
	var $win = $(window), $body = $('body');
	constructor[wushuyi] = {
		// html 参数 设置
		setings : {
			thisElement : '.wu-parallax', // 初始化 的 class
			thisOption : 'wu-data' // 参数 设置 attr
		},
		// 储存需要的 元素 属性
		objList : {},
		// 返回 响应鼠标的 css
		getCss : function() {
		},
		// 返回需要 的 元素属性
		getAttr : function() {
		},
		// 初始化
		init : function() {
			var _THIS = this;
			_THIS.pgsize();
			_THIS.run();
		},
		// 页面尺寸 响应
		pgsize : function() {
			var _THIS = this;
			var winH = $win.height(), winW = $win.width();
			(winH < 620) ? winH = 620 : null;
			(winW < 1000) ? winW = 1000 : null;
			$body.height(winH).width(winW);
			// 改变 页面尺寸 是 需要 重新 获取  需要的 元素 属性

			// 这里需要改进
			_THIS.setdata();
		},
		// 将获取 的 需要的 元素 属性 压入  this.objList 储存
		setdata : function() {
			var _THIS = this;

			var initElement = _THIS.setings.thisElement, initOption = _THIS.setings.thisOption;
			var objList = {}, objattr = {}, centrePoint = {};
			var options = _THIS.options;
			_THIS.objList = {};
			$(initElement).removeAttr('style').each(function(i) {
				var $thisDom = $(this);
				objList[i] = _THIS.getAttr($thisDom, initOption);
			});
			_THIS.objList = objList;
		},
		// 开始运行
		run : function() {
			var _THIS = this;
			$body.mousemove(function(e) {
				if (e.pageX % 4 && e.pageY % 4) {
					return false;
				}
				$.each(_THIS.objList, function(i) {
					var thisDom = _THIS.objList[i].thisElement;
					var thisObj = _THIS.objList[i];
					var thisCss = {};
					thisCss = _THIS.getCss(e, thisObj);
					TweenMax.from(thisDom, 12, thisCss);
				});
			});
		}
	};
	// 对于 支持 transforms 分别处理
	if (Modernizr.csstransforms) {
		// 获取需要的 元素属性 支持 transforms时 不需要获取 元素  margin
		constructor[wushuyi].getAttr = function($thisDom, initOption) {
			var objattr = {}, centrePoint = {}, attrOption = {}, thisAttr = {};
			var attrOption = $thisDom.attr(initOption);
			if (attrOption.indexOf("'") > 0) {
				attrOption = attrOption.replace(/'/g, '"');
			}
			attrOption = $.parseJSON(attrOption);
			objattr = {
				thisElement : $thisDom,
				offsetTop : $thisDom.offset().top,
				offsetLeft : $thisDom.offset().left,
				width : $thisDom.width(),
				height : $thisDom.height()
			};
			centrePoint = {
				centerTop : objattr.offsetTop + (objattr.width / 2),
				centerLeft : objattr.offsetLeft + (objattr.height / 2)
			};
			$.extend(thisAttr, attrOption, objattr, centrePoint);
			return thisAttr;
		};
		// 动画算法 支持 transforms时 可以 更高效
		constructor[wushuyi].getCss = function(e, thisObj) {
			var testTop, testleft, objLeft, objTop, thisCss;
			testleft = e.pageX - thisObj.centerLeft;
			testTop = e.pageY - thisObj.centerTop;
			objLeft = testleft * thisObj.speed;
			objTop = testTop * thisObj.speed;
			if (thisObj.reverse) {
				objLeft = -objLeft;
				objTop = -objTop;
			}
			thisCss = {
				'transform' : 'translate(' + -objLeft + 'px,' + -objTop + 'px)'
			};
			return thisCss;
		};
	} else {
		// 获取需要的 元素属性 不支持 transforms时 需要获取 元素  margin
		constructor[wushuyi].getAttr = function($thisDom, initOption) {
			var objattr = {}, centrePoint = {}, attrOption = {}, thisAttr = {};
			var attrOption = $thisDom.attr(initOption);
			if (attrOption.indexOf("'") > 0) {
				attrOption = attrOption.replace(/'/g, '"');
			}
			attrOption = $.parseJSON(attrOption);
			objattr = {
				thisElement : $thisDom,
				offsetTop : $thisDom.offset().top,
				offsetLeft : $thisDom.offset().left,
				width : $thisDom.width(),
				height : $thisDom.height(),
				marginTop : Number($thisDom.css('marginTop').replace('px', '')),
				marginLeft : Number($thisDom.css('marginLeft').replace('px', ''))
			};
			centrePoint = {
				centerTop : objattr.offsetTop + (objattr.width / 2),
				centerLeft : objattr.offsetLeft + (objattr.height / 2)
			};
			$.extend(thisAttr, attrOption, objattr, centrePoint);
			return thisAttr;
		};
		// 动画算法 不支持 transforms时 可以 效率比较低下
		constructor[wushuyi].getCss = function(e, thisObj) {
			var testTop, testleft, objLeft, objTop, thisCss;
			testleft = e.pageX - thisObj.centerLeft;
			testTop = e.pageY - thisObj.centerTop;
			if (thisObj.reverse) {
				objLeft = -objLeft;
				objTop = -objTop;
			}
			objLeft = (testleft * thisObj.speed) + thisObj.marginLeft;
			objTop = (testTop * thisObj.speed) + thisObj.marginTop;

			thisCss = {
				'marginLeft' : objLeft,
				'marginTop' : objTop
			};
			return thisCss;
		};
	}
})('wushuyi', this);

// 全局jquery 对象缓存
var $objCache = {};

// 页面
(function(puma, constructor) {
	var $pg = $objCache;
	var pgindex = {};
	var $pgbox = $('div.pg');
	pgindex.thisIndex = 0;
	pgindex.lock = false;
	pgindex.max = $pgbox.size();

	// 动画序列
	pgindex.action = {};
	pgindex.action.object = {
		pg1tit : $('.pg1 .tit'),
		pg2tit : $('.pg2 .tit'),
		pg3tit : $('.pg3 .tit'),
		pg4tit : $('.pg4 .tit'),
		pg5tit : $('.pg5 .tit'),
		pg6tit : $('.pg6 .tit'),
		pg7tit : $('.pg7 .tit'),

		pg1cent1 : $('.pg1 .cent1'),
		pg1cent2 : $('.pg1 .cent2'),

		pg2titImg : $('.pg2 .titImg'),
		pg2titImg2 : $('.pg2 .titImg2'),
		pg2tit1 : $('.pg2 .tit1'),
		pg2tit2 : $('.pg2 .tit2'),
		pg2btn : $('.pg2 .btn'),

		pg3titImg : $('.pg3 .titImg'),
		pg3tit1 : $('.pg3 .tit1'),
		pg3tit2 : $('.pg3 .tit2'),

		pg4cent1 : $('.pg4 .centBox1'),
		pg4cent2 : $('.pg4 .centBox2'),
		pg4tit1 : $('.pg4 .tit1'),
		pg4tit2 : $('.pg4 .tit2'),
		pg4swithBtn : $('.pg4 .swithBtn'),
		pg4swithBtnX : $('.pg4 .swithBtnX'),
		pg4bg1 : $('.pg4 .bg1 img'),
		pg4bg2 : $('.pg4 .bg2 img'),
		pg4bg3 : $('.pg4 .bg3 img'),
		pg4bg4 : $('.pg4 .bg4 img'),

		pg7cent : $('.pg7 .cent'),
		pg7moveBtn : $('.pg7 .moveBtn'),

		popBox : $('.popBox'),
		infoBox : $('.infoBox')
	};
	var domList = pgindex.action.object;
	pgindex.action.thisInit = {
		0 : function() {
			domList.pg1cent1.css({
				'left' : '-80px',
				'opacity' : 0
			});
			domList.pg1cent2.css({
				'left' : '80px',
				'opacity' : 0
			});
			domList.pg1tit.css({
				'marginTop' : '-20px',
				'opacity' : 0
			});
		},
		1 : function() {
			domList.pg2titImg.css({
				'marginTop' : '30px',
				'opacity' : 0
			});
			domList.pg2titImg2.css({
				'marginTop' : '0px',
				'opacity' : 0
			});
			domList.pg2tit1.css({
				'marginLeft' : '-214px',
				'opacity' : 0
			});
			domList.pg2tit2.css({
				'marginLeft' : '-278px',
				'opacity' : 0
			});
			domList.pg2btn.css({
				'marginBottom' : '20px',
				'opacity' : 0
			});
			domList.pg2tit.css({
				'marginTop' : '-20px',
				'opacity' : 0
			});
		},
		2 : function() {
			domList.pg3tit.css({
				'marginTop' : '-20px',
				'opacity' : 0
			});
			domList.pg3titImg.css({
				'opacity' : 0
			});
			domList.pg3tit1.css({
				'marginLeft' : '-50px',
				'opacity' : 0
			});
			domList.pg3tit2.css({
				'marginLeft' : '80px',
				'opacity' : 0
			});
			domList.pg3titImg.css({
				'left' : '100%'
			});
		},
		3 : function() {
			domList.pg4tit.css({
				'marginTop' : '-20px',
				'opacity' : 0
			});
			domList.pg4tit1.css({
				'marginLeft' : '-70px',
				'opacity' : 0
			});
			domList.pg4tit2.css({
				'marginLeft' : '80px',
				'opacity' : 0
			});
		},
		4 : function() {
			domList.pg5tit.css({
				'marginTop' : '-20px',
				'opacity' : 0
			});
		},
		5 : function() {
			domList.pg6tit.css({
				'marginTop' : '-20px',
				'opacity' : 0
			});
		},
		6 : function() {
			domList.pg7tit.css({
				'marginTop' : '-20px',
				'opacity' : 0
			});
			domList.pg7cent.css({
				'width' : '100%'
			});
			domList.pg7moveBtn.css({
				'left' : '100%'
			});
			domList.infoBox.css({
				'width' : '0%'
			});
			var uniteObj = pubfun.merge([domList.popBox, domList.infoBox]);
			uniteObj.css({
				'display' : 'none'
			});
		}
	};
	pgindex.action.thisIn = {
		0 : function() {
			TweenMax.to(domList.pg1cent1, 1, {
				'left' : '0',
				'opacity' : 1
			});
			TweenMax.to(domList.pg1cent2, 1, {
				'left' : '0',
				'opacity' : 1
			});
			TweenMax.to(domList.pg1tit, 1, {
				'marginTop' : '0px',
				'opacity' : 1
			});
		},
		1 : function() {
			TweenMax.to(domList.pg2titImg, .5, {
				'marginTop' : '0px',
				'opacity' : 1
			});
			TweenMax.to(domList.pg2tit1, .5, {
				'marginLeft' : '-134px',
				'opacity' : 1
			});
			TweenMax.to(domList.pg2tit2, .5, {
				'marginLeft' : '-358px',
				'opacity' : 1,
				onComplete : function() {
					TweenMax.to(domList.pg2btn, .5, {
						'marginBottom' : '0px',
						'opacity' : 1
					});
				}
			});
			TweenMax.to(domList.pg2tit, 1, {
				'marginTop' : '0px',
				'opacity' : 1
			});
		},
		2 : function() {
			TweenMax.to(domList.pg3tit, 1, {
				'marginTop' : '0px',
				'opacity' : 1
			});
			TweenMax.to(domList.pg3titImg, 1, {
				'opacity' : 1
			});
			TweenMax.to(domList.pg3tit1, 1, {
				'marginLeft' : '30px',
				'opacity' : 1
			});
			TweenMax.to(domList.pg3tit2, 1, {
				'marginLeft' : '0px',
				'opacity' : 1
			});
		},
		3 : function() {
			TweenMax.to(domList.pg4tit, 1, {
				'marginTop' : '0px',
				'opacity' : 1
			});
			TweenMax.to(domList.pg4tit1, 1, {
				'marginLeft' : '10px',
				'opacity' : 1
			});
			TweenMax.to(domList.pg4tit2, 1, {
				'marginLeft' : '00px',
				'opacity' : 1
			});
		},
		4 : function() {
			TweenMax.to(domList.pg5tit, 1, {
				'marginTop' : '0px',
				'opacity' : 1
			});
		},
		5 : function() {
			TweenMax.to(domList.pg6tit, 1, {
				'marginTop' : '0px',
				'opacity' : 1
			});
		},
		6 : function() {
			TweenMax.to(domList.pg7tit, 1, {
				'marginTop' : '0px',
				'opacity' : 1
			});
			TweenMax.to(domList.pg7cent, 1, {
				'width' : '39%',
			});
			TweenMax.to(domList.pg7moveBtn, 1, {
				'left' : '39%',
			});

		}
	};
	pgindex.action.thisOut = {
		0 : function() {
			var uniteObj = pubfun.merge([domList.pg1cent1, domList.pg1cent2]);
			TweenMax.to(uniteObj, 1, {
				'opacity' : 0
			});
			TweenMax.to(domList.pg1tit, 1, {
				'marginTop' : '20px',
				'opacity' : 0
			});
		},
		1 : function() {
			var uniteObj = pubfun.merge([domList.pg2tit1, domList.pg2tit2, domList.pg2btn]);
			//console.log(uniteObj);
			TweenMax.to(uniteObj, 1, {
				'opacity' : 0
			});
			TweenMax.to(domList.pg2titImg, 1, {
				'marginTop' : '-30px',
				'opacity' : 0
			});
			TweenMax.to(domList.pg2tit, 1, {
				'marginTop' : '20px',
				'opacity' : 0
			});
		},
		2 : function() {
			var uniteObj = pubfun.merge([domList.pg3titImg, domList.pg3tit1, domList.pg3tit2]);
			TweenMax.to(uniteObj, 1, {
				'opacity' : 0
			});
			TweenMax.to(domList.pg3tit, 1, {
				'marginTop' : '20px',
				'opacity' : 0
			});
		},
		3 : function() {
			TweenMax.to(domList.pg4tit, 1, {
				'marginTop' : '20px',
				'opacity' : 0
			});
			if (pgindex.action.pg4.status) {
				pgindex.action.pg4.status = false;
				pgindex.action.pg4.switchBoxReset();
				return false;
			}
			TweenMax.to(domList.pg4tit1, 1, {
				'marginLeft' : '-70px',
				'opacity' : 0
			});
			TweenMax.to(domList.pg4tit2, 1, {
				'marginLeft' : '80px',
				'opacity' : 0
			});
		},
		4 : function() {
			TweenMax.to(domList.pg5tit, 1, {
				'marginTop' : '20px',
				'opacity' : 0
			});
		},
		5 : function() {
			TweenMax.to(domList.pg6tit, 1, {
				'marginTop' : '20px',
				'opacity' : 0
			});
		},
		6 : function() {
			TweenMax.to(domList.pg7tit, 1, {
				'marginTop' : '20px',
				'opacity' : 0
			});
		},
	};
	pgindex.action.popInit = function() {
		domList.popBox.css({
			'display' : 'none'
		});
		domList.infoBox.css({
			'width' : '0%',
			'display' : 'none'

		});
		$('.titBox').css({
			'right' : '0%'
		});
		$('.bg').css({
			'left' : '0%'
		});
	};
	pgindex.action.pg2 = {
		status : true,
		openBtn : function() {
			var domList = pgindex.action.object;
			TweenMax.to(domList.pg2titImg, .5, {
				'marginTop' : '-30px',
				'opacity' : 0,
				onComplete : function() {
					TweenMax.to(domList.pg2titImg2, .5, {
						'marginTop' : '20px',
						'opacity' : 1
					});
				}
			});
		},
		closeBtn : function() {
			var domList = pgindex.action.object;
			TweenMax.to(domList.pg2titImg2, .5, {
				'marginTop' : '0px',
				'opacity' : 0,
				onComplete : function() {
					TweenMax.to(domList.pg2titImg, .5, {
						'marginTop' : '0px',
						'opacity' : 1
					});
				}
			});
		}
	};
	pgindex.action.pg4 = {
		status : false,
		switchBox : function() {
			pgindex.action.pg4.status = true;
			domList.pg4cent2.css({
				'display' : 'none',
				'marginRight' : '80px',
				'opacity' : '0'
			});
			domList.pg4swithBtnX.css({
				'display' : 'none',
				'marginLeft' : '-80px',
				'opacity' : '0'
			});
			TweenMax.to(domList.pg4cent1, .5, {
				'marginLeft' : '80px',
				'opacity' : '0'
			});
			TweenMax.to(domList.pg4swithBtn, .5, {
				'marginRight' : '-80px',
				'opacity' : '0'
			});
			TweenMax.to(domList.pg4bg1, 1, {
				'right' : '10%'
			});
			TweenMax.to(domList.pg4bg2, 1, {
				'right' : '50%'
			});
			TweenMax.to(domList.pg4bg3, 1, {
				'right' : '42%'
			});
			TweenMax.to(domList.pg4bg4, 1, {
				'right' : '36%',
				onComplete : function() {
					TweenMax.to(domList.pg4cent2.show(), 1, {
						'marginRight' : '0px',
						'opacity' : '1'
					});
					TweenMax.to(domList.pg4swithBtnX.show(), 1, {
						'marginLeft' : '0px',
						'opacity' : '1'
					});
					wushuyi.setdata();
				}
			});
		},
		switchBoxReset : function() {
			TweenMax.to(domList.pg4cent2, 1, {
				'marginRight' : '-80px',
				'opacity' : '0'
			});
			TweenMax.to(domList.pg4swithBtnX, .5, {
				'marginLeft' : '80px',
				'opacity' : '0',
				onComplete : function() {
					var uniteObj = pubfun.merge([domList.pg4cent2, domList.pg4swithBtnX]);
					uniteObj.hide();
					TweenMax.to(domList.pg4bg1, 1, {
						'right' : '0%'
					});
					TweenMax.to(domList.pg4bg2, 1, {
						'right' : '0%'
					});
					TweenMax.to(domList.pg4bg3, 1, {
						'right' : '0%'
					});
					TweenMax.to(domList.pg4bg4, 1, {
						'right' : '0%',
						onComplete : function() {
							TweenMax.to(domList.pg4cent1, .5, {
								'marginLeft' : '0px',
								'opacity' : '1'
							});
							TweenMax.to(domList.pg4swithBtn, .5, {
								'marginRight' : '0px',
								'opacity' : '1',
								onComplete : function() {
									if (pgindex.action.pg4.status = true) {
										wushuyi.setdata();
										pgindex.action.pg4.status = false;
									}
								}
							});
						}
					});
				}
			});
		}
	};
	pgindex.action.pg7 = {

	};

	pgindex.pgNext = function() {
		var _THIS = this;
		if (pgindex.lock) {
			return false;
		}
		pgindex.lock = true;
		_THIS.action.popInit();
		var pgNext = pgindex.thisIndex + 1;
		if (pgNext >= pgindex.max) {
			pgNext = 0;
		}
		var $nextPg = $pgbox.eq(pgNext);
		var $thisPg = $pgbox.eq(pgindex.thisIndex);
		_THIS.action.thisInit[pgNext]();
		_THIS.action.thisOut[pgindex.thisIndex]();
		$thisPg.css({
			'left' : '0%',
			'zIndex' : '9'
		});
		$nextPg.css({
			'left' : '100%',
			'zIndex' : '10'
		});
		TweenMax.to($nextPg, 1, {
			'left' : '0%'
		});
		TweenMax.to($thisPg, 1, {
			'left' : '-25%',
			onComplete : function() {
				$nextPg.css({
					'zIndex' : '1'
				}).addClass('run');
				$thisPg.css({
					'left' : '-100%',
					'zIndex' : '0'
				}).removeClass('run');
				pgindex.thisIndex = pgNext;
				pgindex.lock = false;
				_THIS.action.thisIn[pgNext]();
				wushuyi.setdata();
			}
		});

	};
	pgindex.pgPrev = function() {
		var _THIS = this;
		if (pgindex.lock) {
			return false;
		}
		pgindex.lock = true;
		_THIS.action.popInit();
		var pgNext = pgindex.thisIndex - 1;
		if (pgNext < 0) {
			pgNext = pgindex.max - 1;
		}
		var $nextPg = $pgbox.eq(pgNext);
		var $thisPg = $pgbox.eq(pgindex.thisIndex);
		_THIS.action.thisInit[pgNext]();
		_THIS.action.thisOut[pgindex.thisIndex]();
		$thisPg.css({
			'left' : '0%',
			'zIndex' : '9'
		});
		$nextPg.css({
			'left' : '-100%',
			'zIndex' : '10'
		});
		TweenMax.to($nextPg, 1, {
			'left' : '0%',
		});
		TweenMax.to($thisPg, 1, {
			'left' : '25%',
			onComplete : function() {
				$nextPg.css({
					'zIndex' : '1'
				}).addClass('run');
				;
				$thisPg.css({
					'left' : '100%',
					'zIndex' : '0'
				}).removeClass('run');
				;
				pgindex.thisIndex = pgNext;
				pgindex.lock = false;
				_THIS.action.thisIn[pgNext]();
				wushuyi.setdata();
			}
		});
	};

	constructor[puma] = {
		test : pgindex,
		pgsize : function() {
			var pgH = $pg.win.height();
			$pg.main.height(pgH);
			$pg.mainBox.height(pgH - 50);
		},
		domEvent : function() {
			var _THIS = this;
			// 点击 按钮 翻页
			$pg.pgNext.click(function() {
				pgindex.pgNext();
			});
			$pg.pgPrev.click(function() {
				pgindex.pgPrev();
			});
			// 鼠标滚轮 翻页
			window._NUM_SCROLL = 0;
			$('body').mousewheel(function(e) {
				(e.deltaY > 0) ? window._NUM_SCROLL += 1 : window._NUM_SCROLL -= 1;
				if (window._NUM_SCROLL >= 5) {
					pgindex.pgPrev();
					window._NUM_SCROLL = 0;
				} else if (window._NUM_SCROLL <= -5) {
					pgindex.pgNext();
					window._NUM_SCROLL = 0;
				}
				//console.log(window._NUM_SCROLL);
			});
			// 键盘左右 翻页
			$(document).keydown(function(e) {
				if (e.keyCode == 37 || e.keyCode == 65) {
					pgindex.pgPrev();
				} else if (e.keyCode == 39 || e.keyCode == 68) {
					pgindex.pgNext();
				}
				//console.log(e.keyCode);
			});

			// pg2 点击按钮
			$('.pg2 .btn').click(function() {
				var _this = $(this);
				if (pgindex.action.pg2.status) {
					pgindex.action.pg2.openBtn();
					pgindex.action.pg2.status = false;
					_this.addClass('close');
				} else {
					pgindex.action.pg2.closeBtn();
					pgindex.action.pg2.status = true;
					_this.removeClass('close');
				}
			});

			// pg4 按钮事件
			domList.pg4swithBtn.click(function() {
				pgindex.action.pg4.switchBox();
			});
			domList.pg4swithBtnX.click(function() {
				pgindex.action.pg4.switchBoxReset();
			});

			// pg7 拖动
			var $moveBtn = $('.moveBtn');
			var $body = $('body');
			var $pg7cent = $('.pg7 .cent');
			var $pg7moveBtn = $('.pg7 .moveBtn');
			var pg7lock = false;
			$moveBtn.mousedown(function() {
				pg7lock = true;
				$body.mousemove(function(e) {
					if (pg7lock) {
						$pg7cent.width(e.clientX);
						$pg7moveBtn.css({
							'left' : e.clientX
						});
					}
				});
			});
			$body.mouseup(function() {
				pg7lock = false;
			});

			// pg7 按钮
			$('.openBtn').click(function() {
				var cent = $(this).attr('opendata');
				var centHtml = $(cent).html();
				$('#popCent').html(centHtml);
				$('.close , .popBox, .infoBox').show();
				TweenMax.to($('.bg'), .5, {
					'left' : '-25%'
				});
				TweenMax.to(domList.infoBox, .5, {
					'width' : '50%'
				});
				TweenMax.to($('.titBox'), .5, {
					'right' : '50%'
				});
			});
			$('.popBox, .close').click(function() {
				TweenMax.to($('.bg'), .5, {
					'left' : '0%'
				});
				TweenMax.to(domList.infoBox, .5, {
					'width' : '0%'
				});
				TweenMax.to($('.titBox'), .5, {
					'right' : '0%',
					onComplete : function() {
						$('.close , .popBox, .infoBox').hide();
					}
				});
			});
		},
		loading : function() {
			var progress, $loadbt = $('#loadingbt'), $load = $('#loading'), $loadNum = $('#loadNum'), $loadnumBox = $('#loadnumBox');
			var loadList = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg6.jpg', 'bg7.jpg', 'close.png', 'nav_left.png', 'nav_right.png', 'nav_tit.png', 'pg1_tit1.png', 'pg1_tit2.png', 'pg1_title.png', 'tit_icon.png', 'tit_icon_b.png', 'pg2/btn_tit.png', 'pg2/pg2_img1.png', 'pg2/pg2_tit.png', 'pg2/pg2_tit1.png', 'pg2/pg2_tit2.png', 'pg2/pg2_tit3.png', 'pg3/pg3_img1.png', 'pg3/pg3_tit.png', 'pg3/pg3_tit1.png', 'pg3/pg3_tit2.png', 'pg4/bg1.png', 'pg4/bg2.png', 'pg4/bg3.png', 'pg4/bg4.png', 'pg4/pg4_btn.png', 'pg4/pg4_tit.png', 'pg4/pg4_tit1.png', 'pg4/pg4_tit2.png', 'pg4/pg4_tit3.png', 'pg5/pg5_tit.png', 'pg6/cent1.png', 'pg6/cent2.png', 'pg6/cent3.png', 'pg6/pg6_img.png', 'pg6/pg6_tit.png', 'pg7/btn_icon.png', 'pg7/btn_icon2.png', 'pg7/cent1.png', 'pg7/cent2.png', 'pg7/pg7_tit.png', 'pg7/pg7_tit1.png', 'pg7/pg7_tit2.png'];
			var loadPath = 'assets/images/';
			var loadLength = loadList.length;
			var loader = new PxLoader();
			for (var i = 0; i < loadLength; i++) {
				loader.addImage(loadPath + loadList[i]);
			}
			loader.addCompletionListener(function(e) {
				pgindex.action.thisInit[0]();
				setTimeout(function() {
					var uniteObj = pubfun.merge([$loadnumBox, $loadbt]);
					uniteObj.hide();
					TweenMax.to($load, 1, {
						'opacity' : '0',
						onComplete : function() {
							$load.hide();
							pgindex.action.thisIn[0]();
						}
					});
				}, 500);
			});
			loader.addProgressListener(function(e) {
				progress = parseInt(e.completedCount / e.totalCount * 100);
				$loadNum.html(progress);
				$loadbt.css({
					'width' : progress + '%'
				});
			});
			loader.start();
		}
	};
})('puma', this);

// jquery 闭包
(function($) {

	$(document).ready(function() {
		puma.loading();
		var initobj = {
			win : $(window),
			main : $('div.wrapper'),
			btnav : $('div.btnav'),
			mainBox : $('div.mainpg'),
			pg1 : $('div.pg1'),
			pgPrev : $('div.prev'),
			pgNext : $('div.next')
		};
		$.extend($objCache, initobj);
		puma.pgsize();
		puma.domEvent();
		wushuyi.setings.thisElement = '.run .wu-parallax';
		wushuyi.init();
	});

	$(window).load(function() {

	});

	$(window).resize(function() {
		puma.pgsize();
		wushuyi.pgsize();
	});

})(window.jQuery);
