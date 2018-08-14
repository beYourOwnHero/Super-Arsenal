$(function () {
    /*1. 根据历史搜索记录  进行列表的渲染*/
    /*2. 点击搜索按钮  记录搜索历史 且 进行跳转商品列表*/
    /*2.1 没有输入内容的时候 需要提示*/
    /*2.2 当输入的内容  已经存在  删除之前的  追加新的在最前面*/
    /*2.3 当输入的内容  不经存在  但是超过了10条  删除第一条  追加新的在最前面*/
    /*2.4 正常情况 追加新的在最前面*/
    /*3. 点击删除按钮  删除对应的历史记录*/
    /*4. 点击清空按钮  删除所有的历史记录*/
    new App();
});
var App = function () {
    //获取历史记录
    //约定好 KEY 叫：hm49  VALUE 数据类型：数组json字符串
    this.KEY = 'hm49';
    this.list = JSON.parse(localStorage.getItem(this.KEY)||'[]');
    //历史列表容器
    this.$history = $('.lt_history');
    //获取搜索按钮
    this.$searchBtn = $('.lt_search a');
    //获取搜索输入框
    this.$searchInput = $('.lt_search input');
    this.init();
};
App.prototype = {
    init:function () {
        this.$searchInput.val('');
        this.render();
        this.bindEvent();
    },
    render:function () {
        //模板内容使用传入的数据  模板内有一个默认变量 指向你传入的数据 $data
        this.$history.html(template('history',{list:this.list,ec:encodeURIComponent}));
    },
    bindEvent:function () {
        var _this = this;
        this.$searchBtn.on('tap',function () {
            var value = _this.$searchInput.val();
            if(!value){
                mui.toast('请输入关键字');
                return;
            }
            //追加
            _this.addHistory(value);
            //跳转
            location.href = '/mobile/searchList.html?key='+encodeURIComponent(value);
            // 需要把一个html页面上的数据传递到下一个页面  URL传参
            // 取数据 key=1 其他情况 key=1&name=10  转码URL编码
            // 传递的时候使用encodeURIComponent转码   使用的时候使用decodeURIComponent解码
            // 模板内不能使用 外部变量  artTemplate的规定
        });
        this.$history.on('tap','li span',function () {
            _this.delHistory(this.dataset.index);
        }).on('tap','.tit a',function () {
            _this.clearHistory();
        });
    },
    addHistory:function (value) {
        //实现追加业务
        /*1.相同的*/
        var isSame = false;
        var sameIndex = null;
        this.list.forEach(function (item,i) {
            if(item == value){
                isSame = true;
                sameIndex = i;
                return false;
            }
        });
        if(isSame){
            //删除
            this.list.splice(sameIndex,1);
        }else{
            /*2.超了10*/
            if(this.list.length >= 10){
                //删除第一个
                this.list.splice(0,1);
            }
            /*3.正常的*/
        }
        //追加
        this.list.push(value);
        //注意：this.list 操作完毕  有反映 本地存储上?
        localStorage.setItem(this.KEY,JSON.stringify(this.list));
    },
    delHistory:function (index) {
        //删除内存
        this.list.splice(index,1);
        //存储
        localStorage.setItem(this.KEY,JSON.stringify(this.list));
        //渲染
        this.render();
    },
    clearHistory:function () {
        //删除内存
        this.list = [];
        //存储
        localStorage.setItem(this.KEY,JSON.stringify(this.list));//clear() removeItem()
        //渲染
        this.render();
    }
};