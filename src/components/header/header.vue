<template>
    <div class="header">
        <div class="content-wrapper">
            <!-- 头像 -->
            <div class="avatar">
                <img :src="seller.avatar" alt="" width="100%" height="100%">
            </div>
            <div class="content">
                <!-- 商家名称 -->
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <!-- 描述信息 -->
                <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
                <!-- 活动信息 -->
                <div class="supports" v-if="seller.supports">
                    <!-- 活动图标 -->
                    <span class="icon" :class="supportsAlias[seller.supports[0].type]"></span>
                    <!-- 活动内容 -->
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <!-- 活动个数 -->
            <div class="count" v-if="seller.supports" @click="showDetail">
                <span class="text">{{seller.supports.length}}个</span>
                <span class="icon-keyboard_arrow_right"></span>
            </div>
        </div>
        <div class="bulletin-wrapper">
            <!-- 公告图标 -->
            <span class="bulletin-icon"></span>
            <!-- 公告内容 -->
            <span class="bulletin-text">{{seller.bulletin}}</span>
            <!-- 更多图标 -->
            <span class="icon-keyboard_arrow_right" @click="showDetail"></span>
        </div>
        <!-- 背景图像 -->
        <div class="background">
            <img :src="seller.avatar" alt="" width="100%" height="100%">
        </div>
        <!-- 详情 -->
        <transition name="fade">
            <div class="detail" v-show="detailShow">
                <!-- css sticky footer布局 -->
                <div class="detail-wrapper">
                    <div class="detail-main">
                        <!-- 商家名称 -->
                        <h1 class="seller-name">{{seller.name}}</h1>
                        <!-- 商家评分 -->
                        <div class="seller-score">
                            <star :size="48" :score="3.2" :count="5"></star>
                        </div>
                        <!-- 标题信息 -->
                        <div class="title">
                            <div class="line"></div>
                            <div class="name">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <!-- 活动信息 -->
                        <ul class="supports">
                            <li class="supports-item" v-if="seller.supports" v-for="(item,index) in seller.supports">
                                <!-- 活动图标 -->
                                <span class="icon" :class="supportsAlias[index]"></span>
                                <!-- 活动内容 -->
                                <span class="text">{{item.description}}</span>
                            </li>
                        </ul>
                        <!-- 标题信息 -->
                        <div class="title">
                            <div class="line"></div>
                            <div class="name">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <div class="bulletin-text">{{seller.bulletin}}</div>
                        </div>
                    </div>
                </div>
                <div class="detail-close" @click="detailShow=false">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import star from '@/components/star/star'
