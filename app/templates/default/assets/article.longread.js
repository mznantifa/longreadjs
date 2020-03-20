var current_page = window.location.hash.replace('#', '');
var og_title = document.title;
function movePage() {
    if(current_page) {
        document.title = $('.page-section#'+current_page).data('page-title') + ' - ' + og_title;
        $('.page-section:not(#'+current_page+')').hide();
        $('.page-section#'+current_page).show();
    } else {
        document.title = $('.page-section:first').data('page-title') + ' - ' + og_title;
        $('.page-section:not(:first)').hide();
        $('.page-section:first').show();
    }
}
$(document).ready(function() {
    movePage();
    $(window).on('hashchange', function(e) {
        current_page = window.location.hash.replace('#', '');
        movePage();
    });
    $('.menu-slide-menu > li > a').click(function(e) {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#all-pages-container").offset().top
        }, 800);
    });
});