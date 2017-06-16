<template>
    <transition name="move">
        <div class="food" v-show="showFlag" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" alt="">
                    <div class="back" @click="hide">
                        <span class="icon-arrow_lift"></span>
                    </div>
                </div>
                <div class="content">
                    <h2 class="title">{{food.name}}</h2>
                    <div class="desc">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                    <div class="cart-control-wrapper">
                        <cart-control :food="food" @add="addFood"></cart-control>
                    </div>
                    <transition name="fade">
                        <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count===0">加入购物车</div>
                    </transition>
                </div>
                <split v-show="food.info"></split>
                <!-- 商品介绍 -->
                <div class="info" v-show="food.info">
                    <h2 class="title">商品介绍</h2>
                    <p class="text">{{food.info}}</p>
                </div>
                <split></split>
                <!-- 商品评价 -->
                <div class="good-rating">
                    <h2 class="title">商品评价</h2>
                    <rating-select :selectType="selectType" :ratings="food.ratings" :onlyContent="onlyContent" :desc="desc" @select="getSelectType" @toggle="getOnlyContent"></rating-select>
                    <!-- 评价列表 -->
                    <div class="rating-wrapper">
                        <!-- 有列表内容 -->
                        <ul class="rating-list" v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px" v-for="rating in food.ratings">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img :src="rating.avatar" alt="" width="12" height="12">
                                </div>
                                <div class="time">{{rating.rateTime|formatDate}}</div>
                                <div class="text-content">
                                    <span :class="{'icon-thumb_up': rating.rateType===0,'icon-thumb_down': rating.rateType===1}"></span>
                                    <span class="text">{{rating.text}}</span>
                                </div>
                            </li>
                        </ul>
                        <!-- 无列表内容 -->
                        <div class="norating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import cartControl from '@/components/cartcontrol/cartcontrol';
import BScroll from 'better-scroll';
import split from '@/components/split/split';
import ratingSelect from '@/components/ratingselect/ratingselect';
import {formatDate} from '@/assets/js/date';
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
    props: {
        food: Object
    },
    data() {
        return {
            showFlag: false,
            selectType: ALL,
            ratings: [],
            onlyContent: false,
            desc: {
                all: '全部',
                positive: '推荐',
                negative: '吐槽'
            }
        }
    },
    filters: {
       formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    methods: {
        show() {
            this.showFlag = true;
            this.$nextTick(() => {
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.food, {
                        click: true
                    })
                } else {
                    this.scroll.refresh();
                }
            });
        },
        hide() {
            this.showFlag = false;
        },
        addFirst(event) {
            if (!event._constructed) {
                return;
            }
            if (!this.food.count) {
                console.log(event.target)
                this.$emit('add', event.target)
                this.$set(this.food, 'count', 1);
            }
        },
        addFood(target) {
            this.$emit('add', target)
        },
        getSelectType(type) {
            this.selectType = type;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        getOnlyContent() {
            this.onlyContent = !this.onlyContent;
            this.$nextTick(() => {
                this.scroll.refresh();
            });
        },
        needShow(type, text) {
            if(this.onlyContent && !text) {
                return false;
            }
            if(this.selectType ===ALL){
                return true;
            }else {
                return type === this.selectType;
            }

        }
    },
    components: {
        cartControl,
        split,
        ratingSelect
    }
};
</script>
<style lang="less">
@import url('../../assets/less/base.less');
@import url('../../assets/less/mixin.less');
.food {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 48px;
    z-index: 1;
    width: 100%;
    background-color: #fff;
    transform: translate3d(0, 0, 0);
    &.move-enter-active,
    &.move-leave-active {
        transition: all .3s linear;
    }
    &.move-enter,
    &.move-leave-active {
        transform: translate3d(100%, 0, 0);
    }
    .food-content {
        .image-header {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 100%;
            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            .back {
                position: absolute;
                top: 10px;
                left: 0;
                .icon-arrow_lift {
                    display: block;
                    padding: 10px;
                    font-size: 20px;
                    color: #fff;
                }
            }
        }
        .content {
            position: relative;
            padding: 18px;
            .title {
                padding-bottom: 8px;
                font-size: 14px;
                line-height: 14px;
                font-weight: 700;
                color: rgb(7, 17, 27);
            }
            .desc {
                padding-bottom: 18px;
                font-size: 0;
                line-height: 10px;
                height: 10px;
                color: rgb(7, 17, 27);
                .sell-count,
                .rating {
                    font-size: 10px;
                }
                .sell-count {
                    margin-right: 12px;
                }
            }
            .price {
                .now {
                    font-size: 14px;
                    line-height: 24px;
                    font-weight: 700;
                    color: rgb(240, 20, 20);
                }
                .old {
                    font-size: 10px;
                    line-height: 24px;
                    font-weight: 700;
                    color: rgb(147, 153, 159);
                }
            }
            .cart-control-wrapper {
                position: absolute;
                right: 12px;
                bottom: 12px;
            }
            .buy {
                position: absolute;
                right: 18px;
                bottom: 18px;
                padding: 0 12px;
                border-radius: 12px;
                box-sizing: border-box;
                font-size: 10px;
                line-height: 24px;
                color: #fff;
                background-color: rgb(0, 160, 220);
                opacity: 1;
                z-index: 2;
                &.fade-enter-active,
                &.fade-leave-active {
                    transition: all .2s linear;
                }
                &.fade-enter,
                &.fade-leave-active {
                    opacity: 0;
                }
            }
        }
        .info {
            padding: 18px;
            .title {
                margin-bottom: 6px;
                line-height: 14px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .text {
                padding: 0 8px;
                line-height: 24px;
                font-size: 12px;
                color: rgb(77, 85, 93);
            }
        }
        .good-rating {
            padding-top: 18px;
            .title {
                margin-left: 18px;
                line-height: 14px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .rating-wrapper{
                padding: 0 18px;
                .rating-item{
                    position: relative;
                    padding: 16px 0;
                    .border-1px(rgba(7,17,27,0.1));
                    .user{
                        position: absolute;
                        right: 0;
                        top: 16px;
                        font-size: 0;
                        .name{
                            display: inline-block;
                            font-size: 10px;
                            color: rgb(147, 153, 159);
                            line-height: 12px;
                            vertical-align: top;
                            margin-right: 6px;
                        }
                        img{
                            border-radius: 50%;
                        }
                    }
                    .time{
                        margin-bottom: 6px;
                        line-height: 12px;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                    .text-content{
                        .icon-thumb_up{
                            display: inline-block;
                            line-height: 16px;
                            font-size: 12px;
                            color: rgb(0, 160, 220);
                        }
                        .icon-thumb_down{
                            display: inline-block;
                            line-height: 16px;
                            font-size: 12px;
                            color: rgb(147, 153, 159);
                        }
                        .text{
                            display: inline-block;
                            margin-left: 4px;
                            line-height: 16px;
                            font-size: 12px;
                            color: rgb(7, 17, 27);
                        }
                    }
                }
                .norating{
                    padding: 16px 0;
                    font-size: 12px;
                    color: rgb(147, 153, 159);
                }
            }
        }
    }
}
</style>
