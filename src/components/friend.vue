<template>
    <div>
        <label for="userid">
            ID
            <input
                type="number"
                name="userid"
                id="userid"
                v-model.number="userid"
            />
        </label>
        <button @click="addfriend">add user</button>
    </div>
</template>
<script>
    export default {
        name: "friend",
        data() {
            return {
                userid: 2,
            };
        },
        methods: {
            addfriend() {
                this.$emit("addfriend", this.userid);
            },
        },
    };
</script>
