$(function () {
  // 自调用函数(回调函数)
  // 初始化轮播图
  mui('.mui-slider').slider({
    interval:4000
  });
  // 初始化区域滚动
  mui('.mui-scroll-wrapper').scroll({
    indicators:false
  });
})