<template>
    <div>
        <div class="shopcart">
            <!-- 购物车 -->
            <div class="content" @click="toggleList">
                <div class="content-left">
                    <div class="logo-wrapper">
                        <div class="logo" :class="{highlight: totalCount>0}">
                            <span class="icon-shopping_cart" :class="{highlight: totalCount>0}"></span>
                        </div>
                        <div class="num" v-show="totalCount>0">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{highlight: totalPrice>0}">￥{{totalPrice}}</div>
                    <div class="desc">另需配送费{{deliveryPrice}}元</div>
                </div>
                <div class="content-right" :class="payClass" @click.stop.prevent="pay">{{payDesc}}</div>
            </div>
            <!-- 小球动画 -->
            <div class="ball-wrapper">
                <div v-for="(item,index) in balls">
                    <transition name="drop" @before-enter="beforeDrop" @enter="droping" @after-enter="afterDrop">
                        <div class="ball" v-show="item.show">
                            <span class="inner inner-hook"></span>
                        </div>
                    </transition>
                </div>
            </div>
            <!-- 购物车列表 -->
            <transition name="fold">
                <div class="shopcart-list" v-show="listShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <div class="empty" @click="empty">清空</div>
                    </div>
                    <div class="list-content" ref="listContent">
                        <ul>
                            <li class="food boxder-1px" v-for="food in selectFoods">
                                <div class="name">{{food.name}}</div>
                                <div class="price"><span class="dolar">￥</span>{{food.price*food.count}}</div>
                                <div class="cart-control-wrapper">
                                    <cart-control :food="food" @add="_drop"></cart-control>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <!-- 背景蒙层 -->
        <transition name="fade">
            <div class="list-mask" v-show="listShow" @click="hideList"></div>
        </transition>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import cartControl from '@/components/cartcontrol/cartcontrol'
