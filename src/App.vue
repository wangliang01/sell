<template>
    <div id="app">
        <v-header :seller="seller"></v-header>
        <div class="tab border-1px">
            <div class="tab-item">
                <router-link to="/goods">
                    商品
                </router-link>
            </div>
            <div class="tab-item">
                <router-link to="/ratings">
                    评论
                </router-link>
            </div>
            <div class="tab-item">
                <router-link to="/seller">
                    商家
                </router-link>
            </div>
        </div>
        <keep-alive>
            <router-view :seller="seller"></router-view>
        </keep-alive>
    </div>
</template>
<script>
import Header from '@/components/header/header';
import {parseUrl} from '@/assets/js/parseUrl';
export default {
    name: 'app',
    data() {
        return {
            seller: {
                id: (() => {
                    let querys = parseUrl();
                    return querys.id;
                })()
            }
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init();
        })
    },
    methods: {
        init() {
            this.$http.get('/api/seller?id='+this.seller.id).then((res) => {
                // 成功
               let data = res.data;
               if(data.errno === 0){
                    // this.seller = data.result;
                    this.seller = Object.assign({},this.seller,data.result);
               }
            },(res) => {
                // 失败
                console.log(res)
            })
        }
    },
    components: {
        'v-header': Header
    }

}
</script>
<style lang="less" scoped>
@import url('assets/less/base.less');
@import url('assets/less/mixin.less');
.tab {
    display: flex;
    font-size: 0;
    .border-1px(rgba(7, 17, 27, 0.1));
    .tab-item {
        flex: 1;
        text-align: center;
        font-size: 14px;
        line-height: 40px;
        height: 40px;
        & > a {
            display: block;
            color: rgb(77, 85, 93);
        }
        .active {
            color: rgb(240, 20, 20);
        }
    }
}
</style>
