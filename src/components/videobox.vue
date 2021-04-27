<template>
    <div>
        <button @click="ask">start</button>
        <video src="" id="video"></video>
        <video src="" id="peervideo"></video>
    </div>
</template>

<script>
    var SimplePeer = require("simple-peer");

    export default {
        name: "videobox",
        props: ["msgs", "myClientId"],
        data() {
            return {
                peer: null,
                peer2: null,
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
        mounted() {
            console.log("videobox init", this.msgs);
        },
        methods: {
            ask() {
                // 请求建立连接
                console.log("videobox init", this.msgs);
                navigator.mediaDevices
                    .getUserMedia({ video: { width: 240, height: 160 } })
                    .then((stream) => {
                        let video = document.getElementById("video");
                        video.srcObject = stream;
                        video.play();
                        this.$emit("createPeer", stream);
                    });
            },
            initstream(stream) {
                let video = document.getElementById("peervideo");
                video.srcObject = stream;
                video.play();
            },
            revieve(data) {
                this.peer2 = new SimplePeer({
                    trickle: false,
                    config: this.p2pconfig,
                });
                this.peer2.signal(JSON.parse(data));
                this.peer2.on("data", (data) => {
                    console.log("data: " + data);
                });
                this.peer2.on("signal", (data) => {
                    console.log("SIGNAL", JSON.stringify(data));
                    this.$emit("sendbyWs", {
                        type: "connect response",
                        from: this.myClientId,
                        target: this.msgs.clientID,
                        data: JSON.stringify(data),
                    });
                });
            },
            revieve2(data) {
                this.peer.signal(JSON.parse(data));
            },
        },
    };
</script>
