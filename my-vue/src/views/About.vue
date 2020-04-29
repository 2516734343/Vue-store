<template>
    <div class="about">
            关于
            <div id="a">aaaa</div>
            <router-link to="/" tag="div" class="link">回首页</router-link>
    </div>
</template>

<script>
    export default {
        mounted(){
            // console.log(this.$route.meta);
        }
    }
</script>

<style >
#a{
    margin-top: 1000px;
}
.link{
    margin-top: 1000px;
}
</style>