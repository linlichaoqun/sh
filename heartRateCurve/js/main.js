$(function(){

	// 为dom对象分配高度
	var h = $(window).height();
	$('#clazzCurve').css('height',h);

	// 基于准备好的dom，初始化echarts实例
	var clazzCurve = echarts.init($('#clazzCurve')[0]); 

	// 暴露已经填充好数据的对象
	var clazzOption = curve1();

	// 获取uid
	var uid = window.location.href.split('?')[1];

	// 连接实时端
	var uid = "zc_1_1_3";
  	var ip = 'http://www.corededu.com:8787';
	var socket = io(ip);
	socket.on('connect',function(){
    	socket.emit('login',uid);
  });
  socket.on('update_online_count',function(online_stat){
    	console.log(online_stat)
  });
  // 实时端推送来数据时
  socket.on('a1', function(msg){
    	var data = eval('('+msg+')').collection;
    	var time = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
    	var obb = {}; 
    	obb.current_time = [];
    	obb.current_time.push(time);     
    	obb.class_avg = objToArr(data.class_avg);
    	obb.boy_avg = objToArr(data.boy_avg);
    	obb.girl_avg = objToArr(data.girl_avg);
  	console.log(obb);
  	dynamic(obb);
  });
  // 模拟曲线
  var o = {};
  o.class_avg=[],o.boy_avg=[],o.girl_avg=[],o.current_time=[];
  setInterval(function(){
	var time = (new Date()).toLocaleTimeString().replace(/^\D*/,'');
	o.current_time.push(time);
	o.class_avg.push(Math.ceil(Math.random()*120) + 40);
	o.boy_avg.push(Math.ceil(Math.random()*120) + 40);
	o.girl_avg.push(Math.ceil(Math.random()*120) + 40);
    	dynamic(o);
  },2000);
	
  // 动态更新数据
  function dynamic(obb){
    	// x轴数据更新
    	arrShift(clazzOption.xAxis[0].data);
    	clazzOption.xAxis[0].data = obb.current_time;
    	// y轴数据更新
    	arrShift(clazzOption.series[0].data);
    	clazzOption.series[0].data = obb.class_avg;
    	arrShift(clazzOption.series[1].data);
    	clazzOption.series[1].data = obb.boy_avg;
    	arrShift(clazzOption.series[2].data);
    	clazzOption.series[2].data = obb.girl_avg;
	// 绘图 ----  为echarts对象加载数据 
   	clazzCurve.setOption(clazzOption);
  }

  // 过滤器 ----  数据长度大于12则执行出队（使曲线数据维持在12条）
  function arrShift(arr){
  	if(arr.length > 12){
  		arr.shift();
  	}
  }

  // 转换器 ----  对象转数组（将后端传来的无序对象转为前端可用的数组）
  function objToArr(obj){
    	var arr = [];
    	for(var i in obj){
     	 	arr.push(obj[i]);
    	}
    	return arr;
  }

  // 班级曲线对象
  function curve1(){
	var clazzColors = ['#EB9E05','#409EFF','#67C23A'];//'#283b56'
	var markPoint = {
	      data : [
		{type : 'max', name : '最大值'},
		{type : 'min', name : '最小值'},
	      ],
  	}
	var markLine = {
	      data : [
		{type : 'average', name : '平均值'},
	      ],
	}
	var clazzOption = {
	    color : clazzColors,
	    title : {
	    	left : 'center',
	      text : '班级心率实时曲线',
	      top : '20',
	      subtextStyle : {
	        color : '#aaa',
	        fontWeight : 'bolder',
	        align : 'left',
	      },
	    },
	    tooltip : {
	      show : true,
	      trigger : 'axis',
	      snap : 'snap',
	    },
	    legend : {
	    	orient : 'vertical',
	      data : ['班级平均心率','男生平均心率','女生平均心率'],
	   		x : 'right',
	      top : 40,
	    },
	    calculable : true,
	    grid : {  // 图表的内外边距
	      top : 140,
	      bottom : 25,
	      left : 60,
	      right : 60,
	    },
	    xAxis : [{  // X轴坐标参数
	    	name : '时间/秒',
	      type : 'category',
	      boundaryGap : true,  // 数据置于刻度中间。
	      data : [],
	    }],
	    yAxis : [{
	      name:'心率/次数',
	      type: 'value',
	      scale:true,
	    }],
	    series : [
		    create('班级平均心率'),
		    create('男生平均心率'),
		    create('女生平均心率'),
	    ],
	}
  	// 构造器 ----  各曲线对象
  	function create(name){
    	   var obj = {
	      name : name,
	      smooth : true,	// 曲线平滑属性
	      type : 'line',
	      data : [],
	      markPoint : markPoint,
	      markLine : markLine,
	   }
	   return obj;
  	}
	return clazzOption;
  }


});
