<style>
    .chat-main {
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    /* 好友列表 */
    .chat-friends {
        flex: 0 0 200px;
        background-color: rgb(240, 240, 240);
    }
    .chat-friends__item {
        height: 50px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }
    .friends__item_choosen {
        background-color: rgb(199, 198, 197);
    }
    .friends__item_unchoosen {
        background-color: rgb(240, 240, 240);
    }
    /* 聊天视频框 */
    .msg-box {
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .msg-title {
        height: 20px;
        padding: 20px 50px;
        font-size: 25px;
        text-align: left;
        -webkit-app-region: drag;
        -webkit-user-select: none;
        background-color: rgb(245, 245, 245);
        border-bottom: 1px solid rgb(231, 231, 231);
    }
    /* 聊天视频内容 */
    .msg-box_content {
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    /* 视频框 */
    .msg-box_content__video {
        flex: 0 100px;
    }
    /* 聊天框 */
    .msg-box_content__msg {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-width: 300px;
    }
    .msg-type {
        height: 50px;
        display: flex;
        flex-direction: row;
    }
    .msg-content {
        flex: 1;
    }
    /* switch */
    .switch {
        position: relative;
        display: inline-block;
        width: 30px;
        height: 17px;
    }

    .switch input {
        display: none;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 13px;
        width: 13px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    input:checked + .slider {
        background-color: #2196f3;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #2196f3;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(13px);
        -ms-transform: translateX(13px);
        transform: translateX(13px);
    }

    /* Rounded sliders */
    .slider.round {
        border-radius: 16px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
</style>
<template>
    <div class="chat-main">
        <div class="chat-friends">
            <div
                v-for="(item, index) in msgs"
                :key="index"
                class="chat-friends__item"
                :class="{ friends__item_choosen: index == curname }"
                @click="curname = index"
            >
                <div>
                    {{ item.name }}
                </div>
            </div>
        </div>
        <div class="msg-box" v-if="curname !== null">
            <div class="msg-title">
                {{ msgs[curname].name }}
                <tool />
            </div>
            <div class="msg-box_content">
                <div class="msg-box_content__msg">
                    <div class="msg-type">
                        <div @click="content = 'chat'">聊天</div>
                        |
                        <div @click="content = 'file'">文件</div>
                    </div>
                    <div class="msg-content">
                        <chatbox
                            v-show="content === 'chat'"
                            v-bind:msgs="msgs[curname]"
                            @sendmsg="sendmsg"
                            @createvideoPeer="createvideoPeer"
                        />
                        <filebox
                            v-show="content === 'file'"
                            v-bind:file="msgs[curname].file"
                            @sendfile="sendfile"
                            @changeState="changeState"
                            v-bind:conv_id="msgs[curname].conv_id"
                        />
                    </div>
                </div>
                <div v-show="showvideo" class="msg-box_content__video">
                    <video src="" id="video" width="240" height="160"></video>
                    <video
                        src=""
                        id="peervideo"
                        width="240"
                        height="160"
                    ></video>
                    <button @click="closeVideoPeer">close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import tool from "./tool";
    import filebox from "./filebox";
    import { ipcRenderer } from "electron";
    import chatbox from "./chatbox";
    var SimplePeer = require("simple-peer");
    const fs = require("fs");

    import Store from "electron-store";
    const store = new Store();
    import axios from "../axios";
    const { net } = require("electron").remote;
    import { HOST } from "../config";
    const BUFFSIZE = 100000;
    const PATH = "D:/";
    function toBuffer(ab) {
        var buf = new Buffer(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
        }
        return buf;
    }
    export default {
        name: "chartview",
        components: {
            tool,
            chatbox,
            filebox,
        },
        mounted() {},
        methods: {
            getfile() {
                ipcRenderer.send("getlocalfile");
            },
            // 创建视频p2p链接
            createvideoPeer() {
                console.log("videobox init");
                navigator.mediaDevices
                    .getUserMedia({ video: { width: 240, height: 160 } })
                    .then((stream) => {
                        let video = document.getElementById("video");
                        let peervideo = document.getElementById("peervideo");
                        video.srcObject = stream;
                        video.play();
                        this.peer = new SimplePeer({
                            initiator: true,
                            config: this.p2pconfig,
                            stream: stream,
                        });
                        let peer = this.peer;
                        peer.on("signal", (data) => {
                            console.log("SIGNAL", JSON.stringify(data));
                            this.sendbyWs({
                                op: "connect",
                                from: this.id,
                                to: this.msgs[this.curname].frid,
                                sdp: JSON.stringify(data),
                            });
                        });
                        peer.on("stream", (newStream) => {
                            peervideo.srcObject = newStream;
                            peervideo.play();
                        });
                        peer.on("error", (e) => {
                            console.log("error", e);
                            video.pause();
                            video.srcObject
                                .getTracks()
                                .forEach((track) => track.stop());
                            peer.destroy();
                            this.showvideo = false;
                        });
                        peer.on("close", () => {
                            // video.srcObject = "";
                            video.pause();
                            video.srcObject
                                .getTracks()
                                .forEach((track) => track.stop());
                            this.showvideo = false;
                        });
                        this.showvideo = true;
                    });
            },
            // 接受视频p2p请求
            revieve(id, data) {
                let video = document.getElementById("peervideo");
                let localvideo = document.getElementById("video");

                navigator.mediaDevices
                    .getUserMedia({ video: { width: 240, height: 160 } })
                    .then((stream) => {
                        this.peer2 = new SimplePeer({
                            config: this.p2pconfig,
                            stream: stream,
                        });
                        let peer = this.peer2;
                        localvideo.srcObject = stream;
                        localvideo.play();
                        peer.on("signal", (data) => {
                            console.log("SIGNAL", JSON.stringify(data));
                            this.sendbyWs({
                                op: "connect response",
                                from: this.id,
                                to: this.msgs[id].frid,
                                sdp: JSON.stringify(data),
                            });
                        });
                        peer.signal(JSON.parse(data));
                        peer.on("stream", (stream) => {
                            video.srcObject = stream;
                            video.play();
                        });
                        peer.on("error", (e) => {
                            console.log("error", e);
                            localvideo.pause();
                            localvideo.srcObject
                                .getTracks()
                                .forEach((track) => track.stop());
                            peer.destroy();
                            peer = null;
                            this.showvideo = false;
                        });
                        peer.on("close", () => {
                            localvideo.pause();
                            localvideo.srcObject
                                .getTracks()
                                .forEach((track) => track.stop());

                            this.showvideo = false;
                        });
                        this.showvideo = true;
                    });
            },
            // 发起方接受请求
            revieve2(id, data) {
                console.log(data);
                this.peer.signal(JSON.parse(data));
            },
            closeVideoPeer() {
                let localvideo = document.getElementById("video");
                localvideo.pause();
                localvideo.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
                if (this.peer) {
                    this.peer.destroy();
                    this.peer = null;
                } else {
                    this.peer2.destroy();
                    this.peer2 = null;
                }
                this.showvideo = false;
            },

            sendbyWs(JSONmsg) {
                console.log("sendby ws", JSONmsg);
                this.websocket.send(JSON.stringify(JSONmsg));
            },
            sendmsg(msg) {
                console.log(msg);
                let t = this.msgs[this.curname];
                console.log(`send:${t.input} to:${t.name}`);
                t.msgList.push({
                    time: Date().toString(),
                    type: "text",
                    content: t.input,
                    pas: true,
                });
                this.websocket.send(
                    JSON.stringify({
                        op: "msg",
                        // 会话号
                        conv_id: t.conv_id,
                        // 发送消息的用户的uid
                        sender: this.id,
                        // 发送消息的时间
                        time: Date().toString(),
                        // 消息类型
                        type: "text",
                        // 消息内容
                        content: t.input,
                    })
                );
            },
            async sendfile(filename) {
                console.log("start send file");
                let p = this.msgs[this.curname];
                let t = this.msgs[this.curname].file.send;
                // 获取文件信息
                let fileInfo = fs.statSync(filename);
                t.fileInfo = fileInfo;
                t.filename = filename;
                console.log(`文件大小:${fileInfo.size}`);

                // 获取文件传输websocket
                let ws = this.filewebsocket;
                var buf = new Buffer.alloc(BUFFSIZE);
                let fd = fs.openSync(filename);
                let readlength; // 读取的长度 字节
                function sleep(time) {
                    return new Promise((resolve) => setTimeout(resolve, time));
                }

                t.start = true;
                ws.send(
                    JSON.stringify({
                        op: "start",
                        conv_id: p.conv_id,
                        name: filename.substr(filename.lastIndexOf("\\") + 1),
                        len: fileInfo.size,
                        start: 0,
                        end: Math.ceil(fileInfo.size / BUFFSIZE) - 1,
                    })
                );
                do {
                    // 读取position开始的数据
                    // 返回读取的字节数
                    readlength = fs.readSync(
                        fd,
                        buf,
                        0,
                        buf.length,
                        t.position
                    );
                    if (readlength !== BUFFSIZE) {
                        ws.send(buf.buffer.slice(0, readlength));
                        t.position += readlength;
                    } else {
                        ws.send(buf.buffer);
                        t.position += BUFFSIZE;
                    }
                    // update the loading Bar
                    t.loading = ((100 * t.position) / t.fileInfo.size).toFixed(
                        2
                    );
                    await sleep(0);
                    if (t.pause) {
                        ws.send(
                            JSON.stringify({
                                op: "pause",
                                conv_id: p.conv_id,
                                name: filename,
                            })
                        );
                        while (t.pause) {
                            await sleep(0.3);
                        }
                        ws.send(
                            JSON.stringify({
                                op: "start",
                                conv_id: p.conv_id,
                                name: filename,
                                len: fileInfo.size,
                                start: t.position / BUFFSIZE - 1,
                                end: Math.ceil(fileInfo.size / BUFFSIZE) - 1,
                            })
                        );
                    }
                } while (readlength === BUFFSIZE);
                fs.closeSync(fd);
            },
            changeState() {
                console.log("changeState");
                let t = this.msgs[this.curname].file.send;
                t.pause = !t.pause;
            },
            init() {
                console.log("start init");
                this.id = Number(localStorage.getItem("id"));
                this.sid = localStorage.getItem("sid");
                this.name = localStorage.getItem("name");
                this.websocket = new WebSocket(`ws://${HOST}:43852/msg`);
                this.filewebsocket = new WebSocket(`ws://${HOST}:43852/file`);
                this.filewebsocket.binaryType = "arraybuffer";
                let ws = this.websocket;
                let filews = this.filewebsocket;
                let userlist;
                // 获取会话列表
                // const request = net.request({
                //     method: "POST",
                //     protocol: "http:",
                //     hostname: HOST,
                //     port: 43851,
                //     path: "/convlist",
                // });
                // request.on("response", (response) => {
                //     response.on("data", (chunk) => {
                //         let data = JSON.parse(chunk);
                //         console.log(`BODY: `, data);
                //         if (data.res == "OK") {
                //             this.msgs = data.friendlist.map((i) => {
                //                 return {
                //                     conv_id: i.conv_id,
                //                     name: i.name,
                //                 };
                //             });
                //         } else {
                //             console.log("error", data);
                //         }
                //     });
                // });
                // request.write(
                //     JSON.stringify({
                //         sid: localStorage.getItem("sid"),
                //     })
                // );
                // request.end();
                // userlist = store.get("userlist");
                // if (!userlist) {
                //     userlist = [];
                //     store.set("userlist", []);
                // }

                // this.msgs = userlist;
                ws.onopen = () => {
                    ws.send(
                        JSON.stringify({
                            op: "login",
                            seq: 0,
                            sid: localStorage.getItem("sid"),
                        })
                    );
                };
                ws.onmessage = (event) => {
                    let msg = JSON.parse(event.data);
                    console.log("Message from server ", msg);
                    switch (msg.op) {
                        case "login":
                            if (msg.res === "OK") {
                                console.log("login ok");
                            } else {
                                console.log("login error");
                            }
                            break;
                        case "friend request":
                            userlist = store.get("userlist");
                            // 发送回复
                            axios({
                                method: "POST",
                                url: "/resfriend",
                                headers: {
                                    // 这里要将content-type改成这种提交form表单时使用的格式
                                    "Content-Type":
                                        "application/json;charset=UTF-8",
                                },
                                data: {
                                    sid: this.sid,
                                    // A的uid
                                    frid: msg.frid,
                                    ans: "accept",
                                },
                            }).then((res) => {
                                console.log("服务器成功收到好友请求", res.data);
                                userlist.push({
                                    frid: msg.frid,
                                    name: msg.name,
                                    conv_id: res.data.conv_id,
                                    msgList: [],
                                });
                                store.set("userlist", userlist);
                                this.msgs.push({
                                    frid: msg.frid,
                                    name: msg.name,
                                    conv_id: res.data.conv_id,
                                    msgList: [],
                                });
                            });
                            break;
                        case "friend answer":
                            userlist = store.get("userlist");
                            userlist.push({
                                frid: msg.frid,
                                name: msg.name,
                                conv_id: msg.conv_id,
                                msgList: [],
                            });
                            store.set("userlist", userlist);
                            this.msgs.push({
                                frid: msg.frid,
                                name: msg.name,
                                conv_id: msg.conv_id,
                                msgList: [],
                            });
                            break;
                        case "Userlist":
                            console.log("recieve userlist");
                            this.msgs = msg.data.map((i) => {
                                i.msgList = [];
                                i.input = "";
                                return i;
                            });
                            console.log(this.msgs);
                            this.curname = 0;
                            break;
                        case "msg":
                            console.log("recieve message");
                            for (let i = 0; i < this.msgs.length; i++) {
                                if (this.msgs[i].conv_id == msg.conv_id) {
                                    this.msgs[i].msgList.push({
                                        time: msg.time,
                                        content: msg.content,
                                        pas: false,
                                    });
                                    break;
                                }
                            }
                            break;
                        case "connect response":
                            console.log("recieve connect response", msg.data);
                            for (let i = 0; i < this.msgs.length; i++) {
                                if (this.msgs[i].frid == msg.from) {
                                    this.revieve2(i, msg.sdp);
                                    break;
                                }
                            }
                            break;
                        case "connect":
                            console.log("recieve connection");
                            for (let i = 0; i < this.msgs.length; i++) {
                                if (this.msgs[i].frid == msg.from) {
                                    this.revieve(i, msg.sdp);
                                    break;
                                }
                            }

                            break;
                        default:
                            break;
                    }
                };
                let recievefile = {};
                filews.onopen = () => {
                    filews.send(
                        JSON.stringify({
                            op: "login",
                            seq: 0,
                            sid: localStorage.getItem("sid"),
                        })
                    );
                };
                let t;
                filews.onmessage = (event) => {
                    console.log(event.data);
                    if (typeof event.data === "string") {
                        let _ = JSON.parse(event.data);
                        if (_.res == "OK") {
                            console.log("file websocket connected");
                        } else {
                            if (_.op == "start") {
                                recievefile = JSON.parse(event.data);
                                console.log("start recieve file", recievefile);
                                for (let i = 0; i < this.msgs.length; i++) {
                                    if (this.msgs[i].conv_id == _.conv_id) {
                                        this.msgs[i].file.recieve = [
                                            ...this.msgs[i].file.recieve,
                                            {
                                                filename: _.name,
                                                start: -1,
                                                end: _.end,
                                            },
                                        ];
                                        t = this.msgs[i].file.recieve[
                                            this.msgs[i].file.recieve.length - 1
                                        ];
                                        console.log(this.msgs[i]);
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        console.log("recieve file", toBuffer(event.data));

                        fs.appendFileSync(
                            PATH + recievefile.name,
                            toBuffer(event.data)
                        );
                        t.start += 1;
                        console.log(t);
                    }
                };
            },
            addfriend() {
                const request = net.request({
                    method: "POST",
                    protocol: "http:",
                    hostname: HOST,
                    port: 43851,
                    path: "/addfriend",
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
            },
        },
        watch: {
            p2pchecked: function(val) {
                console.log(val);
            },
        },
        data() {
            return {
                p2pchecked: false,
                curname: null,
                websocket: null,
                filewebsocket: null,
                sid: 0,
                id: "",
                showvideo: false,
                msgs: [
                    {
                        frid: 2,
                        name: "lch",
                        conv_id: 2,
                        msgList: [],
                        file: {
                            send: {
                                pause: false,
                                filename: "",
                                loading: 0,
                                position: 0,
                                size: 1,
                                start: false,
                                fileInfo: {},
                            },
                            recieve: [],
                        },
                    },
                ],
                peer: null,
                peer2: null,
                content: "chat",
                p2pconfig: {
                    iceServers: [
                        {
                            urls: "stun:hwc.l2d.top:3478",
                        },
                        {
                            urls: "turn:hwc.l2d.top:3478", // A TURN server
                            username: "test",
                            credential: "123456",
                        },
                    ],
                },
            };
        },
    };
</script>
