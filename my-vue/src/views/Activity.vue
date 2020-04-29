<template>
    <div class="activity">
        <router-link :to="{name:'academic'}">学术讨论</router-link>
        <router-link to="personal">个人中心</router-link>
        <router-link to="download">资源下载</router-link>
        <div class="activity-view">
                <router-view></router-view>  
        </div>
    </div>
  
</template>

<script>
    export default {
          beforeRouteLeave(to,from,next){
        //    console.log(to);
            if(from.meta.backAsk){
                const isGo = window.confirm('真的要走吗？不再看看了？');
                isGo ? next() : next(false); 
            }
        }
    }
</script>

<style>
a{
 
 text-decoration: none;
    padding: 5px 10px;
    margin-right: 10px;
}
a.router-link-active{
    color: #fff;
      background-color: #3385ff;
}
.activity-view{
    margin-top: 30px;
}
</style>