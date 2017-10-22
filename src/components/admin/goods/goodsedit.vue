<template>
        <div class="tmpl">
            <el-row>
                <el-col :span="24">
                    <div class="abread bt-line">
                        <!-- 使用elementUI中的面包屑导航组件完成 -->
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                            <el-breadcrumb-item>商品新增</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                </el-col>
            </el-row>
    
            <!-- 表单元素布局 -->
            <el-row class="martop">
                <el-col :span="19">
                    <!-- 定义一个表单 -->
                    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <!-- 定义表单元素- 标题 -->
                        
                        <el-form-item label="标题" prop="title">
                            <el-input v-model="form.title"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="副标题" prop="sub_title">
                            <el-input v-model="form.sub_title"></el-input>
                        </el-form-item>
                        <el-form-item label="类别" prop="category_id">
                            <el-select v-model="form.category_id" placeholder="请选择">
                                <el-option v-for="(cate,index) in categorylist" :key="index" :label="cate.title" :value="cate.category_id">
                                    <span v-for="count in (cate.class_layer-1)">&nbsp;</span>
                                    <span v-if="cate.class_layer>1">|-</span>
                                    <span v-text="cate.title"></span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否发布">
                            <el-switch v-model="form.status" on-text="发布" off-text="未发布" :width="80">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="推荐类型">
                            <el-switch v-model="form.is_slide" on-text="进入轮播" off-text="不进轮播" :width="90">
                            </el-switch>
                            <el-switch v-model="form.is_top" on-text="置顶" off-text="未置顶" :width="80">
                            </el-switch>
                            <el-switch v-model="form.is_hot" on-text="热门" off-text="非热门" :width="80">
                            </el-switch>
                        </el-form-item>
                        <el-form-item label="商品号" prop="goods_no">
                            <el-input v-model="form.goods_no"></el-input>
                        </el-form-item>
                        <el-form-item label="库存" prop="stock_quantity">
                            <el-input v-model="form.stock_quantity"></el-input>
                        </el-form-item>
                        <el-form-item label="市场价" prop="market_price">
                            <el-input v-model="form.market_price"></el-input>
                        </el-form-item>
                        <el-form-item label="销售价" prop="sell_price">
                            <el-input v-model="form.sell_price"></el-input>
                        </el-form-item>
                        <el-form-item label="上传封面图" >
                                <el-upload
                                class="upload-demo"
                                action="http://157.122.54.189:9095/admin/article/uploadimg"
                                :file-list="form.imgList"
                                :on-success="imgUploaded"
                                list-type="picture">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传图片文件</div>
                              </el-upload>
                            </el-form-item>
                            <el-form-item label="上传相册图" >
                                    <el-upload
                                    class="upload-demo"
                                    action="http://157.122.54.189:9095/admin/article/uploadfile"                               
                                    :file-list="form.fileList"
                                    :on-success="fileUploaded"
                                    list-type="picture">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传图片文件</div>
                                  </el-upload>
                                </el-form-item>
    
                                <el-form-item label="详细描述" >
                                      <quill-editor v-model="form.content"></quill-editor>
                                </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </template>
    
    <script>
    // 导入富文本编辑器组件对象
    import { quillEditor } from 'vue-quill-editor'
    
        export default {
            // 注册私有组件
            components:{
                quillEditor
            },
            data() {
                var checkNumber = (rule, value, callback) => {
                    // 非空验证
                    if (!value) {
                     return callback(new Error('不能为空'));
                    }
    
                    if(isNaN(value)){
                        return callback(new Error('输入的值必须是一个数字'));
                    }else{
                     callback();
                    }
                };
    
    
                return {
                    // 当前商品的分类数组
                    categorylist: [],
                    // form就是代表当前表单中的元素的一个对象
                    form: {
                        // 代表标题文本框的值
                        title: '',
                        sub_title: '',
                        category_id: 0,
                        status: true,
                        is_slide: true,
                        is_top: true,
                        is_hot: true,
                        goods_no:'',
                        stock_quantity:0,
                        market_price:0,
                        sell_price:0,
                        content:'',
                        imgList:[],  // 商品封面图片数据对象
                        fileList:[] //商品相册图片数组
                    },
                    rules: {
                        title: [
                            { required: true, message: '请输入标题名称', trigger: 'blur' }
                        ],
                        goods_no: [
                            { required: true, message: '请输入商品编号', trigger: 'blur' }
                        ],
                        stock_quantity: [
                             { validator: checkNumber, trigger: 'blur' }
                        ],
                        market_price: [
                            { validator: checkNumber, trigger: 'blur' }
                        ],
                        sell_price: [
                             { validator: checkNumber, trigger: 'blur' }
                        ]
                    }
                }
            },
            created() {
                // 当页面加载完毕以后，执行getCatelist()获取到分类下拉框数据
                this.getCatelist();
            },
            methods: {
                // 根据id获取商品的老数据
                getOldData(){
                    // 1.0 获取浏览器url中传入的id值
                    var goodsid = this.$route.params.id;

                    // 2.0 利用axios请求url： /admin/goods/getgoodsmodel/:id
                    this.$http.get('/admin/goods/getgoodsmodel/'+goodsid).then(res=>{
                        if(res.data.status === 1){
                            this.$message.error(res.data.message);
                            return;
                        }

                        // 3.0 将res.data.message 赋值给data中的 form对象即可
                        this.form = res.data.message;
                        // el-select中的默认值要求 v-model所绑定的值是一个数值类型，而接口返回的是一个字符串所以不能选中具体的项目
                        // 手动转换一下类型即可完成
                        this.form.category_id = (res.data.message.category_id -0);
                    });
                    
                },
                // 商品有多个相册图片
                fileUploaded(response, file, fileList){
                    this.form.fileList.push(response);
                },
                // 当封面图片上传完毕以后的回调函数
                imgUploaded(response, file, fileList){
                    // fileList 的值就是当前上传的所有图片
                    // file  的值就是当前上传图片的返回对象
                    // response 档次响应对象
                    // console.log(response);
                    // console.log(file);
                    // console.log(fileList);
                    // 将服务器响应回来的数据对象增加到 form.imgList数组中即可
                    this.form.imgList = [response];  // 单张封面图片
    
                },
                // 获取数据接口中的商品分类数据数组
                getCatelist() {
                    this.$http.get('/admin/category/getlist/goods')
                        .then(res => {
                            // 判断状态值
    
                            // 赋值
                            this.categorylist = res.data.message;
                            // this.form.category_id=49;
                             // 触发老数据获取方法
                             this.getOldData();
                        });
                },
                // 重置表单元素
                resetForm(formref) {
                    this.$refs[formref].resetFields();
                },
                // 用来提交表单元素到服务器api接口的
                submitForm(formref) {
                    // 验证当前表单元素是否符合规则
                    this.$refs[formref].validate((valid) => {
                        // 如果表单的所有元素值均合法，valid则返回true
                        if (valid) {
                            // ajax提交数据进行编辑操作
                           
                            // console.log(this.form);
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                }
            }
        }
    </script>
    <style scoped>
        .martop {
            margin-top: 10px;
        }
    </style>