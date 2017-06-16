export function parseUrl() {
	let obj = {};
	// 得到url
	let url = location.search;
	// 解析字符串的正则表达式
	let reg = /[?&][^?&]+=[^?&]+/g;
	let urlArr = url.match(reg);

	urlArr.forEach((item) => {
		let tempUrlArr = item.substring(1).split('=');
		let key = decodeURIComponent(tempUrlArr[0]);
		let value = decodeURIComponent(tempUrlArr[1]);
		obj[key] = value;
	});
	return obj;
}