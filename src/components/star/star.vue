<template>
    <div class="star" :class="startype">
        <span v-for="itemClass in itemClasses" class="star-item" :class="itemClass"></span>
    </div>
</template>
<script>
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';
export default {
    props: {
        size: {
            type: Number
        },
        score: {
            type: Number
        },
        count: {
            type: Number
        }
    },
    computed: {
        startype() {
            return 'star-' + this.size;
        },
        itemClasses() {
            let result = [];
            let score = Math.floor(this.score * 2) / 2;
            let integer = Math.floor(score);
            let hasHalfStar = score % 1 !== 0;
            for (let i = 0; i < integer; i++) {
            	result.push(CLS_ON);
            }
            if(hasHalfStar){
            	result.push(CLS_HALF);
            }
            while(result.length < this.count){
            	result.push(CLS_OFF);
            }
            return result;

        }
    }
};
</script>
<style lang="less">
	.star{
		&.star-48{
			.star-item{
				display: inline-block;
				width: 20px;
				height: 20px;
				margin-right: 22px;
				background-size: 20px 20px;
				background-repeat: no-repeat;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					background-image: url('../../assets/images/star48_on@2x.png');
				}
				&.half{
					background-image: url('../../assets/images/star48_half@2x.png');
				}
				&.off{
					background-image: url('../../assets/images/star48_off@2x.png');
				}
			}
		}
		&.star-36{
			.star-item{
				display: inline-block;
				width: 15px;
				height: 15px;
				margin-right: 6px;
				background-size: 15px 15px;
				background-repeat: no-repeat;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					background-image: url('../../assets/images/star36_on@2x.png');
				}
				&.half{
					background-image: url('../../assets/images/star36_half@2x.png');
				}
				&.off{
					background-image: url('../../assets/images/star36_off@2x.png');
				}
			}
		}
		&.star-24{
			.star-item{
				display: inline-block;
				width: 10px;
				height: 10px;
				margin-right: 3px;
				background-size: 10px 10px;
				background-repeat: no-repeat;
				&:last-child{
					margin-right: 0;
				}
				&.on{
					background-image: url('../../assets/images/star24_on@2x.png');
				}
				&.half{
					background-image: url('../../assets/images/star24_half@2x.png');
				}
				&.off{
					background-image: url('../../assets/images/star24_off@2x.png');
				}
			}
		}
	}
</style>
