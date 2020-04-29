<template>
    <div class="student">
        学员展示
    </div>
</template>

<script>
    export default {
        beforeRouteEnter(to,from,next){
            // console.log('beforeRouteEnter');
            next(vm=>{
                // console.log(vm.name);
            })
        },
        // beforeRouteLeave(to,from,next){
        //     console.log(' beforeRouteLeave');
        //     next();
        // },
        data(){
            return{
                name:'student'
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>