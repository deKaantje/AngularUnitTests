/**
 * Footer
 */

var footer = (function() {

    // DOM elements
    var footerElement,
        siblingElement;

    // Initialize
    function initialize() {
        footerElement = document.querySelector('[data-footer-sticky]');
        if(!footerElement) return false;

        siblingElement = footerElement.previousElementSibling;

        setSticked();
        window.addEventListener('resize', setSticked);

        return true;
    }

    // Terminate
    function terminate() {
        window.removeEventListener('resize', setSticked);
    }

    // Set footer sticked and set margin to sibling
    function setSticked() {
        var footerHeight = footerElement.offsetHeight,
            footerElementComputedStyle = window.getComputedStyle(footerElement, null),
            footerMargin = parseInt(footerElementComputedStyle.getPropertyValue('margin-top'));

        footerElement.classList.add('footer-sticked');
        siblingElement.style.marginBottom = (footerHeight + footerMargin) + 'px';
    }

    initialize();

    // Public
    return {
        initialize: initialize,
        terminate: terminate
    };
})();