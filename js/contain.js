//滑屏操作。(括号中为滚动条) --为回到顶部

//=>代表上拉加载的代码
(function(){
document.addEventListener('touchstart', function(e) {
	e.preventDefault();
});
var container = document.querySelector('.container');
var scroll = document.querySelector('#scroll');
var topIcon = document.querySelector('.topIcon');//回到顶部
var start = {};

var likeList = document.querySelector('.likeList');
var containerWrap = container.getBoundingClientRect();
var likeListLi = likeList.getElementsByTagName('li');
var listFooter = document.querySelector('.listFooter');
var first = 0;//=>记录当前加载次的第一个
var last = null;//=>记录当前加载次的最后个
var nowPage = 0;//=>记录当前加载的是第几次
var page = 4;//=>一次加载了几张
var isOver = false;//=>全部加载完了就变成true，false还能加载

var elY;
var lastDis;
var lastTime;
var lastSpeed;
var max = 0;
var min = null;
var TC = .35;
var ismove = true;
var isFirst = true;

css(scroll,"translateY",0);
css(scroll,"translateZ",0.01);

var scale ;
var bar = document.createElement('div');
bar.className = 'bar';
bar.style.opacity = '0';
container.appendChild(bar);//添加滚动条

topIcon.style.opacity = 0;//--回到顶部

container.addEventListener('touchstart',function(e){
	clearInterval(scroll.timer);//判断用户当前滑屏的时候，立马又点击了屏幕，让动画停下来
	scale = container.clientHeight / scroll.offsetHeight;//(滚动条的比例)
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
	console.log(elY,'sb');
	var x = dis.y + elY;
	min =  container.clientHeight - scroll.offsetHeight;
	
	isFirst = false;
	if(Math.abs(dis.x) > Math.abs(dis.y)){
		ismove = false;
		return;
	}

	if(x > max) {
		TC = (.8 - x/container.clientHeight);//x越来越大的时候，TC就越来越小
		x *= TC;
	} else if(x < min) {
		TC = .35;
		x = (x - min)*(TC - .2) + min;
	}
	css(scroll,"translateY",x);

	nowTime = Date.now();

	lastSpeed = (now.y - lastDis) / (nowTime - lastTime);
	lastTime = nowTime;
	lastDis = touchN.pageY;

	bar.style.opacity = '1';//()
	css(bar,'translateY',-x*scale);//向下划屏的话，滚动条应该是负值，向上走的。反之亦然

	if(isOver) {//全部加载后，return
		return;
	}
//上拉加载的代码区域
	var nowScroll = css(scroll,'translateY');
	if(nowScroll <= min - 20) {
		listFooter.innerHTML = '松开立即加载~';
		isCreate = true;
	} else {
		listFooter.innerHTML = '上滑加载更多…';
		isCreate = false;
	}
	showLi();

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
			moveEnd();//startend抬起后，动画结束后的回调;
		},
		callIn: function(){
			css(bar,'translateY',-css(scroll,'translateY')*scale);
			//（这里要重新获取一次srcoll的位移距离）。
		}
	});
	up();

	
}
function up() {//之间抬起后的回调
	if(isOver) {
		return;
	}
	var min = container.clientHeight - scroll.offsetHeight;
	var nowScroll = css(scroll,'translateY');
	if(isCreate&&nowScroll <= min) {
		nowPage++;
		create();
	}
}
/*startend抬起后，动画结束后的回调,没有这个的话，是不能显示懒加载里面的
内容的，抬起一瞬间没有，让li进入懒加载的空间中，但是抬起后还有滑屏动画的
动画过程中，li进入了懒加载的getBoundingClientRect空间中，所以必须这部代码*/
function moveEnd() {
	if(isOver) {
		return;
	}
	showLi();//让进入懒加载区域的li懒加载出来
}

create();//=>一上来先生成4个li，不然啥都看不到了

function create() {
	first = nowPage * page;
	if(first >= data.length) {
		listFooter.innerHTML = '亲~我是有底线哒！';
		isOver = true;
		return;
	}
	last = first + page;
	last = last > data.length?data.length:last;

	for(var i = first;i < last;i++) {
		var li = document.createElement('li');
		li.dataset.src = data[i].img;
		likeList.appendChild(li);
	}
	showLi();
}
function showLi() {
	for(var i = 0;i < likeListLi.length;i++) {
		var rect = likeListLi[i].getBoundingClientRect();
		if(rect.top < containerWrap.bottom && rect.bottom > containerWrap.top && !likeListLi[i].isShow) {
			console.log(139);
			showLiImg(likeListLi[i],i);
			
			likeListLi[i].isShow = true;//=>说明已经加载过了，不用重复showLiImg();
		}
	}
}
function showLiImg(li,index) {
	var c = document.createElement('canvas');
	var a = document.createElement('a');
	var img = new Image();
	var cxt = c.getContext('2d');
	a.appendChild(c);
	li.innerHTML = `
			<div>${data[index].title}</div>
			<strong>${data[index].prise}</strong>
			<a href="javascript:;">找相似</a>
		`;
	li.insertBefore(a,li.children[0]);
	c.width = li.clientWidth;
	c.height = li.clientHeight;
	img.src = li.dataset.src;
	img.onload = function () {
		cxt.drawImage(img,0,0,c.width,c.height);
		c.style.opacity = 1;
	}
}

//返回顶部
	topIcon.addEventListener('click',() => {
		if(topIcon.style.opacity == 1) {

			var topDis = css(scroll,'translateY');

			console.log(topDis,'topDis');
			startMove({
				el: scroll,
				target: {
					translateY: 0
				},
				time: 1000,
				type: 'easeOutStrong',
				callBack: () => {
					setTimeout(() => {
						topIcon.style.opacity = 0;
					},500);
				},
				callIn: () => {
					css(bar,'translateY',-css(scroll,'translateY')*scale);
					//（这里要重新获取一次srcoll的位移距离）。
				}
			});
		}
	});
})();