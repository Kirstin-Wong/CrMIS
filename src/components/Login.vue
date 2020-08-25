<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/g.jpg" alt="">
            </div>
            <!-- 登录表单区域 -->
            <el-form ref="loginFormRef" label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username" >
                    <el-input prefix-icon="iconfont icon-touxiang" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data: function () {
        return {
            // 这是表单的数据绑定对象
            loginForm :{
                username: "admin",
                password: "123456",
            },
            // 这是表单的验证规则对象
            loginFormRules:{
                // 验证用户名是否合法
                username: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                password:[
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 至 15 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 点击重置按钮，重置登录表单
        resetLoginForm () {
            this.$refs.loginFormRef.resetFields();
        },
        login () {
            this.$refs.loginFormRef.validate(async valid => {
                if(!valid) return;
                console.log(this.loginForm)              
                let params = new URLSearchParams();
                params.append("username", this.loginForm.username);
                params.append("password", this.loginForm.password);
                const { data: res } = await this.$http({
                    method:'post',
                    url: 'login' ,
                    data: params        
                })
                // console.log(this.loginForm)
                // console.log('a')
                if(res.meta.status !== 200) return this.$message.error("登录失败");
                this.$message.success("登陆成功");
                window.sessionStorage.setItem("token", res.token);
                this.$router.push("/home");
            })
            console.log('a')
        }
    }
}
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top:50%;
    transform: translate(-50%, -50%);
    .avatar_box{
        height: 130px;
        width: 130px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.btns{
    display: flex;
    justify-content: flex-end;
}
</style>