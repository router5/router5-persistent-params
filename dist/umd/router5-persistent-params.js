(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('router5PersistentParamsPlugin', factory) :
    (global.router5PersistentParamsPlugin = factory());
}(this, function () { 'use strict';

    var babelHelpers = {};

    babelHelpers.defineProperty = function (obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    };

    babelHelpers.extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    babelHelpers;

    var persistentParamsPlugin = function persistentParamsPlugin(params) {
        return function (router) {
            // Persistent parameters
            var persistentParams = params.reduce(function (acc, param) {
                return babelHelpers.extends({}, acc, babelHelpers.defineProperty({}, param, undefined));
            }, {});

            // Root node path
            router.rootNode.path = params.length ? '?' + params.join('&') : '';

            var buildPath = router.buildPath;
            var buildState = router.buildState;

            // Decorators

            router.buildPath = function (route, params) {
                params = babelHelpers.extends({}, persistentParams, params);
                return buildPath(route, params);
            };

            router.buildState = function (route, params) {
                params = babelHelpers.extends({}, persistentParams, params);
                return buildState(route, params);
            };

            return {
                onTransitionSuccess: function onTransitionSuccess(toState) {
                    Object.keys(toState.params).filter(function (p) {
                        return params.indexOf(p) !== -1;
                    }).forEach(function (p) {
                        return persistentParams[p] = toState.params[p];
                    });
                }
            };
        };
    };

    return persistentParamsPlugin;

}));