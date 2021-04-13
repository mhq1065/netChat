<style>
    .chat-main {
        display: flex;
        flex-direction: row;
        height: 100%;
    }
    /* 好友列表 */
    .chat-friends {
        flex-grow: 1;
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
        justify-content: space-between;
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
    .msg-body {
        height: 200px;
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
        margin: 5px 0;
        width: 100%;
        height: 150px;
    }
    .msg-textarea {
        outline: none;
        font-size: 22px;
        width: calc(100% - 80px);
        word-break: break-all;
        resize: none;
    }
    .msg-out__button {
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
        <div class="msg-box">
            <div class="msg-title">
                {{ msgs[curname].name }}
                <tool />
            </div>
            <div class="msg-body">
                <div
                    v-for="(jitem, jindex) in msgs[curname].msgList"
                    :key="jindex"
                    class="msg-item"
                >
                    <div v-if="jitem.pas">me:{{ jitem.contain }}</div>
                    <div v-else>
                        {{ msgs[curname].name }}:{{ jitem.contain }}
                    </div>
                </div>
            </div>
            <div class="msg-in">
                <div>
                    <img src="../assets/file.svg" alt="" @click="getfile" />
                </div>
                <textarea
                    class="msg-textarea"
                    type="text-box"
                    rows="3"
                    v-model="msgs[curname].input"
                />
                <div class="msg-out__button">enter</div>
            </div>
        </div>
    </div>
</template>

<script>
    import tool from "./tool";
    import { ipcRenderer } from "electron";
    export default {
        name: "chartview",
        components: {
            tool,
        },
        methods: {
            getfile() {
                ipcRenderer.send("getlocalfile");
            },
        },
        data() {
            return {
                curname: 0,
                msgs: [
                    {
                        name: "lihua",
                        msgList: [
                            {
                                time: "1999",
                                contain: "hello",
                                pas: true,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                        ],
                        input: "",
                    },
                    {
                        name: "小红",
                        msgList: [
                            {
                                time: "1999",
                                contain: "hello",
                                pas: true,
                            },
                            {
                                time: "1999",
                                contain: "hello",
                                pas: false,
                            },
                        ],
                        input: "",
                    },
                ],
            };
        },
    };
</script>
