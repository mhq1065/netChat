<style scoped>
    .tool-section {
        -webkit-app-region: no-drag;
        position: absolute;
        z-index: 9999;
        top: 0;
        right: 0;
    }
    button {
        height: 33px;
        padding: 2px 12px;
        outline: none;
        border: 1px solid transparent;
        -webkit-app-region: no-drag;
        background-color: rgb(245, 245, 245);
    }
    button:hover {
        background-color: rgb(229, 229, 229);
    }
</style>

<template>
    <div>
        <section class="tool-section">
            <button id="maxbt" @click="maxWindow">
                <img src="../assets/max.svg" alt="" />
            </button>
            <button id="minbt" @click="minWindow">
                <img src="../assets/min.svg" alt="" />
            </button>
            <button id="closebt" @click="closeWindow">
                <img src="../assets/close.svg" alt="" />
            </button>
        </section>
    </div>
</template>
<script>
    import { ipcRenderer } from "electron";

    export default {
        name: "tool",
        methods: {
            maxWindow() {
                ipcRenderer.send("window-max");
            },
            minWindow() {
                ipcRenderer.send("window-min");
            },
            closeWindow() {
                ipcRenderer.send("window-close");
            },
        },
    };
</script>
