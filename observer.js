const data = {
    name:"小辣椒",
    obj:{
        x:1
    },
    arr:[4,5,6]
}

const arrayProto = Array.prototype;
const arrMethod = Object.create(arrayProto);//克隆一份
['push','pop','shift','unshift','sort','splice','reverse'].forEach(method=>{
    arrMethod[method] = function(){
        arrayProto[method].call(this,...arguments);
        render();
    }
})

function defineReactive(data,key,value){
    observer(value);
    Object.defineProperty(data,key,{
        get(){
            console.log("读");
            return value;
        },
        set(newVal){
            if(value === newVal){
                return newVal;
            }
            console.log("写");
            value = newVal;
            render();
        }
    })
}
function observer(data){
    if(Array.isArray(data)){
        data.__proto__ = arrMethod;//如果是数组就改变隐式原型
        return;
    }
    if(typeof data == "object"){
        for (const key in data) {
            defineReactive(data,key,data[key])
        }  
    }
  
}
function render(){
    console.log("页面渲染");
}
observer(data);

// $set $delete原理：
function $set(data,key,value){
    if(Array.isArray(data)){
        data.splice(key,1,value);
        return value;
    }
    defineReactive(data,key,value);
    render();
    return value;
}

function $delete(data,key){
    if(Array.isArray(data)){
        data.splice(key);
        return;
    }
    delete data[key];
    render();
}
// data.name = "小仙女";
// console.log(data.name);
// data.obj.x = 10;
// console.log(data.obj.x);
// data.arr.length = 1;
// data.arr[100] = 100;
$set(data.arr,0,12);
$delete(data.arr,2);
$delete(data.obj.x);
console.log(data.obj);
// data.arr.push(7);
console.log(data.arr);