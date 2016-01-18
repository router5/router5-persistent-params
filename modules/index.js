import Path from 'path-parser';

const persistentParamsPlugin = params => router => {
    // Persistent parameters
    const persistentParams = params.reduce(
        (acc, param) => ({ ...acc, [param]: undefined }),
        {}
    );

    // Root node path
    router.rootNode.path = router.rootNode.path.split('?')[0] + params.length ? '?' + params.join('&') : '';
    router.rootNode.parser = new Path(router.rootNode.path);

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
                .filter(p => params.indexOf(p) !== -1)
                .forEach(p => persistentParams[p] = toState.params[p]);
        }
    };
};

export default persistentParamsPlugin;