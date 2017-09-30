document.addEventListener('touchstart',function(e){
	e.preventDefault();//清除手机端下拉的问题。
});

(function() {
	toSilder('.Tbanner','.topShow','.Tbanner span');//顶部轮播图
	toSilder('.silder','.shopList');//掌上抢轮播-没传dot，下面还有判断
	function toSilder(parent,contain,dot) {
		var silderWrap = document.querySelector(parent);
		var silderBox = document.querySelector(contain);
		var liW = dot?silderWrap.clientWidth:silderWrap.clientWidth / 2 - 5;
		var silderChild = silderBox.children;
		var spanDot = dot?silderWrap.querySelectorAll(dot):null;
		var now = 0;
		var isMove = true;
		var isFirst = true;
		var elX,touch;
		var start = {};
		var timer = null;

		silderBox.innerHTML += silderBox.innerHTML;
		css(silderBox,'width',liW * silderChild.length);
		css(silderBox,'translateX',0);
		css(silderBox,'translateZ',0.01);

		console.log(silderChild.length,liW,spanDot);

		silderWrap.addEventListener('touchstart', e => {
			clearInterval(timer);//摁下时停止定时器自动轮播
			touch = e.changedTouches[0];
			start = {x: touch.pageX,y:touch.pageY};

			isMove = true;
			isFirst = true;

			if(Math.abs(now) <= 0) {
				now = silderChild.length / 2;
				css(silderBox,'translateX',-now * liW);
				console.log(now,'----');
			} else if(Math.abs(now) >= silderChild.length - 1) {
				now = silderChild.length / 2 - 1;
				css(silderBox,'translateX',-now * liW);
				console.log(now,'++++');
			}

			elX = css(silderBox,'translateX');
		});

		silderWrap.addEventListener('touchmove',move);
		silderWrap.addEventListener('touchend',end);

		function move(e) {
			if(!isMove) {
				return;
			}
			var touchN = e.changedTouches[0];
			var moveNow = {x:touchN.pageX,y:touchN.pageY};
			var dis = {x:moveNow.x - start.x,y:moveNow.y - start.y};
			var Translate = dis.x + elX;
			
			css(silderBox,'translateX',Translate);

			if(Math.abs(dis.y) > Math.abs(dis.x)) {
				isMove = false;
				return;
			}
		}

		function end(e) {
			var nowTranslateX = css(silderBox,'translateX');

			now = -Math.round(nowTranslateX / liW);

			nowTranslateX = liW * now;

			startMove({
				el: silderBox,
				target: {
					translateX: -nowTranslateX
				},
				time: 500,
				type: "easeOut"
			});
			if(spanDot) {
				for(var i = 0;i < spanDot.length;i++) {
				spanDot[i].className = '';
			}
			spanDot[now%spanDot.length].className = 'hoverSpan';
			}
			if(spanDot) {
				autoSilder();
			}//抬起时，自动轮播起来
		}

		//下面是自动轮播的代码
		if(spanDot) {
			autoSilder();
		}
		function autoSilder() {
			timer = setInterval(() => {
				if(Math.abs(now) >= silderChild.length - 1) {
					now = spanDot.length - 1;
					css(silderBox,'translateX',-now * liW);
				}
				now++;
				var autoTranslate = now * liW;
				startMove({
					el: silderBox,
					target: {
						translateX: - autoTranslate
					},
					time: 500,
					type: "easeOut"
				});
				if(spanDot) {
					for(var i = 0;i < spanDot.length;i++) {
						spanDot[i].className = '';
					}
					spanDot[now%spanDot.length].className = 'hoverSpan'
				}
			},3000); 
		}
	}
})();