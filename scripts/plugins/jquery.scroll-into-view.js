'use strict';

var jQuery = require('jquery');
var $ = jQuery;

/*!
 * $.fn.scrollIntoView - similar to the default browser scrollIntoView
 * The default browser behavior always places the element at the top or bottom of its container.
 * This override is smart enough to not scroll if the element is already visible.
 *
 * Copyright 2011 Arwid Bancewicz
 * Licensed under the MIT license
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @date 8 Jan 2013
 * @author Arwid Bancewicz http://arwid.ca
 * @version 0.3
 */
 (function($) {
    $.fn.scrollIntoView = function(duration, easing, complete) {
        // The arguments are optional.
        // The first argment can be false for no animation or a duration.
        // The first argment could also be a map of options.
        // Refer to http://api.jquery.com/animate/.
        var opts = $.extend({},
        $.fn.scrollIntoView.defaults);

        // Get options
        if ($.type(duration) == "object") {
            $.extend(opts, duration);
        } else if ($.type(duration) == "number") {
            $.extend(opts, { duration: duration, easing: easing, complete: complete });
        } else if (duration == false) {
            opts.smooth = false;
        }

        // get enclosing offsets
        var elY = Infinity, elH = 0;
        if (this.size()==1)((elY=this.get(0).offsetTop)==null||(elH=elY+this.get(0).offsetHeight));
        else this.each(function(i,el){(el.offsetTop<elY?elY=el.offsetTop:el.offsetTop+el.offsetHeight>elH?elH=el.offsetTop+el.offsetHeight:null)});
        elH -= elY;

        // start from the common ancester
        var pEl = this.commonAncestor().get(0);

        var wH = $(window).height();

        // go up parents until we find one that scrolls
        while (pEl) {
            var pY = pEl.scrollTop, pH = pEl.clientHeight;
            if (pH > wH) pH = wH;

            // case: if body's elements are all absolutely/fixed positioned, use window height
            if (pH == 0 && pEl.tagName == "BODY") pH = wH;

            if (
            // it wiggles?
            (pEl.scrollTop != ((pEl.scrollTop += 1) == null || pEl.scrollTop) && (pEl.scrollTop -= 1) != null) ||
            (pEl.scrollTop != ((pEl.scrollTop -= 1) == null || pEl.scrollTop) && (pEl.scrollTop += 1) != null)) {
                if (elY <= pY) scrollTo(pEl, elY); // scroll up
                else if ((elY + elH) > (pY + pH)) scrollTo(pEl, elY + elH - pH); // scroll down
                else scrollTo(pEl, undefined) // no scroll
                return;
            }

            // try next parent
            pEl = pEl.parentNode;
        }

        function scrollTo(el, scrollTo) {
            if (scrollTo === undefined) {
                if ($.isFunction(opts.complete)) opts.complete.call(el);
            } else if (opts.smooth) {
                $(el).stop().animate({ scrollTop: scrollTo }, opts);
            } else {
                el.scrollTop = scrollTo;
                if ($.isFunction(opts.complete)) opts.complete.call(el);
            }
        }
        return this;
    };

    $.fn.scrollIntoView.defaults = {
        smooth: true,
        duration: null,
        easing: $.easing && $.easing.easeOutExpo ? 'easeOutExpo': null,
        // Note: easeOutExpo requires jquery.effects.core.js
        //       otherwise jQuery will default to use 'swing'
        complete: $.noop(),
        step: null,
        specialEasing: {} // cannot be null in jQuery 1.8.3
    };

    /*
     Returns whether the elements are in view
    */
    $.fn.isOutOfView = function(completely) {
        // completely? whether element is out of view completely
        var outOfView = true;
        this.each(function() {
            var pEl = this.parentNode, pY = pEl.scrollTop, pH = pEl.clientHeight, elY = this.offsetTop, elH = this.offsetHeight;
            if (completely ? (elY) > (pY + pH) : (elY + elH) > (pY + pH)) {}
            else if (completely ? (elY + elH) < pY: elY < pY) {}
            else outOfView = false;
        });
        return outOfView;
    };

    /*
     Returns the common ancestor of the elements.
     It was taken from http://stackoverflow.com/questions/3217147/jquery-first-parent-containing-all-children
     It has received minimal testing.
    */
    $.fn.commonAncestor = function() {
        var parents = [];
        var minlen = Infinity;

        $(this).each(function() {
            var curparents = $(this).parents();
            parents.push(curparents);
            minlen = Math.min(minlen, curparents.length);
        });

        for (var i = 0; i < parents.length; i++) {
            parents[i] = parents[i].slice(parents[i].length - minlen);
        }

        // Iterate until equality is found
        for (var i = 0; i < parents[0].length; i++) {
            var equal = true;
            for (var j in parents) {
                if (parents[j][i] != parents[0][i]) {
                    equal = false;
                    break;
                }
            }
            if (equal) return $(parents[0][i]);
        }
        return $([]);
    }

})(jQuery);
