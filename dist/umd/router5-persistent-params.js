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

    var getDefinedParams = function getDefinedParams(params) {
        return Object.keys(params).filter(function (param) {
            return params[param] !== undefined;
        }).reduce(function (acc, param) {
            return babelHelpers.extends({}, acc, babelHelpers.defineProperty({}, param, params[param]));
        }, {});
    };

    var persistentParamsPlugin = function persistentParamsPlugin() {
        var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        return function (router) {
            // Persistent parameters
            var persistentParams = Array.isArray(params) ? params.reduce(function (acc, param) {
                return babelHelpers.extends({}, acc, babelHelpers.defineProperty({}, param, undefined));
            }, {}) : params;

            var paramNames = Object.keys(persistentParams);

            // Root node path
            var path = router.rootNode.path.split('?')[0] + paramNames.length ? '?' + paramNames.join('&') : '';
            router.rootNode.setPath(path);

            var buildPath = router.buildPath;
            var buildState = router.buildState;

            // Decorators

            router.buildPath = function (route, params) {
                var routeParams = babelHelpers.extends({}, getDefinedParams(persistentParams), params);
                return buildPath.call(router, route, routeParams);
            };

            router.buildState = function (route, params) {
                var routeParams = babelHelpers.extends({}, getDefinedParams(persistentParams), params);
                return buildState.call(router, route, routeParams);
            };

            return {
                name: 'PERSISTENT_PARAMS',
                onTransitionSuccess: function onTransitionSuccess(toState) {
                    Object.keys(toState.params).filter(function (p) {
                        return paramNames.indexOf(p) !== -1;
                    }).forEach(function (p) {
                        return persistentParams[p] = toState.params[p];
                    });
                }
            };
        };
    };

    return persistentParamsPlugin;

}));