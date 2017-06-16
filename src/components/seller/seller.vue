<template>
	<div class="seller" ref="seller">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="description border-1px">
					<star :size="36" :score="seller.score" :count="5" :class="'star'"></star>
					<span class="ratingCount">({{seller.ratingCount}})</span>
					<span class="sellCount">月售{{seller.sellCount}}单</span>
				</div>
				<ul class="remark">
					<li class="block">
						<h2 class="title">起送价</h2>
						<div class="desc"><span class="strong">{{seller.minPrice}}</span>元</div>
					</li>
					<li class="block">
						<h2 class="title">商家配送</h2>
						<div class="desc"><span class="strong">{{seller.deliveryPrice}}</span>元</div>
					</li>
					<li class="block">
						<h2 class="title">平均配送时间</h2>
						<div class="desc"><span class="strong">{{seller.deliveryTime}}</span>分钟</div>
					</li>
				</ul>
				<div class="favorite">
					<span class="icon-favorite" :class="{active: isFavorite}" @click="toggleClass($event)"></span>
					<span class="text">{{favoriteText}}</span>
				</div>
			</div>
			<!-- 分割线 -->
			<split></split>
			<!-- 公告与活动 -->
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<!-- 公告 -->
				<div class="content-wrapper border-1px">
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<!-- 活动信息 -->
                <ul class="supports">
                    <li class="supports-item border-1px" v-if="seller.supports" v-for="(item,index) in seller.supports">
                        <!-- 活动图标 -->
                        <span class="icon" :class="supportsAlias[index]"></span>
                        <!-- 活动内容 -->
                        <span class="text">{{item.description}}</span>
                    </li>
                </ul>
			</div>
			<!-- 分割线 -->
			<split></split>
			<!-- 商家实景 -->
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" ref="picList">
						<li class="pic-item" v-for="pic in seller.pics">
							<img :src="pic" alt="商家实景" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<!-- 分割线 -->
			<split></split>
			<!-- 商家信息 -->
			<div class="infos">
				<h1 class="title">商家信息</h1>
				<ul>
					<li class="info-item border-1px" v-for="info in seller.infos">
						<span class="text">{{info}}</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import BScroll from 'better-scroll';
import {saveToLocal, fetchToLocal} from '@/assets/js/store'
import star from '@/components/star/star';
import split from '@/components/split/split';
	export default {
		data() {
			return {
				isFavorite:(() => {
					return fetchToLocal(this.seller.id, 'favorite', false);
				})()
			}
		},
		props: {
			seller: {
				type: Object
			}
		},
		computed: {
			favoriteText() {
				return this.isFavorite ? '已收藏' : '收藏';
			}
		},
		watch: {
			'seller'(){
				console.log(this.scroll)
				this.$nextTick(() => {
					this._initScrol();
					this._initPics();
				});
			}
		},
		created() {
	      this.supportsAlias = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
	    },
		mounted() {
			this.$nextTick(() => {
				this._initScrol();
				this._initPics();
			});
		},
		methods: {
			_initScrol() {
				if(!this.scroll) {
					this.scroll = new BScroll(this.$refs.seller, {
						click: true
					})
				}else {
					this.scroll.refresh();
				}
			},
			_initPics() {
				if(this.seller.pics) {
					let picWidth = 120;
					let margin = 6;
					let width = (picWidth + margin) * this.seller.pics.length - margin;
					this.$refs.picList.style.width = width + 'px';
					this.$nextTick(() => {
						if(!this.picScroll){
							this.picScroll = new BScroll(this.$refs.picWrapper, {
								scrollX: true,
								eventPassthrough: 'vertical'
							})
						}else {
							this.picScroll.refresh();
						}
					});
				}
			},
			toggleClass(event) {
				if(!event._constructed){
					return ;
				}
				this.isFavorite = !this.isFavorite;
				saveToLocal(this.seller.id,'favorite',this.isFavorite);
			}
		},
		components: {
			star,
			split
		}
	};
