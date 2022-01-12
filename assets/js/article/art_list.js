$(function () {
    const layer = layui.layer;
    const form = layui.form;
    const laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义簿零的函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }
    // 定义一个查询参数的对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2,//每页显示几条数据，默认显示两条
        cate_id: '',//文章分类的id、
        state: '',//文章发布的状态
        limits: [2, 3, 5, 10]
    }
    initTable();
    initCate();
    // 初始化文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章失败');
                }
                layer.msg('获取文章成功');
                // 使用模板引擎渲染数据
                const htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                renderPage(res.total);
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败');
                }
                layer.msg('获取文章分类成功');
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }

    // 监听 form-search表单的submit 提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选项的值
        const cate_id = $('[name=cate_id]').val();
        const state = $('[name=state]').val();
        // 为查询参数的对象 q中 对应的值赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件重新渲染表格
        initTable();
    });
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用 laypage.render() 方法渲染分页
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total,//总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//设置默认被选中的分页
            // 分页发生切换的时候，会触发jump回调函数
            // 触发jump回调的方式有两种：
            // 1.点击页码的时候会触发 jump 回调
            // 2.只要调用了layer.render方法,就会触发 jump方法
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function (obj, first) {
                // 可以通过 first 的值,来判断是通过哪种方式,触发的jump回调
                // 通过firsrt的值为true,证明是方式2触发的
                // 否则就是方式1触发的
                // console.log(obj.curr);
                // 把最新的页码值，赋值到q 这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到q 这个查询参数对象的 pagesize属性中
                q.pagesize = obj.limit;
                // 根据最新的q获取对应的数据列表，并渲染表格
                // initTable();
                if (!first) {
                    initTable();
                }
            }
        })
    }
    //  通过事件委托 为删除按钮btn-delete 绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        //eg1
        var len = $('.btn-delete').length;
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + $(this).attr('id'),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除文章成功');
                    // 当数据删除完成之后，需要判断当前这一页，是否还有剩余的数据
                    // 如果没有剩余的数据了，则让页码值-1之后，再重新调用inittable方法
                    if (len === 1) {
                        // 如果len的值等于1，证明删除完毕后，页面没有任何数据了

                        // 页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;

                    }
                    initTable();
                }
            })
            layer.close(index);
        });
    })
})