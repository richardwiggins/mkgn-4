// initialise plugins
$(document).ready(function() {
	
	//$( "button" ).wrapInner( "<div class='new'></div>");
	
	$('.tito-submit').wrapInner("<span class='text'></span>");
	
	
	// http://codyhouse.co/gem/full-screen-pop-out-navigation/
	//if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
	var MQL = 900;

	//primary navigation slide-in effect
	if($(window).width() > MQL) {
		var headerHeight = $('.header').height();
		$(window).on('scroll',
		{
	        previousTop: 0
	    }, 
	    function () {
		    var currentTop = $(window).scrollTop();
		    //check if user is scrolling up
		    if (currentTop < this.previousTop ) {
		    	//if scrolling up...
		    	if (currentTop > 0 && $('.header').hasClass('is-fixed')) {
		    		$('.header').addClass('is-visible');
		    	} else {
		    		$('.header').removeClass('is-visible is-fixed');
		    	}
		    } else {
		    	//if scrolling down...
		    	$('.header').removeClass('is-visible');
		    	if( currentTop > headerHeight && !$('.header').hasClass('is-fixed')) $('.header').addClass('is-fixed');
		    }
		    this.previousTop = currentTop;
		});
	}


	//open/close primary navigation
	function openCloseNav() {
		// Removed otherwise the anchor links won't work
		//event.preventDefault();
		$('.primary__nav__trigger__icon').toggleClass('is-clicked'); 
		$('.header').toggleClass('menu-is-open');
		//$('.primary__nav__search__trigger').toggleClass('is-clicked');
		//$('.header__search-form').find('input[type="search"]').focus();
		
		//in firefox transitions break when parent overflow is changed, so we need to wait for the end of the trasition to give the body an overflow hidden
		if( $('.primary__nav').hasClass('is-visible') ) {
			$('.primary__nav').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				$('body').removeClass('overflow-hidden');
			});
		} else {
			$('.primary__nav').addClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
				$('body').addClass('overflow-hidden');
			});	
		}
	}
	
	$('.primary__nav__trigger').on('click', function(){
		openCloseNav();
	});
	
	$('.primary__nav a').on('click', function(){
		$('.primary__nav__trigger__icon').toggleClass('is-clicked'); 
		$('.header').toggleClass('menu-is-open');
		$('.primary__nav').removeClass('is-visible').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
			$('body').removeClass('overflow-hidden');
		});
	});
	
	$(document).keydown(function(e){
        if(e.keyCode == 27) {
            if ($('.primary__nav').hasClass('is-visible')) {
                openCloseNav();
            }
        }
    });
	
	
    //set animation timing
    var animationDelay = 6000;

    initHeadline();


    function initHeadline() {
        //insert <i> element for each letter of a changing word
        singleLetters($('.headline.letters').find('b'));
        //initialise headline animation
        animateHeadline($('.headline'));
    }

    function singleLetters($words) {
        $words.each(function () {
            var word = $(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            for (i in letters) {
                if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
            }
            var newLetters = letters.join('');
            word.html(newLetters);
        });
    }

    function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function () {
            var headline = $(this);

            //trigger animation
            setTimeout(function () {
                hideWord(headline.find('.is-visible').eq(0))
            }, duration);
        });
    }

    function hideWord($word) {
        var nextWord = takeNext($word);

        switchWord($word, nextWord);
        setTimeout(function () {
            hideWord(nextWord)
        }, animationDelay);
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass('in').addClass('out');

        if (!$letter.is(':last-child')) {
            setTimeout(function () {
                hideLetter($letter.next(), $word, $bool, $duration);
            }, $duration);
        } else if ($bool) {
            setTimeout(function () {
                hideWord(takeNext($word))
            }, animationDelay);
        }

        if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        }
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass('in').removeClass('out');

        if (!$letter.is(':last-child')) {
            setTimeout(function () {
                showLetter($letter.next(), $word, $bool, $duration);
            }, $duration);
        } else {
            if ($word.parents('.headline').hasClass('type')) {
                setTimeout(function () {
                    $word.parents('.words__wrapper').addClass('waiting');
                }, 200);
            }
            if (!$bool) {
                setTimeout(function () {
                    hideWord($word)
                }, animationDelay)
            }
        }
    }

    function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
    }

    function takePrev($word) {
        return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
    }

    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
    }
	
	
	///// Adding wrappring <b> tags to Tito button
	
	//$('.tito-submit').wrapInner('<div class="new"></div>');
	
	
	
	///// Ajaxing for your SVG Sprite - https://css-tricks.com/ajaxing-svg-sprite/
	$.get("/img/icons/svg-sprite.svg", function(data) {
		var div = document.createElement('div');
		$(div).addClass('svg__sprite');
		div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
		document.body.insertBefore(div, document.body.childNodes[0]);
	});
	
	
	///// WOW.js Animations
	
	var wow = new WOW({
		boxClass: 'animateIn',      // animated element css class (default is wow)
		//animateClass: 'animated', // animation css class (default is animated)
		offset: 200,          // distance to the element when triggering the animation (default is 0)
		mobile: false
	});
	wow.init();
	
	if ($('body').hasClass('home') || $('body').hasClass('partner-us')) {
		
		
		$('#quotes').slick({
			infinite: true,
			arrows: false,
			autoplay: true,
			autoplaySpeed: 6000,
			fade: true,
			cssEase: 'linear',
			draggable: false
		});
	}
});
