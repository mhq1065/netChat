<template>
    <div id="app">
        <section class="left-section">
            <div @click="toolSection = 'chat'">
                <img src="./assets/chat.svg" alt="" />
            </div>
            <div @click="toolSection = 'file'">
                <img src="./assets/file2.svg" alt="" />
            </div>
            <div @click="toolSection = 'setting'">
                <img src="./assets/setting.svg" alt="" />
            </div>
        </section>
        <section class="right-section">
            <chartview v-show="toolSection === 'chat'" ref="child" />
            <login
                v-show="toolSection === 'setting'"
                @loginInit="loginInit"
            />
        </section>
    </div>
</template>

<script>
    import chartview from "./components/chart";
    import login from "./components/login";
    import { ipcRenderer } from "electron";

    export default {
        name: "App",
        components: {
            chartview,
            login,
        },
        mounted() {
            ipcRenderer.on("getlocalfile-reply", function(event, arg) {
                // 接收到Main进程返回的消息
                const message = `异步消息回复: ${arg}`;
                console.log(message);
            });
        },

        data() {
            return {
                toolSection: "chat",
                ws: {},
            };
        },
        methods: {
            loginInit() {
                console.log("log in successfully");
                console.log("start get infomation ... ");
                this.$nextTick().then(() => {
                    console.log(this.$refs);
                    this.$refs.child.init();
                });
            },
        },
    };
</script>

<style>
    * {
        margin: 0;
    }
    html,
    body {
        height: 100%;
    }
    #app {
        display: flex;
        flex-direction: row;

        height: 100%;
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
    .left-section {
        padding: 30px 0;
        width: 60px;
        background-color: rgb(39, 42, 45);
    }
    .left-section > div {
        margin: 20px 0;
        cursor: pointer;
    }
    .right-section {
        flex-grow: 1;
    }
</style>
