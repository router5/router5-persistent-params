[![npm version](https://badge.fury.io/js/router5-persistent-params.svg)](https://badge.fury.io/js/router5-persistent-params)
[![Build Status](https://travis-ci.org/router5/router5-persistent-params.svg?branch=master)](https://travis-ci.org/router5/router5-persistent-params)

# router-persistent-params

> Persistent route parameters plugin for router5.

You just have to pass to the plugin an array of persistent parameters, and those parameters will be added to any route as query parameters (using their last known value). __Note: if you use `#` in your routes, they are not "true" query parameters__.

For now, only query parameters are supported. It works by modifying the path of the root node of your tree of routes (by default the root node path is `''`). If you need support for other types of parameters, please raise an issue to discuss it.

```javascript
import persistentParamsPlugin from 'router5-persistent-params';

const router = new Router5()
    .usePlugin(persistentParamsPlugin(['mode']));
    
// Or

const router = new Router5()
    .usePlugin(persistentParamsPlugin({ 'mode': 'debug' }));
```

