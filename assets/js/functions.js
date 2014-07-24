/*
* author: shuyi.wu
*/
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
		merge : function($obj1, $obj2) {
			var arr = [];
			$obj1.each(function(i) {
				arr.push(this);
			});
			$obj2.each(function(i) {
				arr.push(this);
			});
			return $(arr);
		}
	};
})('pubfun', this);

(function(wushuyi, constructor) {
	var $win = $(window), $body = $('body');
	constructor[wushuyi] = {
		// html 参数 设置
		setings : {
			thisClass : 'wu-parallax', // 初始化 的 class
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
			var initElement = '.' + _THIS.setings.thisClass;
			$(initElement).removeAttr('style');
			// 这里需要改进
			_THIS.setdata();
		},
		// 将获取 的 需要的 元素 属性 压入  this.objList 储存
		setdata : function() {
			var _THIS = this;
			var initElement = '.' + _THIS.setings.thisClass, initOption = _THIS.setings.thisOption;
			var objList = {}, objattr = {}, centrePoint = {};
			var options = _THIS.options;
			$(initElement).each(function(i) {
				var $thisDom = $(this);
				objList[i] = _THIS.getAttr($thisDom, initOption);
			});
			_THIS.objList = objList;
		},
		// 开始运行
		run : function() {
			var _THIS = this;
			var initElement = '.' + _THIS.setings.thisClass;
			var $runobj = $(initElement);
			$body.mousemove(function(e) {
				$.each(_THIS.objList, function(i) {
					var thisDom = $runobj.eq(i);
					// 不科学的 分组 动画
					if (thisDom.parents('.pg').hasClass('run')) {
						var thisObj = _THIS.objList[i];
						var thisCss = {};
						thisCss = _THIS.getCss(e, thisObj);
						//$runobj.eq(i).css(thisCss);
						TweenMax.from(thisDom, 1, thisCss);
					}
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
	pgindex.action = {
		object : {
			pg1cent1 : $('.pg1 .cent1'),
			pg1cent2 : $('.pg1 .cent2'),
			pg1tit : $('.pg1 .tit'),
			pg2tit : $('.pg2 .tit')
		},
		thisInit : {
			0 : function() {
				var domList = pgindex.action.object;
				domList.pg1cent1.css({
					'left' : '-80px',
					'opacity' : 0
				});
				domList.pg1cent2.css({
					'left' : '80px',
					'opacity' : 0
				});
				domList.pg1tit.css({
					'margin-top' : '-20px',
					'opacity' : 0
				});
			},
			1 : function() {
				var domList = pgindex.action.object;
				domList.pg2tit.css({
					'margin-top' : '-20px',
					'opacity' : 0
				});
			},
			2 : function() {

			},
			3 : function() {

			},
			4 : function() {

			},
			5 : function() {

			},
			6 : function() {

			}
		},
		thisIn : {
			0 : function() {
				var domList = pgindex.action.object;
				TweenMax.to(domList.pg1cent1, 1, {
					'left' : '0',
					'opacity' : 1
				});
				TweenMax.to(domList.pg1cent2, 1, {
					'left' : '0',
					'opacity' : 1
				});
				TweenMax.to(domList.pg1tit, 1, {
					'margin-top' : '0px',
					'opacity' : 1
				});
			},
			1 : function() {
				var domList = pgindex.action.object;
				TweenMax.to(domList.pg2tit, 1, {
					'margin-top' : '0px',
					'opacity' : 1
				});
			},
			2 : function() {

			},
			3 : function() {

			},
			4 : function() {

			},
			5 : function() {

			},
			6 : function() {

			}
		},
		thisOut : {
			0 : function() {
				var domList = pgindex.action.object;
				var obj = pubfun.merge(domList.pg1cent1, domList.pg1cent2);
				TweenMax.to(obj, 1, {
					'opacity' : 0
				});
				TweenMax.to(domList.pg1tit, 1, {
					'margin-top' : '20px',
					'opacity' : 0
				});
			},
			1 : function() {
				var domList = pgindex.action.object;
				TweenMax.to(domList.pg2tit, 1, {
					'margin-top' : '20px',
					'opacity' : 0
				});
			},
			2 : function() {

			},
			3 : function() {

			},
			4 : function() {

			},
			5 : function() {

			},
			6 : function() {

			}
		}
	};

	pgindex.pgNext = function() {
		var _THIS = this;
		if (pgindex.lock) {
			return false;
		}
		pgindex.lock = true;
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
			'z-index' : '9'
		});
		$nextPg.css({
			'left' : '100%',
			'z-index' : '10'
		});
		TweenMax.to($nextPg, 1, {
			'left' : '0%'
		});
		TweenMax.to($thisPg, 1, {
			'left' : '-25%',
			onComplete : function() {
				$nextPg.css({
					'z-index' : '1'
				}).addClass('run');
				$thisPg.css({
					'left' : '-100%',
					'z-index' : '0'
				}).removeClass('run');
				pgindex.thisIndex = pgNext;
				pgindex.lock = false;
				_THIS.action.thisIn[pgNext]();
			}
		});

	};
	pgindex.pgPrev = function() {
		var _THIS = this;
		if (pgindex.lock) {
			return false;
		}
		pgindex.lock = true;
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
			'z-index' : '9'
		});
		$nextPg.css({
			'left' : '-100%',
			'z-index' : '10'
		});
		TweenMax.to($nextPg, 1, {
			'left' : '0%',
		});
		TweenMax.to($thisPg, 1, {
			'left' : '25%',
			onComplete : function() {
				$nextPg.css({
					'z-index' : '1'
				}).addClass('run');
				;
				$thisPg.css({
					'left' : '100%',
					'z-index' : '0'
				}).removeClass('run');
				;
				pgindex.thisIndex = pgNext;
				pgindex.lock = false;
				_THIS.action.thisIn[pgNext]();
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
		},
		load : function() {
		}
	};
})('puma', this);

// jquery 闭包
(function($) {

	$(document).ready(function() {
		var initobj = {
			win : $(window),
			main : $('div.wrapper'),
			btnav : $('div.btnav'),
			mainBox : $('div.mainpg'),
			pg1 : $('div.pg1'),
			pgPrev : $('div.prev'),
			pgNext : $('div.next')
		}
		$.extend($objCache, initobj);

		puma.pgsize();
		puma.domEvent();
		wushuyi.init();
	});

	$(window).load(function() {
		puma.load();
	});

	$(window).resize(function() {
		puma.pgsize();
		wushuyi.pgsize();
	});

})(window.jQuery);
