<template>
    <div>
        {{name}}
        <base-son />
    </div>
</template>

<script>
import son from './Son';
    export default {
        data(){
            return{
                name:'小辣椒'
            }
        },
        components:{
            'base-son':son
        }
    }
</script>

<style scoped>
    div{
        color:green;
    }
</style>