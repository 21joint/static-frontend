(function ($) {
  
  'use strict'
  
  let $profileCarousel = $('.single-profile--carousel'),
    $profileLikeButton = $('.single-profile--likebtn'),
    $profileInfoButton = $('.single-profile--infobtn'),
    $filterDropdown = $('.search-filter--ul button'),
    $ageSlider = $('.ui-age-slider'),
    $priceSlider = $('.ui-slider-price'),
    $budgetSlider = $('#slider-budget'),
    $fixedNav = $('.single-profile--fixednav'),
    $sectionsWrapper = $('.single-profile--sections'),
    $singleInflModal = $('.modal-single--influencer'),
    $profileTabsNav = $('.find-influencer--navtabs'),
    $fixedNavHeight,
    $sectionsWrapperOffset,
    $contentOffsetY,
    _searchFilter = document.getElementById('searchFilter'),
    isTouch = function () {
      return !!window.ontouchstart
    },
    tabsCarousel = function () {
      
      let $clonedTabsNav = $profileTabsNav.clone()
      
      $clonedTabsNav.appendTo($profileTabsNav.parent()).
      removeClass('py-3').
      addClass('py-4').
      addClass('owl-carousel d-md-none').
      find('[data-toggle="tab"]').
      each(function (i, el) {
        el.removeAttribute('data-toggle')
      })
      
      $profileTabsNav.addClass('d-none d-md-flex')
      
      $clonedTabsNav.owlCarousel({
        autoWidth: true,
        center: true,
        loop: true,
        slideBy: 1,
        stagePadding: 90,
        margin: 30,
        navSpeed: 400,
        dragSpeed: 400,
        nav: true,
        navText: [
          '<i class="icon-arrow-left-bold"></i>',
          '<i class="icon-arrow-right-bold"></i>'],
      }).on('translated.owl.carousel', function (e) {
        console.log(e)
        let _targetId = $clonedTabsNav.find('.active.center .nav-link').
          attr('href'),
          $targetTab = $profileTabsNav.find('[data-toggle="tab"][href="' +
            _targetId + '"]')
        $targetTab.tab('show')
      }).on('click', '.nav-link', function (e) {
        e.preventDefault()
        let $owl = $(e.target).parents('.owl-carousel'),
          $clickedSlide = $(e.target).parents('.owl-item'),
          $currentSlide = $owl.find('.owl-item.active.center'),
          direction
        
        if (($clickedSlide.index() - $currentSlide.index()) < 0) {
          direction = 'prev.owl.carousel'
        }
        else {
          direction = 'next.owl.carousel'
        }
        
        $owl.trigger(direction)
      })
      
      $('.find-influencer--navtabs [data-toggle="tab"]').
      on('show.bs.tab', function (e) {
        
        $profileCarousel.trigger('destroy.owl.carousel')
        
        let $target = $(e.currentTarget),
          $targetHref = $target.attr('href')
        
        setTimeout(function () {
          $($targetHref).find($profileCarousel).owlCarousel({
            nav: true,
            loop: true,
            items: 1,
            navText: [
              '<i class="icon-arrow-left-bold"></i>',
              '<i class="icon-arrow-right-bold"></i>'],
          })
        })
        
      })
    },
    updateOffsets = function () {
      $fixedNavHeight = $fixedNav.outerHeight()
      $sectionsWrapperOffset = $sectionsWrapper.position().top
      $contentOffsetY = parseInt(
        $singleInflModal.find('.modal-dialog').css('margin-top'), 10) + 1
    },
    likeProfileToggle = function (profile, callback) {
      //dummy function to make ajax call to like profile
      console.warn('TODO: make ajax call to like profile', console)
      
      if (profile.hasClass('in-likes')) {
        
        profile.removeClass('in-likes')
      }
      else {
        profile.addClass('in-likes')
      }
      
      if (typeof callback === 'function')
        callback()
    },
    refreshScrollSpy = function (element) {
      let cacheScrolltop = $(element).scrollTop()
      $(element).scrollTop(0).scrollspy('refresh').scrollTop(cacheScrolltop)
    },
    createRange = function (element, options) {
      element.slider(options).draggable()
      element.val(element.slider('values', 0) + '-' +
        element.slider('values', 1) + ' years')
    }
  
  $.extend($.easing, {
    easeNav: function (t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    },
  })
  
  $(window).on('resize', function () {
    updateOffsets()
    refreshScrollSpy('.modal-single--influencer')
  })
  
  // createRange($ageSlider, {
  //     range: true,
  //     min: options.min,
  //     max: options.max,
  //     values: [18, 28],
  //     slide: function (event, ui) {
  //         $(this).parent().find('.ui-age-value').val(ui.values[0] + " - " + ui.values[1] + "years ");
  //     }
  // });
  
  console.log(_searchFilter)
  
  $filterDropdown.dropdown({
    boundary: 'viewport',
  })
  
  $ageSlider.slider({
    range: true,
    min: 18,
    max: 65,
    values: [18, 28],
    slide: function (event, ui) {
      $(this).
      parent().
      find('.ui-age-value').
      val(ui.values[0] + ' - ' + ui.values[1] + '+ years ')
    },
  }).draggable()
  
  $('.ui-age-value').
  val($ageSlider.slider('values', 0) + '-' + $ageSlider.slider('values', 1) +
    ' years')
  
  $priceSlider.slider({
    range: true,
    min: 0,
    max: 2000,
    values: [50, 500],
    step: 50,
    slide: function (event, ui) {
      $(this).
      parent().
      find('input').
      val('$ ' + ui.values[0] + '-' + ui.values[1])
    },
  }).draggable()
  
  $priceSlider.parent().
  find('input').
  val('$' + $priceSlider.slider('values', 0) + '-' +
    $priceSlider.slider('values', 1))
  
  $budgetSlider.slider({
    min: 0,
    max: 1500,
    value: 500,
    orientation: 'horizontal',
    range: 'min',
    animate: true,
    slide: function (event, ui) {
      $('#budget').val('$' + ui.value)
    },
  }).draggable()
  
  $('#budget').val('$' + $budgetSlider.slider('value')).draggable()
  
  $('.badge-outline-dark').tooltip({})
  
  $profileLikeButton.on('click', function () {
    let _self = $(this),
      _profile = _self.parents('.single-profile--box')
    
    likeProfileToggle(_profile)
  })
  
  $singleInflModal.on('shown.bs.modal', function () {
    updateOffsets()
    $(this).scrollspy({
      target: '#singleInfluencerNav',
      offset: $fixedNavHeight,
    })
  }).on('scroll', function (e) {
    let $target = $(this),
      distance = $target.scrollTop(),
      offset = $sectionsWrapperOffset - $fixedNavHeight + $contentOffsetY
    
    if (distance >= offset) {
      $fixedNav.addClass('down')
    }
    else {
      $fixedNav.removeClass('down')
    }
  })
  
  $('body').
  on('click', '.single-profile--fixednav .nav-link[href^="#"]', function (e) {
    
    e.preventDefault()
    let $target = $($(this).attr('href'))
    
    $singleInflModal.animate({
      'scrollTop': $target.position().top - $fixedNavHeight +
      $contentOffsetY * 2,
    }, 700, 'easeNav')
  }).
  on('click', '.search-filter--ul .dropdown-menu', function (e) {
    if (!$(e.target).is('.btn-cancel')) {
      e.stopPropagation()
    }
  }).
  on('click', '.single-profile--infobtn', function (e) {
    let _profile = $(e.currentTarget).parents('.single-profile--box'),
      _slider = _profile.find('.owl-carousel')
    _slider.trigger('to.owl.carousel', _slider.data(
      'owl.carousel')._items.length - 1)
  })
  
  $('.search-filter--ul li').on('shown.bs.dropdown', function (e) {
    $('body').addClass('filter-open')
  }).on('hidden.bs.dropdown', function (e) {
    $('body').removeClass('filter-open')
  })
  
  $('.btn-cancel').on('hidden.bs.dropdown', function (e) {
    $('body').removeClass('filter-open')
  })
  
  $profileCarousel.owlCarousel({
    loop: true,
    nav: true,
    items: 1,
    navText: [
      '<i class="icon-arrow-left-bold"></i>',
      '<i class="icon-arrow-right-bold"></i>'],
  })
  tabsCarousel()
  
})(jQuery)