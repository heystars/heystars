'use strict';

$(document).ready(function () {
    if ($('.input-inner input').val() === "") {
        $('.input-inner input').parents('.input-wrapper').siblings('.btn-wrapper').children('button').removeClass('clear-data');
    }

    $('.speak-btn').click(function () {
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).attr('src', $(this).attr('src').replace('.png', '-ov.png'));
        } else {
            $(this).attr('src', $(this).attr('src').replace('-ov.png', '.png'));
        }
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() > 0) {
            $('header.fixed').addClass('scrolled');
        } else {
            $('header.fixed').removeClass('scrolled');
        }
    });

    $('.tab-wrapper li').click(function () {
        $(this).addClass('active').siblings('li');
        $(this).siblings('.active').children('img').attr('src', $(this).siblings('.active').children('img').attr('src').replace('-ov.png', '.png'));
        $(this).children('img').attr('src', $(this).children('img').attr('src').replace('.png', '-ov.png'));
        if ($(this).hasClass('active')) {
            $(this).siblings('li').removeClass('active');
        }
    });
});
//# sourceMappingURL=common.js.map
