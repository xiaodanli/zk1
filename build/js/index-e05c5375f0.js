"use strict";$(function(){var s=new BScroll(".content-wrap");$.ajax({url:"/api/swiper",dataType:"json",success:function(n){if(console.log(n),1===n.code){var e="";n.data.forEach(function(n){e+='<div class="swiper-slide"><img src="'+n.url+'"/></div>'}),console.log(e),$(".swiper-wrapper").append(e);new Swiper(".swiper-container",{slidesPerView:3,spaceBetween:30,pagination:{el:".swiper-pagination",clickable:!0}})}},error:function(n){console.warn(n)}}),$.ajax({url:"/api/list",dataType:"json",success:function(n){if(console.log(n),1===n.code){var e="";n.data.forEach(function(n){e+='<dl class="list-item">\n                    <dd>\n                        <h1 class="tit">'+n.title+'</h1>\n                        <p class="intro">'+n.intro+'</p>\n                        <span class="timer">'+n.timer+'</span>\n                    </dd>\n                    <dt>\n                        <img src="'+n.url+'" alt="">\n                    </dt>\n                </dl>'}),$(".list").append(e),s.refresh()}},error:function(n){console.log(n)}})});