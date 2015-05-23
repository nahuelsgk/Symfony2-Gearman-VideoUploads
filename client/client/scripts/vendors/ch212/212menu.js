$(document).ready(function() {
    var $ch_menu = $("#ch-menu");

    if($ch_menu.length) {
        var $ch_menu_content = $ch_menu.children('.content'),
            $ch_menu_languages = $ch_menu_content.find('.lang'),
            isOpen = $ch_menu.hasClass('open'),
            menuTimeout;

        $ch_menu
            .on('mouseenter', function() {
                clearTimeout(menuTimeout);
            })
            .on('mouseleave', function() {
                if(isOpen) {
                    menuTimeout = setTimeout(toggleMenu, 4000);
                }
            })
            .find('.logo').on('click', function(event){
                event.preventDefault();
                toggleMenu();
                return false
            });

        $('body').bind('click', function(event) {
            if(isOpen && $(event.target).closest($ch_menu).length == 0) {
                toggleMenu();
            }
        });

        $ch_menu_languages.children('a').on('click', function(event){
            event.preventDefault();
            $ch_menu.find('.lang').toggleClass("active");
            return false;
        });

        var toggleMenu = function() {
            if(isOpen) {
                clearTimeout(menuTimeout);
                $ch_menu.removeClass("open");
                $ch_menu_content.slideUp('fast');
                isOpen = false;
            } else {
                $ch_menu.addClass("open");
                $ch_menu_content.slideDown('fast');
                isOpen = true;
            }
        }

        menuTimeout = setTimeout(toggleMenu, 2500);
    }
});
