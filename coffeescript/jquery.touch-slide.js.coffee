##
#  touchSlide enables touch gestures for slide shows
#
#	@version 1.2
#	@author Jason Gillespie


# Reference jQuery
$ = jQuery


# Create default options
pluginName = 'touchSlide'
defaults = 
	threshold: 10  	# percentage of element a finger needs to drag to change slides


##
#	SlideListener listens and responds to touch events
#		enabling slide animations
#
#	@param jQuery object
#	@author Jason Gillespie
##
class SlideListener

	constructor: (elem, options) ->

		@elem = $(elem)

		# Setup our listeners
		@elem.on 'touchstart', @start
		@elem.on 'touchmove', @move
		@elem.on 'touchend', @end

		@settings = $.extend {}, defaults, options

		# Attach our state variables to the element
		@start_x = 0
		@start_y = 0
		@delta_x = 0
		@delta_y = 0

		@_defaults = defaults
		@_name = pluginName

	###
	#	Event fired on touchstart
	###
	start: (e) =>

		touch = e.originalEvent.touches[0];

		# Initialize slider state
		@start_x = touch.pageX
		@start_y = touch.pageY

		# Disable transition to allow for lockstep finger following
		@elem.children().css
			'-moz-transition': '0'
			'-webkit-transition': '0'
			'transition': '0'



	###
	# Event fired on touchmove
	###
	move: (e) =>
				
		# Some quirks with jquery's event handlers not sending e.touches or e.changedTouches,
		# we get around this using the event's "originalEvent"
		# - http://www.the-xavi.com/articles/trouble-with-touch-events-jquery
		touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

		# Change the state of our object
		@delta_x = touch.pageX - @start_x
		@delta_y = touch.pageY - @start_y

		# Try to guess which way we are swiping
		# Disable default vertical scroll and swipe slide, if we determine
		#	scrolling to be horizontal.
		if Math.abs(@delta_x) > Math.abs(@delta_y) && Math.abs(@delta_x) > 10
			e.preventDefault() # disable vertical scrolling

			# Convert delta px to % 
			delta_x_pct = @delta_x / @elem.width() * 100;

			# Move the active item in lockstep with the finger
			@elem.children('.active').css
				'left': delta_x_pct + '%'

			# Swiping left..
			if @delta_x < 0
				@elem.children('.active').next().css
					'left': delta_x_pct + 100 + '%'

			# Swiping right..
			if @delta_x > 0
				@elem.children('.active').prev().css
					'left': delta_x_pct - 100 + '%'				

	###
	# Event fired on touchend
	###
	end: (e) =>

		# Enable transitions
		@elem.children().css
			'-moz-transition': ''
			'-webkit-transition': ''
			'transition': ''
			'left': ''

		min_threshold = Math.abs @delta_x / @elem.width() * 100

		# Update active slide if the slide crosses the defined threshold 
		if @delta_x < 0 && min_threshold > @settings.threshold && @elem.children('.active').next().length
			@elem.children('.active').removeClass('active').next().addClass('active')
		if @delta_x > 0 && min_threshold > @settings.threshold && @elem.children('.active').prev().length
			@elem.children('.active').removeClass('active').prev().addClass('active')

		if Math.abs(@delta_x) > 3
			e.preventDefault()

		# reset delta
		@delta_x = 0


# Add object to jQuery
$.fn.extend
	
	touchSlide: (options) ->

		return @each () ->

			# Prevent against multiple instantiations
			if !$.data this, 'plugin_' + pluginName
				$.data this, 'plugin_' + pluginName, new SlideListener(this, options)

			return






