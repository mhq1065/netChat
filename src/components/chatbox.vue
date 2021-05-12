<style>
    .msg-body {
        display: flex;
        flex-direction: row;
        height: 60%;
        overflow: auto;
        flex-grow: 1;
        padding: 0 38px;
        background-color: rgb(245, 245, 245);
        text-align: left;
    }
    .msg-item {
        height: 30px;
    }
    .msg-in {
        padding: 10px 0;
        width: 100%;
        height: calc(30% - 24px);
    }
    .msg-textarea {
        outline: none;
        font-size: 22px;
        width: calc(100% - 80px);
        word-break: break-all;
        resize: none;
    }
    .msg-out__button {
        cursor: pointer;
        border: solid 1px black;
        border-radius: 2px;
        height: 20px;
        width: 50px;
        margin: 5px 36px 5px auto;
        background-color: rgb(245, 245, 245);
    }
    .msg-out__button:hover {
        color: white;
        background-color: rgb(18, 150, 17);
    }
</style>
<template>
    <div style="height:100%">
        <div class="msg-body">
            <div>
                <div
                    v-for="(jitem, jindex) in msgs.msgList"
                    :key="jindex"
                    class="msg-item"
                >
                    <div v-if="jitem.pas === true">me:{{ jitem.content }}</div>
                    <div v-else-if="jitem.pas === false">
                        {{ msgs.name }}:{{ jitem.content }}
                    </div>
                </div>
            </div>
        </div>
        <div class="msg-in">
            <div>
                <img src="../assets/file.svg" alt="" />
                <img src="../assets/video.svg" alt="" @click="ask"/>
                <!-- <label class="switch">
                    <input type="checkbox" v-model="p2pchecked" />
                    <div class="slider round"></div>
                </label> -->
            </div>
            <textarea
                class="msg-textarea"
                type="text-box"
                rows="3"
                v-model="msgs.input"
            />
            <div class="msg-out__button" @click="sendmsg">enter</div>
        </div>
    </div>
</template>
<script>
    export default {
        name: "chatbox",
        props: ["msgs"],
        methods: {
            sendmsg() {
                this.$emit("sendmsg", this.msgs.input);
            },
            ask(){
                this.$emit("createvideoPeer");
            }
        },
    };
</script>
