<template>
    <div class="question" v-if="question">
        <div class="main">问题：{{question.title}}</div>
        <div class="other">
      <div 
        v-for="other in otherQuestionList" 
        :key="other.id"
        :class="other.type"
        :title="other.title"
        @click="handleClick(other.id)"
      >
        {{ other.title }}
      </div>
    </div>
    </div>
</template>

<script>
    export default {
        props:{
            id:{
                type:[String,Number]
            },
            name:{
                type:String,
                default:'question'
            }
        },
        data(){
            return{
                question:null
            }
        },
        methods:{
            handleClick(id){
                // const {name} = this.$route;
                const {name} = this;
                this.$router.push({
                    name,
                    params:{
                        id
                    }
                })
            },
            getData(){
                const {id} = this;
                // console.log();
                this.$axios.get(`/question/${id}`).then(res=>{
                    this.question = res;
                })
            }
        },
        mounted(){
        //  console.log(this.id);
        },
        watch:{
            '$route':{
                handler(){
                    this.getData();
                },
                immediate:true
            }
        },
        computed:{
            otherQuestionList(){
                const arr = [];
                if(this.question.prev) {
                    const { prev, prevId } = this.question;
                        arr.push({
                        type: 'prev',
                        title: prev,
                        id: prevId
                        })
                }
                if(this.question.next) {
                    const { next, nextId } = this.question;
                    arr.push({
                    type: 'next',
                    title: next,
                    id: nextId
                    })
                }
             return arr;
            }
        },
        // beforeRouteUpdate(to,from,next){
        //     // console.log('beforeRouteUpdate');
        //     // console.log(this);
        //     console.log(to);
        //     console.log(from);
        //     next();
        // }
        // beforeRouteLeave(to,from,next){
        //       const isGo = window.confirm('真的要走吗？不再看看了？');
        //       isGo ? next() : next(false); 
        // }
    }
</script>

<style scoped>
.main {
  margin-bottom: 200px;
}
.prev {
  float: left;
}
.next {
  float: right;
}
.prev,
.next {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #3385ff;
  text-decoration: underline;
  cursor: pointer;
}
</style>