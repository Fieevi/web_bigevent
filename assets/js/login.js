$(function () {
    // 去注册页面
    $('#link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    });
    // 去登录页面
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });
    // 从layui获取form表单
    var form = layui.form;
    // 从layui获取layer提示
    var layer = layui.layer;
    // 通过form.verify()函数自定义校验规则
    form.verify({
        pwd: [
            // 自定义了一个叫做pwd的校验规则
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // repwd校验两次密码是否一致
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个错误
            const pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });
    // 监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {

        // 1.阻止默认提交行为
        e.preventDefault();
        // 2.发起ajax的post请求
        $.ajax({
            method: 'POST',
            url: 'http://www.liulongbin.top:3007/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                $('#form_reg [name=username]').val('');
                $('#form_reg [name=password]').val('');
                $('#form_reg [name=repassword]').val('');
                layer.msg('注册成功,请登录');
                // 模拟点击 跳转页面 
                $('#link_login').click();
            }
        });
    });
    // 监听登录表单提交事件
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起Ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功!');
                // 将登录成功后的token字符串，保存到localstorage
                localStorage.setItem('token', res.token);
                // 跳转到后台主页
                location.href = './index.html'
            }
        })
    })
})