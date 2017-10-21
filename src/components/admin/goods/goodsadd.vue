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
            <el-col :span="10">
                <!-- 定义一个表单 -->
                    <el-form :model="form"                    
                     :rules="rules" 
                     ref="ruleForm" 
                     label-width="100px" 
                     class="demo-ruleForm">
                        <!-- 定义表单元素- 标题 -->
                        <el-form-item label="标题" prop="title">
                             <el-input v-model="form.title"></el-input>
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
    export default {
        data() {
            return {
                // form就是代表当前表单中的元素的一个对象
                form:{
                    // 代表标题文本框的值
                    title:''
                },
                rules:{
                    title:[
                      { required: true, message: '请输入标题名称', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            // 重置表单元素
            resetForm(formref){
                this.$refs[formref].resetFields();
            },
            // 用来提交表单元素到服务器api接口的
            submitForm(formref){
                // 验证当前表单元素是否符合规则
                this.$refs[formref].validate((valid) => {
                    // 如果表单的所有元素值均合法，valid则返回true
                if (valid) {
                    // ajax提交数据进行新增操作
                    console.log('success');
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
    .martop{
        margin-top: 10px;
    }
</style>