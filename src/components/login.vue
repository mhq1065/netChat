<style>
    .login-body {
        -webkit-app-region: drag;
        height: 100%;
    }
    input,
    button {
        -webkit-app-region: no-drag;
    }
</style>
<template>
    <div class="login-body">
        <div>
            <tool />
        </div>
        <label for="username">
            用户名
            <input type="text" name="username" />
        </label>
        <label for="pwd">
            密码
            <input type="password" name="pwd" />
        </label>
        <button>登录</button>
    </div>
</template>
<script>
    import tool from "./tool";

    export default {
        name: "login",
        components: {
            tool,
        },
    };
</script>
