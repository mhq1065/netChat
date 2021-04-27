<style>
    .chat-main {
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    /* 好友列表 */
    .chat-friends {
        width: 230px;
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
    /* 聊天 */
    .msg-box {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
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
    .msg-type {
        height: 50px;
        display: flex;
        flex-direction: row;
    }
    .msg-content {
        flex-grow: 1;
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
            <div class="msg-type">
                <div @click="content = 'chat'">聊天</div>
                |
                <div @click="content = 'video'">视频</div>
                |
                <div>文件</div>
            </div>
            <div class="msg-content">
                <chatbox
                    v-show="content === 'chat'"
                    v-bind:msgs="msgs[curname]"
                    @sendmsg="sendmsg"
                />
                <videobox
                    v-show="content === 'video'"
                    v-bind:msgs="msgs[curname]"
                    v-bind:myClientId="myClientId"
                    ref="videobox"
                    @createPeer="createPeer"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import tool from "./tool";
    import { ipcRenderer } from "electron";
    import chatbox from "./chatbox";
    import videobox from "./videobox";
    var SimplePeer = require("simple-peer");
    export default {
        name: "chartview",
        components: {
            tool,
            chatbox,
            videobox,
        },
        mounted() {},
        methods: {
            getfile() {
                ipcRenderer.send("getlocalfile");
            },
            // 创建视频p2p链接
            createPeer(stream) {
                console.log();
                this.msgs[this.curname].peer = new SimplePeer({
                    initiator: true,
                    config: this.p2pconfig,
                    stream: stream,
                });
                let peer = this.msgs[this.curname].peer;
                peer.on("signal", (data) => {
                    console.log("SIGNAL", JSON.stringify(data));
                    this.sendbyWs({
                        type: "connect",
                        from: this.myClientId,
                        target: this.msgs[this.curname].clientID,
                        data: JSON.stringify(data),
                    });
                });
                peer.on("data", (data) => {
                    console.log("data: " + data);
                });
                peer.on("connect", () => {
                    console.log("CONNECT");
                    peer.send("whatever" + Math.random());
                });
            },
            // 接受视频p2p请求
            revieve(id, data) {
                this.msgs[id].peer2 = new SimplePeer({
                    config: this.p2pconfig,
                });
                let peer = this.msgs[id].peer2;
                peer.signal(JSON.parse(data));
                peer.on("data", (data) => {
                    console.log("data: " + data);
                });
                peer.on("signal", (data) => {
                    console.log("SIGNAL", JSON.stringify(data));
                    this.sendbyWs({
                        type: "connect response",
                        from: this.myClientId,
                        target: this.msgs[id].clientID,
                        data: JSON.stringify(data),
                    });
                });
                peer.on("stream", (stream) => {
                    this.$refs.videobox.initstream(stream);
                });
            },
            revieve2(id, data) {
                this.msgs[id].peer.signal(JSON.parse(data));
            },
            sendbyWs(JSONmsg) {
                this.websocket.send(JSON.stringify(JSONmsg));
            },
            sendmsg(msg) {
                console.log(msg);
                let t = this.msgs[this.curname];
                console.log(`send:${t.input} to:${t.name}`);
                t.msgList.push({
                    time: Date(),
                    text: t.input,
                    target: t.clientID,
                    pas: true,
                });
                this.websocket.send(
                    JSON.stringify({
                        type: "message",
                        time: Date(),
                        from: this.myClientId,
                        target: t.clientID,
                        text: t.input,
                    })
                );
            },
            init() {
                console.log("start init");
                this.websocket = new WebSocket("ws://192.168.1.109:6503");
                let ws = this.websocket;
                window.ws = this.websocket;
                ws.onopen = () => {
                    ws.send(
                        JSON.stringify({
                            type: "init",
                            name: "hello",
                            clientID: this.myClientId,
                        })
                    );
                    ws.send(
                        JSON.stringify({
                            type: "getUserlist",
                        })
                    );
                };
                ws.onmessage = (event) => {
                    let msg = JSON.parse(event.data);
                    console.log("Message from server ", msg);
                    switch (msg.type) {
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
                        case "message":
                            console.log("recieve message");
                            for (let i = 0; i < this.msgs.length; i++) {
                                if (this.msgs[i].clientID == msg.from) {
                                    this.msgs[i].msgList.push({
                                        time: msg.time,
                                        text: msg.text,
                                        pas: false,
                                    });
                                    break;
                                }
                            }
                            break;
                        case "connect response":
                            console.log("recieve connect response");
                            for (let i = 0; i < this.msgs.length; i++) {
                                if (this.msgs[i].clientID == msg.from) {
                                    this.revieve2(i, msg.data);
                                    // this.msgs[i].peer.signal(
                                    //     JSON.parse(msg.data)
                                    // );
                                    break;
                                }
                            }
                            break;
                        case "connect":
                            console.log("recieve connection");
                            for (let i = 0; i < this.msgs.length; i++) {
                                if (this.msgs[i].clientID == msg.from) {
                                    this.revieve(i, msg.data);
                                    // this.msgs[i].peer2 = new SimplePeer({
                                    //     trickle: false,
                                    //     config: this.p2pconfig,
                                    // });
                                    // this.msgs[i].peer2.signal(
                                    //     JSON.parse(msg.data)
                                    // );
                                    // this.msgs[i].peer2.on("data", (data) => {
                                    //     console.log("data: " + data);
                                    // });
                                    // this.msgs[i].peer2.on("signal", (data) => {
                                    //     console.log(
                                    //         "SIGNAL",
                                    //         JSON.stringify(data)
                                    //     );
                                    //     this.websocket.send(
                                    //         JSON.stringify({
                                    //             type: "connect response",
                                    //             from: this.myClientId,
                                    //             target: msg.from,
                                    //             data: JSON.stringify(data),
                                    //         })
                                    //     );
                                    // });
                                    break;
                                }
                            }

                            break;
                        default:
                            break;
                    }
                };
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
                myClientId: 100,
                msgs: [],
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
