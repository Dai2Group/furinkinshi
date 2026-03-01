document.addEventListener('DOMContentLoaded', function (event) {
    resizeIframe();
});

window.addEventListener('resize', resizeIframe);

function resizeIframe() {
    var iframe = $('.content__iframe');
    iframe.width($('.content__sample_img').width());
    iframe.height(iframe.width() * 0.5625);
};