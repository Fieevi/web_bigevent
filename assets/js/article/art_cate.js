$(function () {
    initArtcateList()
    // 获取文章分类的初始列表
    const layer = layui.layer;
    const form = layui.form;
    function initArtcateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            data: {},
            success: function (res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }
        });
    }
    // 关闭弹出层参数
    let indexAdd = null;
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });
    // 事件代理 为 form_add添加submit事件
    $('body').on('submit', '#form_add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败');
                }
                layer.msg('添加文章分类成功');
                initArtcateList();
                // 根据索引，关闭对应弹出层
                layer.close(indexAdd);
            }
        })
    });

    // 事件代理 为 编辑按钮添加点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-id');
        // console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                // if (res.status !== 0) {
                //     return layer.msg('更新失败');
                // }
                form.val('form-edit', res.data)
            }
        })
    });

    // 事件代理 为 修改分类的表单绑定submit提交事件
    $('body').on('submit', '#form_edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功');
                initArtcateList();
                layer.close(indexEdit);
            }
        })
    });
    // 事件代理 为 删除分类按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        //eg1
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败');
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtcateList();
                }
            })
        });
    })
})