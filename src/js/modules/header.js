(function ($) {


    $(document).on('click', '.right_nav .dropdown-menu', function (e) {
        console.log(e);
        e.stopPropagation();
    });


})(jQuery);