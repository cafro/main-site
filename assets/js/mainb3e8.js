$(function () {

    new Dragdealer('just-a-slider', {
        animationCallback: function (x, y) {
            left = 50;
            var percent = Math.round(x * 100);
            $('.value').text(percent);

            if ($('.dragdealer').hasClass('active')) {
                // var widthProgress = $('.dragdealer .red-bar').css('width').split(" ");
                // var xPos = parseInt(widthProgress[0], 10);
                // var nxpos = xPos + percent;
                // console.log(xPos);
                // var widthProgress = $('.dragdealer .red-bar').css('width',percent + "%" );
                // var widthProgress = $('.dragdealer .red-bar').css('width',percent+"%");
            }

        }
    });
    $('.tsCarousel').owlCarousel({
        rtl: true,
        loop: true,
        margin: 10,
        items: 1,

        autoplay: true,
        autoplayTimeout: 9000,
        navText: ["<i class='icon-left pink1'></i>", "<i class='icon-right pink1'></i>"],
        onChange: ondragFunc,
        dots: false,
        responsive: {
            0: {
                mouseDrag: true,
                nav: false
            },
            992: {
                mouseDrag: false,
                nav: true
            }
        }
    });
    $('.carouselNews').owlCarousel({
        rtl:true,
        loop:true,
        dots: false,
        autoplay: true,
        autoplayTimeout: 7000,
        margin:10,
        nav:true,
        navText: ["<i class='icon-down-open-mini'></i>", "<i class='icon-up-open-mini'></i>"],
        mouseDrag: false,
        animateIn:'fadeInDown',
        items:1
    });
    $('.packTwoCarousel,.packTwoCarousel,.packThreeCarousel').owlCarousel({
        stagePadding: 50,
        loop: true,
        margin: 10,
        nav: true,
        rtl: true,
        items: 1
    });
    $('.cpsmbsIconTelegram').on('click', function () {
        $('.cpsmtsIconInstagram').removeClass('activeInsta');
        $('.cpSelectMode').removeClass('afterTopArrow');
        $('.cpSelectMode').addClass('beforeBottomArrow');
        $('.cpseSelectInsta').css('display', 'none');
        $('.cpseSelectTelg').css('display', 'block');

        $(this).addClass('activeTelg');
    });
    $('.cpsmtsIconInstagram').on('click', function () {
        $('.cpSelectMode').removeClass('beforeBottomArrow');
        $('.cpSelectMode').addClass('afterTopArrow');
        $('.cpsmbsIconTelegram').removeClass('activeTelg');
        $(this).addClass('activeInsta');
        $('.cpseSelectInsta').css('display', 'block');
        $('.cpseSelectTelg').css('display', 'none');
    });

    var valVal = $('.value').html("15000");
    $('.trsHasUnderCategory').on('click', function () {
        $('.trshUnderMenu').fadeOut();
        $(this).find('.trshUnderMenu').fadeIn();
    });
    $('#topSlider,#main,#footer').on('click',function (){
    $('.trshUnderMenu').fadeOut();

})

});

function ondragFunc() {

    if ($('.wow').hasClass('animated')) {
        $(this).removeClass('animated');
        $(this).removeAttr('style');
        new WOW().init();
    }

}

/*!
 * jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011–2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Depends:
 *  jquery.ui.widget.js
 *  jquery.ui.mouse.js
 */
(function ($) {

    // Detect touch support
    $.support.touch = 'ontouchend' in document;

    // Ignore browsers without touch support
    if (!$.support.touch) {
        return;
    }

    var mouseProto = $.ui.mouse.prototype,
        _mouseInit = mouseProto._mouseInit,
        _mouseDestroy = mouseProto._mouseDestroy,
        touchHandled;

    /**
     * Simulate a mouse event based on a corresponding touch event
     * @param {Object} event A touch event
     * @param {String} simulatedType The corresponding mouse event
     */
    function simulateMouseEvent(event, simulatedType) {

        // Ignore multi-touch events
        if (event.originalEvent.touches.length > 1) {
            return;
        }

        event.preventDefault();

        var touch = event.originalEvent.changedTouches[0],
            simulatedEvent = document.createEvent('MouseEvents');

        // Initialize the simulated mouse event using the touch event's coordinates
        simulatedEvent.initMouseEvent(
            simulatedType,    // type
            true,             // bubbles
            true,             // cancelable
            window,           // view
            1,                // detail
            touch.screenX,    // screenX
            touch.screenY,    // screenY
            touch.clientX,    // clientX
            touch.clientY,    // clientY
            false,            // ctrlKey
            false,            // altKey
            false,            // shiftKey
            false,            // metaKey
            0,                // button
            null              // relatedTarget
        );

        // Dispatch the simulated event to the target element
        event.target.dispatchEvent(simulatedEvent);
    }

    /**
     * Handle the jQuery UI widget's touchstart events
     * @param {Object} event The widget element's touchstart event
     */
    mouseProto._touchStart = function (event) {

        var self = this;

        // Ignore the event if another widget is already being handled
        if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
            return;
        }

        // Set the flag to prevent other widgets from inheriting the touch event
        touchHandled = true;

        // Track movement to determine if interaction was a click
        self._touchMoved = false;

        // Simulate the mouseover event
        simulateMouseEvent(event, 'mouseover');

        // Simulate the mousemove event
        simulateMouseEvent(event, 'mousemove');

        // Simulate the mousedown event
        simulateMouseEvent(event, 'mousedown');
    };

    /**
     * Handle the jQuery UI widget's touchmove events
     * @param {Object} event The document's touchmove event
     */
    mouseProto._touchMove = function (event) {

        // Ignore event if not handled
        if (!touchHandled) {
            return;
        }

        // Interaction was not a click
        this._touchMoved = true;

        // Simulate the mousemove event
        simulateMouseEvent(event, 'mousemove');
    };

    /**
     * Handle the jQuery UI widget's touchend events
     * @param {Object} event The document's touchend event
     */
    mouseProto._touchEnd = function (event) {

        // Ignore event if not handled
        if (!touchHandled) {
            return;
        }

        // Simulate the mouseup event
        simulateMouseEvent(event, 'mouseup');

        // Simulate the mouseout event
        simulateMouseEvent(event, 'mouseout');

        // If the touch interaction did not move, it should trigger a click
        if (!this._touchMoved) {

            // Simulate the click event
            simulateMouseEvent(event, 'click');
        }

        // Unset the flag to allow other widgets to inherit the touch event
        touchHandled = false;
    };

    /**
     * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
     * This method extends the widget with bound touch event handlers that
     * translate touch events to mouse events and pass them to the widget's
     * original mouse event handling methods.
     */
    mouseProto._mouseInit = function () {

        var self = this;

        // Delegate the touch handlers to the widget's element
        self.element.bind({
            touchstart: $.proxy(self, '_touchStart'),
            touchmove: $.proxy(self, '_touchMove'),
            touchend: $.proxy(self, '_touchEnd')
        });

        // Call the original $.ui.mouse init method
        _mouseInit.call(self);
    };

    /**
     * Remove the touch event handlers
     */
    mouseProto._mouseDestroy = function () {

        var self = this;

        // Delegate the touch handlers to the widget's element
        self.element.unbind({
            touchstart: $.proxy(self, '_touchStart'),
            touchmove: $.proxy(self, '_touchMove'),
            touchend: $.proxy(self, '_touchEnd')
        });

        // Call the original $.ui.mouse destroy method
        _mouseDestroy.call(self);
    };

})(jQuery);
