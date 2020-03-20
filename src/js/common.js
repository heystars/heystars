$(document).ready(function(){
    if ($('.input-inner input').val()==="") {
        $('.input-inner input').parents('.input-wrapper').siblings('.btn-wrapper').children('button').removeClass('clear-data');
    }

    $('.speak-btn').click(function(){
        $(this).toggleClass('active');
        if ($(this).hasClass('active')) {
            $(this).attr('src',$(this).attr('src').replace('.png','-ov.png'));
        } else {
            $(this).attr('src',$(this).attr('src').replace('-ov.png','.png'));
        }
    });

    $(window).scroll(function(){
        if($(window).scrollTop() > 0) {
            $('header').addClass('scrolled');
        } else {
            $('header').removeClass('scrolled');
        }
    });

    

});