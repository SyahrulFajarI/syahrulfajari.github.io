function lazyload() {
    var loadingBG = '';
    $('img[data-src]').each(function() {
        $(this).attr('style', 'opacity: 0;');
        var data_img = $(this).attr('data-src');
        $(this)
            .attr('src', data_img)
            .wrap('<div class="lazy-img-wrap" style="background:' + loadingBG + '"></div>');
        $(this).bind('load', function() {
            $(this).addClass('loaded').animate({
                    opacity: "1"
                }, 1000)
                .removeAttr('data-src')
                .unwrap();
        });
    });

    $('*[data-bg]').each(function() {
        var data_bg = $(this).attr('data-bg');
        $(this)
            .attr('style', 'position:relative;')
            .prepend('<div class="lazy-bg-placeholder" style="position:absolute;z-index:auto;top:0;left:0;right:0;bottom:0;background:' + loadingBG + '"><img src="' + data_bg + '" style="display:none;"/></div>');
        $('.lazy-bg-placeholder img', this).bind('load', function() {
            $(this)
                .parents('*[data-bg]')
                .attr('style', 'background-image:url(' + data_bg + ');position:relative;')
                .removeAttr('data-bg')
                .find('.lazy-bg-placeholder').fadeOut(1000, function() {
                    $(this).remove();
                });
        });
    });
}
$(window).scroll(function() {
    $('section').each(function() {
        var id = $(this).attr('id');
        if ($(window).scrollTop() > $('#' + id).offset().top - $('#header').height() - 100) {
            $('.menu ul li a').removeClass('current');
            $('.menu ul li a[href^="#' + id + '"').addClass('current');
        } else {
            $('.menu ul li a[href^="#' + id + '"').removeClass('current');
        }
    });
    if ($(window).scrollTop() >= $('html').offset().top + 1) {
        $('#header').addClass('onscroll');
    } else {
        $('#header').removeClass('onscroll');
    }
});

$(document).ready(function() {
    $('#header .menuBtn').click(function() {
        $('#header .menu').toggleClass('active');
    });
    $('.menu ul li a[href^="#"], a.scroll[href^="#"]').click(function(e) {
        e.preventDefault();
        var hashID = $(this).attr('href').replace(/^.*?(#|$)/, '');
        var sectionTop = $('#' + hashID).offset().top - $('#header').height();
        $("html, body").animate({ scrollTop: sectionTop }, 500);
    });
    $('.tab .tab-menu li:first').addClass('active');
    $('.tab .tab-menu a').click(function(e) {
        e.preventDefault();
        var hashID = $(this).attr('href').replace(/^.*?(#|$)/, '');
        $(this).parents('.tab').find('.tab-body').hide();
        $(this).parents('.tab').find('li').removeClass('active');
        $(this).parents('li').addClass('active');
        $(this).parents('.tab').find('.tab-body#' + hashID).fadeIn(1000);
        $("html, body").animate({ scrollTop: $('.tab').offset().top - $('#header').height() - 20 }, 1000);
    });
    if ($('#slide-ulasan').html() != undefined) {
        $('#slide-ulasan .owl-carousel').owlCarousel({
            loop: true,
            center: true,
            navText: ["<i class='icon ion-ios-arrow-back'></i>", "<i class='icon ion-ios-arrow-forward'></i>"],
            autoHeight: false,
            responsive: {
                // breakpoint from 0 up
                0: {
                    items: 1,
                    stagePadding: 60,
                    margin: 10,
                    nav: true,
                },
                // breakpoint from 480 up
                769: {
                    items: 3,
                    nav: false,
                },
                // breakpoint from 768 up
                1069: {
                    margin: 20,
                }
            }
        });
    }
    
    $('.poptamvBtn').one('click', function() {
        $('body').addClass('hideScroll');
        var title = $(this).attr('data-title');
        var target = '#' + $(this).attr('data-target');
        $(target).addClass('open');
        $(target).find('.titletamv-content').html(title);
        if ($(this).attr('data-iframe') != null) {
            var iframe = $(this).attr('data-iframe');
            $(target).find('iframe').remove();
            $(target).find('.content').prepend('<iframe src="' + iframe + '" />');
        }
    });
    $('.poptamvBtn').on('click', function() {
        $('body').addClass('hideScroll');
        var title = $(this).attr('data-title');
        var target = '#' + $(this).attr('data-target');
        $(target).addClass('open');
        $(target).find('.titletamv-content').html(title);
        if ($(this).attr('data-width') != null) {
            var width = $(this).attr('data-width');
            $(target).find('.wrap').attr('style', 'max-width:' + width + 'px!important;')
        }
        $(target).find('.poptamv-img').remove();
        if ($(this).attr('data-img') != null) {
            var img = $(this).attr('data-img');
            $(target).find('.content').prepend('<img class="poptamv-img" style="width:100%;height:auto;" src="' + img + '" />');
        }
        if ($(this).attr('data-time') != null) {
            var time = $(this).attr('data-time');
            $(target).find('.poptamv-time').remove();
            $(target).find('.content').append('<div class="poptamv-time poptamv-wrap">' + time + '</div>');
        }
        if ($(this).attr('data-caption') != null) {
            var caption = $(this).attr('data-caption');
            $(target).find('.poptamv-caption').remove();
            $(target).find('.content').append('<div class="poptamv-caption poptamv-wrap">' + caption + '</div>');
        }
    });

    $('.poptamv .closeTamv').on('click', function() {
        $('body').removeClass('hideScroll');
        $(this).parents('.poptamv').removeClass('open');
        $(this).parents('.poptamv').find('iframe').each(function() {
            this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*')
        });
    });

    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            $('.poptamv .closeTamv').trigger('click');
        }
    });

});

$(window).bind('load', function() {
    $('#fitur .grid').each(function() { // the containers for all your galleries
        $(this).magnificPopup({
            delegate: 'a.lightbox:has(img)', // the selector for gallery item
            type: 'image',
            preload: [1, 2],
            gallery: {
                enabled: true
            },
            callbacks: {
                beforeOpen: function() {
                    // just a hack that adds mfp-anim class to markup 
                    this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
                    this.st.mainClass = this.st.el.attr('data-effect');
                }
            },
            closeOnContentClick: true,
            midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
        });
    });
    lazyload();
    $('#fitur .grid .item').each(function() {
        var img = $('img', this).attr('data-src');
        var title = $('h3', this).text();
        var desc = $('p', this).text();
        if($(this).attr('href') == '') {
            $(this).addClass('lightbox');
            $(this).attr('href', img);
            $(this).attr('data-title', '<b>' + title + '</b> - ' + desc);
        } else {
            $(this).attr('target', '_blank');
        }
        $('.thumbImg', this).css('background-image', 'url(' + img + ')');
    });
});

var messageBody = document.querySelector('.chat');
messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
