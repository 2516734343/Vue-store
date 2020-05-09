<template>
    <div class="student">
        <studentAdd/>
        <hr>
        <studentList/>
    </div>
</template>

<script>
import studentAdd from '../components/StudentAdd';
import studentList from '../components/StduentList'
    export default {
        components:{
            studentAdd,
            studentList
        }
    }
</script>
