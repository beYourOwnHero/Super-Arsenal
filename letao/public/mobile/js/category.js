$(function () {
  /*需求分析*/
  /*1. 默认渲染一级分类和二级分类*/
  /*1.1 先获取一级分类数据*/
  /*1.2 渲染左侧分类*/
  /*1.3 同时获取第一个第一分类且根据这个分类去查询二级分类数据*/
  /*1.4 渲染右侧分类*/
  /*2. 点击左侧分类 进行右侧分类的渲染*/
  /*2.1 左侧栏样式的切换*/
  /*2.2 去进行右侧栏的渲染*/
  /*2.3 去进行右侧栏的渲染 注意：有没有数据  图片正不正确*/
  new App();
});
/*构造函数*/
var App = function () {
  this.$top = $('.lt_cateLeft');
  this.$second = $('.lt_cateRight');
  /*对象属性*/
  this.init();
};
/*原型方法*/
App.prototype = {
  /*入口函数*/
  init:function () {
      this.render();
      this.bindEvent();
  },
  /*渲染*/
  render:function () {
      var _this = this;
      _this.renderTop(function (data) {
          _this.renderSecond(data.rows[0].id);
      });
  },
  /*渲染一级分类*/
  renderTop:function (callback) {
      var _this = this;
      /*获取数据*/
      /*进行渲染*/
      $.ajax({
          type:'get',
          url:'/category/queryTopCategory',
          data:'',
          dataType:'json',
          success:function (data) {
              /*模板渲染*/
              //模板内容使用传入的数据：如果是对象 对象的属性在模板内就一个变量数据
              _this.$top.html(template('top',data));//{rows:'',total:''}
              callback && callback(data);//短路与 &&
          }
      });
  },
  /*渲染二级分类*/
  renderSecond:function (topId) {
      var _this = this;
      /*获取数据  */
      /*进行渲染*/
      $.ajax({
          type:'get',
          url:'/category/querySecondCategory',
          data:{id:topId},
          dataType:'json',
          success:function (data) {
              !data.rows.length && mui.toast('没有品牌数据');
              /*if(!data.rows.length){
                  mui.toast('没有品牌数据');
              }*/
              /*模板渲染*/
              _this.$second.html(template('second',data));
          }
      });
  },
  /*绑定事件*/
  bindEvent:function () {
      /*左侧点击  click 300ms延时  推荐使用tap 但是在zepto.js的touch模块中 */
      /*tap是手势事件（其实就是点击事件只不过比click快） swipeLeft swipeRight 手势事件 都是基于touch事件进行的封装事件*/
      /*不是原本就支持的 是一些框架（mui实现了）或者库 封装的*/
      var _this = this;
      _this.$top.on('tap','li a',function () {
          //改样式
          $(this).parent('li').addClass('now').siblings('li').removeClass('now');
          //渲染二级分类
          _this.renderSecond(this.dataset.id);//$(this).data('id');
      });
  }
};