export default {
    data() {
            return {
                balls: [{
                    show: false
                }, {
                    show: false
                }, {
                    show: false
                }, {
                    show: false
                }, {
                    show: false
                }],
                dropBalls: [],
                fold: true
            }
        },
        props: {
            deliveryPrice: {
                type: Number,
                default: 0
            },
            minPrice: {
                type: Number,
                default: 0
            },
            selectFoods: {
                type: Array,
                default () {
                    return []
                }
            }
        },
        created() {},
        computed: {
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((food) => {
                    total += food.price * food.count;
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((food) => {
                    count += food.count;
                });
                return count;
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return `￥${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    let diff = this.minPrice - this.totalPrice;
                    return `还差￥${diff}元起送`;
                } else {
                    return '去结算';
                }
            },
            payClass() {
                if (this.totalPrice < this.minPrice) {
                    return 'not-enough';
                } else {
                    return 'enough';
                }
            },
            listShow() {
                if (!this.totalCount) {
                    return false;
                }
                let show = !this.fold;
                if (show) {
                    if (!this.scroll) {
                        this.$nextTick(() => {
                            this.scroll = new BScroll(this.$refs.listContent, {
                                click: true
                            });
                        });
                    } else {
                        this.scroll.refresh();
                    }
                }
                return show;
            },
        },
        methods: {
            drop(el) {
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.show) {
                        ball.show = true;
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeDrop(el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.show) {
                        let ball_el = ball.el
                        let rect = ball_el.getBoundingClientRect();
                        let x = (rect.left - 32);

                        let y = -(window.innerHeight - rect.top - 22);

                        el.style.display = 'inline-block';
                        el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
                        el.style.transform = `translate3d(0, ${y}px, 0)`;
                        let inner = el.getElementsByClassName('inner-hook')[0];
                        inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
                        inner.style.transform = `translate3d(${x}px, 0, 0)`;
                    }
                }
            },
            droping(el, done) {
                //触发浏览器重绘
                let rf = el.offsetHeight;
                this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0, 0, 0)';
                    el.style.transform = 'translate3d(0, 0, 0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0, 0, 0)';
                    inner.style.transform = 'translate3d(0, 0, 0)';
                    el.addEventListener('transitionend', done);
                });

            },
            afterDrop(el) {
                let ball = this.dropBalls.shift();
                if (ball) {
                    ball.show = false;
                    el.style.display = 'none';
                }
            },
            toggleList() {
                if (!this.totalCount) {
                    return;
                }
                this.fold = !this.fold;
            },
            empty() {
                this.$nextTick(() => {
                    this.selectFoods.forEach((food) => {
                        food.count = 0;
                    });
                    this.fold = true;
                });
            },
            hideList() {
                this.fold = true;
            },
            pay() {
                if(this.totalPrice < this.minPrice) {
                    return;
                }
                alert(`需支付${this.totalPrice}元`);
            },
            _drop(target) {
                this.$nextTick(() => {
                    this.drop(target);
                });
            }

        },
        components: {
            cartControl
        }
};
</script>
<style lang="less">
@import url('../../assets/less/base.less');
@import url('../../assets/less/mixin.less');
.shopcart {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 48px;
    z-index: 3;
    .content {
        display: flex;
        background-color: #141d27;
        width: 100%;
        height: 100%;
        font-size: 0;
        &-left {
            flex: 1;
            height: 100%;
            .logo-wrapper {
                display: inline-block;
                position: relative;
                top: -10px;
                margin: 0 12px;
                padding: 6px;
                width: 56px;
                height: 56px;
                box-sizing: border-box;
                border-radius: 50%;
                background-color: #141d27;
                .logo {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    text-align: center;
                    background-color: rgb(43, 52, 60);
                    &.highlight {
                        background-color: rgb(0, 160, 220);
                    }
                    .icon-shopping_cart {
                        font-size: 24px;
                        line-height: 44px;
                        color: rgba(255, 255, 255, 0.4);
                        &.highlight {
                            color: #fff;
                        }
                    }
                }
                .num {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 24px;
                    height: 16px;
                    line-height: 16px;
                    border-radius: 16px;
                    text-align: center;
                    background-color: rgb(240, 20, 20);
                    color: #fff;
                    font-size: 9px;
                    font-weight: 700;
                }
            }
            .price {
                display: inline-block;
                margin-top: 12px;
                padding-right: 12px;
                vertical-align: top;
                font-size: 16px;
                line-height: 24px;
                font-weight: 700;
                color: rgba(255, 255, 255, 0.4);
                box-sizing: border-box;
                border-right: 1px solid rgba(255, 255, 255, 0.1);
                &.highlight {
                    color: #fff;
                }
            }
            .desc {
                display: inline-block;
                margin-top: 12px;
                padding-left: 12px;
                vertical-align: top;
                font-size: 10px;
                font-weight: 200;
                line-height: 24px;
                color: rgba(255, 255, 255, 0.4);
            }
        }
        &-right {
            flex: 0 0 105px;
            width: 105px;
            height: 100%;
            line-height: 48px;
            padding: 0 8px;
            box-sizing: border-box;
            font-size: 12px;
            text-align: center;
            font-weight: 700;
            &.enough {
                background-color: rgb(0, 180, 60);
                color: #fff;
            }
            &.not-enough {
                background-color: rgb(43, 51, 59);
                color: rgba(255, 255, 255, 0.4);
            }
        }
    }
    .ball-wrapper {
        .ball {
            position: fixed;
            left: 32px;
            bottom: 22px;
            z-index: 2;
            transition: all .4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
            .inner {
                display: inline-block;
                width: 16px;
                height: 16px;
                background-color: rgb(0, 160, 220);
                border-radius: 50%;
                transition: all .4s linear;
            }
        }
    }
    .shopcart-list {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: -1;
        transform: translate3d(0, -100%, 0);
        &.fold-enter,
        &.fold-leave-active {
            transform: translate3d(0, 0, 0);
        }
        &.fold-enter-active,
        &.fold-leave-active {
            transition: all 0.4s linear;
        }
        .list-header {
            padding: 0 18px;
            height: 40px;
            line-height: 40px;
            background-color: #f3f5f7;
            border: 1px solid rgba(7, 17, 27, 0.1);
            .title {
                float: left;
                font-size: 14px;
                color: rgb(7, 17, 27);
                font-weight: 200;
            }
            .empty {
                float: right;
                font-size: 12px;
                color: rgb(0, 160, 220);
            }
        }
        .list-content {
            padding: 0 18px;
            background-color: #f3f5f7;
            max-height: 217px;
            overflow: hidden;
            .food {
                position: relative;
                padding: 12px 0;
                padding-right: 90px;
                line-height: 24px;
                overflow: hidden;
                box-sizing: border-box;
                .border-1px(rgba(7,
                17,
                27,
                0.1));
                .name {
                    float: left;
                    font-size: 14px;
                    color: rgb(7, 17, 27);
                }
                .price {
                    float: right;
                    color: rgb(240, 20, 20);
                    font-size: 14px;
                    font-weight: 700;
                    .dolar {
                        font-size: 10px;
                    }
                }
                .cart-control-wrapper {
                    position: absolute;
                    top: 6px;
                    right: 0;
                }
            }
        }
    }
}

.list-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(7, 17, 27, 0.6);
    -webkit-filter: blur(10px);
    drop-filter: blur(10px);
    z-index: 2;
    &.fade-enter-active,&.fade-leave-active{
        transition: all .4s;
    }
    &.fade-enter,&.fade-leave-active{
        z-index: 0;
        background-color: rgba(7, 17, 27, 0);
    }
}
</style>
