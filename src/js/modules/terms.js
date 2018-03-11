(function ($) {

    var countCheck = function () {
        return $('.agree_checkbox:checked').length;
    };

    $('.agree_checkbox').on('change', function () {

        var a = countCheck();
        if (a === 4) {
            $('.btn-agree').prop('disabled', false);
        }
        else {
            $('.btn-agree').prop('disabled', true);
        }
    });


})(jQuery);
