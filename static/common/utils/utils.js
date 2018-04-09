define("utils/utils", ["jquery", "./string.prototype", "./array.prototype"], function(require, exports, module) {
	var $ = require("jquery"),
		utils = {};
	return require("./string.prototype"), require("./array.prototype"), utils = {
		isEmpty: function(a) {
			if("object" == typeof a) {
				if(null == a || "[object Array]" === Object.prototype.toString.call(a) && 0 == a.length || a.hasOwnProperty("length") && 0 == a.length) return !0;
				for(var b in a) return !1;
				return !0
			}
			return "undefined" == typeof a || "string" == typeof a && "" == a || "number" == typeof a && isNaN(a)
		},
		isEqual: function(a, b) {
			if(a instanceof Array) {
				if(!(b instanceof Array)) return !1;
				var c = a.length,
					d = b.length;
				if(c != d) return !1;
				for(var e = !0, f = 0, g = 0; c > g; g++) e = a[g] != b[g] && "object" == typeof a[g] && "object" == typeof b[g] ? arguments.callee.apply(null, [a[g], b[g]]) : $.isFunction(a[g]) && $.isFunction(b[g]) ? !0 : a[g] === b[g], e && f++;
				return f != c ? !1 : !0
			}
			if(a instanceof Date) return b instanceof Date ? a.getTime() == b.getTime() : !1;
			if(a instanceof Object) {
				if(b instanceof Array || b instanceof Date || !(b instanceof Object)) return !1;
				var c = d = 0,
					h = 100;
				for(var g in a)
					if(c++, c > h) break;
				for(var g in b)
					if(d++, d > h) break;
				if(c != d) return !1;
				var e = !0,
					f = len = 0;
				for(var g in a)
					if(e = "object" == typeof a[g] && "object" == typeof b[g] && a[g] != b[g] ? arguments.callee.apply(null, [a[g], b[g]]) : $.isFunction(a[g]) && $.isFunction(b[g]) ? !0 : a[g] === b[g], e && f++, len++, len > h) break;
				return f != c ? !1 : !0
			}
			return b instanceof Object ? !1 : a === b
		},
		getBrowserWH: function() {
			var a, b;
			return window.innerWidth ? a = window.innerWidth : document.body && document.body.clientWidth && (a = document.body.clientWidth), window.innerHeight ? b = window.innerHeight : document.body && document.body.clientHeight && (b = document.body.clientHeight), document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth && (b = document.documentElement.clientHeight, a = document.documentElement.clientWidth), {
				w: a,
				h: b
			}
		},
		getBrowserInfo: function() {
			var a = navigator.userAgent,
				b = {
					w: 0,
					h: 0,
					ua: "",
					v: 0
				};
			switch(!0) {
				case /msie (\d+\.\d+)/i.test(a):
					b.ua = "ie", b.v = document.documentMode || +RegExp.$1;
					break;
				case /chrome\/(\d+\.\d+)/i.test(a):
					b.ua = "chrome", b.v = +RegExp.$1;
					break;
				case /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(a) && !/chrome/i.test(a):
					b.ua = "safari", b.v = +(RegExp.$1 || RegExp.$2);
					break;
				case /firefox\/(\d+\.\d+)/i.test(a):
					b.ua = "firefox", b.v = +RegExp.$1;
					break;
				case /opera(?:\/| )(\d+(?:\.\d+)?)(.+?(version\/(\d+(?:\.\d+)?)))?/i.test(a):
					b.ua = "opera", b.v = +(RegExp.$4 || RegExp.$1)
			}
			return $.extend(b, utils.getBrowserWH())
		},
		getPlatform: function() {
			for(var a = navigator.userAgent, b = ["Android", "iPad", "iPhone", "Linux", "Macintosh", "Windows", "X11"], c = 0; c < b.length; c++)
				if(~a.indexOf(b[c])) return b[c]
		},
		winResize: function(a, b) {
			void 0 == a.length && (a = [a]);
			var c = function() {
				$.each(a, function(a, b) {
					$.isFunction(b.name) && (void 0 != typeof b.param ? b.name.call(this, b.param) : b.name.call(this))
				})
			};
			(void 0 == b || 1 == b) && c(), $(window).bind("resize.mining", c)
		},
		gotoUrl: function(a, b) {
			if(!utils.isEmpty(a)) {
				if(utils.getBrowserInfo().ie6 && $ && $.fn.isTag && !$.isWindow(event.srcElement)) {
					var c = $(event.srcElement);
					c.isTag("a") && c.attr("href", "#")
				}
				if(a = decodeURIComponent(a), /MSIE (\d+\.\d+);/.test(navigator.userAgent) || /MSIE(\d+\.\d+);/.test(navigator.userAgent)) {
					var d = document.createElement("a");
					d.href = a, "_blank" == b && (d.target = b), document.body.appendChild(d), d.click()
				} else "_blank" == b ? window.open(a) : location.href = a
			}
		},
		getUrlParam: function(a) {
			var b = {};
			return window.location.search.replace(/[\?&]([_\w]+)=([^&]+)/g, function(a, c, d) {
				b[c] = d
			}), utils.isEmpty(a) ? b : "string" != typeof a || utils.isEmpty(b[a]) ? null : b[a]
		},
		checkImg: function(a, b) {
			utils.isEmpty(a) || a.size() < 1 || utils.isEmpty(b) || a.each(function() {
				utils.imgloaderror(this, function() {
					this.src = b
				})
			})
		},
		imgloaderror: function(a, b) {
			var c = new Image;
			c.onerror = function() {
				b && b.call(a)
			}, c.src = a.src
		},
		addBookmark: function(b, c) {
			c = c || a.href, b = b || a.title;
			try {
				window.external.addFavorite(c, b)
			} catch(d) {
				try {
					window.sidebar.addPanel(b, c, "")
				} catch(d) {
					if(/Opera/.test(window.navigator.userAgent)) return a.rel = "sidebar", a.href = c, !0;
					alert("亲，请使用 Ctrl+D 进行添加")
				}
			}
			return !1
		},
		setHome: function() {
			if(document.all) document.body.style.behavior = "url(#default#homepage)", document.body.setHomePage(window.location.href);
			else if(window.sidebar) {
				if(window.netscape) try {
					netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
				} catch(a) {
					alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true")
				}
				var b = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
				b.setCharPref("browser.startup.homepage", window.location.href)
			} else $dialog && $dialog.alert("您的浏览器不支持自动设置首页, 请使用浏览器菜单手动设置!", "warning")
		},
		stopBubble: function(a) {
			a && a.stopPropagation ? a.stopPropagation() : window.event.cancelBubble = !0
		},
		stopDefault: function(a) {
			return a && a.preventDefault ? a.preventDefault() : window.event.returnValue = !1, !1
		},
		newObj: function(key, value) {
			var obj = new Object;
			return utils.isEmpty(key) || eval("obj." + key + "=value"), obj
		},
		inArray: function(a, b) {
			for(var c in b)
				if(utils.isEqual(a, b[c])) return c;
			return -1
		},
		pushOnly: function(a, b) {
			-1 == utils.inArray(a, b) && b.push(a)
		},
		bubbleSort: function(a, b, c) {
			for(var d, e, f = 0; f < a.length; f++) {
				e = !1;
				for(var g = a.length - 2; g >= f; g--) "asc" == b ? a[g + 1] < a[g] && (d = a[g + 1], a[g + 1] = a[g], a[g] = d, !utils.isEmpty(c) && $.isFunction(c) && c.call(this, g, g + 1), e = !0) : a[g + 1] > a[g] && (d = a[g + 1], a[g + 1] = a[g], a[g] = d, !utils.isEmpty(c) && $.isFunction(c) && c.call(this, g, g + 1), e = !0);
				if(!e) break
			}
			return a
		},
		reload: function() {
			window.location.reload()
		},
		getSwf: function(a) {
			return window.document[a] ? window.document[a] : -1 != navigator.appName.indexOf("Microsoft Internet") ? document.getElementById(a) : document.embeds && document.embeds[a] ? document.embeds[a] : void 0
		},
		scrollTo: function(a, b) {
			$("html,body").animate({
				scrollTop: a
			}, {
				duration: 300,
				complete: function() {
					!utils.isEmpty(b) && $.isFunction(b) && b.call(this)
				}
			})
		},
		flashChecker: function() {
			var a = !1,
				b = 0;
			if(utils.getBrowserInfo().msie) {
				var c = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
				c && (a = !0, VSwf = c.GetVariable("$version"), b = parseInt(VSwf.split(" ")[1].split(",")[0]))
			} else if(navigator.plugins && navigator.plugins.length > 0) {
				var c = navigator.plugins["Shockwave Flash"];
				if(c) {
					a = !0;
					for(var d = c.description.split(" "), e = 0; e < d.length; ++e) isNaN(parseInt(d[e])) || (b = parseInt(d[e]))
				}
			}
			return {
				hasflash: a,
				version: b
			}
		},
		clone: function(a) {
			var b;
			switch(typeof a) {
				case "undefined":
					break;
				case "string":
					b = a + "";
					break;
				case "number":
					b = a - 0;
					break;
				case "boolean":
					b = a;
					break;
				case "object":
					if(null === a) b = null;
					else if(a instanceof Array) {
						b = [];
						for(var c = 0, d = a.length; d > c; c++) b.push(utils.clone(a[c]))
					} else {
						b = {};
						for(var e in a) b[e] = utils.clone(a[e])
					}
					break;
				default:
					b = a
			}
			return b
		},
		randomInt: function(a, b) {
			return Math.floor(Math.random() * (b - a + 1) + a)
		},
		supportstorage: function() {
			return "object" == typeof window.localStorage
		},
		fixAutoFill: function(a) {
			var b, c, d = 100,
				e = 3e3,
				f = 0;
			void 0 == a && (a = "body"), c = "string" == typeof a ? $(a) : a, b = setInterval(function() {
				if($("input:-webkit-autofill", c).size() > 0) try {
					clearInterval(b);
					var a = [];
					$("input:-webkit-autofill", c).each(function() {
						a.push({
							node: $(this),
							value: $(this).val()
						})
					}).parents("form:first")[0].reset(), $.each(a, function(a, b) {
						b.node.val(b.value)
					})
				} catch(d) {}
				e > f ? f += 100 : clearInterval(b)
			}, d)
		},
		formatMoney: function(a, b) {
			return(a.toFixed(b) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
		},
		getRGB: function(a, b) {
			var c = [0, 0, 0];
			return /#(..)(..)(..)/g.test(a) ? c = [parseInt(RegExp.$1, 16), parseInt(RegExp.$2, 16), parseInt(RegExp.$3, 16)] : /#(.)(.)(.)/g.test(a) && (c = [parseInt(RegExp.$1 + RegExp.$1, 16), parseInt(RegExp.$2 + RegExp.$2, 16), parseInt(RegExp.$3 + RegExp.$3, 16)]), b ? "rgba(" + c.join(",") + "," + b + ")" : "rgb(" + c.join(",") + ")"
		},
		cutString: function(a, b) {
			var c = /[^\x00-\xff]/g,
				d = a.replace(c, "**"),
				e = d.length;
			if(!(e > b)) return a;
			for(var f = Math.floor(b / 2), g = a.length, h = f; g > h; h++) {
				var i = a.substr(0, h).replace(c, "**");
				if(i.length >= b) return a.substr(0, h) + "..."
			}
		},
		localStorage: function(a, b) {
			if("undefined" == typeof b) {
				var b = localStorage.getItem(a);
				try {
					return JSON.parse(b)
				} catch(c) {
					return b
				}
			}
			localStorage.setItem(a, "string" == typeof b ? b : JSON.stringify(b))
		},
		removeStorage: function(a) {
			try {
				localStorage.removeItem(a)
			} catch(b) {}
		}
	}
}), define("utils/string.prototype", [], function() {
	var a = {
		trim: function() {
			return this.replace(/(^\s*)|(\s*$)/g, "")
		},
		replaceAll: function(a, b, c) {
			return RegExp.prototype.isPrototypeOf(a) ? this.replace(a, b) : this.replace(new RegExp(a, c ? "gi" : "g"), b)
		},
		isUrl: function() {
			return new RegExp(/^[a-zA-z]+:\/\/([a-zA-Z0-9\-\.]+)([-\w .\/?%&=:]*)$/).test(this)
		},
		isExternalUrl: function() {
			return this.isUrl() && -1 == this.indexOf("://" + document.domain)
		},
		toUrl: function() {
			return this.isUrl() ? this.replace(/(^\s*)|(\s*$)/g, "") : "http://" + this
		},
		stripTags: function() {
			return(this || "").replace(/<[^>]+>/g, "")
		}
	};
	$.extend(String.prototype, a)
}), define("utils/array.prototype", [], function() {
	var a = {
		max: function() {
			return Math.max.apply({}, this)
		},
		min: function() {
			return Math.min.apply({}, this)
		},
		pushOnly: function(a) {
			var b = !0;
			try {
				"undefined" == typeof mining.utils.inArray && (b = !1)
			} catch(c) {
				b = !1
			}
			return b && -1 == mining.utils.inArray(a, this) ? this.push(a) : this.length
		},
		remove: function(a) {
			var b = !0;
			try {
				"undefined" == typeof mining.utils.inArray && (b = !1)
			} catch(c) {
				b = !1
			}
			return b && -1 != mining.utils.inArray(a, this) && this.splice(mining.utils.inArray(a, this), 1), this
		},
		removeAll: function(a) {
			for(; - 1 != mining.utils.inArray(a, this);) this.remove(a);
			return this
		}
	};
	$.extend(Array.prototype, a), Array.indexOf || (Array.prototype.indexOf = function(a) {
		for(var b = 0; b < this.length; b++)
			if(this[b] == a) return b;
		return -1
	})
});