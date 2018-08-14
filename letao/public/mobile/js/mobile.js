/*封装公共的函数*/
if(!window.lt){
  window.lt = {};
}

// 获取参数到地址栏
lt.getParamsByUrl = function () {
  // 业务 ?key=1&name=xxx
  // 转换 {key:1, name:'xxx'}
  var search = location.search;
    var obj = {};
    if (search) {
      search = search.replace(/^\?/, ''); //表示去掉第一个问号
      // replace 表示替换掉当前字符,更换为''
      if (search) {
        // key=1&name=xxx
        var arr = search.split('&'); //split 表示分割
        // ['key=1','name=xxx']
        arr.forEach(function (item, i) {
          // 遍历数组
          /*item key=1*/
          /*item name=xxx*/
          var itemArr = item.split('=');
          /*['key',1]*/
          /*['name','xxx']*/
          obj[itemArr[0]] = decodeURIComponent(itemArr[1]);
        });
      }
    }
    return obj;
};