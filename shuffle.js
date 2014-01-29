/* global exports, document, window */

(function(exports, _) {
    'use strict';

    /**
     * Shuffle
     *
     * Example Usage:
     * var shuffle = new Shuffle('shuffle');
     *
     * @param string container - element to apply shuffle
     * @param object options - options
     * @return object - Shuffle
     */
    function Shuffle(container, options) {
        this.settings   = _.extend({}, Shuffle.defaults, options);

        var self = this;

        this.container      = document.getElementsByClassName(container)[0]; // shuffle container
        this.imageContainer = this.container.getElementsByClassName('image_container')[0];
        this.images         = this.container.getElementsByTagName('img'); // list of images in dom
        this.imagesOrder    = []; // store current order of images
        this.animating      = false;
        this.transitionEnd = _.whichTransitionEvent();

        // preset z-indexes
        for ( var i=0; i<this.images.length; i++ ) {
            this.imagesOrder.push(this.images[i]);
            this.images[i].style.zIndex = i;
            
            this.images[i].style['transform'] = 'rotate(' + this.images[i].getAttribute('data-rotation') + ")";
            this.images[i].style['-webkit-transform'] = 'rotate(' + this.images[i].getAttribute('data-rotation') + ")";
            this.images[i].style['-moz-transform'] = 'rotate(' + this.images[i].getAttribute('data-rotation') + ")";
            this.images[i].style['-ms-transform'] = 'rotate(' + this.images[i].getAttribute('data-rotation') + ")";
        }

        this.minZIndex = 0;
        this.maxZIndex = this.images.length - 1;

        // create navigation
        if (this.settings.prev) {
            this.prev = document.createElement('button');
            this.prev.innerHTML ='&#9664;';
            this.container.insertBefore(this.prev, this.imageContainer);
            this.prev.className = 'nav prev';
            this.prev.addEventListener('click', this.prevElement.bind(this));
        }
        
        if (this.settings.next) {
            this.next = document.createElement('button');
            this.next.innerHTML ='&#9654;';
            this.container.insertBefore(this.next, this.imageContainer);
            this.next.className = 'nav next';
            this.next.addEventListener('click', this.nextElement.bind(this));
        }

        this.container.setAttribute('data-shuffle', this);
    }

    /**
     * prevElement
     * shuffle to prev item
     *
     * Example Usage:
     * shuffle.prevElement();
     */
    Shuffle.prototype.prevElement = function() {
        if (!this.animating) {
            this.animating = true;
            this.animatingImg = this.imagesOrder[0];
            this.imagesOrder.shift();
            this.imagesOrder.push(this.animatingImg);

            if(Modernizr.csstransitions) {
                
                this._transCallback = this.animatePrevCallback.bind(this);
                this.animatingImg.addEventListener(this.transitionEnd, this._transCallback);

                this.animateCardOut(this.animatingImg, -1);

            } else {
                this.animatingImg.style.zIndex = ++this.maxZIndex;
                this.animating = false;
            }
            
            ++this.minZIndex;
        }
    };

    /**
     * animatePrevCallback
     * callback function after transitionend to animate card back to original position with new z-index
     *
     * Example Usage:
     * shuffle.animatePrevCallback();
     */
    Shuffle.prototype.animatePrevCallback = function(e) {
        e.stopPropagation();
        this.animatingImg.removeEventListener(this.transitionEnd, this._transCallback);

        this.animatingImg.style.zIndex = ++this.maxZIndex;
        
        this.resetCard(this.animatingImg);
        
        this.animating = false;
    };

    /**
     * nextElement
     * shuffle to next item
     *
     * Example Usage:
     * shuffle.nextElement();
     */
    Shuffle.prototype.nextElement = function() {
        if (!this.animating) {
            this.animating = true;

            // image to animate
            this.animatingImg = this.imagesOrder[this.imagesOrder.length - 1];

            // reorder images order array
            this.imagesOrder.pop();
            this.imagesOrder.unshift(this.animatingImg);

            // animate image to the left
            if(Modernizr.csstransitions) {
                this._transCallback = this.animateNextCallback.bind(this);
                this.animatingImg.addEventListener(this.transitionEnd, this._transCallback);

                this.animateCardOut(this.animatingImg, 1);
                
            } else {
                this.animatingImg.style.zIndex = --this.minZIndex;
                this.animating = false;
            }
            
            --this.maxZIndex;
        }
    };

    /**
     * animateNextCallback
     * callback function after transitionend to animate card back to original position with new z-index
     *
     * Example Usage:
     * shuffle.animateNextCallback();
     */
    Shuffle.prototype.animateNextCallback = function(e) {
        e.stopPropagation();
        this.animatingImg.removeEventListener(this.transitionEnd, this._transCallback);
        
        this.animatingImg.style.zIndex = --this.minZIndex;
        
        this.resetCard(this.animatingImg);

        this.animating = false;
    };

    /**
     * animateCardOut
     * animate card out of stack
     *
     * Example Usage:
     * this.resetCard();
     */
    Shuffle.prototype.animateCardOut = function(image, factor) {
        image.className = 'animatingOut';
        
        var left = image.getAttribute('data-left') * factor * 4 + '%',
            top = image.getAttribute('data-top') * factor * 4 + '%',
            rotate = image.getAttribute('data-rotation');

        image.style.transform = 'translate(' + left + ', ' + top + ') rotate(' + rotate + ')';
        image.style.msTransform = 'translate(' + left + ', ' + top + ') rotate(' + rotate + ')'; /* IE 9 */
        image.style.mozTransform = 'translate(' + left + ', ' + top + ') rotate(' + rotate + ')'; /* IE 9 */
        image.style.webkitTransform = 'translate(' + left + ', ' + top + ') rotate(' + rotate + ')'; /* Safari and Chrome */
    };

    /**
     * resetCard
     * set card back to original position after shuffle animation
     *
     * Example Usage:
     * this.resetCard();
     */
    Shuffle.prototype.resetCard = function(image) {
        image.className = '';

        var rotate = image.getAttribute('data-rotation');
             
        image.style.transform = 'translate(0, 0) rotate(' + rotate + ')';
        image.style.msTransform = 'translate(0, 0) rotate(' + rotate + ')'; /* IE 9 */
        image.style.mozTransform = 'translate(0, 0) rotate(' + rotate + ')'; /* IE 9 */
        image.style.webkitTransform = 'translate(0, 0) rotate(' + rotate + ')';
    };

    // user can go next / prev
    Shuffle.defaults = {
        'prev' : true,
        'next' : true
    };

    exports.Shuffle = Shuffle;
})(exports, exports._);