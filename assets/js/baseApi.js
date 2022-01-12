//注意：每次调用 $.get() 或 $.post() 或 $.ajax() 的时候
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象 
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    // 在发起真正的Ajax请求之前，统一拼接发起的请求
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    // 统一为有权限的接口，设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载 complete函数
    // 阻止不登录就进入后台页面
    options.complete = function (res) {
        // 无论成功或者失败，都会调用 complete函数
        // console.log('执行了 complete回调函数');
        // console.log(res);
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.强制清空 localstorage 的token
            localStorage.removeItem('token');
            // 2.强制跳转到登录页面
            location.href = '/login.html';
        }
    }
})