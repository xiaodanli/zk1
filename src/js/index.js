$(function() {
    var contentScroll = new BScroll('.content-wrap');

    $.ajax({
        url: '/api/swiper',
        dataType: 'json',
        success: function(res) {
            console.log(res);
            if (res.code === 1) {
                var str = '';
                res.data.forEach(function(item) {
                    str += '<div class="swiper-slide"><img src="' + item.url + '"/></div>'
                })
                console.log(str);
                $('.swiper-wrapper').append(str);
                var swiper = new Swiper('.swiper-container', {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                });
            }
        },
        error: function(error) {
            console.warn(error)
        }
    })

    $.ajax({
        url: '/api/list',
        dataType: 'json',
        success: function(res) {
            console.log(res);
            if (res.code === 1) {
                var listStr = '';
                res.data.forEach(function(item) {
                    listStr += `<dl class="list-item">
                    <dd>
                        <h1 class="tit">${item.title}</h1>
                        <p class="intro">${item.intro}</p>
                        <span class="timer">${item.timer}</span>
                    </dd>
                    <dt>
                        <img src="${item.url}" alt="">
                    </dt>
                </dl>`;
                })
                $('.list').append(listStr);
                contentScroll.refresh();
            }
        },
        error: function(error) {
            console.log(error)
        }
    })
})