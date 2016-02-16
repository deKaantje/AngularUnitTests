/**
 * Navigation
 */

var nav = (function() {

    // Global variables
    var navHeight,
        menuHeight,
        isSticked;

    // DOM elements
    var bodyElement,
        navElement,
        menuElement,
        toggleElements,
        offsetElements;

    // Initialize
    function initialize() {
        navElement = document.querySelector('[data-nav-sticky]');
        if(!navElement) return false;

        bodyElement = document.querySelector('body');
        menuElement = navElement.querySelector('[data-nav-sticky-menu]');
        toggleElements = document.querySelectorAll('[data-nav-sticky-toggle]');
        offsetElements = document.querySelectorAll('[data-nav-sticky-offset]');

        setSticked();
        window.addEventListener('sizechange', setSticked);
        bodyElement.addEventListener('click', closeMenu);

        if(toggleElements) {
            for(var i = 0; toggleElements.length > i; i++) {
                toggleElements[i].addEventListener('click', toggleMenu);
            }
        }

        return true;
    }

    // Set nav sticked
    function setSticked() {
        var menuHeightAuto = false,
            offsetType;

        menuHeight = menuElement.offsetHeight;

        if(device.getSize() !== 'small') menuHeightAuto = true;
        setMenuHeight(menuHeightAuto);

        navHeight = navElement.offsetHeight;
        navElement.classList.add('nav-sticked');
        isSticked = true;

        if(offsetElements) {
            for(var i = 0; offsetElements.length > i; i++) {
                offsetType = offsetElements[i].getAttribute('data-nav-sticky-offset');
                offsetElements[i].style[offsetType] = navHeight + 'px';
            }
        }
    }

    // Toggle menu
    function toggleMenu(event) {
        event.stopPropagation();
        menuElement.classList.toggle('nav--menu-visisble');
        setMenuHeight();
    }

    // Toggle menu
    function closeMenu() {
        if(menuElement.classList.contains('nav--menu-visisble')) {
            menuElement.classList.remove('nav--menu-visisble');
            setMenuHeight();
        }
    }

    // Set menu height
    function setMenuHeight(auto) {
        if(auto) {
            menuElement.style.height = 'auto';
            return;
        }

        if(menuElement.classList.contains('nav--menu-visisble')) {
            menuElement.style.height = menuHeight + 'px';

        } else { menuElement.style.height = 0; }
    }

    initialize();

    // Public
    return {
        initialize: initialize,
        navHeight: navHeight,
        isSticked: isSticked
    };
})();


/**
 * Nav aside
 */

var navAside = (function() {

    // Global variables
    var navAsideElementComputedStyle,
        navAsideElementTop,
        parentElementComputedStyle;

    // DOM elements
    var navAsideElement,
        menuElement,
        menuItemElements,
        parentElement,
        sectionElements;

    // Initialze
    function initialize() {
        navAsideElement = document.querySelector('[data-navAside]');
        if(!navAsideElement) return false;

        navAsideElementComputedStyle = window.getComputedStyle(navAsideElement, null);
        navAsideElementTop = parseInt(navAsideElementComputedStyle.getPropertyValue('top'));
        menuElement = navAsideElement.querySelector('[data-navAside-menu]');
        menuItemElements = navAsideElement.querySelectorAll('li');
        parentElement = navAsideElement.parentNode;
        parentElementComputedStyle = window.getComputedStyle(parentElement, null);
        sectionElements = document.querySelectorAll('[data-nav-aside-section]');

        setMenuFunctions();

        window.addEventListener('scroll', setMenuFunctions);
        window.addEventListener('resize', setMenuFunctions);

        if(menuElement) {
            for(var i = 0; menuItemElements.length > i; i++) {
                menuItemElements[i].addEventListener('click', scrollToSection);
            }
        }

        return true;
    }

    // Terminate
    function terminate() {
        window.removeEventListener('scroll', setMenuFunctions);
        window.removeEventListener('resize', setMenuFunctions);
    }

    function setMenuFunctions() {
        setMenuSticked();
        setMenuItemActive();
    }

    // Check and set nav sticked with parent width
    function setMenuSticked() {
        var parentElementRectangle = parentElement.getBoundingClientRect(),
            navAsideTop = navAsideElementTop;

        if(nav.isSticked) {
            navAsideTop += nav.navHeight;
            navAsideElement.style.top = navAsideTop + 'px';
        }

        if(parentElementRectangle.top <= navAsideTop) {
            parentElementWidth = parseInt(parentElementComputedStyle.getPropertyValue('width'));
            parentElementPaddingLeft = parseInt(parentElementComputedStyle.getPropertyValue('padding-left'));
            navAsideElement.style.width = parentElementWidth - parentElementPaddingLeft + 'px';
            navAsideElement.classList.add('navAside--sticked');

        } else {
            navAsideElement.classList.remove('navAside--sticked');
            navAsideElement.style.width = 'auto';
        }
    }

    // Check and set menu item active
    function setMenuItemActive() {
        var sectionElementsRectangle,
            offset = 0;

        if(nav.isSticked) offset = nav.navHeight;

        if(sectionElements) {
            for(var i = 0; sectionElements.length > i; i++) {
                sectionElementsRectangle = sectionElements[i].getBoundingClientRect();

                if(Math.floor(sectionElementsRectangle.top) <= offset && Math.floor(sectionElementsRectangle.bottom) > offset) {
                    menuItemElements[i].classList.add('active');

                } else { menuItemElements[i].classList.remove('active'); }
            }
        }
    }

    // Check and set menu anchors
    function scrollToSection(event) {
        event.stopPropagation();
        event.preventDefault();

        var anchor = this.querySelector('[href]').getAttribute('href'),
            scrollToValue = 0;

        if(anchor !== '#') {
            var sectionElement = document.querySelector(anchor),
                sectionElementRectangle = sectionElement.getBoundingClientRect(),
                sectionTop = sectionElementRectangle.top,
                windowTop = window.pageYOffset;

            scrollToValue = windowTop + sectionTop;
            if(nav.isSticked) scrollToValue -= nav.navHeight;
        }

        window.scrollTo(0, scrollToValue);
    }

    initialize();

    // Public
    return {
        initialize: initialize,
        terminate: terminate
    };
})();