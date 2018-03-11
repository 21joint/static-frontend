(function ($) {


    var countCheck = function () {
        return $('.agree_checkbox:checked').length;
    };

    $('.agree_checkbox').on('change', function () {

        var a = countCheck();
        if (a === 4) {
            $('.btn-agree').attr('disabled', false);
        }
        else {
            $('.btn-agree').attr('disabled', true);
        }
    });

    // $('#agencies_all_1').on('change', function (e) {
    //
    //     if($(this).parent().find('input').is(':checked')) {
    //         something();
    //     }
    // })
    // $("#categories_all").click(function(){
    //     $('input:checkbox').not(this).prop('checked', this.checked);
    // });
    $('body')
        .on('click','.checked-all', function (e) {
        var $checked = $(e.currentTarget).closest('.row').find('input:checkbox');
        $checked.not(this).prop('checked', this.checked);
    })
        .on('click', '.navbar_toggler',  function () {
            $('body').toggleClass('menu_open');
        });


})(jQuery);
