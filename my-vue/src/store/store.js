import Vue from 'vue';
import Vuex from 'vuex';

import count from './modules/count';
import student from './modules/student';
import {
    COUNT_INCREMENT,
    CHANGE_OBJ,
    UPDATE_MSG,
} from './mutation-type';
Vue.use(Vuex);

export default new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    modules:{
        count,
        student
    },
    state: {
        obj: {
            a: '10'
        },
        msg:''
    },
    mutations: {
        [CHANGE_OBJ](state) {
            Vue.set(state.obj, 'b', 10);
            // state.obj = {...state.obj, b: 10};
        },
        [UPDATE_MSG](state, {
            value
        }) {
            state.msg = value;
        }
    }
});