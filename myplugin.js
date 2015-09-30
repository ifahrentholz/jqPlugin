/*
 **Convention:** Methods or properties starting with `_` are meant to be
 private. You can make them public by including them in the return statement
 at the bottom of the Constructor
 */

/**
 * TODO: build data validator
 * TODO: build error handler
 */

;(function($, window, document, undefined) {

  "use strict";

  var pluginName    = "my_plugin_name";
  var pluginVersion = "0.1.0";

  var Plugin = function(element, options, dataName) {
    var self;
    self = {
      /**
       * The DOM element where the plugin was initialized on
       * @type {Element}
       */
      element: element,


      /**
       * The DOM element wrapped in a jQuery object
       * @type {Object}
       */
      $element: $(element),


      /**
       * The plugin options
       * @type {Object}
       */
      options: options,


      /**
       * The name of the plugin (used in data attribute of element)
       * @type {String}
       */
      dataName: dataName,


      /**
       * Collection of ui classes used in DOM
       * @type {Object}
       */
      uiClass: {
      },


      /**
       * Collection of ui selectors used in plugin
       * @type {Object}
       */
      uiSelector: {
      },


      /**
       * Data object to hold serialized data used for video / audio initialisation
       * @type {Object}
       */
      data: {}
    };


    /***********************************************************************************
     * HELPER
     ***********************************************************************************/


    /**
     * Listener for namespaced events.
     *
     * EXAMPLE:
     * _bindEvent("click self.uiSelector.mediaplayerPre _startPlayer");
     * _bindEvent("event context callback");
     *
     * @param {String} eventString
     * @private
     */
    var _bindEvent = function(eventString) {
      var arr = [];
      var isArray = false;
      var event, eventTarget, selector, callback;

      function setEvent(eventTarget) {
        eventTarget.on(event + "." + pluginName, callback);
      }

      if(eventString.length) {
        arr = eventString.split(" ");
        if(arr.length !== 3) {
          $.log(pluginName + ": _bindEvents syntax error.");
        } else {
          event = arr[0];
          selector = eval(arr[1]);
          callback = eval(arr[2]);

          eventTarget = (self.$element === selector ? selector : self.$element.find(selector)) || undefined;

          isArray = $.isArray(eventTarget) ? true : false;

          if(event === "click") {
            event = Modernizr.touch ? "touchstart" : "click";
          }

          // Handle
          if(eventTarget.length && !isArray) {
            setEvent(eventTarget);
          }

          // Handle array
          if(eventTarget.length && isArray){
            eventTarget.each(function() {
              setEvent(this);
            });
          }
        }
      }
    };


    /**
     * Helper for event triggering (written to ease the use of namespaced events)
     *
     * EXAMPLE: _triggerEvent("update", self.uiSelector.mediaplayerPre);
     *
     * @param context
     * @param event
     * @private
     */
    var _triggerEvent = function(event, context) {
      var $ctx = (context instanceof jQuery) ? context : $(context);
      if($ctx.length) {
        $ctx.trigger(event + "." + pluginName);
      }
    };


    /**
     * Helper to kill event (written to ease the use of namespaced events)
     *
     * EXAMPLE: _killEvent("click", self.uiSelector.mediaplayerPre);
     *
     * @param event
     * @param context
     * @private
     */
    var _killEvent = function(event, context) {
      var $ctx = (context instanceof jQuery) ? context : $(context);
      if($ctx.length) {
        $ctx.off(event + "." + pluginName);
      }
    };


    /**
     * Callback support
     * @param {Function} callback
     * @returns {_callbackSupport}
     * @private
     */
    var _callbackSupport = function(callback) {
      //Checks to make sure the parameter passed in is a function
      if($.isFunction(callback)) {
        callback.call(self.$element.data(dataName), self.$element);
      }
      return this;
    };


    /**
     * Set the necessary data properties
     * @param data
     * @returns {Object}
     * @private
     */
    var _serializeData = function(data) {
      $.each(data[0], function(k,v) {
        self.data[k] = v;
      });
      _validateData();
      return self.data;
    };


    /**
     * Easy data validation to make sure no errors occure on rendering
     * TODO: make valdiation variable via parameter string: "type media"
     * @returns {Object}
     * @private
     */
    var _validateData = function() {
      var data = self.data;
      self.data.valid = !(!data || !data.type || !data.media);
      return self.data;
    };


    /***********************************************************************************
     * PLUGIN LOGIC
     ***********************************************************************************/


    /**
     * Init the plugin
     * @returns {Object} this
     */
    var init = function() {
      _serializeData();
      if(self.data.valid) {
        _eventHandler();
      } else {
        // TODO: ERROR HANDING ON INVALID DATA
      }
      // Maintain chainability
      return this;
    };


    /**
     * Add event listeners here
     * @private
     */
    var _eventHandler = function() {
      //_bindEvent("click self.uiSelector.[YOURSELECTOR] [CALLBACK]");
    };


    /***********************************************************************************
     * PUBLIC
     ***********************************************************************************/


    /**
     * Returns the plugin option if it exists, and returns undefined if the
     * option does not exist.
     * @param {String} key
     * @returns {*|undefined}
     */
    var getOption = function(key) {
      return self.options[key] || undefined;
    };


    /**
     * Returns an object of all plugin options
     * @returns {Object|undefined}
     */
    var getOptions = function() {
      return self.options || undefined;
    };


    /**
     * Place or replace a plugin option
     * @param {String} key
     * @param {String} value
     * @param {Function} callback
     * @returns {setOption}
     */
    var setOption = function(key, value, callback) {
      if(typeof key === "string") {
        self.options[key] = value;
      }

      _callbackSupport(callback);

      // Maintain chainability
      return this;
    };


    /**
     * Place or replace multiple plugin options
     * @param {Object} newOptions
     * @param {Function} callback
     * @returns {setOptions}
     */
    var setOptions = function(newOptions, callback) {
      if($.isPlainObject(newOptions)) {
        self.options = $.extend({}, self.options, newOptions);
      }

      _callbackSupport(callback);

      // Maintain chainability
      return this;
    };


    var destroy = function() {
      //_killEvent("click", [CONTEXT]);
    };


    /***********************************************************************************
     * PUBLIC API
     ***********************************************************************************/


    return {
      init: init,
      self: self,
      version: pluginVersion,
      getOption: getOption,
      getOptions: getOptions,
      setOption: setOption,
      setOptions: setOptions,
      destroy: destroy
    };


  };


  /***********************************************************************************
   * CREATE JQUERY PLUGIN
   ***********************************************************************************/


  /**
   * Add plugin to the jQuery `fn` namespace
   * @param options
   * @returns {*}
   */
  $.fn[pluginName] = function(options) {

    // Maintain chainability
    return this.each(function() {

      /**
       * Destcription:
       * - stores the calling element and the data name into local variables
       * - instantiate the plugin variable (which will hold the plugin object
       * - instantiate an empty object literal which will be used to dynamically create a jQuery custom pseudo selector
       * @type {*|HTMLElement}
       */
      var element = $(this), plugin, dataName = pluginName, obj = {};


      /**
       * returns early if plugin instance is already defined on this element
       */
      if($.data(element[0], dataName)) {
        return;
      }


      /**
       * Uses the jQuery `extend` method to merge the user specified
       * options object with the `self.options`object to create a new
       * object. The options variable is set to the newly created object.
       */
      var options = $.extend({}, $.fn[pluginName].options, options);


      /**
       * Instantiate the plugin
       */
      plugin = new Plugin(this, options, dataName).init();


      /**
       * Store the new plugin object in data attribute of element
       */
      $.data(element[0], dataName, plugin);


      /**
       * Uses the name of the plugin to create a dynamic property
       * of an empty object literal
       */
      obj[pluginName] = function(elem) {
        return $(elem).data(dataName) !== undefined;
      };


      /**
       * Adds custom jQuery pseudo selectors
       */
      $.extend($.expr[":"], obj);


      /**
       * Trigger the callback
       */
      options.callback.call(this);

    });
  };


  /**
   * Default plugin options (add to this)
   * @type {Object}
   */
  $.fn[pluginName].options = {
  };


})(fra_jquery, window, document);
