/**
 * name:            Ezbox
 * version:         0.0.3
 * author:          Billy Onjea  (istocode.com)
 * description:     A simple overlay - no slideshow, just an overlay
 * homepage:        http://istocode.com/shared/javascript/jquery/ezbox
 * files:           ezbox.js, ezbox.css, jquery.v1.7.1 or higher
 * license:         GNU GPLv2 or higher
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * Copyright (C) 2012  Billy Onjea
 * GPL License url: www.gnu.org/licenses/gpl-2.0.txt
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * TESTED ON (must re-test because of a few changes):
 * ~ IE6 to IE9 (no opacity in IE6)
 * ~ Firefox 3.0 to Firefox 9.0.1
 * ~ Chrome, and Safari 5.1.2
 *  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
**/
   (function($, window, document) {

	  /* Namespace */
	  $.fn.EzBox = function(options) {
		 var settings = {
			overlayBg: "#EDEDED",
			overlayOpacity: 0.58,
			scrollAllowed: true
		 };

		 $.extend(settings, options);

		 /* Save reference to body's height */
		 var bodyHeight = $('body').outerHeight(true);

		 /* Function: buildBox
		  * Descript: Attaches the necessary html and its styles to the body element
		  * Params:   Void
		  * Returns:  Boolean - true if the html was added, else false
		  */
		 var buildBox = function() {
			var boxReady = false;

			$(document.body).append('<div id="overlay"></div> \n'  +
			   '<div id="ezboxView"> \n' +
				  '<div id="outer-image-wrap"> \n' +
					 '<div id="image-wrap"> \n' +
						'<img id="theImage" /> \n' +
					 '</div> \n' +
				  '</div> \n' + /* End outer-image-wrap */

				  '<div id="outer-data-wrap"> \n' +
					 '<div id="data-wrap"> \n' +
						'<div id="image-details"> \n' +
							  /* details go here */
						'</div> \n' +
						'<div id="bottom-nav"> \n' +
						   '<a href="#" id="closeIcon"> <!--<img src="images/close.gif" />-->close </a> \n' +
						'</div> \n' +
					 '</div> \n' +
				  '</div> \n' + /* End outer-data-wrap */
			   '</div> \n' /* End ezboxView */ + '\n');

			/* Proceed with adding classes and styles if the attachment was successful */
			if ( $("body:has(div#ezboxView)") ) {

			   $('#overlay').addClass('overlayCls').css({
				  backgroundColor: settings.overlayBg,
				  opacity: settings.overlayOpacity
			   });

			   $('#ezboxView').addClass('ezboxView');

			   //By positioning both here and when the showImage() function is called resolves inaccurate calculations
			   $('#theImage').load(function() {
				  positionBox();
			   });

			   //Initially hide EzBox from view
			   $('#overlay, #ezboxView').css('display','none');

			   boxReady = true;
			}

			return boxReady;
		 };


		 /* Function: showImage
		  * Descript: Loads an image into the div#ezboxView by reading the clicked link's href attribute
		  * Param1:   event object
		  * Param2:	 target element index (not used)
		  * Returns:  Void
		  */
		 var showImage = function (e, i) {
			var link,
			ezboxReady = buildBox();

			//are #overlay and #ezboxView on the page?
			if (ezboxReady) {
			   /* Hide bad elements */
			   $('embed, object, select').css({ 'visibility' : 'hidden' });

			   if (e.target.nodeName.toLowerCase() !== 'a') {
				  link = $(e.target).parent();
			   }

			   $('#overlay').fadeIn(180, function() {
				  $('#ezboxView, #theImage').fadeIn(190);
			   });

			   if ($('#overlay:visible') && $('#ezboxView:visible')) {

				  $('#theImage').attr('src', link.attr('href')).load(function() {

					 if (settings.scrollAllowed) {
						 $(window).scroll(function() {
						   /* When window scrolls, find where the y-scroll...
						    * bar is and move the div#ezboxView to that position + 80
						    */
						   calcScroll();
						});
					 }

					 /* Calculate center position */
					 positionBox();
				  });

				  /* Use the title attribute for the overlay description */
				  $('#image-details').text(link.find('img').attr('title'));

				  /* Remove EzBox when the following elements are cliked */
				  $('#closeIcon, #overlay').on('click', function(e) {
					 removeBox();
					 e.preventDefault();
				  });
			   }
			} else {
			   return;
			}
		 };


		 /* Function: calcScroll
		  * Descript: Animates the position of the div#ezboxView on window scroll (optional)
		  * Params:   Void
		  * Returns:  Void
		  */
		 var calcScroll = function() {
			var t,
			ezboxHeight = $('#ezboxView').height();

			if ( $(document).scrollTop() < bodyHeight - (ezboxHeight - 80) ) {
			   t = $(document).scrollTop() + 80;
			}

			$('#ezboxView').stop(true).delay(100).animate({ top: t } , 'slow', 'swing');
		 };


		 /* Function: positionBox
		  * Descript: Calculates center position of Ezbox in relation to the window
		  * Params:   Void
		  * Returns:  Void
		  */
		 var positionBox = function () {
			var winWidth  =  $(window).width(),
			   winHeight  =  $(window).height(),
			  ezboxWidth  =  $('#ezboxView').width(),
			 ezboxHeight  =  $('#ezboxView').height();

			$('#ezboxView').css({
			   'top' : (winHeight/2) - (ezboxHeight/2) + $(document).scrollTop(),
			   'left': (winWidth/2) - (ezboxWidth/2)
			});

			$('#overlay').height($('body').outerHeight(true) + 100);
		 };


		 /* Function: removeBox
		  * Descript: Fades and hides overlay and ezboxView - makes bad elements visible
		  * Params:   Void
		  * Returns:  Void
		  */
		 var removeBox = function () {
			$('#overlay, #ezboxView').fadeOut(200).remove();
			$('embed, object, select').css({ 'visibility' : 'visible' });
		 };


		 /* Initilize EzBox */
		 return this.each(function(i, domEl) {
			$(this).find('a').on("click", function(e) {
			   showImage(e, i);
			   e.preventDefault();
			});
		 });
	  };
   })(jQuery, window, document);
