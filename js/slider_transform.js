var Tbanner = document.querySelector('.Tbanner');
var topShow = Tbanner.querySelector('.topShow');
var aT = topShow.children;
/*获取topShow下的所有a，但是下面又给topShow加了一组a，所以也能获取到
增加后的a的数量*/
var chose = Tbanner.querySelector('.chose');
var cSpan = chose.querySelectorAll('span');

console.log(Tbanner.clientHeight);

document.addEventListener('touchstart',function(e){
	e.preventDefault();//清除手机端下拉的问题。
});
//轮播图
(function(){
	topShow.innerHTML += topShow.innerHTML;
	var liw = Tbanner.clientWidth;
	css(topShow,'width',liw * aT.length);
	var startX,startY,elX;
	css(topShow,'translateX',0);
	css(topShow,'translateZ',0);
	var now = 0;
	var ismove = true;
	var isFirst = true;
/*因为要做无缝轮播图的话，肯定是要在手指滑动过界前，将其他图拉到对应
的下一张的位置，但是做无缝必须在touchstart的时候来判断，在move和end中
做判断的话，其实拖拽第一张过界时，会出现短暂的空白，也就是过界的图
还没有拉过来，所以要在start中判断now的值。*/
	Tbanner.addEventListener('touchstart',function(e){
		clearInterval(topShow.timer);
		var touch = e.changedTouches[0];
		startX = touch.pageX;
		startY = touch.pageY;
		ismove = true;
		isFirst = true;
		
		if(Math.abs(now) <= 0) {//向右拖拽后过界时，将now拉到第1组的第0张。
			now = cSpan.length;
			css(topShow,'translateX',- now * liw);//同步now的left位置
		} else if(Math.abs(now) >= aT.length - 1) {
		//向左拖拽过界时，将now拉到第0组的最后一张。
			now = cSpan.length - 1;
			css(topShow,'translateX',- now * liw);//同步now的left位置
		}
		console.log(now);
		elX = css(topShow,'translateX');
	});
	Tbanner.addEventListener('touchmove',move);
	Tbanner.addEventListener('touchend',end);

	function move(e) {
		if(!ismove) {
			return;
		}
		var touchN = e.changedTouches[0];
		var nowX = touchN.pageX;
		var nowY = touchN.pageY;
		var dirX = nowX - startX;//用来判断用户是否想滑屏还是滑轮播图
		var dirY = nowY - startY;//用来判断用户是否想滑屏还是滑轮播图
		var x = nowX - startX + elX;
		css(topShow,'translateX',x);//move移动后，当前topShow的值。
		isFirst = false;
		if(Math.abs(dirY) > Math.abs(dirX)) {
			ismove = false;
			return;
		}
	}
	function end(e) {
		var nowLeft = css(topShow,'translateX');//在end的时候记录最后次move的
		//left位置。
		now = -Math.round(nowLeft / liw);
		/*判断如果没有啦过一张图的一半 ，那就还原拖拽前的位置，超过
		一张的图一半，那就拖拽到下一张。所以用四舍五入。*/
		console.log(nowLeft,'now');
		nowLeft = liw * now;//同步当前的left的值。
		startMove({
			el: topShow,
			target: {
				translateX: -nowLeft
			},
			time: 500,
			type: "easeOut"
		});
		for(var i = 0;i < cSpan.length;i++) {
			cSpan[i].className = '';
		}
		cSpan[now%cSpan.length].className = 'hoverSpan';

	}

})();
