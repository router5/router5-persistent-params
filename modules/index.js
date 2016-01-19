const persistentParamsPlugin = (params = {}) => router => {
    // Persistent parameters
    const persistentParams = Array.isArray(params)
        ? params.reduce((acc, param) => ({ ...acc, [param]: undefined }), {})
        : params;

    const paramNames = Object.keys(persistentParams);

    // Root node path
    const path = router.rootNode.path.split('?')[0] + paramNames.length ? '?' + paramNames.join('&') : '';
    router.rootNode.setPath(path);

    const { buildPath, buildState } = router;

    // Decorators
    router.buildPath = function (route, params) {
        const routeParams = { ...persistentParams, ...params };
        return buildPath.call(router, route, routeParams);
    };

    router.buildState = function (route, params) {
        const routeParams = { ...persistentParams, ...params };
        return buildState.call(router, route, routeParams);
    };

    return {
        name: 'PERSISTENT_PARAMS',
        onTransitionSuccess(toState) {
            Object.keys(toState.params)
                .filter(p => paramNames.indexOf(p) !== -1)
                .forEach(p => persistentParams[p] = toState.params[p]);
        }
    };
};

export default persistentParamsPlugin;
