$(function () {
    const layer = layui.layer;
    const form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor()
    // 定义文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败');
                }
                layer.msg('获取文章分类成功');
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render()方法
                form.render();

            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    // 为选择封面的按钮，绑定事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });
    // 监听 coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        // 获取文件的列表数组
        var files = e.targer.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return 
        }
        // 拿到用户选择的文件,创建对应的url地址
        newImgURL = URL.createObjectURL(files[0]);
        // 设置新的图片路径
        $image
            .cropper('destroy')// 销毁旧的裁剪区域   
            .attr('src', newImgURL)// 重新设置图片路径
            .cropper(options)// 重新初始化裁剪区域
    });
    let art_state = '已发布';

    // 为草稿按钮添加点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    });
    // 为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止默认提交行为
        e.preventDefault();
        // 2. 基于form表单，快速创建一个FormData 对象
        // $(this)[0] 将jquery对象转换为原生DOM对象
        var fd = new FormData($(this)[0]);
        // 3.将文章的发布状态，存入fd中
        fd.append('state', art_state)
        // 4.将封面裁剪后的图片，转为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象，存储到fd中
                fd.append('cover_img', blob);
                // 6.发起ajax请求
                publishArticle(fd);
            });

    });
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 如果传入的参数是 FormData 难么必须携带下面两个选项
            // 必须添加下面两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(' 发布文章失败');
                }
                layer.msg(' 发布文章成功');
                // 发布文章成功之后，跳转到文章列表页面
                location.href='/article/art_list.html'
            }
        })
    }
})