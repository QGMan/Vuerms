<template>
    <div class="arttmpl">
        <el-row>
            <el-col :span="24">
                <div class="abread bt-line">
                    <!-- 使用elementUI中的面包屑导航组件完成 -->
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            </el-col>
        </el-row>
        <div class="operation">
            <el-row>
                <el-col :span="5">
                    <!-- 新增，删除，全选按钮 -->
                    <el-button>全选</el-button>
                    <el-button>新增</el-button>
                    <el-button>删除</el-button>
                </el-col>
                <el-col :span="3" :offset="16">
                    <!-- 搜索框 -->
                    <el-input placeholder="请输入搜索条件" icon="search" 
                    v-model="searchValue" :on-icon-click="getlist">
                    </el-input>
                </el-col>
            </el-row>
        </div>

        <el-row>
            <el-col :span="24">
                <el-table :data="list" 
                style="width: 100%" 
                :row-class-name="tableRowClassName"
                 @selection-change="getrows"
                 height="400">
                    <el-table-column type="selection" width="80">
                    </el-table-column>
                    <el-table-column prop="title" label="标题">
                        <template scope="scope">
                            <router-link v-bind="{to:'/admin/goodsedit/'+scope.row.id}">
                                {{ scope.row.title }}
                            </router-link>
                        </template>
                    </el-table-column>
                    <el-table-column prop="categoryname" label="类别" width="100">
                    </el-table-column>
                    <el-table-column label="发布人/发布时间" width="170">
                        <template scope="scope">
                            {{scope.row.user_name }} / {{scope.row.add_time | datefmt('YYYY-MM-DD') }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="属性" width="120">
                        <template scope="scope">
                                <el-tooltip class="item" effect="dark" 
                                v-bind="{content:(scope.row.is_slide==1?'进入轮播图':'不进入轮播图')}" placement="bottom">
                                        <i v-bind="{class:'el-icon-picture ls '+ (scope.row.is_slide==1?'imgactive':'')}"></i>
                                 </el-tooltip>
                            <i v-bind="{class:'el-icon-upload ls '+ (scope.row.is_top==1?'imgactive':'')}"></i>
                             <i v-bind="{class:'el-icon-star-on ls '+ (scope.row.is_hot==1?'imgactive':'')}"></i>
                        </template>

                    </el-table-column>
                    <el-table-column label="操作" width="80">
                        <template scope="scope">
                            <router-link v-bind="{to:'/admin/goodsedit/'+scope.row.id}">
                                <el-button type="success" size="mini">编辑</el-button>
                            </router-link>

                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <!-- 分页组件的时候 -->
                    <el-pagination
                    @size-change="sizeChange"
                    @current-change="changePage"
                    :current-page="currentPage"
                    :page-sizes="[10,20,30,50,100,200]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                  </el-pagination>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 获取删除数据的商品id字符串，多个id之间使用逗号分隔
                ids: '',
                // 搜索框的绑定属性
                searchValue: '',
                // 表示当前第几页
                currentPage:1,
                // 表示当前的页容量是多少
                pageSize:10,
                // 当前的数据总条数是多少 （这个数据一定是服务器api接口返回的）
                total:0,
                // 表格中的每行数据来源于list，而这个list将来是通过getlist()方法请求后台api接口获取到的
                list: []
            }
        },
        created() {
            // 获取到列表数据
            this.getlist();
        },
        methods: {
            // 当用户改变分页组件中的页容量的时候触发
            sizeChange(currentSize){
                // 将用户选择的页容量值赋值给pagesize
                this.pageSize = currentSize;

                 // 重新调用getlist()方法去获取到当前页的真实数据
                 this.getlist();
            },
            // 当用户点击下一页或者某个页码的时候会触发，并且将当前页码传入到pageindex参数
            changePage(pageindex){
                // 将最新的页码赋值给自定义的currentPage
                this.currentPage = pageindex;

                // 重新调用getlist()方法去获取到当前页的真实数据
                this.getlist();
            },
            // 1.0 获取到用户勾选的行对象数据
            getrows(rows) {
                this.ids = '';
                // console.log(rows);
                var splitchar = ',';
                for (var i = 0; i < rows.length; i++) {
                    if (i == rows.length - 1) {
                        splitchar = '';
                    }

                    this.ids += rows[i].id + splitchar;
                }

                //    console.log(this.ids);
            },
            // 用axios去发出具体的url的请求获取到数据后绑定到表格中
            getlist() {
                // 1.0 获取url
                var url = '/admin/goods/getlist?pageIndex='+this.currentPage+'&pageSize='+this.pageSize+'&searchvalue='+this.searchValue;
                this.$http.get(url).then(res => {
                    // 判断服务器返回的状态status
                    if (res.data.status == 1) {
                        this.$message.error(res.data.message);
                        return;
                    }

                    // 正常逻辑的处理
                    this.list = res.data.message;

                    // 将总数据条数赋值给total
                    this.total = res.data.totalcount;
                });
            },
            // 控制表格的隔行变色
            tableRowClassName(row, index) {
                //    控制奇数和偶数行的颜色
                if (index % 2 == 0) {
                    return 'info-row';
                } else {
                    return 'positive-row';
                }
            }
        }
    }
</script>
<style scoped>
</style>