</script>
<style lang="less">
@import url('../../assets/less/base.less');
@import url('../../assets/less/mixin.less');
	.seller{
		position: absolute;
		left: 0;
		top: 174px;
		bottom: 0;
		width: 100%;
		overflow: hidden;
		.seller-content{
			.overview{
				position: relative;
				padding: 18px;
				.title{
					margin-bottom: 8px;
					line-height: 14px;
					font-size: 14px;
					color: rgb(7, 17, 27);
				}
				.description{
					padding-bottom: 18px;
					
					font-size: 0;
					color: rgb(77, 85, 93);
					.border-1px(rgba(7,17,27,0.1));
					.star{
						display: inline-block;
						margin-right: 8px;
						line-height: 18px;
						vertical-align: top;
					}
					.ratingCount{
						display: inline-block;
						margin-right: 12px;
						line-height: 18px;
						font-size: 10px;
					}
					.sellCount{
						display: inline-block;
						line-height: 18px;
						font-size: 10px;
					}
				}
				.remark{
					padding-top: 18px;
					display: flex;
					.block{
						flex: 1;
						text-align: center;
						border-right: 1px solid rgba(7, 17, 27, 0.1);
						&:last-child{
							border: none;
						}
						.title{
							margin-bottom: 4px;
							line-height: 10px;
							font-size: 10px;
							color: rgb(147, 153, 159);
						}
						.desc{
							line-height: 24px;
							font-size: 10px;
							font-weight: 200;
							color: rgb(7,17,27);
							.strong{
								font-size: 24px;
							}
						}
					}
				}
				.favorite{
					position: absolute;
					top: 18px;
					right: 11px;
					width: 50px;
					text-align: center;
					font-size: 0;
					.icon-favorite{
						display: block;
						margin-bottom: 4px;
						line-height: 24px;
						font-size: 24px;
						color: #D4D6D9;
						&.active{
							color: rgb(240, 20, 20);
						}

					}
					.text{
						line-height: 10px;
						font-size: 10px;
						color: rgb(77, 85, 93);
					}
				}
			}
			.bulletin{
				padding: 18px 18px 0;
				.title{
					margin-bottom: 8px;
					line-height: 14px;
					font-size: 14px;
					color: rgb(7, 17, 27);
				}
				.content-wrapper{
					padding: 0 12px 16px;
					.border-1px(rgba(7,17,27,0.1));
					.content{
						line-height: 24px;
						font-size: 12px;
						font-weight: 200;
						color: rgb(240, 20, 20);
					}
				}
				.supports{
					.supports-item{
						padding: 16px 12px;
						font-size: 0;
						.border-1px(rgba(7,17,27,0.1));
						&:last-child{
							.border-none();
						}
						.icon{
							display: inline-block;
							margin-right: 6px;
							width: 16px;
							height: 16px;
							vertical-align: top;
							background-size: 16px 16px;
							background-repeat: no-repeat;
							&.decrease {
		                        background-image: url('../../assets/images/decrease_4@2x.png');
		                    }
		                    &.discount {
		                        background-image: url('../../assets/images/discount_4@2x.png');
		                    }
		                    &.guarantee {
		                        background-image: url('../../assets/images/guarantee_4@2x.png');
		                    }
		                    &.invoice {
		                        background-image: url('../../assets/images/invoice_4@2x.png');
		                    }
		                    &.special {
		                        background-image: url('../../assets/images/special_4@2x.png');
		                    }
						}
						.text{
							line-height: 16px;
							vertical-align: top;
							font-size: 12px;
							font-weight: 200;
							color: rgb(7, 17, 27);
						}
					}
				}
			}
			.pics{
				padding: 18px;
				.title{
					margin-bottom: 12px;
					line-height: 14px;
					font-size: 14px;
					color: rgb(7, 17, 27);
				}
				.pic-wrapper{
					width: 100%;
					overflow: hidden;
					white-space: nowrap;
					.pic-list{
						font-size: 0;
						.pic-item{
							display: inline-block;
							margin-right: 6px;
							width: 120px;
							height: 90px;
							&:last-child{
								margin-right: 0;
							}
						}
					}
				}
			}
			.infos{
				padding: 18px 18px 0;
				.title{
					margin-bottom: 12px;
					line-height: 14px;
					font-size: 14px;
					color: rgb(7, 17, 27);
				}
				.info-item{
					padding: 16px 12px;
					.border-top-1px(rgba(7,17,27,0.1));
					.text{
						line-height: 16px;
						font-size: 12px;
						font-weight: 200;
						color: rgb(7, 17, 27);
					}
				}
			}
		}
	}
</style>