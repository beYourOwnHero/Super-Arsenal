$(function () {
  /*1. 默认下拉刷新效果  获取商品详情数据进行渲染 清除下拉刷新效果*/
  /*2. 选择尺码  选择数量*/
  /*3. 加入购物车功能*/
  /*3.1 没有登录  去登录页进行登录  登录完毕回调到详情页面*/
  /*3.2 已经登录  当你添加购物车成功 弹窗提示框 （点击确认 跳转去购物车页面）*/
  new App();
});
var App = function () {
  //需要渲染的容器
  this.$el = $('.mui-scroll');
  this.init();
}
App.prototype = {
  init:function(){
      this.initPullRefresh();
      this.bindEvent();
  },
  initPullRefresh:function () {
      var _this = this;
      mui.init({
          pullRefresh:{
              container:'.mui-scroll-wrapper',
              indicators:false,
              down:{
                  auto:true,
                  callback:function () {
                      _this.render(function () {
                          mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                      });
                  }
              }
          }
      });
  },
  render:function (callback) {
      var _this = this;
      $.ajax({
          type:'get',
          url:'/product/queryProductDetail',
          data:{
              id:lt.getParamsByUrl().productId
          },
          dataType:'json',
          success:function (data) {
              //渲染
              _this.$el.html(template('product',data));
              //组件的效果没有初始化
              mui('.mui-slider').slider({
                  interval:3000
              });
              //清除下拉的效果
              callback && callback();
          }
      });
  },
  bindEvent:function () {
      var _this = this;
      _this.$el.on('tap','[data-size]',function () {
          _this.changeSize(this);
      });
  },
  addCart:function () {

  },
  changeSize:function (btn) {
      $(btn).addClass('now').siblings().removeClass('now');
  },
  changeNum:function () {

  }
};