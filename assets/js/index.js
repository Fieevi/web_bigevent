$(function () {
    getUserinfo();

    var layer = layui.layer;

    // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function () {
        //eg1
        layer.confirm('是否确定退出?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清空本地存储的token
            localStorage.removeItem('token');
            // 2.跳转到登录页面
            location.href = '../../login.html';

            // 关闭confirm询问框
            layer.close(index);
        });
    })
})
// 获取用户基本信息
function getUserinfo() {
    // console.log(localStorage.getItem('token'));
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // header 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            renderAvatar(res.data);
            // console.log(res);
        },
        // 阻止通过 输入网页地址 进入后台页面的登录
        // 无论成功或者失败，都会调用 complete函数
        // complete: function (res) {
        // console.log('执行了 complete回调函数');
        //     console.log(res);
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据

        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        // 1.强制清空 localstorage 的token
        //         localStorage.removeItem('token');
        // 2.强制跳转到登录页面
        //         location.href = '/login.html';
        //     }
        // }
    })
}
// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username;
    // 2.渲染用户名称
    $('.welcome').html(`欢迎&nbsp;&nbsp;${name}`);
    // 3.用户是否有头像决定渲染 文字头像还是自带头像
    if (user.user_pic !== null) {
        // 3.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2渲染文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        // name[0] 获取字符串第一个 toUpperCase 字符串大写方法
        $('.text-avatar').html(first).show();
    }
}