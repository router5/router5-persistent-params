const persistentParamsPlugin = params => router => {
    // Persistent parameters
    const persistentParams = params.reduce(
        (acc, param) => ({ ...acc, [param]: undefined }),
        {}
    );

    // Root node path
    router.rootNode.path = params.length ? '?' + params.join('&') : '';

    const { buildPath, buildState } = router;

    // Decorators
    router.buildPath = (route, params) => {
        params = { ...persistentParams, ...params };
        return buildPath(route, params);
    };

    router.buildState = (route, params) => {
        params = { ...persistentParams, ...params };
        return buildState(route, params);
    };

    return {
        onTransitionSuccess(toState) {
            Object.keys(toState.params)
                .filter(p => params.indexOf(p) !== -1)
                .forEach(p => persistentParams[p] = toState.params[p]);
        }
    };
};

export default persistentParamsPlugin;
