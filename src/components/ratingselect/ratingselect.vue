<template>
    <div class="rating-select">
        <!-- 评价分类 -->
        <div class="classify border-1px">
            <span class="block positive" :class="{active: selectType===2}" @click="select(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span class="block positive" :class="{active: selectType===0}" @click="select(0,$event)">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
            <span class="block negative" :class="{active: selectType===1}" @click="select(1,$event)">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
        </div>
        <!-- 只看有内容的评价 -->
        <div class="rating-only-content" :class="{on: onlyContent}" @click="toggleContent">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>
<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
	props: {
		selectType: {
			type: Number,
			default: ALL
		},
		ratings: {
			type: Array,
			default() {
				return [];
			}
		},
		onlyContent: {
			type: Boolean,
			default: false
		},
		desc: {
			type: Object,
			default() {
				return {
					all: '全部',
					positive: '满意',
					negative: '不满意'
				}
			}
		}
	},
	computed: {
        positives() {
            return this.ratings.filter((rating) => {
                return rating.rateType === POSITIVE;
            });
        },
        negatives() {
            return this.ratings.filter((rating) => {
                return rating.rateType === NEGATIVE;
            });
        }
    },
	methods: {
		select(type, event) {
			 if (!event._constructed) {
                return;
            }
			// this.selectType = type;
			this.$emit('select', type);
		},
		toggleContent(event) {
			 if (!event._constructed) {
                return;
            }
			// this.onlyContent = !this.onlyContent;
			this.$emit('toggle')
		}
	}
};
</script>
<style lang="less">
@import url('../../assets/less/base.less');
@import url('../../assets/less/mixin.less');
.rating-select {
    .classify {
        margin: 0 18px;
        padding: 18px 0;
        .border-1px(rgba(7, 17, 27, 0.1));
        font-size: 0;
        .block {
            display: inline-block;
            padding: 8px 12px;
            margin-right: 8px;
            line-height: 16px;
            font-size: 12px;
            border-radius: 1px;
            color: rgb(77, 85, 93);
            &.active{
            	color: #fff;
            }
            &:last-child {
                margin-right: 0;
            }
            .count {
            	margin-left: 2px;
                font-size: 8px;
            }
            &.positive{
            	background-color: rgba(0, 160, 220, 0.2);
            	&.active{
            		background-color: rgb(0, 160, 220);
            	}
            }
            &.negative{
           		background-color: rgba(77, 85, 93, 0.2);
           		&.active{
           			background-color: rgb(77, 85, 93);
           		}
            }
        }
    }
    .rating-only-content{
            padding: 12px 18px;
            line-height: 24px;
            font-size: 0;
            color: rgb(147, 153, 159);
            &.on{
            	.icon-check_circle{
            		color: #00c850;
            	}
            }
            .border-1px(rgba(7,17,27,0.1));
            .icon-check_circle{
                margin-right: 4px;
                display: inline-block;
                vertical-align: top;
                font-size: 24px;
            }
            .text{
                display: inline-block;
                vertical-align: top;
                font-size: 12px;
            }
        }
}
</style>
