<style>
    .login-body {
        -webkit-app-region: drag;
        height: 30%;
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
            <input
                type="text"
                name="username"
                id="username"
                v-model="username"
            />
        </label>
        <label for="pwd">
            密码
            <input type="password" name="pwd" id="pwd" v-model="pwd" />
        </label>
        <br />
        <label for="rememberme">
            <input
                type="checkbox"
                name="rememberme"
                id="rememberme"
                v-model="rememberme"
            />
        </label>
        <button @click="login">登录</button>
        <!-- <video id="video" width="480" height="320" controls></video> -->
    </div>
</template>
<script>
    import tool from "./tool";
    import Store from "electron-store";
    const store = new Store();
    // import axios from "../axios";
    export default {
        name: "login",
        components: {
            tool,
        },
        mounted() {
            if (store.get("username")) {
                this.username = store.get("username");
                this.pwd = store.get("pwd");
                this.rememberme = store.get("rememberme");
                console.log(store.get("username"));
                console.log(this.rememberme, store.get("rememberme"));
            }
        },
        data() {
            return {
                username: "",
                pwd: "",
                rememberme: false,
                websocket: null,
                id: "",
            };
        },
        methods: {
            login() {
                if (this.username == "" || this.pwd == "") {
                    alert("用户名密码不能为空");
                    return;
                }
                if (this.rememberme) {
                    store.set({
                        username: this.username,
                        pwd: this.pwd,
                        rememberme: this.rememberme,
                    });
                    console.log(store.get("username"));
                } else {
                    store.set({
                        username: "",
                        pwd: "",
                    });
                }

                // this.websocket.send(
                //     JSON.stringify({ type: "name", id: this.id, name: "hello" })
                // );

                // axios({
                //     method: "post",
                //     url: "/Test",
                //     headers: {
                //         // 这里要将content-type改成这种提交form表单时使用的格式
                //         "Content-Type": "application/json;charset=UTF-8",
                //     },
                //     data: {
                //         username: this.username,
                //         password: this.pwd,
                //     },
                // })
                //     .then((res) => {
                //         console.log(res.data);
                this.$emit("loginInit");
                //     })
                //     .catch((err) => {
                //         console.log(err);
                //     });
            },
        },
    };
</script>
