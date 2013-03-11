(function() {
  var $, SlideListener, defaults, pluginName,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  $ = jQuery;

  pluginName = 'touchSlide';

  defaults = {
    threshold: 10,
    next: '.next',
    prev: '.prev'
  };

  SlideListener = (function() {

    function SlideListener(elem, options) {
      this.disableButton = __bind(this.disableButton, this);

      this.prev = __bind(this.prev, this);

      this.next = __bind(this.next, this);

      this.end = __bind(this.end, this);

      this.move = __bind(this.move, this);

      this.start = __bind(this.start, this);

      this.unlisten = __bind(this.unlisten, this);

      this.listen = __bind(this.listen, this);

      this.maxWidthListener = __bind(this.maxWidthListener, this);

      var _this = this;
      this.elem = $(elem);
      this.settings = $.extend({}, defaults, options);
      this.start_x = 0;
      this.start_y = 0;
      this.delta_x = 0;
      this.delta_y = 0;
      this._name = pluginName;
      this._listening = false;
      if (this.settings.max_width !== void 0) {
        this.maxWidthListener();
        $(window).resize(function() {
          return _this.maxWidthListener();
        });
      } else {
        this.listen();
      }
      this.disableButton();
    }

    SlideListener.prototype.isTouchEnabled = function() {
      return !!(__indexOf.call(window, 'ontouchstart') >= 0);
    };

    SlideListener.prototype.maxWidthListener = function() {
      if ($(window).width() > this.settings.max_width && this._listening) {
        return this.unlisten();
      } else if ($(window).width() <= this.settings.max_width && !this._listening) {
        return this.listen();
      }
    };

    SlideListener.prototype.listen = function() {
      this._listening = true;
      if (this.isTouchEnabled()) {
        this.elem.on('touchstart', this.start);
        this.elem.on('touchmove', this.move);
        this.elem.on('touchend', this.end);
        $(this.settings.next).on('touchend', this.next);
        return $(this.settings.prev).on('touchend', this.prev);
      } else {
        $(this.settings.next).on('click', this.next);
        return $(this.settings.prev).on('click', this.prev);
      }
    };

    SlideListener.prototype.unlisten = function() {
      this._listening = false;
      if (this.isTouchEnabled()) {
        this.elem.unbind('touchstart touchmove touchend');
        $(this.settings.next).unbind('touchend', this.next);
        return $(this.settings.prev).unbind('touchend', this.prev);
      } else {
        $(this.settings.next).unbind('click', this.next);
        return $(this.settings.prev).unbind('click', this.prev);
      }
    };

    /*
    	#	Event fired on touchstart
    */


    SlideListener.prototype.start = function(e) {
      var touch;
      if (typeof this.settings.onTouchSlideStart === 'function') {
        this.settings.onTouchSlideStart.call(this);
      }
      touch = e.originalEvent.touches[0];
      this.start_x = touch.pageX;
      this.start_y = touch.pageY;
      return this.elem.children().css({
        '-moz-transition': '0',
        '-webkit-transition': '0',
        'transition': '0'
      });
    };

    /*
    	# Event fired on touchmove
    */


    SlideListener.prototype.move = function(e) {
      var delta_x_pct, touch;
      touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
      this.delta_x = touch.pageX - this.start_x;
      this.delta_y = touch.pageY - this.start_y;
      if (Math.abs(this.delta_x) > Math.abs(this.delta_y) && Math.abs(this.delta_x) > 10) {
        e.preventDefault();
        delta_x_pct = this.delta_x / this.elem.width() * 100;
        this.elem.children('.active').css({
          'left': delta_x_pct + '%'
        });
        if (this.delta_x < 0) {
          this.elem.children('.active').next().css({
            'left': delta_x_pct + 100 + '%'
          });
        }
        if (this.delta_x > 0) {
          return this.elem.children('.active').prev().css({
            'left': delta_x_pct - 100 + '%'
          });
        }
      }
    };

    /*
    	# Event fired on touchend
    */


    SlideListener.prototype.end = function(e) {
      var min_threshold;
      if (typeof this.settings.onTouchSlideEnd === 'function') {
        this.settings.onTouchSlideEnd.call(this);
      }
      this.elem.children().css({
        '-moz-transition': '',
        '-webkit-transition': '',
        'transition': '',
        'left': ''
      });
      min_threshold = Math.abs(this.delta_x / this.elem.width() * 100);
      if (this.delta_x < 0 && min_threshold > this.settings.threshold) {
        this.next();
      }
      if (this.delta_x > 0 && min_threshold > this.settings.threshold) {
        this.prev();
      }
      if (Math.abs(this.delta_x) > 3) {
        e.preventDefault();
      }
      return this.delta_x = 0;
    };

    /*
    	# If there's a next slide, make it active
    */


    SlideListener.prototype.next = function() {
      if (this.elem.children('.active').next().length) {
        this.elem.children('.active').removeClass('active').next().addClass('active');
      }
      return this.disableButton();
    };

    /*
    	# If there's a previous slide, make it active
    */


    SlideListener.prototype.prev = function() {
      if (this.elem.children('.active').prev().length) {
        this.elem.children('.active').removeClass('active').prev().addClass('active');
      }
      return this.disableButton();
    };

    /*
    	# Disable buttons if they are useless
    */


    SlideListener.prototype.disableButton = function() {
      $(this.settings.next).removeClass('disabled');
      $(this.settings.prev).removeClass('disabled');
      if (this.elem.children().last().hasClass('active')) {
        $(this.settings.next).addClass('disabled');
      }
      if (this.elem.children().first().hasClass('active')) {
        return $(this.settings.prev).addClass('disabled');
      }
    };

    return SlideListener;

  })();

  $.fn.extend({
    touchSlide: function(options) {
      return this.each(function() {
        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new SlideListener(this, options));
        }
      });
    }
  });

}).call(this);
