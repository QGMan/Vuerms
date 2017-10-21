
// 步骤1：导入 vue这个包
// var Vue = require('vue');
import Vue from 'vue';

// 步骤2：想要解析和呈现App.vue组件的内容，则导入 App.vue组件
// var App = require('./App.vue');
import App from './App.vue';


// 1.0 路由的写法
// 1.0.0 导包
import vueRouter from 'vue-router';

// 1.0.2 将vueRouter和vue绑定起来
Vue.use(vueRouter);

// 1.0.3 定义路由规则
// 导入login.vue组件对象
import login from './components/admin/account/login.vue';
// 导入后台管理系统的整体布局组件
import layout from './components/admin/layout.vue';
// 导入goodslist.vue
import goodslist from './components/admin/goods/goodslist.vue';

var router = new vueRouter({
    routes:[
        {name:'default',path:'/',redirect:'/admin'},
        {name:'login',path:'/login',component:login},
        {name:'layout',path:'/admin',component:layout,
    children:[
        {name:'goodslist',path:'goodslist',component:goodslist}
    ]
}
    ]
});


// 2.0 axios的使用
// 2.0.1 导入axios包
import axios from 'axios';
// 2.0.2 设定axios的基本的url请求前缀
axios.defaults.baseURL = 'http://157.122.54.189:9095';

// 2.0.3 想要在将来的每个子组件中的方法中均可以使用 this.$http去调用其方法执行ajax请求
//就要将axios对象挂载到vue的原型属性$http上
Vue.prototype.$http = axios;

// 2.0.4 绑定到vue上
Vue.use(axios);

// 3.0 使用elementUI这个ui框架的步骤
// 3.0.1、导包
import elementUI  from 'element-ui';
// 3.0.2 导入elemeui的css控制样式
// 由于项目的样式和elementui的css样式有些不一样，那么修改了这个样式以后，要利用自己的样式替换原来的原有样式

// import 'element-ui/lib/theme-default/index.css';
import '../statics/theme_rms/index.css';

// 将此项目的全局样式导入到elementui中的css之后
import '../statics/css/site.css';

// 3.0.3 绑定
Vue.use(elementUI);

new Vue({
    el:'#app',
    // 使用app这个组件对象
    // es5的写法
    // render:function(create){create(App);}
    router,
    // es6的写法 :将app当做根组件替换index1.html这个模板中的<div id="app">
    render:create=>create(App)
});