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
			$('initElement').removeAttr('style');
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
					var thisObj = _THIS.objList[i];
					var thisCss = {};
					thisCss = _THIS.getCss(e, thisObj);
					//$runobj.eq(i).css(thisCss);
					TweenMax.from($runobj.eq(i), 5, thisCss);
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
	constructor[puma] = {
		pgsize : function() {
			var pgH = $pg.win.height();
			$pg.main.height(pgH);
			$pg.mainBox.height(pgH - 50);
		},
		domEvent : function() {
			$pg.pgPrev.click(function() {
				TweenMax.to($pg.pg1, 3, {
					'left' : '0%'
				});
			});
			$pg.pgNext.click(function() {
				TweenMax.to($pg.pg1, 3, {
					'left' : '-100%'
				});
			});
		},
		load : function() {
			var cent1 = $('div.cent1');
			var cent2 = $('div.cent2');
			var main = $('div.mainpg');
			var _THIS = this;
			this.amin1 = function() {
				TweenMax.from(cent1, 1, {
					'left' : '-80px',
					'opacity' : 0
				});
				TweenMax.from(cent2, 1, {
					'left' : '80px',
					'opacity' : 0
				});
			}
			this.amin2 = function() {
				TweenMax.from($pg.btnav, 1, {
					'bottom' : '-50px',
					'backgroundColor' : '#CCCCCC',
					'opacity' : 0,
					onComplete : function() {
						_THIS.amin1();
					}
				});
			}
			_THIS.amin2();
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
