
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

import goodsadd from './components/admin/goods/goodsadd.vue';

var router = new vueRouter({
    routes:[
        {name:'default',path:'/',redirect:'/admin'},
        {name:'login',path:'/login',component:login},
        {name:'layout',path:'/admin',component:layout,
    children:[
        {name:'goodslist',path:'goodslist',component:goodslist}, // 商品列表路由规则
        {name:'goodsadd',path:'goodsadd',component:goodsadd},  // 商品新增路由规则
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

// 设定axios的参数使得axios发出的ajax请求能够自动带上cookie
axios.defaults.withCredentials = true;

// 2.0.4 绑定到vue上
Vue.use(axios);



// 路由全局守卫（路由钩子函数）
/*
to: 当前要进入的路由
form:代表来源路由
next,要执行一下 next()方法才能正常渲染出组件页面
*/
router.beforeEach((to, from, next) => {
    
    // 1.0 如果进入的是登录页面则直接进入即可
    // console.log(to);
    /*
     to:Object {name: "login", meta: Object, path: "/login", hash: "", query: Object…}
    */ 
    if(to.name == "login"){
        // 当进入到的是登录页面，则不应该检查是否登录
        next();
    }
    else{
    // 发出 /admin/account/isloing 这个url的请求，如果它返回的是logined表示登录过，所以要执行next（）进程进入到想要
    // 进入的组件页面，否则跳转到登录页面
    // 1.0 发出ajax请求到/admin/account/isloing
    axios.get('/admin/account/islogin').then(res=>{
        // 如果res.data.code =="logined" 表示登录过
        if(res.data.code =="logined"){
            next();
        }else{
            // 跳转到登录页面
            router.push({name:'login'});
        }
    });
    }
    
  })




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

// 4.0 定义共有过滤器(全局过滤器)来实现日期字符串的格式化操作
Vue.filter('datefmt',(input,fmtstring)=>{
    var mydate = new Date(input);
    var y = mydate.getFullYear();
    var m = mydate.getMonth() + 1;
    var d = mydate.getDate();
    var h = mydate.getHours();
    var mi = mydate.getMinutes();
    var s = mydate.getSeconds();

    if(fmtstring == 'YYYY-MM-DD'){
        return y + '-' + m + '-' + d;
    }
    if(fmtstring == 'YYYY-MM-DD HH:mm:ss'){
        return y + '-' + m + '-' + d + ' ' + h + ':'+ mi + ':' + s;
    }

});

new Vue({
    el:'#app',
    // 使用app这个组件对象
    // es5的写法
    // render:function(create){create(App);}
    router,
    // es6的写法 :将app当做根组件替换index1.html这个模板中的<div id="app">
    render:create=>create(App)
});