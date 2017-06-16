<template>
    <div class="goods">
        <!-- 左侧菜单栏 -->
        <div class="menu-wrapper" ref="menu-wrapper">
            <ul class="menu">
                <li class="menu-item" v-for="(item,index) in goods" :class="{current: currentIndex===index}" @click.stop="selectMenu(index,$event)">
                    <span class="text border-1px">
						<span class="icon" v-show="item.type>0" :class="classMap[item.type]"></span> {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <!-- 右侧食品列表 -->
        <div class="foods-wrapper" ref="foods-wrapper">
            <ul>
                <li class="food-list food-list-hook" v-for="good in goods">
                    <h1 class="title">{{good.name}}</h1>
                    <ul>
                        <li class="food-item border-1px" v-for="food in good.foods" @click="selectFood(food,$event)">
                            <div class="icon">
                                <img :src="food.icon" alt="">
                            </div>
                            <div class="content">
                                <!-- 名称 -->
                                <h2 class="name">{{food.name}}</h2>
                                <!-- 描述 -->
                                <p class="desc">{{food.description}}</p>
                                <!-- 额外的信息 -->
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}</span>
                                </div>
                                <!-- 价格 -->
                                <div class="price">
                                    <span class="currency-sign">￥</span><span class="nowPrice">{{food.price}}</span>
                                    <span class="oldPrice" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <!-- 购物车控件 -->
                                <div class="cart-control-wrapper">
                                    <cart-control :food="food" @add="_drop"></cart-control>
                                </div>
                            </div>
                            
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!-- 底部购物车 -->
        <shopcart :selectFoods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" ref="shopcart"></shopcart>
        <food :food="selectedFood" ref="food" @add="_drop"></food>
    </div>
</template>
<script>
import BScroll from 'better-scroll';
import shopcart from '@/components/shopcart/shopcart';
import cartControl from '@/components/cartcontrol/cartcontrol';
import food from '@/components/food/food';
const ERR_OK = 0;
export default {
    props: {
        seller: {
            type: Object
        }
    },
    data() {
        return {
            goods: [],
            listHeight: [],
            scrollY: 0,
            selectedFood: {}
        }
    },
    computed: {
        currentIndex() {
            for (let i = 0; i < this.listHeight.length; i++) {
                let height1 = this.listHeight[i];
                let height2 = this.listHeight[i + 1];
                if (!height2 || this.scrollY >= height1 && this.scrollY < height2) {
                    return i;
                }
            }
            return 0;
        },
        selectFoods() {
            let foods = [];
            this.goods.forEach((good) => {
                good.foods.forEach((food) => {
                    if (food.count) {
                        foods.push(food);
                    }
                })
            });
            return foods;
        }
    },
    created() {
    	this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];

        this.$http.get('/api/goods').then((res) => {
            let data = res.data;
            if (data.errno === ERR_OK) {
                this.goods = data.result;
                this.$nextTick(() => {
                    this._initScroll();
                    this._calcHeight();
                });
            }
        })
    },
    methods: {
        selectMenu(index, event) {
            if (!event._constructed) {
                return;
            }
            let listHeight = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook');
            let el = listHeight[index];
            this.foodsScroll.scrollToElement(el, 300);
            // this.currentIndex = index;
        },
        _initScroll() {
            this.menuScroll = new BScroll(this.$refs['menu-wrapper'], {
                click: true
            });
            this.foodsScroll = new BScroll(this.$refs['foods-wrapper'], {
                probeType: 3,
                click: true
            });

            this.foodsScroll.on('scroll', (pos) => {
                this.scrollY = Math.abs(Math.round(pos.y));

            })
        },
        _calcHeight() {
            let listHeight = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook');
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < listHeight.length; i++) {
                let item = listHeight[i];
                height += item.clientHeight;
                this.listHeight.push(height);
            }
        },
        _drop(target) {
            //优化体验，异步执行下落动画
            this.$nextTick(() => {
                this.$refs.shopcart.drop(target);
            });
        },
        selectFood(food,event) {
            if(!event._constructed){
                return ;
            }
            this.selectedFood = food;
            this.$refs.food.show();
        }
    },
    components: {
        shopcart,
        cartControl,
        food
    }
};
</script>
<style lang="less">
// @import url('../../assets/less/base.less');
@import url('../../assets/less/mixin.less');
.goods {
    display: flex;
    position: absolute;
    top: 175px;
    bottom: 48px;
    width: 100%;
    overflow: hidden;
    .menu-wrapper {
        flex: 0 0 80px;
        width: 80px; //处理安卓手机上的BUG
        background-color: #f3f5f7;
        text-align: center;
        .menu-item {
            display: table;
            padding: 0 12px;
            width: 56px;
            height: 54px;
            line-height: 14px;
            font-size: 0;
            &.current {
                position: relative;
                margin-top: -1px;
                font-weight: 700;
                background-color: #fff;
                .text {
                    .border-none();
                }
            }
            .icon {
                display: inline-block;
                width: 12px;
                height: 12px;
                margin-right: 2px;
                vertical-align: top;
                background-size: 12px 12px;
                background-repeat: no-repeat;
                &.decrease {
                    background-image: url('../../assets/images/decrease_3@2x.png');
                }
                &.discount {
                    background-image: url('../../assets/images/discount_3@2x.png');
                }
                &.guarantee {
                    background-image: url('../../assets/images/guarantee_3@2x.png');
                }
                &.invoice {
                    background-image: url('../../assets/images/invoice_3@2x.png');
                }
                &.special {
                    background-image: url('../../assets/images/special_3@2x.png');
                }
            }
            .text {
                display: table-cell;
                width: 56px;
                vertical-align: middle;
                font-size: 12px;
                .border-1px(rgba(7,
                17,
                27,
                0.1));
            }
        }
    }
    .foods-wrapper {
        flex: 1;
        .title {
            height: 26px;
            line-height: 26px;
            padding-left: 14px;
            border-left: 2px solid #d9dde1;
            font-size: 12px;
            color: rgb(147, 153, 159);
            background-color: #f3f5f7;
        }
        .food-item {
            display: flex;
            margin: 18px;
            padding-bottom: 18px;
            .border-1px(rgba(7,
            17,
            27,
            0.1));
            &:last-child {
                margin-bottom: 0;
                .border-none();
            }
            .icon {
                flex: 0 0 57px;
                width: 57px;
                height: 57px;
                margin-right: 10px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 2px;
                }
            }
            .content {
                flex: 1;
                .name {
                    padding-top: 2px;
                    font-size: 14px;
                    line-height: 14px;
                    color: rgb(7, 17, 27);
                }
                .desc {
                    padding: 8px 0;
                    font-size: 10px;
                    line-height: 12px;
                    color: rgb(147, 153, 159);
                }
                .extra {
                    font-size: 10px;
                    line-height: 10px;
                    color: rgb(147, 153, 159);
                    .rating {
                        padding-left: 12px;
                    }
                }
                .price {
                    font-size: 10px;
                    line-height: 24px;
                    font-weight: 700;
                    .currency-sign {
                        color: rgb(240, 20, 20);
                    }
                    .nowPrice {
                        font-size: 14px;
                        padding-right: 8px;
                        color: rgb(240, 20, 20);
                    }
                    .oldPrice {
                        color: rgb(147, 153, 159);
                    }
                }
                .cart-control-wrapper {
                    position: absolute;
                    right: 0;
                    bottom: 12px;
                }
            }
        }
    }
}
</style>
