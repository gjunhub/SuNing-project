//滑屏操作。(括号中为滚动条) --为回到顶部
(function(){
document.addEventListener('touchstart', function(e) {
	e.preventDefault();
});
var container = document.querySelector('.container');
var scroll = document.querySelector('#scroll');
var topIcon = document.querySelector('.topIcon');//回到顶部
var start = {};
var elY;
var lastDis;
var lastTime;
var lastSpeed;
var max = 0;
var min = container.clientHeight - scroll.offsetHeight;
var TC = .35;
var ismove = true;
var isFirst = true;

css(scroll,"translateY",0);
css(scroll,"translateZ",0.01);

var scale = container.clientHeight / scroll.offsetHeight;//(滚动条的比例)
var bar = document.createElement('div');
bar.className = 'bar';
bar.style.opacity = '0';
container.appendChild(bar);//添加滚动条

topIcon.style.opacity = 0;//--回到顶部

container.addEventListener('touchstart',function(e){
	clearInterval(scroll.timer);//判断用户当前滑屏的时候，立马又点击了屏幕，让动画停下来
	var touch = e.changedTouches[0];
	start = {x:touch.pageX,y:touch.pageY};
	elY = css(scroll,"translateY");
	lastDis = touch.pageY;
	lastTime = Date.now();
	ismove = true;
	isFirst = true;

	css(bar,'height',container.clientHeight * scale);//(点击的时候给滚动条添加高度)
});
container.addEventListener('touchmove',move);
container.addEventListener('touchend',end);

function move(e) {
	if(!ismove) {
		return;
	}
	var touchN = e.changedTouches[0];
	var now = {x:touchN.pageX,y:touchN.pageY};
	var dis = {x:now.x - start.x,y:now.y - start.y};
	var x = dis.y + elY;
	
	isFirst = false;
	if(Math.abs(dis.x) > Math.abs(dis.y)){
		ismove = false;
		return;
	}

	if(x > max) {
		TC = (.8 - x/container.clientHeight);//x越来越大的时候，TC就越来越小
		x *= TC;
	} else if(x < min) {
		x = (x - min)*(TC + .1) + min;
	}
	css(scroll,"translateY",x);

	nowTime = Date.now();

	lastSpeed = (now.y - lastDis) / (nowTime - lastTime);
	lastTime = nowTime;
	lastDis = touchN.pageY;

	bar.style.opacity = '1';//()
	css(bar,'translateY',-x*scale);

};
function end(e) {
	if(Date.now() - lastTime > 100) {
		lastSpeed = 0;
	}
	lastSpeed = Math.abs(lastSpeed) < .1?0:lastSpeed;
	var time = 200;
	var Translate = lastSpeed * time;
	
	Translate = Math.abs(Translate) < 2500?2500 * (Translate/Math.abs(Translate)):Translate;
	Translate = (isNaN(Translate))?0:Translate;
	var type = "easeOutStrong";
	var targetY = Translate + css(scroll,'translateY');
	console.log(Translate,targetY,css(scroll,'translateY'));

	if(Math.abs(targetY) > container.clientHeight) {//滑动距离达到一屏的时候，出现返回top的按钮。
		topIcon.style.opacity = 1;
	} else {
		topIcon.style.opacity = 0;
	}

	if(targetY > max) {
		type = "backOut";
		targetY = max;

	} else if(targetY < min) {
		type = "backOut";
		targetY = min;
	}
	
	time = Math.abs(targetY - css(scroll,'translateY'));
	time = (time > 0 && time < 200)?200:time;
	startMove({
		el:scroll,
		target: {
			translateY: targetY
		},
		type: type,
		time: time,
		callBack: function(){
			bar.style.opacity = '0';
		},
		callIn: function(){
			css(bar,'translateY',-css(scroll,'translateY')*scale);
			//（这里要重新获取一次srcoll的位移距离）。
		}
	});

}
})();