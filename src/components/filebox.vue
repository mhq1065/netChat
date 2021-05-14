<template>
    <div>
        <button @click="chooseFile">cloose file</button>
        <div>{{ filename }}</div>
        <div>{{ file.send.fileInfo.size || "" }}</div>
        <br />
        <button @click="sendFile" v-show="!file.send.start">send</button>
        <br v-show="!file.send.start" />
        <button @click="changeState">{{ file.send.pause ? "继续" : "暂停" }}</button>
        <div>传输进度:{{ file.send.loading }}%</div>
    </div>
</template>
<script>
    import { ipcRenderer } from "electron";
    export default {
        props: ["conv_id", "file"],
        name: "filebox",
        mounted() {
            ipcRenderer.on("getlocalfile-reply", (event, arg) => {
                // 接收到Main进程返回的消息
                const message = `异步消息回复: ${arg}`;
                console.log(message);
                this.$emit("sendfile", arg[0]);
            });
        },
        methods: {
            changeState() {
                this.$emit("changeState");
            },
            chooseFile() {
                ipcRenderer.send("getlocalfile");
            },
            sendFile() {
                this.$emit("sendfile", this.filename);
            },
        },
        data() {
            return {
            };
        },
    };
</script>
