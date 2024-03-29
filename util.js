'use strict';
// utils.js

const apiEndPoint = 'https://playable-web.cdn.prismic.io/api/v2';

function getApi(ctx){
	
	let request = new XMLHttpRequest();
	
	request.open('GET', apiEndPoint, true);
	
	request.onload = function () {
		var data = JSON.parse(this.response);
		data.refs.forEach((ref) => {
			if(ref.isMasterRef){
				// console.log(ref.ref);
				getKidstrumentsFromPrismic(ref.ref, ctx);
			}
		});
	}

	// Send request
	request.send();
}

let totalSize;
let results = [];

function getKidstrumentsFromPrismic(masterRef, ctx){
	let predicates = '[[at(document.type,"kidstrument")]]';
	let queryEndPoint = apiEndPoint + '/documents/search?ref=' + masterRef + '&q=' + predicates + '&pageSize=100'; 
	makeRequest(queryEndPoint, ctx);	
}

function makeRequest(queryEndPoint, ctx){
	let request = new XMLHttpRequest();
	request.open('GET', queryEndPoint, true);
	
	request.onload = function(){
		var data = JSON.parse(this.response);
		
		results = results.concat(data.results);

		if(data.next_page != null){
			makeRequest(data.next_page, ctx);
		}else{
			console.log('received ', results.length, ' results' );
			ctx.setKidstruments(results);
		}
	}

	request.send();
}



function luma(img) {
	let newImg = img.get();

	for (let y = 0; y < newImg.height; y++) {
		for (let x = 0; x < newImg.width; x++) {
			let index = (x + y * newImg.width) * 4;
			let r = newImg.pixels[index + 0];
			let g = newImg.pixels[index + 1];
			let b = newImg.pixels[index + 2];
			let a = newImg.pixels[index + 3];

			let luma = r * 0.299 + g * 0.587 + b * 0.0114;

			newImg.pixels[index + 0] = luma;
			newImg.pixels[index + 1] = luma;
			newImg.pixels[index + 2] = luma;
		}
	}
	newImg.updatePixels();

	return newImg;
}



function getNormMouse() {
	let normMouseX = mouseX / width;
	let normMouseY = mouseY / height;
	let obj = {
		x: normMouseX,
		y: normMouseY
	};
	return obj;
}



function getElapsed() {
	let endTime = new Date();
	return endTime - startTime; //in ms
}



// function getParameterByName(name, url) {
// 	if (!url) url = window.location.href;
// 	name = name.replace(/[\[\]]/g, '\\$&');
// 	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
// 			results = regex.exec(url);
// 	if (!results) return null;
// 	if (!results[2]) return '';
// 	return decodeURIComponent(results[2].replace(/\+/g, ' '));
// }



function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (pair[0] == variable) {
			return pair[1];
		}
	}
	return false;
}



function getUrlName() {
	var query = window.location.search.substring(1).toLowerCase(); 
	return query;
}