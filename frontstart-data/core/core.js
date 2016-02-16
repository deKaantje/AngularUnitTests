/**
 * Log functions
 */

// Short alert function
function a(value) {
    /*@exclude*/
    if(!value && value !== false && value !== 0 ) value = 'Alert';
    window.alert(value);
    /*@endexclude*/
}

// Short console log function
function l(value) {
    /*@exclude*/
    if(!value && value !== false && value !== 0) value = 'Log';
    window.console.log(value);
    /*@endexclude*/
}

// Short console dir function
function d(value) {
    /*@exclude*/
    if(!value && value !== false && value !== 0) value = 'Log';
    window.console.dir(value);
    /*@endexclude*/
}


/**
 * Device
 */

var device = (function() {
    var htmlElement,
        isOutdated,
        isTouch,
        data;

    // Initialize
    function initialize() {
        htmlElement = document.getElementsByTagName('html')[0];
        isOutdated = false;
        isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;
        data = {};

        try {
            document.querySelector('html').classList.remove('test');

        } catch(error) { isOutdated = true; }

        if(!isOutdated) {
            setClasses();
            createSizeEvent();

            window.addEventListener('load', setLoadedClass);

            // Example usage of sizechange event
            // window.addEventListener('sizechange', function() {
            //     l(device.getSize());
            // }, false);

        } else { htmlElement.setAttribute('class', 'is-outdated'); }
    }

    // Set html classes
    function setClasses() {
        htmlElement.classList.add('is-' + getDpi());
        htmlElement.classList.add('is-' + getSize());
        htmlElement.classList.add('is-' + getType());
        htmlElement.classList.add('is-modern');
        htmlElement.classList.remove('is-outdated');

        if(isTouch) htmlElement.classList.add('is-touch');
    }

    function setLoadedClass() {
        htmlElement.classList.add('is-loaded');
        window.removeEventListener('load', setLoadedClass);
    }

    // Create device size event
    function createSizeEvent(size) {
        data.lastSize = getSize();
        data.event = document.createEvent('Event');
        data.event.initEvent('sizechange', true, true);

        window.addEventListener('resize', function() {
            if(getSize() !== data.lastSize) {
                changeSizeClass();
                document.dispatchEvent(data.event);
            }

            data.lastSize = getSize();
        });
    }

    // Change device size body class
    function changeSizeClass() {
        htmlElement.classList.remove('is-' + data.lastSize);
        htmlElement.classList.add('is-' + getSize());
    }

    // Get device type
    function getType() {
        var type;

        if(
            navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
        ) {
            type = 'mobile';

        } else { type = 'desktop'; }

        return type;
    }

    // Get device size
    function getSize() {
        var pseudoElement = window.getComputedStyle(htmlElement, ':before'),
            size = pseudoElement.getPropertyValue('content') || 'size-not-set';

        return size.replace(/['"]+/g, '');
    }

    // Get device size
    function getDpi() {
        var pseudoElement = window.getComputedStyle(htmlElement, ':after'),
            hdpi = pseudoElement.getPropertyValue('content') || 'ldpi';

        return hdpi.replace(/['"]+/g, '');
    }

    initialize();

    // Public
    return {
        initialize: initialize,
        isOutdated: isOutdated,
        isTouch: isTouch,
        getDpi: getDpi,
        getSize: getSize,
        getType: getType
    };
})();