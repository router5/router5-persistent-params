var router5PersistentParamsPlugin = (function () {
    'use strict';

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
            var path = router.rootNode.path.split('?')[0] + params.length ? '?' + params.join('&') : '';
            router.rootNode.setPath(path);

            var buildPath = router.buildPath;
            var buildState = router.buildState;

            // Decorators

            router.buildPath = function (route, params) {
                var routeParams = babelHelpers.extends({}, persistentParams, params);
                return buildPath.call(router, route, routeParams);
            };

            router.buildState = function (route, params) {
                var routeParams = babelHelpers.extends({}, persistentParams, params);
                return buildState.call(router, route, routeParams);
            };

            return {
                name: 'PERSISTENT_PARAMS',
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

}());