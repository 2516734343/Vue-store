<template>
    <div class="student-list">
        <div>学生总人数：{{studentLength}}</div>
        <div>学生列表</div>
        <ul>
            <li v-for="stduent in studentList" :key="stduent.id">
                姓名：{{stduent.name}}
                年龄：{{stduent.age}}
                </li>
        </ul>
        <hr>
        <div>未成年学生列表</div>
        <ul>
            <li v-for="student in studentYoung" :key="student.id">
                  姓名：{{student.name}}
                  年龄：{{student.age}}
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
    export default {
        computed:{
            ...mapState({
                studentList:state => state.studentList.filter(stduent=>stduent.age >= 18)
            }),
            ...mapGetters(['studentLength','studentYoung'])
        }
    }
</script>

<style lang="scss" scoped>

</style>