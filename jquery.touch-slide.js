(function() {
  var $, SlideListener, defaults, pluginName,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  pluginName = 'touchSlide';

  defaults = {
    threshold: 10
  };

  SlideListener = (function() {

    function SlideListener(elem, options) {
      this.end = __bind(this.end, this);

      this.move = __bind(this.move, this);

      this.start = __bind(this.start, this);
      this.elem = $(elem);
      this.elem.on('touchstart', this.start);
      this.elem.on('touchmove', this.move);
      this.elem.on('touchend', this.end);
      this.settings = $.extend({}, defaults, options);
      this.start_x = 0;
      this.start_y = 0;
      this.delta_x = 0;
      this.delta_y = 0;
      this._defaults = defaults;
      this._name = pluginName;
    }

    /*
      # Event fired on touchstart
    */


    SlideListener.prototype.start = function(e) {
      var touch;
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
      this.elem.children().css({
        '-moz-transition': '',
        '-webkit-transition': '',
        'transition': '',
        'left': ''
      });
      min_threshold = Math.abs(this.delta_x / this.elem.width() * 100);
      if (this.delta_x < 0 && min_threshold > this.settings.threshold && this.elem.children('.active').next().length) {
        this.elem.children('.active').removeClass('active').next().addClass('active');
      }
      if (this.delta_x > 0 && min_threshold > this.settings.threshold && this.elem.children('.active').prev().length) {
        this.elem.children('.active').removeClass('active').prev().addClass('active');
      }
      if (Math.abs(this.delta_x) > 3) {
        e.preventDefault();
      }
      return this.delta_x = 0;
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