export default {
    data() {
            return {
                supportsAlias: ['decrease', 'discount', 'guarantee', 'invoice', 'special'],
                detailShow: false
            }
        },
        props: {
            seller: {
                type: Object
            }
        },
        methods: {
            showDetail() {
                this.detailShow = true;
            }
        },
        components: {
            star
        }

};
</script>
<style lang="less">
@import url('../../assets/less/base.less');
@import url('../../assets/less/mixin.less');
@import url('../../assets/less/icon.less');
.header {
    position: relative;
    background-color: rgba(7, 17, 27, 0.5);
    color: #fff;
    .content-wrapper {
        position: relative;
        padding: 24px 12px 18px 24px;
        font-size: 0;
        .avatar {
            display: inline-block;
            width: 64px;
            height: 64px;
            vertical-align: top;
            img {
                border-radius: 2px;
            }
        }
        .content {
            display: inline-block;
            padding-left: 16px;
            .title {
                margin: 2px 0 8px 0;
                .brand {
                    display: inline-block;
                    width: 30px;
                    height: 18px;
                    vertical-align: middle;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-image: url('../../assets/images/brand@2x.png');
                }
                .name {
                    padding-left: 6px;
                    font-size: 16px;
                    font-weight: bold;
                    line-height: 18px;
                    vertical-align: middle;
                }
            }
            .description {
                margin-bottom: 10px;
                font-size: 12px;
                line-height: 12px;
                color: #fff;
                font-weight: 200;
            }
            .supports {
                .icon {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    vertical-align: middle;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-color: #fff;
                    &.decrease {
                        background-image: url('../../assets/images/decrease_1@2x.png');
                    }
                    &.discount {
                        background-image: url('../../assets/images/discount_1@2x.png');
                    }
                    &.guarantee {
                        background-image: url('../../assets/images/guarantee_1@2x.png');
                    }
                    &.invoice {
                        background-image: url('../../assets/images/invoice_1@2x.png');
                    }
                    &.special {
                        background-image: url('../../assets/images/special_1@2x.png');
                    }
                }
                .text {
                    padding: 0 4px;
                    font-size: 10px;
                    line-height: 12px;
                    font-weight: 200;
                    color: #fff;
                    vertical-align: middle;
                }
            }
        }
        .count {
            position: absolute;
            right: 12px;
            bottom: 18px;
            line-height: 24px;
            padding: 0 8px;
            border-radius: 12px;
            font-size: 0;
            background-color: rgba(0, 0, 0, 0.2);
            color: #fff;
            font-weight: 200;
            .text {
                font-size: 10px;
                vertical-align: middle;
            }
            .icon-keyboard_arrow_right {
                margin-left: 2px;
                font-size: 10px;
                vertical-align: middle;
            }
        }
    }
    .bulletin-wrapper {
        position: relative;
        padding: 5px 22px 5px 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: rgba(7, 17, 27, 0.2);
        .bulletin-icon {
            display: inline-block;
            width: 30px;
            height: 18px;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url('../../assets/images/bulletin@2x.png');
            vertical-align: top;
        }
        .bulletin-text {
            font-size: 10px;
            line-height: 18px;
            font-weight: 200;
        }
        .icon-keyboard_arrow_right {
            position: absolute;
            top: 10px;
            right: 12px;
            font-size: 10px;
        }
    }
    .background {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        z-index: -1;
        filter: blur(0.1rem);
    }
    .detail {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2;
        overflow: auto;
        background-color: rgba(7, 17, 27, 0.8);
        opacity: 1;
        backdrop-filter: blur(10px);
        &.fade-enter,&.fade-leave-active{
            opacity: 0;
            background-color: rgba(7, 17, 27, 0);
        }
        &.fade-enter-active,&.fade-leave-active{
            transition: all .5s;
        }
        .detail-wrapper {
            min-height: 100%;
            width: 100%;
            .detail-main {
                // margin-top: 64px;
                padding-bottom: 64px;
                .seller-name {
                    padding-top: 64px;
                    text-align: center;
                    font-size: 16px;
                    line-height: 16px;
                    font-weight: 700;
                }
                .seller-score {
                    margin: 16px 0 28px;
                    text-align: center;
                }
                .title {
                    display: flex;
                    width: 80%;
                    margin: 0 auto;
                    .line {
                        flex: 1;
                        position: relative;
                        top: -6px;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                    }
                    .name {
                        font-size: 14px;
                        line-height: 14px;
                        font-weight: 700;
                        padding: 0 12px;
                    }
                }
                .supports {
                    margin: 24px auto 28px;
                    padding-left: 12px;
                    width: 80%;
                    font-size: 0;
                    .supports-item{
                        margin-bottom: 12px;
                        .icon {
                            display: inline-block;
                            width: 16px;
                            height: 16px;
                            background-size: 16px 16px;
                            background-repeat: no-repeat;
                            vertical-align: top;
                            &.decrease {
                                background-image: url('../../assets/images/decrease_2@2x.png');
                            }
                            &.discount {
                                background-image: url('../../assets/images/discount_2@2x.png');
                            }
                            &.guarantee {
                                background-image: url('../../assets/images/guarantee_2@2x.png');
                            }
                            &.invoice {
                                background-image: url('../../assets/images/invoice_2@2x.png');
                            }
                            &.special {
                                background-image: url('../../assets/images/special_2@2x.png');
                            }
                        }
                        .text {
                            padding-left: 6px;
                            font-size: 12px;
                            line-height: 16px;
                            font-weight: 200;
                        }
                    }
                }
                .bulletin {
                    width: 80%;
                    margin: 24px auto;
                    &-text{
                        padding: 0 12px;
                        font-size: 12px;
                        line-height: 24px;
                        font-weight: 200;
                    }
                }
            }
        }
        .detail-close {
            position: relative;
            width: 32px;
            height: 32px;
            margin: -64px auto 0;
            font-size: 32px;
        }
    }
}
</style>
