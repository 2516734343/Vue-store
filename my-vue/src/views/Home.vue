<template>
  <div class="home">
    <button @click="handleClick">点击</button>

    {{storeCount}}
    {{countDouble}} {{ $store.getters['count/countDouble'] }}
    {{countAdd(3)}}
    {{obj}}
    <input v-model="msg" />
    {{msg}}
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { COUNT_INCREMENT, CHANGE_OBJ, UPDATE_MSG } from "@/store/mutation-type";
export default {
  created() {
    console.log(this.$store.state.count);
  },
  // data(){
  //     return{
  //         count:this.$store.state.count
  //     }
  // },
  // computed:{
  //     count(){
  //         return this.$store.state.count
  //     }
  // }
  computed: {
    // ...mapState(['count'])
      ...mapState(['obj']),
    ...mapState('count',{
      storeCount: state => state.count
    }),
    ...mapGetters('count',["countDouble", "countAdd"]),
    msg: {
      get() {
        return this.$store.state.msg;
      },
      set(value) {
        this.$store.commit(UPDATE_MSG, { value });
      }
    }
  },
  methods: {
    // ...mapMutations(['countIncrement']),
    handleClick() {
      const num = Math.floor(Math.random() * 10);
    //   this.$store.commit(COUNT_INCREMENT, { num });

    this.$store.dispatch('count/countIncrement', { num }).then(()=>{
        alert('count值已增加')
    })

      // this.countIncrement(10)
      // this.$store.commit({
      //     type:'countIncrement',
      //     num:10
      // })

       // this.$store.commit(CHANGE_OBJ);
    },
    handleInput(e) {
      this.$store.commit(UPDATE_MSG, { value: e.target.value });
    }
  }
};
</script>

<style>
</style>