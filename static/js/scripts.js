// Utility function
function Util() {}

/* 
	class manipulation functions
*/
Util.hasClass = function (el, className) {
  return el.classList.contains(className);
};

Util.addClass = function (el, className) {
  var classList = className.split(" ");
  el.classList.add(classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(" "));
};

Util.removeClass = function (el, className) {
  var classList = className.split(" ");
  el.classList.remove(classList[0]);
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(" "));
};

Util.toggleClass = function (el, className, bool) {
  if (bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};

Util.setAttributes = function (el, attrs) {
  for (var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function (el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < children.length; i++) {
    if (Util.hasClass(children[i], className))
      childrenByClass.push(children[i]);
  }
  return childrenByClass;
};

Util.is = function (elem, selector) {
  if (selector.nodeType) {
    return elem === selector;
  }

  var qa =
      typeof selector === "string"
        ? document.querySelectorAll(selector)
        : selector,
    length = qa.length,
    returnArr = [];

  while (length--) {
    if (qa[length] === elem) {
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function (start, to, element, duration, cb, timeFunction) {
  var change = to - start,
    currentTime = null;

  var animateHeight = function (timestamp) {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if (progress > duration) progress = duration;
    var val = parseInt((progress / duration) * change + start);
    if (timeFunction) {
      val = Math[timeFunction](progress, start, to - start, duration);
    }
    element.style.height = val + "px";
    if (progress < duration) {
      window.requestAnimationFrame(animateHeight);
    } else {
      if (cb) cb();
    }
  };

  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start + "px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function (final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if (!scrollEl) start = window.scrollY || document.documentElement.scrollTop;

  var animateScroll = function (timestamp) {
    if (!currentTime) currentTime = timestamp;
    var progress = timestamp - currentTime;
    if (progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final - start, duration);
    element.scrollTo(0, val);
    if (progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if (!element) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute("tabindex", "-1");
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function (array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function (property, value) {
  if ("CSS" in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) {
      return g[1].toUpperCase();
    });
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function () {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        // If deep merge and property is an object, merge properties
        if (
          deep &&
          Object.prototype.toString.call(obj[prop]) === "[object Object]"
        ) {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for (; i < length; i++) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function () {
  if (!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
};

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;
    if (!document.documentElement.contains(el)) return null;
    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

//Custom Event() constructor
if (typeof window.CustomEvent !== "function") {
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent("CustomEvent");
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t + b;
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
  t /= d;
  return c * t * t * t * t + b;
};

Math.easeOutQuart = function (t, b, c, d) {
  t /= d;
  t--;
  return -c * (t * t * t * t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t * t + b;
  t -= 2;
  return (-c / 2) * (t * t * t * t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s = 1.70158;
  var p = d * 0.7;
  var a = c;
  if (t == 0) return b;
  if ((t /= d) == 1) return b + c;
  if (!p) p = d * 0.3;
  if (a < Math.abs(c)) {
    a = c;
    var s = p / 4;
  } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
  return (
    a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
    c +
    b
  );
};

/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key)
(function () {
  var focusTab = document.getElementsByClassName("js-tab-focus"),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if (focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener("keydown", detectTab);
    }
    window.removeEventListener("mousedown", detectClick);
    outlineStyle = false;
    eventDetected = true;
  }

  function detectTab(event) {
    if (event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener("keydown", detectTab);
    window.addEventListener("mousedown", detectClick);
    outlineStyle = true;
  }

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? "" : "none";
    for (var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty("outline", outlineStyle);
    }
  }

  function initFocusTabs() {
    if (shouldInit) {
      if (eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener("mousedown", detectClick);
  }

  initFocusTabs();
  window.addEventListener("initFocusTabs", initFocusTabs);
})();

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent("initFocusTabs"));
}

// =============================================================================
// NAVIGATION
// File#: _1_hiding-nav
// Usage: codyhouse.co/license
(function () {
  var hidingNav = document.getElementsByClassName("js-hide-nav");
  if (hidingNav.length > 0 && window.requestAnimationFrame) {
    var mainNav = Array.prototype.filter.call(hidingNav, function (element) {
        return Util.hasClass(element, "js-hide-nav--main");
      }),
      subNav = Array.prototype.filter.call(hidingNav, function (element) {
        return Util.hasClass(element, "js-hide-nav--sub");
      });

    var scrolling = false,
      previousTop = window.scrollY,
      currentTop = window.scrollY,
      scrollDelta = 10,
      scrollOffset = 150, // scrollY needs to be bigger than scrollOffset to hide navigation
      headerHeight = 0;

    var navIsFixed = false; // check if main navigation is fixed
    if (mainNav.length > 0 && Util.hasClass(mainNav[0], "hide-nav--fixed"))
      navIsFixed = true;

    // store button that triggers navigation on mobile
    var triggerMobile = getTriggerMobileMenu();
    var prevElement = createPrevElement();
    var mainNavTop = 0;
    // list of classes the hide-nav has when it is expanded -> do not hide if it has those classes
    var navOpenClasses = hidingNav[0].getAttribute("data-nav-target-class"),
      navOpenArrayClasses = [];
    if (navOpenClasses) navOpenArrayClasses = navOpenClasses.split(" ");
    getMainNavTop();
    if (mainNavTop > 0) {
      scrollOffset = scrollOffset + mainNavTop;
    }

    // init navigation and listen to window scroll event
    getHeaderHeight();
    initSecondaryNav();
    initFixedNav();
    resetHideNav();
    window.addEventListener("scroll", function (event) {
      if (scrolling) return;
      scrolling = true;
      window.requestAnimationFrame(resetHideNav);
    });

    window.addEventListener("resize", function (event) {
      if (scrolling) return;
      scrolling = true;
      window.requestAnimationFrame(function () {
        if (headerHeight > 0) {
          getMainNavTop();
          getHeaderHeight();
          initSecondaryNav();
          initFixedNav();
        }
        // reset both navigation
        hideNavScrollUp();

        scrolling = false;
      });
    });

    function getHeaderHeight() {
      headerHeight = mainNav[0].offsetHeight;
    }

    function initSecondaryNav() {
      // if there's a secondary nav, set its top equal to the header height
      if (subNav.length < 1 || mainNav.length < 1) return;
      subNav[0].style.top = headerHeight - 1 + "px";
    }

    function initFixedNav() {
      if (!navIsFixed || mainNav.length < 1) return;
      mainNav[0].style.marginBottom = "-" + headerHeight + "px";
    }

    function resetHideNav() {
      // check if navs need to be hidden/revealed
      currentTop = window.scrollY;
      if (currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
        hideNavScrollDown();
      } else if (
        previousTop - currentTop > scrollDelta ||
        (previousTop - currentTop > 0 && currentTop < scrollOffset)
      ) {
        hideNavScrollUp();
      } else if (
        previousTop - currentTop > 0 &&
        subNav.length > 0 &&
        subNav[0].getBoundingClientRect().top > 0
      ) {
        setTranslate(subNav[0], "0%");
      }
      // if primary nav is fixed -> toggle bg class
      if (navIsFixed) {
        var scrollTop = window.scrollY || window.pageYOffset;
        Util.toggleClass(
          mainNav[0],
          "hide-nav--has-bg",
          scrollTop > headerHeight + mainNavTop
        );
      }
      previousTop = currentTop;
      scrolling = false;
    }

    function hideNavScrollDown() {
      // if there's a secondary nav -> it has to reach the top before hiding nav
      if (
        subNav.length > 0 &&
        subNav[0].getBoundingClientRect().top > headerHeight
      )
        return;
      // on mobile -> hide navigation only if dropdown is not open
      if (
        triggerMobile &&
        triggerMobile.getAttribute("aria-expanded") == "true"
      )
        return;
      // check if main nav has one of the following classes
      if (mainNav.length > 0 && (!navOpenClasses || !checkNavExpanded())) {
        setTranslate(mainNav[0], "-100%");
        mainNav[0].addEventListener("transitionend", addOffCanvasClass);
      }
      if (subNav.length > 0) setTranslate(subNav[0], "-" + headerHeight + "px");
    }

    function hideNavScrollUp() {
      if (mainNav.length > 0) {
        setTranslate(mainNav[0], "0%");
        Util.removeClass(mainNav[0], "hide-nav--off-canvas");
        mainNav[0].removeEventListener("transitionend", addOffCanvasClass);
      }
      if (subNav.length > 0) setTranslate(subNav[0], "0%");
    }

    function addOffCanvasClass() {
      mainNav[0].removeEventListener("transitionend", addOffCanvasClass);
      Util.addClass(mainNav[0], "hide-nav--off-canvas");
    }

    function setTranslate(element, val) {
      element.style.transform = "translateY(" + val + ")";
    }

    function getTriggerMobileMenu() {
      // store trigger that toggle mobile navigation dropdown
      var triggerMobileClass = hidingNav[0].getAttribute("data-mobile-trigger");
      if (!triggerMobileClass) return false;
      if (triggerMobileClass.indexOf("#") == 0) {
        // get trigger by ID
        var trigger = document.getElementById(
          triggerMobileClass.replace("#", "")
        );
        if (trigger) return trigger;
      } else {
        // get trigger by class name
        var trigger = hidingNav[0].getElementsByClassName(triggerMobileClass);
        if (trigger.length > 0) return trigger[0];
      }

      return false;
    }

    function createPrevElement() {
      // create element to be inserted right before the mainNav to get its top value
      if (mainNav.length < 1) return false;
      var newElement = document.createElement("div");
      newElement.setAttribute("aria-hidden", "true");
      mainNav[0].parentElement.insertBefore(newElement, mainNav[0]);
      var prevElement = mainNav[0].previousElementSibling;
      prevElement.style.opacity = "0";
      return prevElement;
    }

    function getMainNavTop() {
      if (!prevElement) return;
      mainNavTop = prevElement.getBoundingClientRect().top + window.scrollY;
    }

    function checkNavExpanded() {
      var navIsOpen = false;
      for (var i = 0; i < navOpenArrayClasses.length; i++) {
        if (Util.hasClass(mainNav[0], navOpenArrayClasses[i].trim())) {
          navIsOpen = true;
          break;
        }
      }
      return navIsOpen;
    }
  } else {
    // if window requestAnimationFrame is not supported -> add bg class to fixed header
    var mainNav = document.getElementsByClassName("js-hide-nav--main");
    if (mainNav.length < 1) return;
    if (Util.hasClass(mainNav[0], "hide-nav--fixed"))
      Util.addClass(mainNav[0], "hide-nav--has-bg");
  }
})();

// =======================================================
// MODAL WINDOW
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function () {
  var Modal = function (element) {
    this.element = element;
    this.triggers = document.querySelectorAll(
      '[aria-controls="' + this.element.getAttribute("id") + '"]'
    );
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.moveFocusEl = null; // focus will be moved to this element when modal is open
    this.modalFocus = this.element.getAttribute("data-modal-first-focus")
      ? this.element.querySelector(
          this.element.getAttribute("data-modal-first-focus")
        )
      : null;
    this.selectedTrigger = null;
    this.preventScrollEl = this.getPreventScrollEl();
    this.showClass = "modal--is-visible";
    this.initModal();
  };

  Modal.prototype.getPreventScrollEl = function () {
    var scrollEl = false;
    var querySelector = this.element.getAttribute("data-modal-prevent-scroll");
    if (querySelector) scrollEl = document.querySelector(querySelector);
    return scrollEl;
  };

  Modal.prototype.initModal = function () {
    var self = this;
    //open modal when clicking on trigger buttons
    if (this.triggers) {
      for (var i = 0; i < this.triggers.length; i++) {
        this.triggers[i].addEventListener("click", function (event) {
          event.preventDefault();
          if (Util.hasClass(self.element, self.showClass)) {
            self.closeModal();
            return;
          }
          self.selectedTrigger = event.currentTarget;
          self.showModal();
          self.initModalEvents();
        });
      }
    }

    // listen to the openModal event -> open modal without a trigger button
    this.element.addEventListener("openModal", function (event) {
      if (event.detail) self.selectedTrigger = event.detail;
      self.showModal();
      self.initModalEvents();
    });

    // listen to the closeModal event -> close modal without a trigger button
    this.element.addEventListener("closeModal", function (event) {
      if (event.detail) self.selectedTrigger = event.detail;
      self.closeModal();
    });

    // if modal is open by default -> initialise modal events
    if (Util.hasClass(this.element, this.showClass)) this.initModalEvents();
  };

  Modal.prototype.showModal = function () {
    var self = this;
    Util.addClass(this.element, this.showClass);
    this.getFocusableElements();
    if (this.moveFocusEl) {
      this.moveFocusEl.focus();
      // wait for the end of transitions before moving focus
      this.element.addEventListener("transitionend", function cb(event) {
        self.moveFocusEl.focus();
        self.element.removeEventListener("transitionend", cb);
      });
    }
    this.emitModalEvents("modalIsOpen");
    // change the overflow of the preventScrollEl
    if (this.preventScrollEl) this.preventScrollEl.style.overflow = "hidden";
  };

  Modal.prototype.closeModal = function () {
    if (!Util.hasClass(this.element, this.showClass)) return;
    Util.removeClass(this.element, this.showClass);
    this.firstFocusable = null;
    this.lastFocusable = null;
    this.moveFocusEl = null;
    if (this.selectedTrigger) this.selectedTrigger.focus();
    //remove listeners
    this.cancelModalEvents();
    this.emitModalEvents("modalIsClose");
    // change the overflow of the preventScrollEl
    if (this.preventScrollEl) this.preventScrollEl.style.overflow = "";
  };

  Modal.prototype.initModalEvents = function () {
    //add event listeners
    this.element.addEventListener("keydown", this);
    this.element.addEventListener("click", this);
  };

  Modal.prototype.cancelModalEvents = function () {
    //remove event listeners
    this.element.removeEventListener("keydown", this);
    this.element.removeEventListener("click", this);
  };

  Modal.prototype.handleEvent = function (event) {
    switch (event.type) {
      case "click": {
        this.initClick(event);
      }
      case "keydown": {
        this.initKeyDown(event);
      }
    }
  };

  Modal.prototype.initKeyDown = function (event) {
    if (
      (event.keyCode && event.keyCode == 9) ||
      (event.key && event.key == "Tab")
    ) {
      //trap focus inside modal
      this.trapFocus(event);
    } else if (
      ((event.keyCode && event.keyCode == 13) ||
        (event.key && event.key == "Enter")) &&
      event.target.closest(".js-modal__close")
    ) {
      event.preventDefault();
      this.closeModal(); // close modal when pressing Enter on close button
    }
  };

  Modal.prototype.initClick = function (event) {
    //close modal when clicking on close button or modal bg layer
    if (
      !event.target.closest(".js-modal__close") &&
      !Util.hasClass(event.target, "js-modal")
    )
      return;
    event.preventDefault();
    this.closeModal();
  };

  Modal.prototype.trapFocus = function (event) {
    if (this.firstFocusable == document.activeElement && event.shiftKey) {
      //on Shift+Tab -> focus last focusable element when focus moves out of modal
      event.preventDefault();
      this.lastFocusable.focus();
    }
    if (this.lastFocusable == document.activeElement && !event.shiftKey) {
      //on Tab -> focus first focusable element when focus moves out of modal
      event.preventDefault();
      this.firstFocusable.focus();
    }
  };

  Modal.prototype.getFocusableElements = function () {
    //get all focusable elements inside the modal
    var allFocusable = this.element.querySelectorAll(focusableElString);
    this.getFirstVisible(allFocusable);
    this.getLastVisible(allFocusable);
    this.getFirstFocusable();
  };

  Modal.prototype.getFirstVisible = function (elements) {
    //get first visible focusable element inside the modal
    for (var i = 0; i < elements.length; i++) {
      if (isVisible(elements[i])) {
        this.firstFocusable = elements[i];
        break;
      }
    }
  };

  Modal.prototype.getLastVisible = function (elements) {
    //get last visible focusable element inside the modal
    for (var i = elements.length - 1; i >= 0; i--) {
      if (isVisible(elements[i])) {
        this.lastFocusable = elements[i];
        break;
      }
    }
  };

  Modal.prototype.getFirstFocusable = function () {
    if (!this.modalFocus || !Element.prototype.matches) {
      this.moveFocusEl = this.firstFocusable;
      return;
    }
    var containerIsFocusable = this.modalFocus.matches(focusableElString);
    if (containerIsFocusable) {
      this.moveFocusEl = this.modalFocus;
    } else {
      this.moveFocusEl = false;
      var elements = this.modalFocus.querySelectorAll(focusableElString);
      for (var i = 0; i < elements.length; i++) {
        if (isVisible(elements[i])) {
          this.moveFocusEl = elements[i];
          break;
        }
      }
      if (!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
    }
  };

  Modal.prototype.emitModalEvents = function (eventName) {
    var event = new CustomEvent(eventName, { detail: this.selectedTrigger });
    this.element.dispatchEvent(event);
  };

  function isVisible(element) {
    return (
      element.offsetWidth ||
      element.offsetHeight ||
      element.getClientRects().length
    );
  }

  window.Modal = Modal;

  //initialize the Modal objects
  var modals = document.getElementsByClassName("js-modal");
  // generic focusable elements string selector
  var focusableElString =
    '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
  if (modals.length > 0) {
    var modalArrays = [];
    for (var i = 0; i < modals.length; i++) {
      (function (i) {
        modalArrays.push(new Modal(modals[i]));
      })(i);
    }

    window.addEventListener("keydown", function (event) {
      //close modal window on esc
      if (
        (event.keyCode && event.keyCode == 27) ||
        (event.key && event.key.toLowerCase() == "escape")
      ) {
        for (var i = 0; i < modalArrays.length; i++) {
          (function (i) {
            modalArrays[i].closeModal();
          })(i);
        }
      }
    });
  }
})();
