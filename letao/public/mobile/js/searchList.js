$(function () {
    /*1. 当页面初始化的时候：主动触发下拉刷新效果  去获取第一页数据渲染页面替换  去除下拉刷新效果 */
    /*2. 当我们去上拉操作的时候：触发上拉加载效果  去获取下一页数据渲染页面追加  去除上拉加载效果*/
    /*3. 当我们输入新的关键字点击搜索按钮：触发下拉刷新效果  去获取第一页数据渲染页面替换  去除下拉刷新效果*/
    /*4. 当我们点击排序按钮：触发下拉刷新效果  去获取第一页数据渲染页面替换  去除下拉刷新效果*/

    /*实现下拉刷新和上拉加载*/
    /*mui的下拉和上拉的效果是基于区域滚动之上封装的  结构一致*/
    /*初始化*/
    // mui.init({
    //     //拉刷新组件
    //     pullRefresh:{
    //         /*配置*/
    //         container:'.mui-scroll-wrapper',
    //         /*下拉*/
    //         down:{
    //             auto:true,
    //             callback:function () {
    //                 //去获取数据
    //                 setTimeout(function () {
    //                     //获取数据完毕
    //                     mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
    //                 },1000);
    //             }
    //         },
    //         /*上拉*/
    //         up:{
    //             callback:function () {
    //                 //去获取数据
    //                 setTimeout(function () {
    //                     //获取数据完毕
    //                     mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
    //                 },1000);
    //             }
    //         }
    //     }
    // });

    new App();
});

var App = function () {
  //渲染的容器
  this.$product = $('.lt_product');
  //搜索框
  this.$searchInput = $('.lt_search input');
  //搜索按钮
  this.$searchBtn = $('.lt_search a');
  //排序区域
  this.$order = $('.lt_order');
  //获取搜索关键字  设置给输入框
  this.proName = lt.getParamsByUrl().key;
  //默认第一页
  this.page = 1;
  //排序方式
  this.price = null;
  this.num = null;
  this.init();
};
App.prototype = { // prototype 构造函数 通过 prototype 找原型
  init: function () {
    this.$searchInput.val(this.proName);
    this.initPullRefresh();
    this.bindEvent();
  },
  initPullRefresh: function () {
    var _this = this;
    mui.init({
      // 拉动刷新组件
      pullRefresh: {
        // 配置
        container: '.mui-scroll-wrapper',
        // 去掉滚动条
        indicators: false,
        // 下拉
        down: {
          // 自动触发一次
          auto: true,
          callback: function () {
            // 去获取数据
            // 第一页
            _this.page = 1;
            _this.render(function (data) {
              _this.$product.html(template('product', data));
              // 结束下拉刷新操作
              mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
              // 启动之前禁用上拉加载
              mui('.mui-scroll-wrapper').pullRefresh().refresh(true);
            });
          }
        },
        // 上拉
        up: {
          callback: function (){
            // 去获取数据
            // 下一页
            _this.page++;
            _this.render(function (data){
              _this.$product.append(template('product', data));
              // 如果没有数据 禁用上拉操作并显示没有更多数据
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(!data.data.length);
            });
          }
        }
      }
    });
  },

  render: function (callback) {
    var _this = this;
    // 获取数据
    // 模板渲染
    $.ajax({
      type: 'get',
      url: '/product/queryProduct',
      data: {
        proName: _this.proName,
        page: _this.page,
        pageSize: 4,
        price: _this.price,
        num: _this.num
      },
      dataType: 'json',
      success: function (data) {
        // 渲染
        // 模拟网络延时 不要在工作中使用
        setTimeout(function (){
          callback && callback(data);
        }, 1000);
      }
    });
  },

  bindEvent: function () {  // bindEvent 表示事件的绑定
    var _this = this;
    _this.$searchBtn.on('tap', function (){
      _this.search();
    });
    _this.$order.on('tap','a', function (){
      _this.order(this);
    });
  },
  // 排序
  order: function () {
    var _this = this;
    // 当前点击的按钮
    var $curr = $(btn);
    var $currSpan = $curr.find('span');
    // 选择时候的样式修改
    //1. 当点击的排序没有选中：当前元素选中 其他元素重置
    //2. 当点击的排序已经选中：当前元素的箭头 反方向进行改变
    if ($curr.hasClass('now')) {
      if ($currSpan.hasClass('fa-angle-down')) {
        $currSpan.attr('class', 'fa fa-angle-up');
      }else {
        $currSpan.attr('class', 'fa fa-angle-down');
      }
    }else {
      $curr.addClass('now').siblings().removeClass('now').find('span').attr('class', 'fa fa-angle-down');
    }
    //进行排序
    //price   |否|使用价格排序（1升序，2降序）
    //num     |否|产品库存排序（1升序，2降序）
    // 点击按钮的时候判断排序类型  根据箭头判断排序的方式（升序 降序）
    var orderType = $curr.data('type'); //price 或 num
    var orderValue = $currSpan.hasClass('fa-angle-down') ? 2 : 1;
    // 清空排序方式
    _this.price = null;
    _this.num = null;
    // 给对象中的 price num 赋值即可
    _this[orderType] = orderValue;
    // 调用渲染方法
    // 主动去触发一次下拉刷新操作
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  },
  // 搜索
  search: function () {
    var value = this.$searchInput.val();
    if (!value) {
      mui.toast('请输入关键字');
      return;
    }
    this.proName = value;
    // 主动去触发一次下拉刷新操作
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  }
};