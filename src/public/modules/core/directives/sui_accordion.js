'use strict';

function linkHandler(scope, element, attrs){

  element.bind('$destroy', function() {

    //remove event listeners that might cause memory leaks; Listeners registered to the element are automatically cleaned up when this is removed(destroyed), but if you registered a listener on a service or on a DOM node that isn't being deleted, you'll have to clean it up yourself here

  });

  $(element[0]).accordion();

}

function Accordion(){

    return {

      link: (scope, element, attrs) => linkHandler(scope, element, attrs)

    };
}

Accordion.$inject = [];

export default Accordion;
