$(function () {
    const form = layui.form;
    const layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return layer.msg('昵称长度必须在 1-6个字符之间');
            }
        }
    });
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败');
                }
                console.log(res);
                // layui的form表单赋值
                form.val('formUserInfo', res.data)
            }
        });
        
    }
    // 重置表单
    $('#btnReset').on('click', function (e) {
        //  由于重置表单按钮会将表单所有元素都重置。所以需要禁用表单事件
        e.preventDefault();
        initUserInfo();
    });
    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 禁用表单
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息更新失败');
                }
                layer.msg('用户信息更新成功');

                // 调用父页面中的方法，重新渲染用户头像和名字
                window.parent.getUserinfo();
            }
        })
    })
})