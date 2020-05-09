<template>
    <div class="stduent-add">
        <div>添加学生：</div>
        <div>姓名：<input type="text" v-model="name"></div>
          <div>年龄：<input type="text" v-model="age"></div>
        <button @click="handleClick">添加</button>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                name:'',
                age:null
            }
        },
        methods:{
            handleClick(){
                this.$store.state.studentList.push({
                    name:this.name,
                    age:this.age,
                    id:Math.random() * 100000
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>