/**
 * Element
 */

var element = (function() {
    var equalizeGroups;

    // DOM elements
    var nameElements,
        clickElements,
        equalizeElements;

    // Initialize
    function initialize() {
        // Click elements
        clickElements = document.querySelectorAll('[data-element-activate], [data-element-deactivate], [data-element-toggle]');
        if(clickElements.length) {
            for(var i = 0; clickElements.length > i; i++) clickElements[i].addEventListener('click', handleClick);
        }

        // Equalize elements
        //var previousGroup;
        equalizeElements = document.querySelectorAll('[data-element-equalize]');
        equalizeGroups = [];

        if(equalizeElements.length && !device.isOutdated) {
            for(var j = 0; equalizeElements.length > j; j++) {
                var equalizeGroup = equalizeElements[j].getAttribute('data-element-equalize');

                equalizeGroups.push(equalizeGroup);
            }

            equalizeGroups.sort();

            handleResize();
            window.addEventListener('resize', handleResize);
        }
    }

    // Handle resize
    function handleResize() {
        var previousGroup;

        for(var i = 0; equalizeGroups.length > i; i++) {
            if(equalizeGroups[i] !== previousGroup) {
                equalize(equalizeGroups[i]);

                previousGroup = equalizeGroups[i];
            }
        }
    }

    // Handle click
    function handleClick(event) {
        event.stopPropagation();

        var attributes = {
            'active': this.getAttribute('data-element-activate'),
            'inactive': this.getAttribute('data-element-deactivate'),
            'toggle': this.getAttribute('data-element-toggle')
        };

        for(var attribute in attributes) {
            if(attributes[attribute]) prepareChangeState(attributes[attribute], attribute);
        }

        function prepareChangeState(attribute, state) {
            if(attribute === '*') {
                changeState(attribute, state);
                return;
            }

            var names = attribute.split(" ");
            for(var i = 0; names.length > i; i++) changeState(names[i], state);
        }
    }

    // Change state
    function changeState(name, state) {
        var classOption;

        switch(state) {
            case 'active':
                classOption = 'add';
                break;

            case 'inactive':
                classOption = 'remove';
                break;

            case 'toggle':
                classOption = 'toggle';
                break;

            default:
                console.warn('Invalid state');
        }

        var selector = (name === '*') ? '' : '="' + name + '"',
            elements = document.querySelectorAll('[data-element' + selector + ']');

        for(var i = 0; elements.length > i; i++) elements[i].classList[classOption]('element-active');
    }


    /**
     * Public functions
     */

    // Activate
    function activate(name) {
        if(name === '*') {
            changeState(name, 'active');
            return;
        }

        if(name instanceof Array) {
            var names = name;
            for(var i = 0; names.length > i; i++) changeState(names[i], 'active');

        } else { changeState(name, 'active'); }
    }

    // Deactivate
    function deactivate(name) {
        if(name === '*') {
            changeState(name, 'inactive');
            return;
        }

        if(name instanceof Array) {
            var names = name;
            for(var i = 0; names.length > i; i++) changeState(names[i], 'inactive');

        } else { changeState(name, 'inactive'); }
    }

    // Toggle
    function toggle(name) {
        if(name === '*') {
            changeState(name, 'toggle');
            return;
        }

        if(name instanceof Array) {
            var names = name;
            for(var i = 0; names.length > i; i++) changeState(names[i], 'toggle');

        } else { changeState(name, 'toggle'); }
    }

    // Equalize
    function equalize(name) {
        var elements = document.querySelectorAll('[data-element-equalize="' + name + '"]'),
            ignoreSizes,
            computedElement,
            currentHeight,
            highestValue = 0;

        for(var i = 0; elements.length > i; i++) {
            elements[i].style.height = 'auto';
            computedElement = window.getComputedStyle(elements[i]);
            currentHeight = parseFloat(computedElement.getPropertyValue('height'));

            if(currentHeight > highestValue) highestValue = currentHeight;
        }


        for(var j = 0; elements.length > j; j++) {
            ignoreSizes = elements[j].getAttribute('data-element-equalize-ignore') || '';

            if(ignoreSizes.indexOf(device.getSize()) > -1) continue;

            elements[j].style.height = highestValue + 'px';
        }
    }

    initialize();

    // Public
    return {
        activate: activate,
        deactivate: deactivate,
        equalize: equalize,
        toggle: toggle,
        initialize: initialize
    };
})();