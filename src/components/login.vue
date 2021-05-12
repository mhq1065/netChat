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
            ID
            <input
                type="number"
                name="username"
                id="username"
                v-model.number="username"
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
        <div>{{ msg }}</div>
        <!-- <video id="video" width="480" height="320" controls></video> -->
    </div>
</template>
<script>
    import tool from "./tool";
    const { net } = require("electron").remote;
    import { HOST } from "../config";

    // import axios from "../axios";
    export default {
        name: "login",
        components: {
            tool,
        },
        data() {
            return {
                username: 2,
                pwd: "lch",
                rememberme: false,
                websocket: null,
                id: "",
                msg: "",
            };
        },
        methods: {
            login() {
                if (this.username == "" || this.pwd == "") {
                    alert("用户名密码不能为空");
                    return;
                }

                // this.websocket.send(
                //     JSON.stringify({ type: "name", id: this.id, name: "hello" })
                // );
                console.log({
                    id: +this.username,
                    psw: this.pwd,
                });
                localStorage.setItem("id", +this.username);
                const request = net.request({
                    method: "POST",
                    protocol: "http:",
                    hostname: HOST,
                    port: 43851,
                    path: "/login",
                });
                request.on("response", (response) => {
                    console.log(`STATUS: ${response.statusCode}`);
                    console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
                    response.on("data", (chunk) => {
                        let data = JSON.parse(chunk);
                        console.log(`BODY: `, data);
                        if (data.res == "OK") {
                            localStorage.setItem("sid", data.sid);
                            localStorage.setItem("name", data.name);
                            this.msg = `welcome,${data.name}`;
                            this.$emit("loginInit");
                        } else {
                            this.msg = `wrong id or password`;
                        }
                    });
                    response.on("end", () => {
                        console.log("No more data in response.");
                    });
                });
                request.write(
                    JSON.stringify({
                        id: +this.username,
                        psw: this.pwd,
                    })
                );
                request.end();

                // axios({
                //     method: "POST",
                //     url: "http://114.116.234.101:43851/login",
                //     headers: {
                //         // 这里要将content-type改成这种提交form表单时使用的格式
                //         "Content-Type": "application/json",
                //     },
                //     data: {
                //         id: +this.username,
                //         psw: this.pwd,
                //     },
                // })
                //     .then((res) => {
                //         console.log(res.data);
                //         if (res.data.res === "OK") {
                //             localStorage.setItem("id", this.id);
                //             localStorage.setItem("sid", res.data.id);
                //             localStorage.setItem("name", res.data.name);
                //             this.$emit("loginInit");
                //         } else {
                //             console.log(res.data);
                //         }
                //     })
                //     .catch((err) => {
                //         console.log(err);
                //     });
            },
        },
    };
</script>
