/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/common/get-electron-binding.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/common/get-electron-binding.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getElectronBinding = void 0;
const getElectronBinding = (name) => {
    if (process._linkedBinding) {
        return process._linkedBinding('electron_common_' + name);
    }
    else if (process.electronBinding) {
        return process.electronBinding(name);
    }
    else {
        return null;
    }
};
exports.getElectronBinding = getElectronBinding;


/***/ }),

/***/ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/common/module-names.js":
/*!***********************************************************************************************!*\
  !*** ./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/common/module-names.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.browserModuleNames = exports.commonModuleNames = void 0;
const get_electron_binding_1 = __webpack_require__(/*! ./get-electron-binding */ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/common/get-electron-binding.js");
exports.commonModuleNames = [
    'clipboard',
    'nativeImage',
    'shell',
];
exports.browserModuleNames = [
    'app',
    'autoUpdater',
    'BaseWindow',
    'BrowserView',
    'BrowserWindow',
    'contentTracing',
    'crashReporter',
    'dialog',
    'globalShortcut',
    'ipcMain',
    'inAppPurchase',
    'Menu',
    'MenuItem',
    'nativeTheme',
    'net',
    'netLog',
    'MessageChannelMain',
    'Notification',
    'powerMonitor',
    'powerSaveBlocker',
    'protocol',
    'screen',
    'session',
    'ShareMenu',
    'systemPreferences',
    'TopLevelWindow',
    'TouchBar',
    'Tray',
    'View',
    'webContents',
    'WebContentsView',
    'webFrameMain',
].concat(exports.commonModuleNames);
const features = get_electron_binding_1.getElectronBinding('features');
if (!features || features.isDesktopCapturerEnabled()) {
    exports.browserModuleNames.push('desktopCapturer');
}
if (!features || features.isViewApiEnabled()) {
    exports.browserModuleNames.push('ImageView');
}


/***/ }),

/***/ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/common/type-utils.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/common/type-utils.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deserialize = exports.serialize = exports.isSerializableObject = exports.isPromise = void 0;
const electron_1 = __webpack_require__(/*! electron */ "electron");
function isPromise(val) {
    return (val &&
        val.then &&
        val.then instanceof Function &&
        val.constructor &&
        val.constructor.reject &&
        val.constructor.reject instanceof Function &&
        val.constructor.resolve &&
        val.constructor.resolve instanceof Function);
}
exports.isPromise = isPromise;
const serializableTypes = [
    Boolean,
    Number,
    String,
    Date,
    Error,
    RegExp,
    ArrayBuffer
];
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#Supported_types
function isSerializableObject(value) {
    return value === null || ArrayBuffer.isView(value) || serializableTypes.some(type => value instanceof type);
}
exports.isSerializableObject = isSerializableObject;
const objectMap = function (source, mapper) {
    const sourceEntries = Object.entries(source);
    const targetEntries = sourceEntries.map(([key, val]) => [key, mapper(val)]);
    return Object.fromEntries(targetEntries);
};
function serializeNativeImage(image) {
    const representations = [];
    const scaleFactors = image.getScaleFactors();
    // Use Buffer when there's only one representation for better perf.
    // This avoids compressing to/from PNG where it's not necessary to
    // ensure uniqueness of dataURLs (since there's only one).
    if (scaleFactors.length === 1) {
        const scaleFactor = scaleFactors[0];
        const size = image.getSize(scaleFactor);
        const buffer = image.toBitmap({ scaleFactor });
        representations.push({ scaleFactor, size, buffer });
    }
    else {
        // Construct from dataURLs to ensure that they are not lost in creation.
        for (const scaleFactor of scaleFactors) {
            const size = image.getSize(scaleFactor);
            const dataURL = image.toDataURL({ scaleFactor });
            representations.push({ scaleFactor, size, dataURL });
        }
    }
    return { __ELECTRON_SERIALIZED_NativeImage__: true, representations };
}
function deserializeNativeImage(value) {
    const image = electron_1.nativeImage.createEmpty();
    // Use Buffer when there's only one representation for better perf.
    // This avoids compressing to/from PNG where it's not necessary to
    // ensure uniqueness of dataURLs (since there's only one).
    if (value.representations.length === 1) {
        const { buffer, size, scaleFactor } = value.representations[0];
        const { width, height } = size;
        image.addRepresentation({ buffer, scaleFactor, width, height });
    }
    else {
        // Construct from dataURLs to ensure that they are not lost in creation.
        for (const rep of value.representations) {
            const { dataURL, size, scaleFactor } = rep;
            const { width, height } = size;
            image.addRepresentation({ dataURL, scaleFactor, width, height });
        }
    }
    return image;
}
function serialize(value) {
    if (value && value.constructor && value.constructor.name === 'NativeImage') {
        return serializeNativeImage(value);
    }
    if (Array.isArray(value)) {
        return value.map(serialize);
    }
    else if (isSerializableObject(value)) {
        return value;
    }
    else if (value instanceof Object) {
        return objectMap(value, serialize);
    }
    else {
        return value;
    }
}
exports.serialize = serialize;
function deserialize(value) {
    if (value && value.__ELECTRON_SERIALIZED_NativeImage__) {
        return deserializeNativeImage(value);
    }
    else if (Array.isArray(value)) {
        return value.map(deserialize);
    }
    else if (isSerializableObject(value)) {
        return value;
    }
    else if (value instanceof Object) {
        return objectMap(value, deserialize);
    }
    else {
        return value;
    }
}
exports.deserialize = deserialize;


/***/ }),

/***/ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/renderer/callbacks-registry.js":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/renderer/callbacks-registry.js ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CallbacksRegistry = void 0;
class CallbacksRegistry {
    constructor() {
        this.nextId = 0;
        this.callbacks = {};
        this.callbackIds = new WeakMap();
        this.locationInfo = new WeakMap();
    }
    add(callback) {
        // The callback is already added.
        let id = this.callbackIds.get(callback);
        if (id != null)
            return id;
        id = this.nextId += 1;
        this.callbacks[id] = callback;
        this.callbackIds.set(callback, id);
        // Capture the location of the function and put it in the ID string,
        // so that release errors can be tracked down easily.
        const regexp = /at (.*)/gi;
        const stackString = (new Error()).stack;
        if (!stackString)
            return id;
        let filenameAndLine;
        let match;
        while ((match = regexp.exec(stackString)) !== null) {
            const location = match[1];
            if (location.includes('(native)'))
                continue;
            if (location.includes('(<anonymous>)'))
                continue;
            if (location.includes('callbacks-registry.js'))
                continue;
            if (location.includes('remote.js'))
                continue;
            if (location.includes('@electron/remote/dist'))
                continue;
            const ref = /([^/^)]*)\)?$/gi.exec(location);
            if (ref)
                filenameAndLine = ref[1];
            break;
        }
        this.locationInfo.set(callback, filenameAndLine);
        return id;
    }
    get(id) {
        return this.callbacks[id] || function () { };
    }
    getLocation(callback) {
        return this.locationInfo.get(callback);
    }
    apply(id, ...args) {
        return this.get(id).apply(global, ...args);
    }
    remove(id) {
        const callback = this.callbacks[id];
        if (callback) {
            this.callbackIds.delete(callback);
            delete this.callbacks[id];
        }
    }
}
exports.CallbacksRegistry = CallbacksRegistry;


/***/ }),

/***/ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/renderer/index.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/renderer/index.js ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
if (process.type === 'browser')
    throw new Error(`"@electron/remote" cannot be required in the browser process. Instead require("@electron/remote/main").`);
__exportStar(__webpack_require__(/*! ./remote */ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/renderer/remote.js"), exports);


/***/ }),

/***/ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/renderer/remote.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/renderer/remote.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createFunctionWithReturnValue = exports.getGlobal = exports.getCurrentWebContents = exports.getCurrentWindow = exports.getBuiltin = void 0;
const callbacks_registry_1 = __webpack_require__(/*! ./callbacks-registry */ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/renderer/callbacks-registry.js");
const type_utils_1 = __webpack_require__(/*! ../common/type-utils */ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/common/type-utils.js");
const electron_1 = __webpack_require__(/*! electron */ "electron");
const module_names_1 = __webpack_require__(/*! ../common/module-names */ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/common/module-names.js");
const get_electron_binding_1 = __webpack_require__(/*! ../common/get-electron-binding */ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/common/get-electron-binding.js");
const callbacksRegistry = new callbacks_registry_1.CallbacksRegistry();
const remoteObjectCache = new Map();
const finalizationRegistry = new FinalizationRegistry((id) => {
    const ref = remoteObjectCache.get(id);
    if (ref !== undefined && ref.deref() === undefined) {
        remoteObjectCache.delete(id);
        electron_1.ipcRenderer.send("REMOTE_BROWSER_DEREFERENCE" /* BROWSER_DEREFERENCE */, contextId, id, 0);
    }
});
const electronIds = new WeakMap();
const isReturnValue = new WeakSet();
function getCachedRemoteObject(id) {
    const ref = remoteObjectCache.get(id);
    if (ref !== undefined) {
        const deref = ref.deref();
        if (deref !== undefined)
            return deref;
    }
}
function setCachedRemoteObject(id, value) {
    const wr = new WeakRef(value);
    remoteObjectCache.set(id, wr);
    finalizationRegistry.register(value, id);
    return value;
}
function getContextId() {
    const v8Util = get_electron_binding_1.getElectronBinding('v8_util');
    if (v8Util) {
        return v8Util.getHiddenValue(global, 'contextId');
    }
    else {
        throw new Error('Electron >=v13.0.0-beta.6 required to support sandboxed renderers');
    }
}
// An unique ID that can represent current context.
const contextId = process.contextId || getContextId();
// Notify the main process when current context is going to be released.
// Note that when the renderer process is destroyed, the message may not be
// sent, we also listen to the "render-view-deleted" event in the main process
// to guard that situation.
process.on('exit', () => {
    const command = "REMOTE_BROWSER_CONTEXT_RELEASE" /* BROWSER_CONTEXT_RELEASE */;
    electron_1.ipcRenderer.send(command, contextId);
});
const IS_REMOTE_PROXY = Symbol('is-remote-proxy');
// Convert the arguments object into an array of meta data.
function wrapArgs(args, visited = new Set()) {
    const valueToMeta = (value) => {
        // Check for circular reference.
        if (visited.has(value)) {
            return {
                type: 'value',
                value: null
            };
        }
        if (value && value.constructor && value.constructor.name === 'NativeImage') {
            return { type: 'nativeimage', value: type_utils_1.serialize(value) };
        }
        else if (Array.isArray(value)) {
            visited.add(value);
            const meta = {
                type: 'array',
                value: wrapArgs(value, visited)
            };
            visited.delete(value);
            return meta;
        }
        else if (value instanceof Buffer) {
            return {
                type: 'buffer',
                value
            };
        }
        else if (type_utils_1.isSerializableObject(value)) {
            return {
                type: 'value',
                value
            };
        }
        else if (typeof value === 'object') {
            if (type_utils_1.isPromise(value)) {
                return {
                    type: 'promise',
                    then: valueToMeta(function (onFulfilled, onRejected) {
                        value.then(onFulfilled, onRejected);
                    })
                };
            }
            else if (electronIds.has(value)) {
                return {
                    type: 'remote-object',
                    id: electronIds.get(value)
                };
            }
            const meta = {
                type: 'object',
                name: value.constructor ? value.constructor.name : '',
                members: []
            };
            visited.add(value);
            for (const prop in value) { // eslint-disable-line guard-for-in
                meta.members.push({
                    name: prop,
                    value: valueToMeta(value[prop])
                });
            }
            visited.delete(value);
            return meta;
        }
        else if (typeof value === 'function' && isReturnValue.has(value)) {
            return {
                type: 'function-with-return-value',
                value: valueToMeta(value())
            };
        }
        else if (typeof value === 'function') {
            return {
                type: 'function',
                id: callbacksRegistry.add(value),
                location: callbacksRegistry.getLocation(value),
                length: value.length
            };
        }
        else {
            return {
                type: 'value',
                value
            };
        }
    };
    return args.map(valueToMeta);
}
// Populate object's members from descriptors.
// The |ref| will be kept referenced by |members|.
// This matches |getObjectMemebers| in rpc-server.
function setObjectMembers(ref, object, metaId, members) {
    if (!Array.isArray(members))
        return;
    for (const member of members) {
        if (Object.prototype.hasOwnProperty.call(object, member.name))
            continue;
        const descriptor = { enumerable: member.enumerable };
        if (member.type === 'method') {
            const remoteMemberFunction = function (...args) {
                let command;
                if (this && this.constructor === remoteMemberFunction) {
                    command = "REMOTE_BROWSER_MEMBER_CONSTRUCTOR" /* BROWSER_MEMBER_CONSTRUCTOR */;
                }
                else {
                    command = "REMOTE_BROWSER_MEMBER_CALL" /* BROWSER_MEMBER_CALL */;
                }
                const ret = electron_1.ipcRenderer.sendSync(command, contextId, metaId, member.name, wrapArgs(args));
                return metaToValue(ret);
            };
            let descriptorFunction = proxyFunctionProperties(remoteMemberFunction, metaId, member.name);
            descriptor.get = () => {
                descriptorFunction.ref = ref; // The member should reference its object.
                return descriptorFunction;
            };
            // Enable monkey-patch the method
            descriptor.set = (value) => {
                descriptorFunction = value;
                return value;
            };
            descriptor.configurable = true;
        }
        else if (member.type === 'get') {
            descriptor.get = () => {
                const command = "REMOTE_BROWSER_MEMBER_GET" /* BROWSER_MEMBER_GET */;
                const meta = electron_1.ipcRenderer.sendSync(command, contextId, metaId, member.name);
                return metaToValue(meta);
            };
            if (member.writable) {
                descriptor.set = (value) => {
                    const args = wrapArgs([value]);
                    const command = "REMOTE_BROWSER_MEMBER_SET" /* BROWSER_MEMBER_SET */;
                    const meta = electron_1.ipcRenderer.sendSync(command, contextId, metaId, member.name, args);
                    if (meta != null)
                        metaToValue(meta);
                    return value;
                };
            }
        }
        Object.defineProperty(object, member.name, descriptor);
    }
}
// Populate object's prototype from descriptor.
// This matches |getObjectPrototype| in rpc-server.
function setObjectPrototype(ref, object, metaId, descriptor) {
    if (descriptor === null)
        return;
    const proto = {};
    setObjectMembers(ref, proto, metaId, descriptor.members);
    setObjectPrototype(ref, proto, metaId, descriptor.proto);
    Object.setPrototypeOf(object, proto);
}
// Wrap function in Proxy for accessing remote properties
function proxyFunctionProperties(remoteMemberFunction, metaId, name) {
    let loaded = false;
    // Lazily load function properties
    const loadRemoteProperties = () => {
        if (loaded)
            return;
        loaded = true;
        const command = "REMOTE_BROWSER_MEMBER_GET" /* BROWSER_MEMBER_GET */;
        const meta = electron_1.ipcRenderer.sendSync(command, contextId, metaId, name);
        setObjectMembers(remoteMemberFunction, remoteMemberFunction, meta.id, meta.members);
    };
    return new Proxy(remoteMemberFunction, {
        set: (target, property, value) => {
            if (property !== 'ref')
                loadRemoteProperties();
            target[property] = value;
            return true;
        },
        get: (target, property) => {
            if (property === IS_REMOTE_PROXY)
                return true;
            if (!Object.prototype.hasOwnProperty.call(target, property))
                loadRemoteProperties();
            const value = target[property];
            if (property === 'toString' && typeof value === 'function') {
                return value.bind(target);
            }
            return value;
        },
        ownKeys: (target) => {
            loadRemoteProperties();
            return Object.getOwnPropertyNames(target);
        },
        getOwnPropertyDescriptor: (target, property) => {
            const descriptor = Object.getOwnPropertyDescriptor(target, property);
            if (descriptor)
                return descriptor;
            loadRemoteProperties();
            return Object.getOwnPropertyDescriptor(target, property);
        }
    });
}
// Convert meta data from browser into real value.
function metaToValue(meta) {
    if (meta.type === 'value') {
        return meta.value;
    }
    else if (meta.type === 'array') {
        return meta.members.map((member) => metaToValue(member));
    }
    else if (meta.type === 'nativeimage') {
        return type_utils_1.deserialize(meta.value);
    }
    else if (meta.type === 'buffer') {
        return Buffer.from(meta.value.buffer, meta.value.byteOffset, meta.value.byteLength);
    }
    else if (meta.type === 'promise') {
        return Promise.resolve({ then: metaToValue(meta.then) });
    }
    else if (meta.type === 'error') {
        return metaToError(meta);
    }
    else if (meta.type === 'exception') {
        if (meta.value.type === 'error') {
            throw metaToError(meta.value);
        }
        else {
            throw new Error(`Unexpected value type in exception: ${meta.value.type}`);
        }
    }
    else {
        let ret;
        if ('id' in meta) {
            const cached = getCachedRemoteObject(meta.id);
            if (cached !== undefined) {
                return cached;
            }
        }
        // A shadow class to represent the remote function object.
        if (meta.type === 'function') {
            const remoteFunction = function (...args) {
                let command;
                if (this && this.constructor === remoteFunction) {
                    command = "REMOTE_BROWSER_CONSTRUCTOR" /* BROWSER_CONSTRUCTOR */;
                }
                else {
                    command = "REMOTE_BROWSER_FUNCTION_CALL" /* BROWSER_FUNCTION_CALL */;
                }
                const obj = electron_1.ipcRenderer.sendSync(command, contextId, meta.id, wrapArgs(args));
                return metaToValue(obj);
            };
            ret = remoteFunction;
        }
        else {
            ret = {};
        }
        setObjectMembers(ret, ret, meta.id, meta.members);
        setObjectPrototype(ret, ret, meta.id, meta.proto);
        if (ret.constructor && ret.constructor[IS_REMOTE_PROXY]) {
            Object.defineProperty(ret.constructor, 'name', { value: meta.name });
        }
        // Track delegate obj's lifetime & tell browser to clean up when object is GCed.
        electronIds.set(ret, meta.id);
        setCachedRemoteObject(meta.id, ret);
        return ret;
    }
}
function metaToError(meta) {
    const obj = meta.value;
    for (const { name, value } of meta.members) {
        obj[name] = metaToValue(value);
    }
    return obj;
}
function handleMessage(channel, handler) {
    electron_1.ipcRenderer.on(channel, (event, passedContextId, id, ...args) => {
        if (event.senderId !== 0) {
            console.error(`Message ${channel} sent by unexpected WebContents (${event.senderId})`);
            return;
        }
        if (passedContextId === contextId) {
            handler(id, ...args);
        }
        else {
            // Message sent to an un-exist context, notify the error to main process.
            electron_1.ipcRenderer.send("REMOTE_BROWSER_WRONG_CONTEXT_ERROR" /* BROWSER_WRONG_CONTEXT_ERROR */, contextId, passedContextId, id);
        }
    });
}
const enableStacks = process.argv.includes('--enable-api-filtering-logging');
function getCurrentStack() {
    const target = { stack: undefined };
    if (enableStacks) {
        Error.captureStackTrace(target, getCurrentStack);
    }
    return target.stack;
}
// Browser calls a callback in renderer.
handleMessage("REMOTE_RENDERER_CALLBACK" /* RENDERER_CALLBACK */, (id, args) => {
    callbacksRegistry.apply(id, metaToValue(args));
});
// A callback in browser is released.
handleMessage("REMOTE_RENDERER_RELEASE_CALLBACK" /* RENDERER_RELEASE_CALLBACK */, (id) => {
    callbacksRegistry.remove(id);
});
exports.require = (module) => {
    const command = "REMOTE_BROWSER_REQUIRE" /* BROWSER_REQUIRE */;
    const meta = electron_1.ipcRenderer.sendSync(command, contextId, module, getCurrentStack());
    return metaToValue(meta);
};
// Alias to remote.require('electron').xxx.
function getBuiltin(module) {
    const command = "REMOTE_BROWSER_GET_BUILTIN" /* BROWSER_GET_BUILTIN */;
    const meta = electron_1.ipcRenderer.sendSync(command, contextId, module, getCurrentStack());
    return metaToValue(meta);
}
exports.getBuiltin = getBuiltin;
function getCurrentWindow() {
    const command = "REMOTE_BROWSER_GET_CURRENT_WINDOW" /* BROWSER_GET_CURRENT_WINDOW */;
    const meta = electron_1.ipcRenderer.sendSync(command, contextId, getCurrentStack());
    return metaToValue(meta);
}
exports.getCurrentWindow = getCurrentWindow;
// Get current WebContents object.
function getCurrentWebContents() {
    const command = "REMOTE_BROWSER_GET_CURRENT_WEB_CONTENTS" /* BROWSER_GET_CURRENT_WEB_CONTENTS */;
    const meta = electron_1.ipcRenderer.sendSync(command, contextId, getCurrentStack());
    return metaToValue(meta);
}
exports.getCurrentWebContents = getCurrentWebContents;
// Get a global object in browser.
function getGlobal(name) {
    const command = "REMOTE_BROWSER_GET_GLOBAL" /* BROWSER_GET_GLOBAL */;
    const meta = electron_1.ipcRenderer.sendSync(command, contextId, name, getCurrentStack());
    return metaToValue(meta);
}
exports.getGlobal = getGlobal;
// Get the process object in browser.
Object.defineProperty(exports, "process", ({
    enumerable: true,
    get: () => exports.getGlobal('process')
}));
// Create a function that will return the specified value when called in browser.
function createFunctionWithReturnValue(returnValue) {
    const func = () => returnValue;
    isReturnValue.add(func);
    return func;
}
exports.createFunctionWithReturnValue = createFunctionWithReturnValue;
const addBuiltinProperty = (name) => {
    Object.defineProperty(exports, name, {
        enumerable: true,
        get: () => exports.getBuiltin(name)
    });
};
module_names_1.browserModuleNames
    .forEach(addBuiltinProperty);


/***/ }),

/***/ "./node_modules/_@electron_remote@1.2.1@@electron/remote/renderer/index.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/_@electron_remote@1.2.1@@electron/remote/renderer/index.js ***!
  \*********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(/*! ../dist/src/renderer */ "./node_modules/_@electron_remote@1.2.1@@electron/remote/dist/src/renderer/index.js")


/***/ }),

/***/ "./node_modules/_marked@3.0.2@marked/lib/marked.js":
/*!*********************************************************!*\
  !*** ./node_modules/_marked@3.0.2@marked/lib/marked.js ***!
  \*********************************************************/
/***/ (function(module) {

/**
 * marked - a markdown parser
 * Copyright (c) 2011-2021, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/markedjs/marked
 */

/**
 * DO NOT EDIT THIS FILE
 * The code in this file is generated from files in ./src/
 */

(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, (function () { 'use strict';

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (it) return (it = it.call(o)).next.bind(it);

    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      return function () {
        if (i >= o.length) return {
          done: true
        };
        return {
          done: false,
          value: o[i++]
        };
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var defaults$5 = {exports: {}};

  function getDefaults$1() {
    return {
      baseUrl: null,
      breaks: false,
      extensions: null,
      gfm: true,
      headerIds: true,
      headerPrefix: '',
      highlight: null,
      langPrefix: 'language-',
      mangle: true,
      pedantic: false,
      renderer: null,
      sanitize: false,
      sanitizer: null,
      silent: false,
      smartLists: false,
      smartypants: false,
      tokenizer: null,
      walkTokens: null,
      xhtml: false
    };
  }

  function changeDefaults$1(newDefaults) {
    defaults$5.exports.defaults = newDefaults;
  }

  defaults$5.exports = {
    defaults: getDefaults$1(),
    getDefaults: getDefaults$1,
    changeDefaults: changeDefaults$1
  };

  /**
   * Helpers
   */
  var escapeTest = /[&<>"']/;
  var escapeReplace = /[&<>"']/g;
  var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
  var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
  var escapeReplacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };

  var getEscapeReplacement = function getEscapeReplacement(ch) {
    return escapeReplacements[ch];
  };

  function escape$2(html, encode) {
    if (encode) {
      if (escapeTest.test(html)) {
        return html.replace(escapeReplace, getEscapeReplacement);
      }
    } else {
      if (escapeTestNoEncode.test(html)) {
        return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
      }
    }

    return html;
  }

  var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

  function unescape$1(html) {
    // explicitly match decimal, hex, and named HTML entities
    return html.replace(unescapeTest, function (_, n) {
      n = n.toLowerCase();
      if (n === 'colon') return ':';

      if (n.charAt(0) === '#') {
        return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
      }

      return '';
    });
  }

  var caret = /(^|[^\[])\^/g;

  function edit$1(regex, opt) {
    regex = regex.source || regex;
    opt = opt || '';
    var obj = {
      replace: function replace(name, val) {
        val = val.source || val;
        val = val.replace(caret, '$1');
        regex = regex.replace(name, val);
        return obj;
      },
      getRegex: function getRegex() {
        return new RegExp(regex, opt);
      }
    };
    return obj;
  }

  var nonWordAndColonTest = /[^\w:]/g;
  var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

  function cleanUrl$1(sanitize, base, href) {
    if (sanitize) {
      var prot;

      try {
        prot = decodeURIComponent(unescape$1(href)).replace(nonWordAndColonTest, '').toLowerCase();
      } catch (e) {
        return null;
      }

      if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
        return null;
      }
    }

    if (base && !originIndependentUrl.test(href)) {
      href = resolveUrl(base, href);
    }

    try {
      href = encodeURI(href).replace(/%25/g, '%');
    } catch (e) {
      return null;
    }

    return href;
  }

  var baseUrls = {};
  var justDomain = /^[^:]+:\/*[^/]*$/;
  var protocol = /^([^:]+:)[\s\S]*$/;
  var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

  function resolveUrl(base, href) {
    if (!baseUrls[' ' + base]) {
      // we can ignore everything in base after the last slash of its path component,
      // but we might need to add _that_
      // https://tools.ietf.org/html/rfc3986#section-3
      if (justDomain.test(base)) {
        baseUrls[' ' + base] = base + '/';
      } else {
        baseUrls[' ' + base] = rtrim$1(base, '/', true);
      }
    }

    base = baseUrls[' ' + base];
    var relativeBase = base.indexOf(':') === -1;

    if (href.substring(0, 2) === '//') {
      if (relativeBase) {
        return href;
      }

      return base.replace(protocol, '$1') + href;
    } else if (href.charAt(0) === '/') {
      if (relativeBase) {
        return href;
      }

      return base.replace(domain, '$1') + href;
    } else {
      return base + href;
    }
  }

  var noopTest$1 = {
    exec: function noopTest() {}
  };

  function merge$2(obj) {
    var i = 1,
        target,
        key;

    for (; i < arguments.length; i++) {
      target = arguments[i];

      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }

    return obj;
  }

  function splitCells$1(tableRow, count) {
    // ensure that every cell-delimiting pipe has a space
    // before it to distinguish it from an escaped pipe
    var row = tableRow.replace(/\|/g, function (match, offset, str) {
      var escaped = false,
          curr = offset;

      while (--curr >= 0 && str[curr] === '\\') {
        escaped = !escaped;
      }

      if (escaped) {
        // odd number of slashes means | is escaped
        // so we leave it alone
        return '|';
      } else {
        // add space before unescaped |
        return ' |';
      }
    }),
        cells = row.split(/ \|/);
    var i = 0; // First/last cell in a row cannot be empty if it has no leading/trailing pipe

    if (!cells[0].trim()) {
      cells.shift();
    }

    if (!cells[cells.length - 1].trim()) {
      cells.pop();
    }

    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) {
        cells.push('');
      }
    }

    for (; i < cells.length; i++) {
      // leading or trailing whitespace is ignored per the gfm spec
      cells[i] = cells[i].trim().replace(/\\\|/g, '|');
    }

    return cells;
  } // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
  // /c*$/ is vulnerable to REDOS.
  // invert: Remove suffix of non-c chars instead. Default falsey.


  function rtrim$1(str, c, invert) {
    var l = str.length;

    if (l === 0) {
      return '';
    } // Length of suffix matching the invert condition.


    var suffLen = 0; // Step left until we fail to match the invert condition.

    while (suffLen < l) {
      var currChar = str.charAt(l - suffLen - 1);

      if (currChar === c && !invert) {
        suffLen++;
      } else if (currChar !== c && invert) {
        suffLen++;
      } else {
        break;
      }
    }

    return str.substr(0, l - suffLen);
  }

  function findClosingBracket$1(str, b) {
    if (str.indexOf(b[1]) === -1) {
      return -1;
    }

    var l = str.length;
    var level = 0,
        i = 0;

    for (; i < l; i++) {
      if (str[i] === '\\') {
        i++;
      } else if (str[i] === b[0]) {
        level++;
      } else if (str[i] === b[1]) {
        level--;

        if (level < 0) {
          return i;
        }
      }
    }

    return -1;
  }

  function checkSanitizeDeprecation$1(opt) {
    if (opt && opt.sanitize && !opt.silent) {
      console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
    }
  } // copied from https://stackoverflow.com/a/5450113/806777


  function repeatString$1(pattern, count) {
    if (count < 1) {
      return '';
    }

    var result = '';

    while (count > 1) {
      if (count & 1) {
        result += pattern;
      }

      count >>= 1;
      pattern += pattern;
    }

    return result + pattern;
  }

  var helpers = {
    escape: escape$2,
    unescape: unescape$1,
    edit: edit$1,
    cleanUrl: cleanUrl$1,
    resolveUrl: resolveUrl,
    noopTest: noopTest$1,
    merge: merge$2,
    splitCells: splitCells$1,
    rtrim: rtrim$1,
    findClosingBracket: findClosingBracket$1,
    checkSanitizeDeprecation: checkSanitizeDeprecation$1,
    repeatString: repeatString$1
  };

  var defaults$4 = defaults$5.exports.defaults;
  var rtrim = helpers.rtrim,
      splitCells = helpers.splitCells,
      _escape = helpers.escape,
      findClosingBracket = helpers.findClosingBracket;

  function outputLink(cap, link, raw, lexer) {
    var href = link.href;
    var title = link.title ? _escape(link.title) : null;
    var text = cap[1].replace(/\\([\[\]])/g, '$1');

    if (cap[0].charAt(0) !== '!') {
      lexer.state.inLink = true;
      var token = {
        type: 'link',
        raw: raw,
        href: href,
        title: title,
        text: text,
        tokens: lexer.inlineTokens(text, [])
      };
      lexer.state.inLink = false;
      return token;
    } else {
      return {
        type: 'image',
        raw: raw,
        href: href,
        title: title,
        text: _escape(text)
      };
    }
  }

  function indentCodeCompensation(raw, text) {
    var matchIndentToCode = raw.match(/^(\s+)(?:```)/);

    if (matchIndentToCode === null) {
      return text;
    }

    var indentToCode = matchIndentToCode[1];
    return text.split('\n').map(function (node) {
      var matchIndentInNode = node.match(/^\s+/);

      if (matchIndentInNode === null) {
        return node;
      }

      var indentInNode = matchIndentInNode[0];

      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }

      return node;
    }).join('\n');
  }
  /**
   * Tokenizer
   */


  var Tokenizer_1 = /*#__PURE__*/function () {
    function Tokenizer(options) {
      this.options = options || defaults$4;
    }

    var _proto = Tokenizer.prototype;

    _proto.space = function space(src) {
      var cap = this.rules.block.newline.exec(src);

      if (cap) {
        if (cap[0].length > 1) {
          return {
            type: 'space',
            raw: cap[0]
          };
        }

        return {
          raw: '\n'
        };
      }
    };

    _proto.code = function code(src) {
      var cap = this.rules.block.code.exec(src);

      if (cap) {
        var text = cap[0].replace(/^ {1,4}/gm, '');
        return {
          type: 'code',
          raw: cap[0],
          codeBlockStyle: 'indented',
          text: !this.options.pedantic ? rtrim(text, '\n') : text
        };
      }
    };

    _proto.fences = function fences(src) {
      var cap = this.rules.block.fences.exec(src);

      if (cap) {
        var raw = cap[0];
        var text = indentCodeCompensation(raw, cap[3] || '');
        return {
          type: 'code',
          raw: raw,
          lang: cap[2] ? cap[2].trim() : cap[2],
          text: text
        };
      }
    };

    _proto.heading = function heading(src) {
      var cap = this.rules.block.heading.exec(src);

      if (cap) {
        var text = cap[2].trim(); // remove trailing #s

        if (/#$/.test(text)) {
          var trimmed = rtrim(text, '#');

          if (this.options.pedantic) {
            text = trimmed.trim();
          } else if (!trimmed || / $/.test(trimmed)) {
            // CommonMark requires space before trailing #s
            text = trimmed.trim();
          }
        }

        var token = {
          type: 'heading',
          raw: cap[0],
          depth: cap[1].length,
          text: text,
          tokens: []
        };
        this.lexer.inline(token.text, token.tokens);
        return token;
      }
    };

    _proto.hr = function hr(src) {
      var cap = this.rules.block.hr.exec(src);

      if (cap) {
        return {
          type: 'hr',
          raw: cap[0]
        };
      }
    };

    _proto.blockquote = function blockquote(src) {
      var cap = this.rules.block.blockquote.exec(src);

      if (cap) {
        var text = cap[0].replace(/^ *> ?/gm, '');
        return {
          type: 'blockquote',
          raw: cap[0],
          tokens: this.lexer.blockTokens(text, []),
          text: text
        };
      }
    };

    _proto.list = function list(src) {
      var cap = this.rules.block.list.exec(src);

      if (cap) {
        var raw, istask, ischecked, indent, i, blankLine, endsWithBlankLine, line, lines, itemContents;
        var bull = cap[1].trim();
        var isordered = bull.length > 1;
        var list = {
          type: 'list',
          raw: '',
          ordered: isordered,
          start: isordered ? +bull.slice(0, -1) : '',
          loose: false,
          items: []
        };
        bull = isordered ? "\\d{1,9}\\" + bull.slice(-1) : "\\" + bull;

        if (this.options.pedantic) {
          bull = isordered ? bull : '[*+-]';
        } // Get next list item


        var itemRegex = new RegExp("^( {0,3}" + bull + ")((?: [^\\n]*| *)(?:\\n[^\\n]*)*(?:\\n|$))"); // Get each top-level item

        while (src) {
          if (this.rules.block.hr.test(src)) {
            // End list if we encounter an HR (possibly move into itemRegex?)
            break;
          }

          if (!(cap = itemRegex.exec(src))) {
            break;
          }

          lines = cap[2].split('\n');

          if (this.options.pedantic) {
            indent = 2;
            itemContents = lines[0].trimLeft();
          } else {
            indent = cap[2].search(/[^ ]/); // Find first non-space char

            indent = cap[1].length + (indent > 4 ? 1 : indent); // intented code blocks after 4 spaces; indent is always 1

            itemContents = lines[0].slice(indent - cap[1].length);
          }

          blankLine = false;
          raw = cap[0];

          if (!lines[0] && /^ *$/.test(lines[1])) {
            // items begin with at most one blank line
            raw = cap[1] + lines.slice(0, 2).join('\n') + '\n';
            list.loose = true;
            lines = [];
          }

          var nextBulletRegex = new RegExp("^ {0," + Math.min(3, indent - 1) + "}(?:[*+-]|\\d{1,9}[.)])");

          for (i = 1; i < lines.length; i++) {
            line = lines[i];

            if (this.options.pedantic) {
              // Re-align to follow commonmark nesting rules
              line = line.replace(/^ {1,4}(?=( {4})*[^ ])/g, '  ');
            } // End list item if found start of new bullet


            if (nextBulletRegex.test(line)) {
              raw = cap[1] + lines.slice(0, i).join('\n') + '\n';
              break;
            } // Until we encounter a blank line, item contents do not need indentation


            if (!blankLine) {
              if (!line.trim()) {
                // Check if current line is empty
                blankLine = true;
              } // Dedent if possible


              if (line.search(/[^ ]/) >= indent) {
                itemContents += '\n' + line.slice(indent);
              } else {
                itemContents += '\n' + line;
              }

              continue;
            } // Dedent this line


            if (line.search(/[^ ]/) >= indent || !line.trim()) {
              itemContents += '\n' + line.slice(indent);
              continue;
            } else {
              // Line was not properly indented; end of this item
              raw = cap[1] + lines.slice(0, i).join('\n') + '\n';
              break;
            }
          }

          if (!list.loose) {
            // If the previous item ended with a blank line, the list is loose
            if (endsWithBlankLine) {
              list.loose = true;
            } else if (/\n *\n *$/.test(raw)) {
              endsWithBlankLine = true;
            }
          } // Check for task list items


          if (this.options.gfm) {
            istask = /^\[[ xX]\] /.exec(itemContents);

            if (istask) {
              ischecked = istask[0] !== '[ ] ';
              itemContents = itemContents.replace(/^\[[ xX]\] +/, '');
            }
          }

          list.items.push({
            type: 'list_item',
            raw: raw,
            task: !!istask,
            checked: ischecked,
            loose: false,
            text: itemContents
          });
          list.raw += raw;
          src = src.slice(raw.length);
        } // Do not consume newlines at end of final item. Alternatively, make itemRegex *start* with any newlines to simplify/speed up endsWithBlankLine logic


        list.items[list.items.length - 1].raw = raw.trimRight();
        list.items[list.items.length - 1].text = itemContents.trimRight();
        list.raw = list.raw.trimRight();
        var l = list.items.length; // Item child tokens handled here at end because we needed to have the final item to trim it first

        for (i = 0; i < l; i++) {
          this.lexer.state.top = false;
          list.items[i].tokens = this.lexer.blockTokens(list.items[i].text, []);

          if (list.items[i].tokens.some(function (t) {
            return t.type === 'space';
          })) {
            list.loose = true;
            list.items[i].loose = true;
          }
        }

        return list;
      }
    };

    _proto.html = function html(src) {
      var cap = this.rules.block.html.exec(src);

      if (cap) {
        var token = {
          type: 'html',
          raw: cap[0],
          pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
          text: cap[0]
        };

        if (this.options.sanitize) {
          token.type = 'paragraph';
          token.text = this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]);
          token.tokens = [];
          this.lexer.inline(token.text, token.tokens);
        }

        return token;
      }
    };

    _proto.def = function def(src) {
      var cap = this.rules.block.def.exec(src);

      if (cap) {
        if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
        var tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
        return {
          type: 'def',
          tag: tag,
          raw: cap[0],
          href: cap[2],
          title: cap[3]
        };
      }
    };

    _proto.table = function table(src) {
      var cap = this.rules.block.table.exec(src);

      if (cap) {
        var item = {
          type: 'table',
          header: splitCells(cap[1]).map(function (c) {
            return {
              text: c
            };
          }),
          align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
          rows: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
        };

        if (item.header.length === item.align.length) {
          item.raw = cap[0];
          var l = item.align.length;
          var i, j, k, row;

          for (i = 0; i < l; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = 'right';
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = 'center';
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = 'left';
            } else {
              item.align[i] = null;
            }
          }

          l = item.rows.length;

          for (i = 0; i < l; i++) {
            item.rows[i] = splitCells(item.rows[i], item.header.length).map(function (c) {
              return {
                text: c
              };
            });
          } // parse child tokens inside headers and cells
          // header child tokens


          l = item.header.length;

          for (j = 0; j < l; j++) {
            item.header[j].tokens = [];
            this.lexer.inlineTokens(item.header[j].text, item.header[j].tokens);
          } // cell child tokens


          l = item.rows.length;

          for (j = 0; j < l; j++) {
            row = item.rows[j];

            for (k = 0; k < row.length; k++) {
              row[k].tokens = [];
              this.lexer.inlineTokens(row[k].text, row[k].tokens);
            }
          }

          return item;
        }
      }
    };

    _proto.lheading = function lheading(src) {
      var cap = this.rules.block.lheading.exec(src);

      if (cap) {
        var token = {
          type: 'heading',
          raw: cap[0],
          depth: cap[2].charAt(0) === '=' ? 1 : 2,
          text: cap[1],
          tokens: []
        };
        this.lexer.inline(token.text, token.tokens);
        return token;
      }
    };

    _proto.paragraph = function paragraph(src) {
      var cap = this.rules.block.paragraph.exec(src);

      if (cap) {
        var token = {
          type: 'paragraph',
          raw: cap[0],
          text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1],
          tokens: []
        };
        this.lexer.inline(token.text, token.tokens);
        return token;
      }
    };

    _proto.text = function text(src) {
      var cap = this.rules.block.text.exec(src);

      if (cap) {
        var token = {
          type: 'text',
          raw: cap[0],
          text: cap[0],
          tokens: []
        };
        this.lexer.inline(token.text, token.tokens);
        return token;
      }
    };

    _proto.escape = function escape(src) {
      var cap = this.rules.inline.escape.exec(src);

      if (cap) {
        return {
          type: 'escape',
          raw: cap[0],
          text: _escape(cap[1])
        };
      }
    };

    _proto.tag = function tag(src) {
      var cap = this.rules.inline.tag.exec(src);

      if (cap) {
        if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
          this.lexer.state.inLink = true;
        } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
          this.lexer.state.inLink = false;
        }

        if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.lexer.state.inRawBlock = true;
        } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          this.lexer.state.inRawBlock = false;
        }

        return {
          type: this.options.sanitize ? 'text' : 'html',
          raw: cap[0],
          inLink: this.lexer.state.inLink,
          inRawBlock: this.lexer.state.inRawBlock,
          text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
        };
      }
    };

    _proto.link = function link(src) {
      var cap = this.rules.inline.link.exec(src);

      if (cap) {
        var trimmedUrl = cap[2].trim();

        if (!this.options.pedantic && /^</.test(trimmedUrl)) {
          // commonmark requires matching angle brackets
          if (!/>$/.test(trimmedUrl)) {
            return;
          } // ending angle bracket cannot be escaped


          var rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');

          if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
            return;
          }
        } else {
          // find closing parenthesis
          var lastParenIndex = findClosingBracket(cap[2], '()');

          if (lastParenIndex > -1) {
            var start = cap[0].indexOf('!') === 0 ? 5 : 4;
            var linkLen = start + cap[1].length + lastParenIndex;
            cap[2] = cap[2].substring(0, lastParenIndex);
            cap[0] = cap[0].substring(0, linkLen).trim();
            cap[3] = '';
          }
        }

        var href = cap[2];
        var title = '';

        if (this.options.pedantic) {
          // split pedantic href and title
          var link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

          if (link) {
            href = link[1];
            title = link[3];
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : '';
        }

        href = href.trim();

        if (/^</.test(href)) {
          if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
            // pedantic allows starting angle bracket without ending angle bracket
            href = href.slice(1);
          } else {
            href = href.slice(1, -1);
          }
        }

        return outputLink(cap, {
          href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
          title: title ? title.replace(this.rules.inline._escapes, '$1') : title
        }, cap[0], this.lexer);
      }
    };

    _proto.reflink = function reflink(src, links) {
      var cap;

      if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
        var link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
        link = links[link.toLowerCase()];

        if (!link || !link.href) {
          var text = cap[0].charAt(0);
          return {
            type: 'text',
            raw: text,
            text: text
          };
        }

        return outputLink(cap, link, cap[0], this.lexer);
      }
    };

    _proto.emStrong = function emStrong(src, maskedSrc, prevChar) {
      if (prevChar === void 0) {
        prevChar = '';
      }

      var match = this.rules.inline.emStrong.lDelim.exec(src);
      if (!match) return; // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well

      if (match[3] && prevChar.match(/(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDD\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/)) return;
      var nextChar = match[1] || match[2] || '';

      if (!nextChar || nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar))) {
        var lLength = match[0].length - 1;
        var rDelim,
            rLength,
            delimTotal = lLength,
            midDelimTotal = 0;
        var endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
        endReg.lastIndex = 0; // Clip maskedSrc to same section of string as src (move to lexer?)

        maskedSrc = maskedSrc.slice(-1 * src.length + lLength);

        while ((match = endReg.exec(maskedSrc)) != null) {
          rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
          if (!rDelim) continue; // skip single * in __abc*abc__

          rLength = rDelim.length;

          if (match[3] || match[4]) {
            // found another Left Delim
            delimTotal += rLength;
            continue;
          } else if (match[5] || match[6]) {
            // either Left or Right Delim
            if (lLength % 3 && !((lLength + rLength) % 3)) {
              midDelimTotal += rLength;
              continue; // CommonMark Emphasis Rules 9-10
            }
          }

          delimTotal -= rLength;
          if (delimTotal > 0) continue; // Haven't found enough closing delimiters
          // Remove extra characters. *a*** -> *a*

          rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal); // Create `em` if smallest delimiter has odd char count. *a***

          if (Math.min(lLength, rLength) % 2) {
            var _text = src.slice(1, lLength + match.index + rLength);

            return {
              type: 'em',
              raw: src.slice(0, lLength + match.index + rLength + 1),
              text: _text,
              tokens: this.lexer.inlineTokens(_text, [])
            };
          } // Create 'strong' if smallest delimiter has even char count. **a***


          var text = src.slice(2, lLength + match.index + rLength - 1);
          return {
            type: 'strong',
            raw: src.slice(0, lLength + match.index + rLength + 1),
            text: text,
            tokens: this.lexer.inlineTokens(text, [])
          };
        }
      }
    };

    _proto.codespan = function codespan(src) {
      var cap = this.rules.inline.code.exec(src);

      if (cap) {
        var text = cap[2].replace(/\n/g, ' ');
        var hasNonSpaceChars = /[^ ]/.test(text);
        var hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);

        if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
          text = text.substring(1, text.length - 1);
        }

        text = _escape(text, true);
        return {
          type: 'codespan',
          raw: cap[0],
          text: text
        };
      }
    };

    _proto.br = function br(src) {
      var cap = this.rules.inline.br.exec(src);

      if (cap) {
        return {
          type: 'br',
          raw: cap[0]
        };
      }
    };

    _proto.del = function del(src) {
      var cap = this.rules.inline.del.exec(src);

      if (cap) {
        return {
          type: 'del',
          raw: cap[0],
          text: cap[2],
          tokens: this.lexer.inlineTokens(cap[2], [])
        };
      }
    };

    _proto.autolink = function autolink(src, mangle) {
      var cap = this.rules.inline.autolink.exec(src);

      if (cap) {
        var text, href;

        if (cap[2] === '@') {
          text = _escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
          href = 'mailto:' + text;
        } else {
          text = _escape(cap[1]);
          href = text;
        }

        return {
          type: 'link',
          raw: cap[0],
          text: text,
          href: href,
          tokens: [{
            type: 'text',
            raw: text,
            text: text
          }]
        };
      }
    };

    _proto.url = function url(src, mangle) {
      var cap;

      if (cap = this.rules.inline.url.exec(src)) {
        var text, href;

        if (cap[2] === '@') {
          text = _escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
          href = 'mailto:' + text;
        } else {
          // do extended autolink path validation
          var prevCapZero;

          do {
            prevCapZero = cap[0];
            cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
          } while (prevCapZero !== cap[0]);

          text = _escape(cap[0]);

          if (cap[1] === 'www.') {
            href = 'http://' + text;
          } else {
            href = text;
          }
        }

        return {
          type: 'link',
          raw: cap[0],
          text: text,
          href: href,
          tokens: [{
            type: 'text',
            raw: text,
            text: text
          }]
        };
      }
    };

    _proto.inlineText = function inlineText(src, smartypants) {
      var cap = this.rules.inline.text.exec(src);

      if (cap) {
        var text;

        if (this.lexer.state.inRawBlock) {
          text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0];
        } else {
          text = _escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
        }

        return {
          type: 'text',
          raw: cap[0],
          text: text
        };
      }
    };

    return Tokenizer;
  }();

  var noopTest = helpers.noopTest,
      edit = helpers.edit,
      merge$1 = helpers.merge;
  /**
   * Block-Level Grammar
   */

  var block$1 = {
    newline: /^(?: *(?:\n|$))+/,
    code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
    fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( {0,3}bull)( [^\n]+?)?(?:\n|$)/,
    html: '^ {0,3}(?:' // optional indentation
    + '<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
    + '|comment[^\\n]*(\\n+|$)' // (2)
    + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
    + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
    + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
    + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (6)
    + '|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) open tag
    + '|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)' // (7) closing tag
    + ')',
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    table: noopTest,
    lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
    // regex template, placeholders will be replaced according to different paragraph
    // interruption rules of commonmark and the original markdown spec:
    _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
    text: /^[^\n]+/
  };
  block$1._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
  block$1._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
  block$1.def = edit(block$1.def).replace('label', block$1._label).replace('title', block$1._title).getRegex();
  block$1.bullet = /(?:[*+-]|\d{1,9}[.)])/;
  block$1.listItemStart = edit(/^( *)(bull) */).replace('bull', block$1.bullet).getRegex();
  block$1.list = edit(block$1.list).replace(/bull/g, block$1.bullet).replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))').replace('def', '\\n+(?=' + block$1.def.source + ')').getRegex();
  block$1._tag = 'address|article|aside|base|basefont|blockquote|body|caption' + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' + '|track|ul';
  block$1._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
  block$1.html = edit(block$1.html, 'i').replace('comment', block$1._comment).replace('tag', block$1._tag).replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  block$1.paragraph = edit(block$1._paragraph).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
  .replace('blockquote', ' {0,3}>').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)').replace('tag', block$1._tag) // pars can be interrupted by type (6) html blocks
  .getRegex();
  block$1.blockquote = edit(block$1.blockquote).replace('paragraph', block$1.paragraph).getRegex();
  /**
   * Normal Block Grammar
   */

  block$1.normal = merge$1({}, block$1);
  /**
   * GFM Block Grammar
   */

  block$1.gfm = merge$1({}, block$1.normal, {
    table: '^ *([^\\n ].*\\|.*)\\n' // Header
    + ' {0,3}(?:\\| *)?(:?-+:? *(?:\\| *:?-+:? *)*)\\|?' // Align
    + '(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells

  });
  block$1.gfm.table = edit(block$1.gfm.table).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
  .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)').replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
  .getRegex();
  /**
   * Pedantic grammar (original John Gruber's loose markdown specification)
   */

  block$1.pedantic = merge$1({}, block$1.normal, {
    html: edit('^ *(?:comment *(?:\\n|\\s*$)' + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
    + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))').replace('comment', block$1._comment).replace(/tag/g, '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub' + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)' + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b').getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^(#{1,6})(.*)(?:\n+|$)/,
    fences: noopTest,
    // fences not supported
    paragraph: edit(block$1.normal._paragraph).replace('hr', block$1.hr).replace('heading', ' *#{1,6} *[^\n]').replace('lheading', block$1.lheading).replace('blockquote', ' {0,3}>').replace('|fences', '').replace('|list', '').replace('|html', '').getRegex()
  });
  /**
   * Inline-Level Grammar
   */

  var inline$1 = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noopTest,
    tag: '^comment' + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
    + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
    + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
    + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
    + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
    // CDATA section
    link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
    nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
    reflinkSearch: 'reflink|nolink(?!\\()',
    emStrong: {
      lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
      //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
      //        () Skip other delimiter (1) #***                   (2) a***#, a***                   (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
      rDelimAst: /\_\_[^_*]*?\*[^_*]*?\_\_|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
      rDelimUnd: /\*\*[^_*]*?\_[^_*]*?\*\*|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _

    },
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: noopTest,
    text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
    punctuation: /^([\spunctuation])/
  }; // list of punctuation marks from CommonMark spec
  // without * and _ to handle the different emphasis markers * and _

  inline$1._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
  inline$1.punctuation = edit(inline$1.punctuation).replace(/punctuation/g, inline$1._punctuation).getRegex(); // sequences em should skip over [title](link), `code`, <html>

  inline$1.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
  inline$1.escapedEmSt = /\\\*|\\_/g;
  inline$1._comment = edit(block$1._comment).replace('(?:-->|$)', '-->').getRegex();
  inline$1.emStrong.lDelim = edit(inline$1.emStrong.lDelim).replace(/punct/g, inline$1._punctuation).getRegex();
  inline$1.emStrong.rDelimAst = edit(inline$1.emStrong.rDelimAst, 'g').replace(/punct/g, inline$1._punctuation).getRegex();
  inline$1.emStrong.rDelimUnd = edit(inline$1.emStrong.rDelimUnd, 'g').replace(/punct/g, inline$1._punctuation).getRegex();
  inline$1._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
  inline$1._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
  inline$1._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
  inline$1.autolink = edit(inline$1.autolink).replace('scheme', inline$1._scheme).replace('email', inline$1._email).getRegex();
  inline$1._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
  inline$1.tag = edit(inline$1.tag).replace('comment', inline$1._comment).replace('attribute', inline$1._attribute).getRegex();
  inline$1._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  inline$1._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
  inline$1._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
  inline$1.link = edit(inline$1.link).replace('label', inline$1._label).replace('href', inline$1._href).replace('title', inline$1._title).getRegex();
  inline$1.reflink = edit(inline$1.reflink).replace('label', inline$1._label).getRegex();
  inline$1.reflinkSearch = edit(inline$1.reflinkSearch, 'g').replace('reflink', inline$1.reflink).replace('nolink', inline$1.nolink).getRegex();
  /**
   * Normal Inline Grammar
   */

  inline$1.normal = merge$1({}, inline$1);
  /**
   * Pedantic Inline Grammar
   */

  inline$1.pedantic = merge$1({}, inline$1.normal, {
    strong: {
      start: /^__|\*\*/,
      middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      endAst: /\*\*(?!\*)/g,
      endUnd: /__(?!_)/g
    },
    em: {
      start: /^_|\*/,
      middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
      endAst: /\*(?!\*)/g,
      endUnd: /_(?!_)/g
    },
    link: edit(/^!?\[(label)\]\((.*?)\)/).replace('label', inline$1._label).getRegex(),
    reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace('label', inline$1._label).getRegex()
  });
  /**
   * GFM Inline Grammar
   */

  inline$1.gfm = merge$1({}, inline$1.normal, {
    escape: edit(inline$1.escape).replace('])', '~|])').getRegex(),
    _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
  });
  inline$1.gfm.url = edit(inline$1.gfm.url, 'i').replace('email', inline$1.gfm._extended_email).getRegex();
  /**
   * GFM + Line Breaks Inline Grammar
   */

  inline$1.breaks = merge$1({}, inline$1.gfm, {
    br: edit(inline$1.br).replace('{2,}', '*').getRegex(),
    text: edit(inline$1.gfm.text).replace('\\b_', '\\b_| {2,}\\n').replace(/\{2,\}/g, '*').getRegex()
  });
  var rules = {
    block: block$1,
    inline: inline$1
  };

  var Tokenizer$1 = Tokenizer_1;
  var defaults$3 = defaults$5.exports.defaults;
  var block = rules.block,
      inline = rules.inline;
  var repeatString = helpers.repeatString;
  /**
   * smartypants text replacement
   */

  function smartypants(text) {
    return text // em-dashes
    .replace(/---/g, "\u2014") // en-dashes
    .replace(/--/g, "\u2013") // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018") // closing singles & apostrophes
    .replace(/'/g, "\u2019") // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C") // closing doubles
    .replace(/"/g, "\u201D") // ellipses
    .replace(/\.{3}/g, "\u2026");
  }
  /**
   * mangle email addresses
   */


  function mangle(text) {
    var out = '',
        i,
        ch;
    var l = text.length;

    for (i = 0; i < l; i++) {
      ch = text.charCodeAt(i);

      if (Math.random() > 0.5) {
        ch = 'x' + ch.toString(16);
      }

      out += '&#' + ch + ';';
    }

    return out;
  }
  /**
   * Block Lexer
   */


  var Lexer_1 = /*#__PURE__*/function () {
    function Lexer(options) {
      this.tokens = [];
      this.tokens.links = Object.create(null);
      this.options = options || defaults$3;
      this.options.tokenizer = this.options.tokenizer || new Tokenizer$1();
      this.tokenizer = this.options.tokenizer;
      this.tokenizer.options = this.options;
      this.tokenizer.lexer = this;
      this.inlineQueue = [];
      this.state = {
        inLink: false,
        inRawBlock: false,
        top: true
      };
      var rules = {
        block: block.normal,
        inline: inline.normal
      };

      if (this.options.pedantic) {
        rules.block = block.pedantic;
        rules.inline = inline.pedantic;
      } else if (this.options.gfm) {
        rules.block = block.gfm;

        if (this.options.breaks) {
          rules.inline = inline.breaks;
        } else {
          rules.inline = inline.gfm;
        }
      }

      this.tokenizer.rules = rules;
    }
    /**
     * Expose Rules
     */


    /**
     * Static Lex Method
     */
    Lexer.lex = function lex(src, options) {
      var lexer = new Lexer(options);
      return lexer.lex(src);
    }
    /**
     * Static Lex Inline Method
     */
    ;

    Lexer.lexInline = function lexInline(src, options) {
      var lexer = new Lexer(options);
      return lexer.inlineTokens(src);
    }
    /**
     * Preprocessing
     */
    ;

    var _proto = Lexer.prototype;

    _proto.lex = function lex(src) {
      src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ');
      this.blockTokens(src, this.tokens);
      var next;

      while (next = this.inlineQueue.shift()) {
        this.inlineTokens(next.src, next.tokens);
      }

      return this.tokens;
    }
    /**
     * Lexing
     */
    ;

    _proto.blockTokens = function blockTokens(src, tokens) {
      var _this = this;

      if (tokens === void 0) {
        tokens = [];
      }

      if (this.options.pedantic) {
        src = src.replace(/^ +$/gm, '');
      }

      var token, lastToken, cutSrc, lastParagraphClipped;

      while (src) {
        if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some(function (extTokenizer) {
          if (token = extTokenizer.call({
            lexer: _this
          }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }

          return false;
        })) {
          continue;
        } // newline


        if (token = this.tokenizer.space(src)) {
          src = src.substring(token.raw.length);

          if (token.type) {
            tokens.push(token);
          }

          continue;
        } // code


        if (token = this.tokenizer.code(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1]; // An indented code block cannot interrupt a paragraph.

          if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
            lastToken.raw += '\n' + token.raw;
            lastToken.text += '\n' + token.text;
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }

          continue;
        } // fences


        if (token = this.tokenizer.fences(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // heading


        if (token = this.tokenizer.heading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // hr


        if (token = this.tokenizer.hr(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // blockquote


        if (token = this.tokenizer.blockquote(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // list


        if (token = this.tokenizer.list(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // html


        if (token = this.tokenizer.html(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // def


        if (token = this.tokenizer.def(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];

          if (lastToken && (lastToken.type === 'paragraph' || lastToken.type === 'text')) {
            lastToken.raw += '\n' + token.raw;
            lastToken.text += '\n' + token.raw;
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else if (!this.tokens.links[token.tag]) {
            this.tokens.links[token.tag] = {
              href: token.href,
              title: token.title
            };
          }

          continue;
        } // table (gfm)


        if (token = this.tokenizer.table(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // lheading


        if (token = this.tokenizer.lheading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // top-level paragraph
        // prevent paragraph consuming extensions by clipping 'src' to extension start


        cutSrc = src;

        if (this.options.extensions && this.options.extensions.startBlock) {
          (function () {
            var startIndex = Infinity;
            var tempSrc = src.slice(1);
            var tempStart = void 0;

            _this.options.extensions.startBlock.forEach(function (getStartIndex) {
              tempStart = getStartIndex.call({
                lexer: this
              }, tempSrc);

              if (typeof tempStart === 'number' && tempStart >= 0) {
                startIndex = Math.min(startIndex, tempStart);
              }
            });

            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          })();
        }

        if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
          lastToken = tokens[tokens.length - 1];

          if (lastParagraphClipped && lastToken.type === 'paragraph') {
            lastToken.raw += '\n' + token.raw;
            lastToken.text += '\n' + token.text;
            this.inlineQueue.pop();
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }

          lastParagraphClipped = cutSrc.length !== src.length;
          src = src.substring(token.raw.length);
          continue;
        } // text


        if (token = this.tokenizer.text(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];

          if (lastToken && lastToken.type === 'text') {
            lastToken.raw += '\n' + token.raw;
            lastToken.text += '\n' + token.text;
            this.inlineQueue.pop();
            this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
          } else {
            tokens.push(token);
          }

          continue;
        }

        if (src) {
          var errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);

          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }

      this.state.top = true;
      return tokens;
    };

    _proto.inline = function inline(src, tokens) {
      this.inlineQueue.push({
        src: src,
        tokens: tokens
      });
    }
    /**
     * Lexing/Compiling
     */
    ;

    _proto.inlineTokens = function inlineTokens(src, tokens) {
      var _this2 = this;

      if (tokens === void 0) {
        tokens = [];
      }

      var token, lastToken, cutSrc; // String with links masked to avoid interference with em and strong

      var maskedSrc = src;
      var match;
      var keepPrevChar, prevChar; // Mask out reflinks

      if (this.tokens.links) {
        var links = Object.keys(this.tokens.links);

        if (links.length > 0) {
          while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
            if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
              maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
            }
          }
        }
      } // Mask out other blocks


      while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      } // Mask out escaped em & strong delimiters


      while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
      }

      while (src) {
        if (!keepPrevChar) {
          prevChar = '';
        }

        keepPrevChar = false; // extensions

        if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some(function (extTokenizer) {
          if (token = extTokenizer.call({
            lexer: _this2
          }, src, tokens)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            return true;
          }

          return false;
        })) {
          continue;
        } // escape


        if (token = this.tokenizer.escape(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // tag


        if (token = this.tokenizer.tag(src)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];

          if (lastToken && token.type === 'text' && lastToken.type === 'text') {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }

          continue;
        } // link


        if (token = this.tokenizer.link(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // reflink, nolink


        if (token = this.tokenizer.reflink(src, this.tokens.links)) {
          src = src.substring(token.raw.length);
          lastToken = tokens[tokens.length - 1];

          if (lastToken && token.type === 'text' && lastToken.type === 'text') {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }

          continue;
        } // em & strong


        if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // code


        if (token = this.tokenizer.codespan(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // br


        if (token = this.tokenizer.br(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // del (gfm)


        if (token = this.tokenizer.del(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // autolink


        if (token = this.tokenizer.autolink(src, mangle)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // url (gfm)


        if (!this.state.inLink && (token = this.tokenizer.url(src, mangle))) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        } // text
        // prevent inlineText consuming extensions by clipping 'src' to extension start


        cutSrc = src;

        if (this.options.extensions && this.options.extensions.startInline) {
          (function () {
            var startIndex = Infinity;
            var tempSrc = src.slice(1);
            var tempStart = void 0;

            _this2.options.extensions.startInline.forEach(function (getStartIndex) {
              tempStart = getStartIndex.call({
                lexer: this
              }, tempSrc);

              if (typeof tempStart === 'number' && tempStart >= 0) {
                startIndex = Math.min(startIndex, tempStart);
              }
            });

            if (startIndex < Infinity && startIndex >= 0) {
              cutSrc = src.substring(0, startIndex + 1);
            }
          })();
        }

        if (token = this.tokenizer.inlineText(cutSrc, smartypants)) {
          src = src.substring(token.raw.length);

          if (token.raw.slice(-1) !== '_') {
            // Track prevChar before string of ____ started
            prevChar = token.raw.slice(-1);
          }

          keepPrevChar = true;
          lastToken = tokens[tokens.length - 1];

          if (lastToken && lastToken.type === 'text') {
            lastToken.raw += token.raw;
            lastToken.text += token.text;
          } else {
            tokens.push(token);
          }

          continue;
        }

        if (src) {
          var errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);

          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }

      return tokens;
    };

    _createClass(Lexer, null, [{
      key: "rules",
      get: function get() {
        return {
          block: block,
          inline: inline
        };
      }
    }]);

    return Lexer;
  }();

  var defaults$2 = defaults$5.exports.defaults;
  var cleanUrl = helpers.cleanUrl,
      escape$1 = helpers.escape;
  /**
   * Renderer
   */

  var Renderer_1 = /*#__PURE__*/function () {
    function Renderer(options) {
      this.options = options || defaults$2;
    }

    var _proto = Renderer.prototype;

    _proto.code = function code(_code, infostring, escaped) {
      var lang = (infostring || '').match(/\S*/)[0];

      if (this.options.highlight) {
        var out = this.options.highlight(_code, lang);

        if (out != null && out !== _code) {
          escaped = true;
          _code = out;
        }
      }

      _code = _code.replace(/\n$/, '') + '\n';

      if (!lang) {
        return '<pre><code>' + (escaped ? _code : escape$1(_code, true)) + '</code></pre>\n';
      }

      return '<pre><code class="' + this.options.langPrefix + escape$1(lang, true) + '">' + (escaped ? _code : escape$1(_code, true)) + '</code></pre>\n';
    };

    _proto.blockquote = function blockquote(quote) {
      return '<blockquote>\n' + quote + '</blockquote>\n';
    };

    _proto.html = function html(_html) {
      return _html;
    };

    _proto.heading = function heading(text, level, raw, slugger) {
      if (this.options.headerIds) {
        return '<h' + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + '</h' + level + '>\n';
      } // ignore IDs


      return '<h' + level + '>' + text + '</h' + level + '>\n';
    };

    _proto.hr = function hr() {
      return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
    };

    _proto.list = function list(body, ordered, start) {
      var type = ordered ? 'ol' : 'ul',
          startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
      return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
    };

    _proto.listitem = function listitem(text) {
      return '<li>' + text + '</li>\n';
    };

    _proto.checkbox = function checkbox(checked) {
      return '<input ' + (checked ? 'checked="" ' : '') + 'disabled="" type="checkbox"' + (this.options.xhtml ? ' /' : '') + '> ';
    };

    _proto.paragraph = function paragraph(text) {
      return '<p>' + text + '</p>\n';
    };

    _proto.table = function table(header, body) {
      if (body) body = '<tbody>' + body + '</tbody>';
      return '<table>\n' + '<thead>\n' + header + '</thead>\n' + body + '</table>\n';
    };

    _proto.tablerow = function tablerow(content) {
      return '<tr>\n' + content + '</tr>\n';
    };

    _proto.tablecell = function tablecell(content, flags) {
      var type = flags.header ? 'th' : 'td';
      var tag = flags.align ? '<' + type + ' align="' + flags.align + '">' : '<' + type + '>';
      return tag + content + '</' + type + '>\n';
    } // span level renderer
    ;

    _proto.strong = function strong(text) {
      return '<strong>' + text + '</strong>';
    };

    _proto.em = function em(text) {
      return '<em>' + text + '</em>';
    };

    _proto.codespan = function codespan(text) {
      return '<code>' + text + '</code>';
    };

    _proto.br = function br() {
      return this.options.xhtml ? '<br/>' : '<br>';
    };

    _proto.del = function del(text) {
      return '<del>' + text + '</del>';
    };

    _proto.link = function link(href, title, text) {
      href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);

      if (href === null) {
        return text;
      }

      var out = '<a href="' + escape$1(href) + '"';

      if (title) {
        out += ' title="' + title + '"';
      }

      out += '>' + text + '</a>';
      return out;
    };

    _proto.image = function image(href, title, text) {
      href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);

      if (href === null) {
        return text;
      }

      var out = '<img src="' + href + '" alt="' + text + '"';

      if (title) {
        out += ' title="' + title + '"';
      }

      out += this.options.xhtml ? '/>' : '>';
      return out;
    };

    _proto.text = function text(_text) {
      return _text;
    };

    return Renderer;
  }();

  /**
   * TextRenderer
   * returns only the textual part of the token
   */

  var TextRenderer_1 = /*#__PURE__*/function () {
    function TextRenderer() {}

    var _proto = TextRenderer.prototype;

    // no need for block level renderers
    _proto.strong = function strong(text) {
      return text;
    };

    _proto.em = function em(text) {
      return text;
    };

    _proto.codespan = function codespan(text) {
      return text;
    };

    _proto.del = function del(text) {
      return text;
    };

    _proto.html = function html(text) {
      return text;
    };

    _proto.text = function text(_text) {
      return _text;
    };

    _proto.link = function link(href, title, text) {
      return '' + text;
    };

    _proto.image = function image(href, title, text) {
      return '' + text;
    };

    _proto.br = function br() {
      return '';
    };

    return TextRenderer;
  }();

  /**
   * Slugger generates header id
   */

  var Slugger_1 = /*#__PURE__*/function () {
    function Slugger() {
      this.seen = {};
    }

    var _proto = Slugger.prototype;

    _proto.serialize = function serialize(value) {
      return value.toLowerCase().trim() // remove html tags
      .replace(/<[!\/a-z].*?>/ig, '') // remove unwanted chars
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '').replace(/\s/g, '-');
    }
    /**
     * Finds the next safe (unique) slug to use
     */
    ;

    _proto.getNextSafeSlug = function getNextSafeSlug(originalSlug, isDryRun) {
      var slug = originalSlug;
      var occurenceAccumulator = 0;

      if (this.seen.hasOwnProperty(slug)) {
        occurenceAccumulator = this.seen[originalSlug];

        do {
          occurenceAccumulator++;
          slug = originalSlug + '-' + occurenceAccumulator;
        } while (this.seen.hasOwnProperty(slug));
      }

      if (!isDryRun) {
        this.seen[originalSlug] = occurenceAccumulator;
        this.seen[slug] = 0;
      }

      return slug;
    }
    /**
     * Convert string to unique id
     * @param {object} options
     * @param {boolean} options.dryrun Generates the next unique slug without updating the internal accumulator.
     */
    ;

    _proto.slug = function slug(value, options) {
      if (options === void 0) {
        options = {};
      }

      var slug = this.serialize(value);
      return this.getNextSafeSlug(slug, options.dryrun);
    };

    return Slugger;
  }();

  var Renderer$1 = Renderer_1;
  var TextRenderer$1 = TextRenderer_1;
  var Slugger$1 = Slugger_1;
  var defaults$1 = defaults$5.exports.defaults;
  var unescape = helpers.unescape;
  /**
   * Parsing & Compiling
   */

  var Parser_1 = /*#__PURE__*/function () {
    function Parser(options) {
      this.options = options || defaults$1;
      this.options.renderer = this.options.renderer || new Renderer$1();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.textRenderer = new TextRenderer$1();
      this.slugger = new Slugger$1();
    }
    /**
     * Static Parse Method
     */


    Parser.parse = function parse(tokens, options) {
      var parser = new Parser(options);
      return parser.parse(tokens);
    }
    /**
     * Static Parse Inline Method
     */
    ;

    Parser.parseInline = function parseInline(tokens, options) {
      var parser = new Parser(options);
      return parser.parseInline(tokens);
    }
    /**
     * Parse Loop
     */
    ;

    var _proto = Parser.prototype;

    _proto.parse = function parse(tokens, top) {
      if (top === void 0) {
        top = true;
      }

      var out = '',
          i,
          j,
          k,
          l2,
          l3,
          row,
          cell,
          header,
          body,
          token,
          ordered,
          start,
          loose,
          itemBody,
          item,
          checked,
          task,
          checkbox,
          ret;
      var l = tokens.length;

      for (i = 0; i < l; i++) {
        token = tokens[i]; // Run any renderer extensions

        if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
          ret = this.options.extensions.renderers[token.type].call({
            parser: this
          }, token);

          if (ret !== false || !['space', 'hr', 'heading', 'code', 'table', 'blockquote', 'list', 'html', 'paragraph', 'text'].includes(token.type)) {
            out += ret || '';
            continue;
          }
        }

        switch (token.type) {
          case 'space':
            {
              continue;
            }

          case 'hr':
            {
              out += this.renderer.hr();
              continue;
            }

          case 'heading':
            {
              out += this.renderer.heading(this.parseInline(token.tokens), token.depth, unescape(this.parseInline(token.tokens, this.textRenderer)), this.slugger);
              continue;
            }

          case 'code':
            {
              out += this.renderer.code(token.text, token.lang, token.escaped);
              continue;
            }

          case 'table':
            {
              header = ''; // header

              cell = '';
              l2 = token.header.length;

              for (j = 0; j < l2; j++) {
                cell += this.renderer.tablecell(this.parseInline(token.header[j].tokens), {
                  header: true,
                  align: token.align[j]
                });
              }

              header += this.renderer.tablerow(cell);
              body = '';
              l2 = token.rows.length;

              for (j = 0; j < l2; j++) {
                row = token.rows[j];
                cell = '';
                l3 = row.length;

                for (k = 0; k < l3; k++) {
                  cell += this.renderer.tablecell(this.parseInline(row[k].tokens), {
                    header: false,
                    align: token.align[k]
                  });
                }

                body += this.renderer.tablerow(cell);
              }

              out += this.renderer.table(header, body);
              continue;
            }

          case 'blockquote':
            {
              body = this.parse(token.tokens);
              out += this.renderer.blockquote(body);
              continue;
            }

          case 'list':
            {
              ordered = token.ordered;
              start = token.start;
              loose = token.loose;
              l2 = token.items.length;
              body = '';

              for (j = 0; j < l2; j++) {
                item = token.items[j];
                checked = item.checked;
                task = item.task;
                itemBody = '';

                if (item.task) {
                  checkbox = this.renderer.checkbox(checked);

                  if (loose) {
                    if (item.tokens.length > 0 && item.tokens[0].type === 'paragraph') {
                      item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;

                      if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                        item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                      }
                    } else {
                      item.tokens.unshift({
                        type: 'text',
                        text: checkbox
                      });
                    }
                  } else {
                    itemBody += checkbox;
                  }
                }

                itemBody += this.parse(item.tokens, loose);
                body += this.renderer.listitem(itemBody, task, checked);
              }

              out += this.renderer.list(body, ordered, start);
              continue;
            }

          case 'html':
            {
              // TODO parse inline content if parameter markdown=1
              out += this.renderer.html(token.text);
              continue;
            }

          case 'paragraph':
            {
              out += this.renderer.paragraph(this.parseInline(token.tokens));
              continue;
            }

          case 'text':
            {
              body = token.tokens ? this.parseInline(token.tokens) : token.text;

              while (i + 1 < l && tokens[i + 1].type === 'text') {
                token = tokens[++i];
                body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
              }

              out += top ? this.renderer.paragraph(body) : body;
              continue;
            }

          default:
            {
              var errMsg = 'Token with "' + token.type + '" type was not found.';

              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
        }
      }

      return out;
    }
    /**
     * Parse Inline Tokens
     */
    ;

    _proto.parseInline = function parseInline(tokens, renderer) {
      renderer = renderer || this.renderer;
      var out = '',
          i,
          token,
          ret;
      var l = tokens.length;

      for (i = 0; i < l; i++) {
        token = tokens[i]; // Run any renderer extensions

        if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
          ret = this.options.extensions.renderers[token.type].call({
            parser: this
          }, token);

          if (ret !== false || !['escape', 'html', 'link', 'image', 'strong', 'em', 'codespan', 'br', 'del', 'text'].includes(token.type)) {
            out += ret || '';
            continue;
          }
        }

        switch (token.type) {
          case 'escape':
            {
              out += renderer.text(token.text);
              break;
            }

          case 'html':
            {
              out += renderer.html(token.text);
              break;
            }

          case 'link':
            {
              out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
              break;
            }

          case 'image':
            {
              out += renderer.image(token.href, token.title, token.text);
              break;
            }

          case 'strong':
            {
              out += renderer.strong(this.parseInline(token.tokens, renderer));
              break;
            }

          case 'em':
            {
              out += renderer.em(this.parseInline(token.tokens, renderer));
              break;
            }

          case 'codespan':
            {
              out += renderer.codespan(token.text);
              break;
            }

          case 'br':
            {
              out += renderer.br();
              break;
            }

          case 'del':
            {
              out += renderer.del(this.parseInline(token.tokens, renderer));
              break;
            }

          case 'text':
            {
              out += renderer.text(token.text);
              break;
            }

          default:
            {
              var errMsg = 'Token with "' + token.type + '" type was not found.';

              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
        }
      }

      return out;
    };

    return Parser;
  }();

  var Lexer = Lexer_1;
  var Parser = Parser_1;
  var Tokenizer = Tokenizer_1;
  var Renderer = Renderer_1;
  var TextRenderer = TextRenderer_1;
  var Slugger = Slugger_1;
  var merge = helpers.merge,
      checkSanitizeDeprecation = helpers.checkSanitizeDeprecation,
      escape = helpers.escape;
  var getDefaults = defaults$5.exports.getDefaults,
      changeDefaults = defaults$5.exports.changeDefaults,
      defaults = defaults$5.exports.defaults;
  /**
   * Marked
   */

  function marked(src, opt, callback) {
    // throw error in case of non string input
    if (typeof src === 'undefined' || src === null) {
      throw new Error('marked(): input parameter is undefined or null');
    }

    if (typeof src !== 'string') {
      throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
    }

    if (typeof opt === 'function') {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});
    checkSanitizeDeprecation(opt);

    if (callback) {
      var highlight = opt.highlight;
      var tokens;

      try {
        tokens = Lexer.lex(src, opt);
      } catch (e) {
        return callback(e);
      }

      var done = function done(err) {
        var out;

        if (!err) {
          try {
            if (opt.walkTokens) {
              marked.walkTokens(tokens, opt.walkTokens);
            }

            out = Parser.parse(tokens, opt);
          } catch (e) {
            err = e;
          }
        }

        opt.highlight = highlight;
        return err ? callback(err) : callback(null, out);
      };

      if (!highlight || highlight.length < 3) {
        return done();
      }

      delete opt.highlight;
      if (!tokens.length) return done();
      var pending = 0;
      marked.walkTokens(tokens, function (token) {
        if (token.type === 'code') {
          pending++;
          setTimeout(function () {
            highlight(token.text, token.lang, function (err, code) {
              if (err) {
                return done(err);
              }

              if (code != null && code !== token.text) {
                token.text = code;
                token.escaped = true;
              }

              pending--;

              if (pending === 0) {
                done();
              }
            });
          }, 0);
        }
      });

      if (pending === 0) {
        done();
      }

      return;
    }

    try {
      var _tokens = Lexer.lex(src, opt);

      if (opt.walkTokens) {
        marked.walkTokens(_tokens, opt.walkTokens);
      }

      return Parser.parse(_tokens, opt);
    } catch (e) {
      e.message += '\nPlease report this to https://github.com/markedjs/marked.';

      if (opt.silent) {
        return '<p>An error occurred:</p><pre>' + escape(e.message + '', true) + '</pre>';
      }

      throw e;
    }
  }
  /**
   * Options
   */


  marked.options = marked.setOptions = function (opt) {
    merge(marked.defaults, opt);
    changeDefaults(marked.defaults);
    return marked;
  };

  marked.getDefaults = getDefaults;
  marked.defaults = defaults;
  /**
   * Use Extension
   */

  marked.use = function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var opts = merge.apply(void 0, [{}].concat(args));
    var extensions = marked.defaults.extensions || {
      renderers: {},
      childTokens: {}
    };
    var hasExtensions;
    args.forEach(function (pack) {
      // ==-- Parse "addon" extensions --== //
      if (pack.extensions) {
        hasExtensions = true;
        pack.extensions.forEach(function (ext) {
          if (!ext.name) {
            throw new Error('extension name required');
          }

          if (ext.renderer) {
            // Renderer extensions
            var prevRenderer = extensions.renderers ? extensions.renderers[ext.name] : null;

            if (prevRenderer) {
              // Replace extension with func to run new extension but fall back if false
              extensions.renderers[ext.name] = function () {
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }

                var ret = ext.renderer.apply(this, args);

                if (ret === false) {
                  ret = prevRenderer.apply(this, args);
                }

                return ret;
              };
            } else {
              extensions.renderers[ext.name] = ext.renderer;
            }
          }

          if (ext.tokenizer) {
            // Tokenizer Extensions
            if (!ext.level || ext.level !== 'block' && ext.level !== 'inline') {
              throw new Error("extension level must be 'block' or 'inline'");
            }

            if (extensions[ext.level]) {
              extensions[ext.level].unshift(ext.tokenizer);
            } else {
              extensions[ext.level] = [ext.tokenizer];
            }

            if (ext.start) {
              // Function to check for start of token
              if (ext.level === 'block') {
                if (extensions.startBlock) {
                  extensions.startBlock.push(ext.start);
                } else {
                  extensions.startBlock = [ext.start];
                }
              } else if (ext.level === 'inline') {
                if (extensions.startInline) {
                  extensions.startInline.push(ext.start);
                } else {
                  extensions.startInline = [ext.start];
                }
              }
            }
          }

          if (ext.childTokens) {
            // Child tokens to be visited by walkTokens
            extensions.childTokens[ext.name] = ext.childTokens;
          }
        });
      } // ==-- Parse "overwrite" extensions --== //


      if (pack.renderer) {
        (function () {
          var renderer = marked.defaults.renderer || new Renderer();

          var _loop = function _loop(prop) {
            var prevRenderer = renderer[prop]; // Replace renderer with func to run extension, but fall back if false

            renderer[prop] = function () {
              for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
              }

              var ret = pack.renderer[prop].apply(renderer, args);

              if (ret === false) {
                ret = prevRenderer.apply(renderer, args);
              }

              return ret;
            };
          };

          for (var prop in pack.renderer) {
            _loop(prop);
          }

          opts.renderer = renderer;
        })();
      }

      if (pack.tokenizer) {
        (function () {
          var tokenizer = marked.defaults.tokenizer || new Tokenizer();

          var _loop2 = function _loop2(prop) {
            var prevTokenizer = tokenizer[prop]; // Replace tokenizer with func to run extension, but fall back if false

            tokenizer[prop] = function () {
              for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                args[_key4] = arguments[_key4];
              }

              var ret = pack.tokenizer[prop].apply(tokenizer, args);

              if (ret === false) {
                ret = prevTokenizer.apply(tokenizer, args);
              }

              return ret;
            };
          };

          for (var prop in pack.tokenizer) {
            _loop2(prop);
          }

          opts.tokenizer = tokenizer;
        })();
      } // ==-- Parse WalkTokens extensions --== //


      if (pack.walkTokens) {
        var walkTokens = marked.defaults.walkTokens;

        opts.walkTokens = function (token) {
          pack.walkTokens.call(_this, token);

          if (walkTokens) {
            walkTokens(token);
          }
        };
      }

      if (hasExtensions) {
        opts.extensions = extensions;
      }

      marked.setOptions(opts);
    });
  };
  /**
   * Run callback for every token
   */


  marked.walkTokens = function (tokens, callback) {
    var _loop3 = function _loop3() {
      var token = _step.value;
      callback(token);

      switch (token.type) {
        case 'table':
          {
            for (var _iterator2 = _createForOfIteratorHelperLoose(token.header), _step2; !(_step2 = _iterator2()).done;) {
              var cell = _step2.value;
              marked.walkTokens(cell.tokens, callback);
            }

            for (var _iterator3 = _createForOfIteratorHelperLoose(token.rows), _step3; !(_step3 = _iterator3()).done;) {
              var row = _step3.value;

              for (var _iterator4 = _createForOfIteratorHelperLoose(row), _step4; !(_step4 = _iterator4()).done;) {
                var _cell = _step4.value;
                marked.walkTokens(_cell.tokens, callback);
              }
            }

            break;
          }

        case 'list':
          {
            marked.walkTokens(token.items, callback);
            break;
          }

        default:
          {
            if (marked.defaults.extensions && marked.defaults.extensions.childTokens && marked.defaults.extensions.childTokens[token.type]) {
              // Walk any extensions
              marked.defaults.extensions.childTokens[token.type].forEach(function (childTokens) {
                marked.walkTokens(token[childTokens], callback);
              });
            } else if (token.tokens) {
              marked.walkTokens(token.tokens, callback);
            }
          }
      }
    };

    for (var _iterator = _createForOfIteratorHelperLoose(tokens), _step; !(_step = _iterator()).done;) {
      _loop3();
    }
  };
  /**
   * Parse Inline
   */


  marked.parseInline = function (src, opt) {
    // throw error in case of non string input
    if (typeof src === 'undefined' || src === null) {
      throw new Error('marked.parseInline(): input parameter is undefined or null');
    }

    if (typeof src !== 'string') {
      throw new Error('marked.parseInline(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
    }

    opt = merge({}, marked.defaults, opt || {});
    checkSanitizeDeprecation(opt);

    try {
      var tokens = Lexer.lexInline(src, opt);

      if (opt.walkTokens) {
        marked.walkTokens(tokens, opt.walkTokens);
      }

      return Parser.parseInline(tokens, opt);
    } catch (e) {
      e.message += '\nPlease report this to https://github.com/markedjs/marked.';

      if (opt.silent) {
        return '<p>An error occurred:</p><pre>' + escape(e.message + '', true) + '</pre>';
      }

      throw e;
    }
  };
  /**
   * Expose
   */


  marked.Parser = Parser;
  marked.parser = Parser.parse;
  marked.Renderer = Renderer;
  marked.TextRenderer = TextRenderer;
  marked.Lexer = Lexer;
  marked.lexer = Lexer.lex;
  marked.Tokenizer = Tokenizer;
  marked.Slugger = Slugger;
  marked.parse = marked;
  var marked_1 = marked;

  return marked_1;

})));


/***/ }),

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("electron");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./render/render.ts ***!
  \**************************/

var marked = __webpack_require__(/*! marked */ "./node_modules/_marked@3.0.2@marked/lib/marked.js");
var ipcRenderer = __webpack_require__(/*! electron */ "electron").ipcRenderer;
var remote = __webpack_require__(/*! @electron/remote */ "./node_modules/_@electron_remote@1.2.1@@electron/remote/renderer/index.js");
var getFileFromUser = remote.require('../src/lib/dialog').getFileFromUser;
var markdownView = document.querySelector('#markdown');
var htmlView = document.querySelector('#html');
var newFileButton = document.querySelector('#new-file');
var openFileButton = document.querySelector('#open-file');
var saveMarkdownButton = document.querySelector('#save-markdown');
var revertButton = document.querySelector('#revert');
var saveHtmlButton = document.querySelector('#save-html');
var showFileButton = document.querySelector('#show-file');
var openInDefaultButton = document.querySelector('#open-in-default');
var renderMarkdownToHtml = function (markdown) {
    htmlView.innerHTML = marked(markdown, { sanitize: true });
};
markdownView.addEventListener('keyup', function (event) {
    var _a;
    // @ts-ignore
    var currentContent = (_a = event) === null || _a === void 0 ? void 0 : _a.target.value;
    renderMarkdownToHtml(currentContent);
});
openFileButton.addEventListener('click', function () {
    getFileFromUser();
});
ipcRenderer.on('file-opened', function (event, file, content) {
    console.log('receive:', event, file);
    // @ts-ignore
    markdownView === null || markdownView === void 0 ? void 0 : markdownView.value = content;
    renderMarkdownToHtml(content);
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztBQUN4QztBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyw4QkFBOEI7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FLGdCQUFnQjtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RCxrQkFBa0I7QUFDL0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGNBQWM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsU0FBUyxrQ0FBa0MsZUFBZTtBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNELGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSwyQ0FBMEM7QUFDMUM7QUFDQTtBQUNBLENBQUMsRUFBQztBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDalpBLHNKQUFnRDs7Ozs7Ozs7Ozs7QUNBaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUUsS0FBNEQ7QUFDOUQsRUFBRSxDQUNxRztBQUN2RyxDQUFDLHNCQUFzQjs7QUFFdkI7QUFDQSxvQkFBb0Isa0JBQWtCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDJDQUEyQyxTQUFTOztBQUVwRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLG9CQUFvQjs7QUFFcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkNBQTZDO0FBQzdDLGdEQUFnRDtBQUNoRDtBQUNBLGVBQWU7QUFDZixjQUFjO0FBQ2QsY0FBYztBQUNkLGdCQUFnQjtBQUNoQixlQUFlO0FBQ2Y7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSw2REFBNkQ7O0FBRTdEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSztBQUNMOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLHNCQUFzQjtBQUNqQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLGVBQWU7O0FBRWY7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsa0JBQWtCO0FBQzdCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUk7QUFDSjtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNOzs7QUFHTixxQkFBcUI7O0FBRXJCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7O0FBR0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0NBQXNDLElBQUk7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLGtDQUFrQzs7QUFFbEM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLElBQUk7O0FBRXBDO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVix3Q0FBd0MsSUFBSSwwREFBMEQ7O0FBRXRHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWiw0Q0FBNEM7O0FBRTVDLGdFQUFnRSx3Q0FBd0M7O0FBRXhHO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0NBQStDLGtDQUFrQyxhQUFhLElBQUk7O0FBRWxHLHNCQUFzQixrQkFBa0I7QUFDeEM7O0FBRUE7QUFDQTtBQUNBLHNDQUFzQyxJQUFJLE1BQU0sRUFBRTtBQUNsRCxjQUFjOzs7QUFHZDtBQUNBO0FBQ0E7QUFDQSxjQUFjOzs7QUFHZDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjs7O0FBR2hCO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBLGNBQWM7OztBQUdkO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFlBQVk7OztBQUdaO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DOztBQUVuQyxvQkFBb0IsT0FBTztBQUMzQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IsT0FBTztBQUM3QjtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0EsY0FBYztBQUNkO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxzQkFBc0IsT0FBTztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixZQUFZO0FBQ1o7OztBQUdBOztBQUVBLHNCQUFzQixPQUFPO0FBQzdCO0FBQ0E7QUFDQSxZQUFZOzs7QUFHWjs7QUFFQSxzQkFBc0IsT0FBTztBQUM3Qjs7QUFFQSx3QkFBd0IsZ0JBQWdCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FB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O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxVQUFVOzs7QUFHVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQSxpREFBaUQ7O0FBRWpEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsb0NBQW9DOztBQUVwQztBQUNBO0FBQ0Esa0NBQWtDOztBQUVsQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTs7O0FBR1I7QUFDQTtBQUNBLFFBQVE7OztBQUdSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEI7O0FBRTlCO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7OztBQUdBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZTs7QUFFZjtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFROzs7QUFHUjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxH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Q0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZmlyZS8uL25vZGVfbW9kdWxlcy9fQGVsZWN0cm9uX3JlbW90ZUAxLjIuMUBAZWxlY3Ryb24vcmVtb3RlL2Rpc3Qvc3JjL2NvbW1vbi9nZXQtZWxlY3Ryb24tYmluZGluZy5qcyIsIndlYnBhY2s6Ly9maXJlLy4vbm9kZV9tb2R1bGVzL19AZWxlY3Ryb25fcmVtb3RlQDEuMi4xQEBlbGVjdHJvbi9yZW1vdGUvZGlzdC9zcmMvY29tbW9uL21vZHVsZS1uYW1lcy5qcyIsIndlYnBhY2s6Ly9maXJlLy4vbm9kZV9tb2R1bGVzL19AZWxlY3Ryb25fcmVtb3RlQDEuMi4xQEBlbGVjdHJvbi9yZW1vdGUvZGlzdC9zcmMvY29tbW9uL3R5cGUtdXRpbHMuanMiLCJ3ZWJwYWNrOi8vZmlyZS8uL25vZGVfbW9kdWxlcy9fQGVsZWN0cm9uX3JlbW90ZUAxLjIuMUBAZWxlY3Ryb24vcmVtb3RlL2Rpc3Qvc3JjL3JlbmRlcmVyL2NhbGxiYWNrcy1yZWdpc3RyeS5qcyIsIndlYnBhY2s6Ly9maXJlLy4vbm9kZV9tb2R1bGVzL19AZWxlY3Ryb25fcmVtb3RlQDEuMi4xQEBlbGVjdHJvbi9yZW1vdGUvZGlzdC9zcmMvcmVuZGVyZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZmlyZS8uL25vZGVfbW9kdWxlcy9fQGVsZWN0cm9uX3JlbW90ZUAxLjIuMUBAZWxlY3Ryb24vcmVtb3RlL2Rpc3Qvc3JjL3JlbmRlcmVyL3JlbW90ZS5qcyIsIndlYnBhY2s6Ly9maXJlLy4vbm9kZV9tb2R1bGVzL19AZWxlY3Ryb25fcmVtb3RlQDEuMi4xQEBlbGVjdHJvbi9yZW1vdGUvcmVuZGVyZXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vZmlyZS8uL25vZGVfbW9kdWxlcy9fbWFya2VkQDMuMC4yQG1hcmtlZC9saWIvbWFya2VkLmpzIiwid2VicGFjazovL2ZpcmUvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vZmlyZS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9maXJlLy4vcmVuZGVyL3JlbmRlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZ2V0RWxlY3Ryb25CaW5kaW5nID0gdm9pZCAwO1xuY29uc3QgZ2V0RWxlY3Ryb25CaW5kaW5nID0gKG5hbWUpID0+IHtcbiAgICBpZiAocHJvY2Vzcy5fbGlua2VkQmluZGluZykge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy5fbGlua2VkQmluZGluZygnZWxlY3Ryb25fY29tbW9uXycgKyBuYW1lKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocHJvY2Vzcy5lbGVjdHJvbkJpbmRpbmcpIHtcbiAgICAgICAgcmV0dXJuIHByb2Nlc3MuZWxlY3Ryb25CaW5kaW5nKG5hbWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxufTtcbmV4cG9ydHMuZ2V0RWxlY3Ryb25CaW5kaW5nID0gZ2V0RWxlY3Ryb25CaW5kaW5nO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmJyb3dzZXJNb2R1bGVOYW1lcyA9IGV4cG9ydHMuY29tbW9uTW9kdWxlTmFtZXMgPSB2b2lkIDA7XG5jb25zdCBnZXRfZWxlY3Ryb25fYmluZGluZ18xID0gcmVxdWlyZShcIi4vZ2V0LWVsZWN0cm9uLWJpbmRpbmdcIik7XG5leHBvcnRzLmNvbW1vbk1vZHVsZU5hbWVzID0gW1xuICAgICdjbGlwYm9hcmQnLFxuICAgICduYXRpdmVJbWFnZScsXG4gICAgJ3NoZWxsJyxcbl07XG5leHBvcnRzLmJyb3dzZXJNb2R1bGVOYW1lcyA9IFtcbiAgICAnYXBwJyxcbiAgICAnYXV0b1VwZGF0ZXInLFxuICAgICdCYXNlV2luZG93JyxcbiAgICAnQnJvd3NlclZpZXcnLFxuICAgICdCcm93c2VyV2luZG93JyxcbiAgICAnY29udGVudFRyYWNpbmcnLFxuICAgICdjcmFzaFJlcG9ydGVyJyxcbiAgICAnZGlhbG9nJyxcbiAgICAnZ2xvYmFsU2hvcnRjdXQnLFxuICAgICdpcGNNYWluJyxcbiAgICAnaW5BcHBQdXJjaGFzZScsXG4gICAgJ01lbnUnLFxuICAgICdNZW51SXRlbScsXG4gICAgJ25hdGl2ZVRoZW1lJyxcbiAgICAnbmV0JyxcbiAgICAnbmV0TG9nJyxcbiAgICAnTWVzc2FnZUNoYW5uZWxNYWluJyxcbiAgICAnTm90aWZpY2F0aW9uJyxcbiAgICAncG93ZXJNb25pdG9yJyxcbiAgICAncG93ZXJTYXZlQmxvY2tlcicsXG4gICAgJ3Byb3RvY29sJyxcbiAgICAnc2NyZWVuJyxcbiAgICAnc2Vzc2lvbicsXG4gICAgJ1NoYXJlTWVudScsXG4gICAgJ3N5c3RlbVByZWZlcmVuY2VzJyxcbiAgICAnVG9wTGV2ZWxXaW5kb3cnLFxuICAgICdUb3VjaEJhcicsXG4gICAgJ1RyYXknLFxuICAgICdWaWV3JyxcbiAgICAnd2ViQ29udGVudHMnLFxuICAgICdXZWJDb250ZW50c1ZpZXcnLFxuICAgICd3ZWJGcmFtZU1haW4nLFxuXS5jb25jYXQoZXhwb3J0cy5jb21tb25Nb2R1bGVOYW1lcyk7XG5jb25zdCBmZWF0dXJlcyA9IGdldF9lbGVjdHJvbl9iaW5kaW5nXzEuZ2V0RWxlY3Ryb25CaW5kaW5nKCdmZWF0dXJlcycpO1xuaWYgKCFmZWF0dXJlcyB8fCBmZWF0dXJlcy5pc0Rlc2t0b3BDYXB0dXJlckVuYWJsZWQoKSkge1xuICAgIGV4cG9ydHMuYnJvd3Nlck1vZHVsZU5hbWVzLnB1c2goJ2Rlc2t0b3BDYXB0dXJlcicpO1xufVxuaWYgKCFmZWF0dXJlcyB8fCBmZWF0dXJlcy5pc1ZpZXdBcGlFbmFibGVkKCkpIHtcbiAgICBleHBvcnRzLmJyb3dzZXJNb2R1bGVOYW1lcy5wdXNoKCdJbWFnZVZpZXcnKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5kZXNlcmlhbGl6ZSA9IGV4cG9ydHMuc2VyaWFsaXplID0gZXhwb3J0cy5pc1NlcmlhbGl6YWJsZU9iamVjdCA9IGV4cG9ydHMuaXNQcm9taXNlID0gdm9pZCAwO1xuY29uc3QgZWxlY3Ryb25fMSA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTtcbmZ1bmN0aW9uIGlzUHJvbWlzZSh2YWwpIHtcbiAgICByZXR1cm4gKHZhbCAmJlxuICAgICAgICB2YWwudGhlbiAmJlxuICAgICAgICB2YWwudGhlbiBpbnN0YW5jZW9mIEZ1bmN0aW9uICYmXG4gICAgICAgIHZhbC5jb25zdHJ1Y3RvciAmJlxuICAgICAgICB2YWwuY29uc3RydWN0b3IucmVqZWN0ICYmXG4gICAgICAgIHZhbC5jb25zdHJ1Y3Rvci5yZWplY3QgaW5zdGFuY2VvZiBGdW5jdGlvbiAmJlxuICAgICAgICB2YWwuY29uc3RydWN0b3IucmVzb2x2ZSAmJlxuICAgICAgICB2YWwuY29uc3RydWN0b3IucmVzb2x2ZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKTtcbn1cbmV4cG9ydHMuaXNQcm9taXNlID0gaXNQcm9taXNlO1xuY29uc3Qgc2VyaWFsaXphYmxlVHlwZXMgPSBbXG4gICAgQm9vbGVhbixcbiAgICBOdW1iZXIsXG4gICAgU3RyaW5nLFxuICAgIERhdGUsXG4gICAgRXJyb3IsXG4gICAgUmVnRXhwLFxuICAgIEFycmF5QnVmZmVyXG5dO1xuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1dlYl9Xb3JrZXJzX0FQSS9TdHJ1Y3R1cmVkX2Nsb25lX2FsZ29yaXRobSNTdXBwb3J0ZWRfdHlwZXNcbmZ1bmN0aW9uIGlzU2VyaWFsaXphYmxlT2JqZWN0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkgfHwgc2VyaWFsaXphYmxlVHlwZXMuc29tZSh0eXBlID0+IHZhbHVlIGluc3RhbmNlb2YgdHlwZSk7XG59XG5leHBvcnRzLmlzU2VyaWFsaXphYmxlT2JqZWN0ID0gaXNTZXJpYWxpemFibGVPYmplY3Q7XG5jb25zdCBvYmplY3RNYXAgPSBmdW5jdGlvbiAoc291cmNlLCBtYXBwZXIpIHtcbiAgICBjb25zdCBzb3VyY2VFbnRyaWVzID0gT2JqZWN0LmVudHJpZXMoc291cmNlKTtcbiAgICBjb25zdCB0YXJnZXRFbnRyaWVzID0gc291cmNlRW50cmllcy5tYXAoKFtrZXksIHZhbF0pID0+IFtrZXksIG1hcHBlcih2YWwpXSk7XG4gICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyh0YXJnZXRFbnRyaWVzKTtcbn07XG5mdW5jdGlvbiBzZXJpYWxpemVOYXRpdmVJbWFnZShpbWFnZSkge1xuICAgIGNvbnN0IHJlcHJlc2VudGF0aW9ucyA9IFtdO1xuICAgIGNvbnN0IHNjYWxlRmFjdG9ycyA9IGltYWdlLmdldFNjYWxlRmFjdG9ycygpO1xuICAgIC8vIFVzZSBCdWZmZXIgd2hlbiB0aGVyZSdzIG9ubHkgb25lIHJlcHJlc2VudGF0aW9uIGZvciBiZXR0ZXIgcGVyZi5cbiAgICAvLyBUaGlzIGF2b2lkcyBjb21wcmVzc2luZyB0by9mcm9tIFBORyB3aGVyZSBpdCdzIG5vdCBuZWNlc3NhcnkgdG9cbiAgICAvLyBlbnN1cmUgdW5pcXVlbmVzcyBvZiBkYXRhVVJMcyAoc2luY2UgdGhlcmUncyBvbmx5IG9uZSkuXG4gICAgaWYgKHNjYWxlRmFjdG9ycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVGYWN0b3IgPSBzY2FsZUZhY3RvcnNbMF07XG4gICAgICAgIGNvbnN0IHNpemUgPSBpbWFnZS5nZXRTaXplKHNjYWxlRmFjdG9yKTtcbiAgICAgICAgY29uc3QgYnVmZmVyID0gaW1hZ2UudG9CaXRtYXAoeyBzY2FsZUZhY3RvciB9KTtcbiAgICAgICAgcmVwcmVzZW50YXRpb25zLnB1c2goeyBzY2FsZUZhY3Rvciwgc2l6ZSwgYnVmZmVyIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gQ29uc3RydWN0IGZyb20gZGF0YVVSTHMgdG8gZW5zdXJlIHRoYXQgdGhleSBhcmUgbm90IGxvc3QgaW4gY3JlYXRpb24uXG4gICAgICAgIGZvciAoY29uc3Qgc2NhbGVGYWN0b3Igb2Ygc2NhbGVGYWN0b3JzKSB7XG4gICAgICAgICAgICBjb25zdCBzaXplID0gaW1hZ2UuZ2V0U2l6ZShzY2FsZUZhY3Rvcik7XG4gICAgICAgICAgICBjb25zdCBkYXRhVVJMID0gaW1hZ2UudG9EYXRhVVJMKHsgc2NhbGVGYWN0b3IgfSk7XG4gICAgICAgICAgICByZXByZXNlbnRhdGlvbnMucHVzaCh7IHNjYWxlRmFjdG9yLCBzaXplLCBkYXRhVVJMIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7IF9fRUxFQ1RST05fU0VSSUFMSVpFRF9OYXRpdmVJbWFnZV9fOiB0cnVlLCByZXByZXNlbnRhdGlvbnMgfTtcbn1cbmZ1bmN0aW9uIGRlc2VyaWFsaXplTmF0aXZlSW1hZ2UodmFsdWUpIHtcbiAgICBjb25zdCBpbWFnZSA9IGVsZWN0cm9uXzEubmF0aXZlSW1hZ2UuY3JlYXRlRW1wdHkoKTtcbiAgICAvLyBVc2UgQnVmZmVyIHdoZW4gdGhlcmUncyBvbmx5IG9uZSByZXByZXNlbnRhdGlvbiBmb3IgYmV0dGVyIHBlcmYuXG4gICAgLy8gVGhpcyBhdm9pZHMgY29tcHJlc3NpbmcgdG8vZnJvbSBQTkcgd2hlcmUgaXQncyBub3QgbmVjZXNzYXJ5IHRvXG4gICAgLy8gZW5zdXJlIHVuaXF1ZW5lc3Mgb2YgZGF0YVVSTHMgKHNpbmNlIHRoZXJlJ3Mgb25seSBvbmUpLlxuICAgIGlmICh2YWx1ZS5yZXByZXNlbnRhdGlvbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGNvbnN0IHsgYnVmZmVyLCBzaXplLCBzY2FsZUZhY3RvciB9ID0gdmFsdWUucmVwcmVzZW50YXRpb25zWzBdO1xuICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IHNpemU7XG4gICAgICAgIGltYWdlLmFkZFJlcHJlc2VudGF0aW9uKHsgYnVmZmVyLCBzY2FsZUZhY3Rvciwgd2lkdGgsIGhlaWdodCB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIC8vIENvbnN0cnVjdCBmcm9tIGRhdGFVUkxzIHRvIGVuc3VyZSB0aGF0IHRoZXkgYXJlIG5vdCBsb3N0IGluIGNyZWF0aW9uLlxuICAgICAgICBmb3IgKGNvbnN0IHJlcCBvZiB2YWx1ZS5yZXByZXNlbnRhdGlvbnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgZGF0YVVSTCwgc2l6ZSwgc2NhbGVGYWN0b3IgfSA9IHJlcDtcbiAgICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gc2l6ZTtcbiAgICAgICAgICAgIGltYWdlLmFkZFJlcHJlc2VudGF0aW9uKHsgZGF0YVVSTCwgc2NhbGVGYWN0b3IsIHdpZHRoLCBoZWlnaHQgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGltYWdlO1xufVxuZnVuY3Rpb24gc2VyaWFsaXplKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUgPT09ICdOYXRpdmVJbWFnZScpIHtcbiAgICAgICAgcmV0dXJuIHNlcmlhbGl6ZU5hdGl2ZUltYWdlKHZhbHVlKTtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5tYXAoc2VyaWFsaXplKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNTZXJpYWxpemFibGVPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdE1hcCh2YWx1ZSwgc2VyaWFsaXplKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59XG5leHBvcnRzLnNlcmlhbGl6ZSA9IHNlcmlhbGl6ZTtcbmZ1bmN0aW9uIGRlc2VyaWFsaXplKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlLl9fRUxFQ1RST05fU0VSSUFMSVpFRF9OYXRpdmVJbWFnZV9fKSB7XG4gICAgICAgIHJldHVybiBkZXNlcmlhbGl6ZU5hdGl2ZUltYWdlKHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLm1hcChkZXNlcmlhbGl6ZSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKGlzU2VyaWFsaXphYmxlT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHZhbHVlIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiBvYmplY3RNYXAodmFsdWUsIGRlc2VyaWFsaXplKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59XG5leHBvcnRzLmRlc2VyaWFsaXplID0gZGVzZXJpYWxpemU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuQ2FsbGJhY2tzUmVnaXN0cnkgPSB2b2lkIDA7XG5jbGFzcyBDYWxsYmFja3NSZWdpc3RyeSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMubmV4dElkID0gMDtcbiAgICAgICAgdGhpcy5jYWxsYmFja3MgPSB7fTtcbiAgICAgICAgdGhpcy5jYWxsYmFja0lkcyA9IG5ldyBXZWFrTWFwKCk7XG4gICAgICAgIHRoaXMubG9jYXRpb25JbmZvID0gbmV3IFdlYWtNYXAoKTtcbiAgICB9XG4gICAgYWRkKGNhbGxiYWNrKSB7XG4gICAgICAgIC8vIFRoZSBjYWxsYmFjayBpcyBhbHJlYWR5IGFkZGVkLlxuICAgICAgICBsZXQgaWQgPSB0aGlzLmNhbGxiYWNrSWRzLmdldChjYWxsYmFjayk7XG4gICAgICAgIGlmIChpZCAhPSBudWxsKVxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICBpZCA9IHRoaXMubmV4dElkICs9IDE7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tzW2lkXSA9IGNhbGxiYWNrO1xuICAgICAgICB0aGlzLmNhbGxiYWNrSWRzLnNldChjYWxsYmFjaywgaWQpO1xuICAgICAgICAvLyBDYXB0dXJlIHRoZSBsb2NhdGlvbiBvZiB0aGUgZnVuY3Rpb24gYW5kIHB1dCBpdCBpbiB0aGUgSUQgc3RyaW5nLFxuICAgICAgICAvLyBzbyB0aGF0IHJlbGVhc2UgZXJyb3JzIGNhbiBiZSB0cmFja2VkIGRvd24gZWFzaWx5LlxuICAgICAgICBjb25zdCByZWdleHAgPSAvYXQgKC4qKS9naTtcbiAgICAgICAgY29uc3Qgc3RhY2tTdHJpbmcgPSAobmV3IEVycm9yKCkpLnN0YWNrO1xuICAgICAgICBpZiAoIXN0YWNrU3RyaW5nKVxuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICBsZXQgZmlsZW5hbWVBbmRMaW5lO1xuICAgICAgICBsZXQgbWF0Y2g7XG4gICAgICAgIHdoaWxlICgobWF0Y2ggPSByZWdleHAuZXhlYyhzdGFja1N0cmluZykpICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBsb2NhdGlvbiA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmluY2x1ZGVzKCcobmF0aXZlKScpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmluY2x1ZGVzKCcoPGFub255bW91cz4pJykpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBpZiAobG9jYXRpb24uaW5jbHVkZXMoJ2NhbGxiYWNrcy1yZWdpc3RyeS5qcycpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmluY2x1ZGVzKCdyZW1vdGUuanMnKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGlmIChsb2NhdGlvbi5pbmNsdWRlcygnQGVsZWN0cm9uL3JlbW90ZS9kaXN0JykpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBjb25zdCByZWYgPSAvKFteL14pXSopXFwpPyQvZ2kuZXhlYyhsb2NhdGlvbik7XG4gICAgICAgICAgICBpZiAocmVmKVxuICAgICAgICAgICAgICAgIGZpbGVuYW1lQW5kTGluZSA9IHJlZlsxXTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubG9jYXRpb25JbmZvLnNldChjYWxsYmFjaywgZmlsZW5hbWVBbmRMaW5lKTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgICBnZXQoaWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FsbGJhY2tzW2lkXSB8fCBmdW5jdGlvbiAoKSB7IH07XG4gICAgfVxuICAgIGdldExvY2F0aW9uKGNhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxvY2F0aW9uSW5mby5nZXQoY2FsbGJhY2spO1xuICAgIH1cbiAgICBhcHBseShpZCwgLi4uYXJncykge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQoaWQpLmFwcGx5KGdsb2JhbCwgLi4uYXJncyk7XG4gICAgfVxuICAgIHJlbW92ZShpZCkge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuY2FsbGJhY2tzW2lkXTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrSWRzLmRlbGV0ZShjYWxsYmFjayk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5jYWxsYmFja3NbaWRdO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0cy5DYWxsYmFja3NSZWdpc3RyeSA9IENhbGxiYWNrc1JlZ2lzdHJ5O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmlmIChwcm9jZXNzLnR5cGUgPT09ICdicm93c2VyJylcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFwiQGVsZWN0cm9uL3JlbW90ZVwiIGNhbm5vdCBiZSByZXF1aXJlZCBpbiB0aGUgYnJvd3NlciBwcm9jZXNzLiBJbnN0ZWFkIHJlcXVpcmUoXCJAZWxlY3Ryb24vcmVtb3RlL21haW5cIikuYCk7XG5fX2V4cG9ydFN0YXIocmVxdWlyZShcIi4vcmVtb3RlXCIpLCBleHBvcnRzKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jcmVhdGVGdW5jdGlvbldpdGhSZXR1cm5WYWx1ZSA9IGV4cG9ydHMuZ2V0R2xvYmFsID0gZXhwb3J0cy5nZXRDdXJyZW50V2ViQ29udGVudHMgPSBleHBvcnRzLmdldEN1cnJlbnRXaW5kb3cgPSBleHBvcnRzLmdldEJ1aWx0aW4gPSB2b2lkIDA7XG5jb25zdCBjYWxsYmFja3NfcmVnaXN0cnlfMSA9IHJlcXVpcmUoXCIuL2NhbGxiYWNrcy1yZWdpc3RyeVwiKTtcbmNvbnN0IHR5cGVfdXRpbHNfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vdHlwZS11dGlsc1wiKTtcbmNvbnN0IGVsZWN0cm9uXzEgPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7XG5jb25zdCBtb2R1bGVfbmFtZXNfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vbW9kdWxlLW5hbWVzXCIpO1xuY29uc3QgZ2V0X2VsZWN0cm9uX2JpbmRpbmdfMSA9IHJlcXVpcmUoXCIuLi9jb21tb24vZ2V0LWVsZWN0cm9uLWJpbmRpbmdcIik7XG5jb25zdCBjYWxsYmFja3NSZWdpc3RyeSA9IG5ldyBjYWxsYmFja3NfcmVnaXN0cnlfMS5DYWxsYmFja3NSZWdpc3RyeSgpO1xuY29uc3QgcmVtb3RlT2JqZWN0Q2FjaGUgPSBuZXcgTWFwKCk7XG5jb25zdCBmaW5hbGl6YXRpb25SZWdpc3RyeSA9IG5ldyBGaW5hbGl6YXRpb25SZWdpc3RyeSgoaWQpID0+IHtcbiAgICBjb25zdCByZWYgPSByZW1vdGVPYmplY3RDYWNoZS5nZXQoaWQpO1xuICAgIGlmIChyZWYgIT09IHVuZGVmaW5lZCAmJiByZWYuZGVyZWYoKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlbW90ZU9iamVjdENhY2hlLmRlbGV0ZShpZCk7XG4gICAgICAgIGVsZWN0cm9uXzEuaXBjUmVuZGVyZXIuc2VuZChcIlJFTU9URV9CUk9XU0VSX0RFUkVGRVJFTkNFXCIgLyogQlJPV1NFUl9ERVJFRkVSRU5DRSAqLywgY29udGV4dElkLCBpZCwgMCk7XG4gICAgfVxufSk7XG5jb25zdCBlbGVjdHJvbklkcyA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCBpc1JldHVyblZhbHVlID0gbmV3IFdlYWtTZXQoKTtcbmZ1bmN0aW9uIGdldENhY2hlZFJlbW90ZU9iamVjdChpZCkge1xuICAgIGNvbnN0IHJlZiA9IHJlbW90ZU9iamVjdENhY2hlLmdldChpZCk7XG4gICAgaWYgKHJlZiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNvbnN0IGRlcmVmID0gcmVmLmRlcmVmKCk7XG4gICAgICAgIGlmIChkZXJlZiAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIGRlcmVmO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNldENhY2hlZFJlbW90ZU9iamVjdChpZCwgdmFsdWUpIHtcbiAgICBjb25zdCB3ciA9IG5ldyBXZWFrUmVmKHZhbHVlKTtcbiAgICByZW1vdGVPYmplY3RDYWNoZS5zZXQoaWQsIHdyKTtcbiAgICBmaW5hbGl6YXRpb25SZWdpc3RyeS5yZWdpc3Rlcih2YWx1ZSwgaWQpO1xuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGdldENvbnRleHRJZCgpIHtcbiAgICBjb25zdCB2OFV0aWwgPSBnZXRfZWxlY3Ryb25fYmluZGluZ18xLmdldEVsZWN0cm9uQmluZGluZygndjhfdXRpbCcpO1xuICAgIGlmICh2OFV0aWwpIHtcbiAgICAgICAgcmV0dXJuIHY4VXRpbC5nZXRIaWRkZW5WYWx1ZShnbG9iYWwsICdjb250ZXh0SWQnKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRWxlY3Ryb24gPj12MTMuMC4wLWJldGEuNiByZXF1aXJlZCB0byBzdXBwb3J0IHNhbmRib3hlZCByZW5kZXJlcnMnKTtcbiAgICB9XG59XG4vLyBBbiB1bmlxdWUgSUQgdGhhdCBjYW4gcmVwcmVzZW50IGN1cnJlbnQgY29udGV4dC5cbmNvbnN0IGNvbnRleHRJZCA9IHByb2Nlc3MuY29udGV4dElkIHx8IGdldENvbnRleHRJZCgpO1xuLy8gTm90aWZ5IHRoZSBtYWluIHByb2Nlc3Mgd2hlbiBjdXJyZW50IGNvbnRleHQgaXMgZ29pbmcgdG8gYmUgcmVsZWFzZWQuXG4vLyBOb3RlIHRoYXQgd2hlbiB0aGUgcmVuZGVyZXIgcHJvY2VzcyBpcyBkZXN0cm95ZWQsIHRoZSBtZXNzYWdlIG1heSBub3QgYmVcbi8vIHNlbnQsIHdlIGFsc28gbGlzdGVuIHRvIHRoZSBcInJlbmRlci12aWV3LWRlbGV0ZWRcIiBldmVudCBpbiB0aGUgbWFpbiBwcm9jZXNzXG4vLyB0byBndWFyZCB0aGF0IHNpdHVhdGlvbi5cbnByb2Nlc3Mub24oJ2V4aXQnLCAoKSA9PiB7XG4gICAgY29uc3QgY29tbWFuZCA9IFwiUkVNT1RFX0JST1dTRVJfQ09OVEVYVF9SRUxFQVNFXCIgLyogQlJPV1NFUl9DT05URVhUX1JFTEVBU0UgKi87XG4gICAgZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5zZW5kKGNvbW1hbmQsIGNvbnRleHRJZCk7XG59KTtcbmNvbnN0IElTX1JFTU9URV9QUk9YWSA9IFN5bWJvbCgnaXMtcmVtb3RlLXByb3h5Jyk7XG4vLyBDb252ZXJ0IHRoZSBhcmd1bWVudHMgb2JqZWN0IGludG8gYW4gYXJyYXkgb2YgbWV0YSBkYXRhLlxuZnVuY3Rpb24gd3JhcEFyZ3MoYXJncywgdmlzaXRlZCA9IG5ldyBTZXQoKSkge1xuICAgIGNvbnN0IHZhbHVlVG9NZXRhID0gKHZhbHVlKSA9PiB7XG4gICAgICAgIC8vIENoZWNrIGZvciBjaXJjdWxhciByZWZlcmVuY2UuXG4gICAgICAgIGlmICh2aXNpdGVkLmhhcyh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbnVsbFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IubmFtZSA9PT0gJ05hdGl2ZUltYWdlJykge1xuICAgICAgICAgICAgcmV0dXJuIHsgdHlwZTogJ25hdGl2ZWltYWdlJywgdmFsdWU6IHR5cGVfdXRpbHNfMS5zZXJpYWxpemUodmFsdWUpIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIHZpc2l0ZWQuYWRkKHZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IG1ldGEgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2FycmF5JyxcbiAgICAgICAgICAgICAgICB2YWx1ZTogd3JhcEFyZ3ModmFsdWUsIHZpc2l0ZWQpXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmlzaXRlZC5kZWxldGUodmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBCdWZmZXIpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2J1ZmZlcicsXG4gICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZV91dGlsc18xLmlzU2VyaWFsaXphYmxlT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlX3V0aWxzXzEuaXNQcm9taXNlKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwcm9taXNlJyxcbiAgICAgICAgICAgICAgICAgICAgdGhlbjogdmFsdWVUb01ldGEoZnVuY3Rpb24gKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoZWxlY3Ryb25JZHMuaGFzKHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdyZW1vdGUtb2JqZWN0JyxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IGVsZWN0cm9uSWRzLmdldCh2YWx1ZSlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbWV0YSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnb2JqZWN0JyxcbiAgICAgICAgICAgICAgICBuYW1lOiB2YWx1ZS5jb25zdHJ1Y3RvciA/IHZhbHVlLmNvbnN0cnVjdG9yLm5hbWUgOiAnJyxcbiAgICAgICAgICAgICAgICBtZW1iZXJzOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZpc2l0ZWQuYWRkKHZhbHVlKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiB2YWx1ZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGd1YXJkLWZvci1pblxuICAgICAgICAgICAgICAgIG1ldGEubWVtYmVycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcHJvcCxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlVG9NZXRhKHZhbHVlW3Byb3BdKVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmlzaXRlZC5kZWxldGUodmFsdWUpO1xuICAgICAgICAgICAgcmV0dXJuIG1ldGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nICYmIGlzUmV0dXJuVmFsdWUuaGFzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZnVuY3Rpb24td2l0aC1yZXR1cm4tdmFsdWUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVRvTWV0YSh2YWx1ZSgpKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2Z1bmN0aW9uJyxcbiAgICAgICAgICAgICAgICBpZDogY2FsbGJhY2tzUmVnaXN0cnkuYWRkKHZhbHVlKSxcbiAgICAgICAgICAgICAgICBsb2NhdGlvbjogY2FsbGJhY2tzUmVnaXN0cnkuZ2V0TG9jYXRpb24odmFsdWUpLFxuICAgICAgICAgICAgICAgIGxlbmd0aDogdmFsdWUubGVuZ3RoXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gYXJncy5tYXAodmFsdWVUb01ldGEpO1xufVxuLy8gUG9wdWxhdGUgb2JqZWN0J3MgbWVtYmVycyBmcm9tIGRlc2NyaXB0b3JzLlxuLy8gVGhlIHxyZWZ8IHdpbGwgYmUga2VwdCByZWZlcmVuY2VkIGJ5IHxtZW1iZXJzfC5cbi8vIFRoaXMgbWF0Y2hlcyB8Z2V0T2JqZWN0TWVtZWJlcnN8IGluIHJwYy1zZXJ2ZXIuXG5mdW5jdGlvbiBzZXRPYmplY3RNZW1iZXJzKHJlZiwgb2JqZWN0LCBtZXRhSWQsIG1lbWJlcnMpIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkobWVtYmVycykpXG4gICAgICAgIHJldHVybjtcbiAgICBmb3IgKGNvbnN0IG1lbWJlciBvZiBtZW1iZXJzKSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBtZW1iZXIubmFtZSkpXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgY29uc3QgZGVzY3JpcHRvciA9IHsgZW51bWVyYWJsZTogbWVtYmVyLmVudW1lcmFibGUgfTtcbiAgICAgICAgaWYgKG1lbWJlci50eXBlID09PSAnbWV0aG9kJykge1xuICAgICAgICAgICAgY29uc3QgcmVtb3RlTWVtYmVyRnVuY3Rpb24gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGxldCBjb21tYW5kO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzICYmIHRoaXMuY29uc3RydWN0b3IgPT09IHJlbW90ZU1lbWJlckZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQgPSBcIlJFTU9URV9CUk9XU0VSX01FTUJFUl9DT05TVFJVQ1RPUlwiIC8qIEJST1dTRVJfTUVNQkVSX0NPTlNUUlVDVE9SICovO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZCA9IFwiUkVNT1RFX0JST1dTRVJfTUVNQkVSX0NBTExcIiAvKiBCUk9XU0VSX01FTUJFUl9DQUxMICovO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBlbGVjdHJvbl8xLmlwY1JlbmRlcmVyLnNlbmRTeW5jKGNvbW1hbmQsIGNvbnRleHRJZCwgbWV0YUlkLCBtZW1iZXIubmFtZSwgd3JhcEFyZ3MoYXJncykpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhVG9WYWx1ZShyZXQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGxldCBkZXNjcmlwdG9yRnVuY3Rpb24gPSBwcm94eUZ1bmN0aW9uUHJvcGVydGllcyhyZW1vdGVNZW1iZXJGdW5jdGlvbiwgbWV0YUlkLCBtZW1iZXIubmFtZSk7XG4gICAgICAgICAgICBkZXNjcmlwdG9yLmdldCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yRnVuY3Rpb24ucmVmID0gcmVmOyAvLyBUaGUgbWVtYmVyIHNob3VsZCByZWZlcmVuY2UgaXRzIG9iamVjdC5cbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvckZ1bmN0aW9uO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIC8vIEVuYWJsZSBtb25rZXktcGF0Y2ggdGhlIG1ldGhvZFxuICAgICAgICAgICAgZGVzY3JpcHRvci5zZXQgPSAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yRnVuY3Rpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1lbWJlci50eXBlID09PSAnZ2V0Jykge1xuICAgICAgICAgICAgZGVzY3JpcHRvci5nZXQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29tbWFuZCA9IFwiUkVNT1RFX0JST1dTRVJfTUVNQkVSX0dFVFwiIC8qIEJST1dTRVJfTUVNQkVSX0dFVCAqLztcbiAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5zZW5kU3luYyhjb21tYW5kLCBjb250ZXh0SWQsIG1ldGFJZCwgbWVtYmVyLm5hbWUpO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXRhVG9WYWx1ZShtZXRhKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAobWVtYmVyLndyaXRhYmxlKSB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5zZXQgPSAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJncyA9IHdyYXBBcmdzKFt2YWx1ZV0pO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21tYW5kID0gXCJSRU1PVEVfQlJPV1NFUl9NRU1CRVJfU0VUXCIgLyogQlJPV1NFUl9NRU1CRVJfU0VUICovO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXRhID0gZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5zZW5kU3luYyhjb21tYW5kLCBjb250ZXh0SWQsIG1ldGFJZCwgbWVtYmVyLm5hbWUsIGFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICBpZiAobWV0YSAhPSBudWxsKVxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0YVRvVmFsdWUobWV0YSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG1lbWJlci5uYW1lLCBkZXNjcmlwdG9yKTtcbiAgICB9XG59XG4vLyBQb3B1bGF0ZSBvYmplY3QncyBwcm90b3R5cGUgZnJvbSBkZXNjcmlwdG9yLlxuLy8gVGhpcyBtYXRjaGVzIHxnZXRPYmplY3RQcm90b3R5cGV8IGluIHJwYy1zZXJ2ZXIuXG5mdW5jdGlvbiBzZXRPYmplY3RQcm90b3R5cGUocmVmLCBvYmplY3QsIG1ldGFJZCwgZGVzY3JpcHRvcikge1xuICAgIGlmIChkZXNjcmlwdG9yID09PSBudWxsKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgcHJvdG8gPSB7fTtcbiAgICBzZXRPYmplY3RNZW1iZXJzKHJlZiwgcHJvdG8sIG1ldGFJZCwgZGVzY3JpcHRvci5tZW1iZXJzKTtcbiAgICBzZXRPYmplY3RQcm90b3R5cGUocmVmLCBwcm90bywgbWV0YUlkLCBkZXNjcmlwdG9yLnByb3RvKTtcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2Yob2JqZWN0LCBwcm90byk7XG59XG4vLyBXcmFwIGZ1bmN0aW9uIGluIFByb3h5IGZvciBhY2Nlc3NpbmcgcmVtb3RlIHByb3BlcnRpZXNcbmZ1bmN0aW9uIHByb3h5RnVuY3Rpb25Qcm9wZXJ0aWVzKHJlbW90ZU1lbWJlckZ1bmN0aW9uLCBtZXRhSWQsIG5hbWUpIHtcbiAgICBsZXQgbG9hZGVkID0gZmFsc2U7XG4gICAgLy8gTGF6aWx5IGxvYWQgZnVuY3Rpb24gcHJvcGVydGllc1xuICAgIGNvbnN0IGxvYWRSZW1vdGVQcm9wZXJ0aWVzID0gKCkgPT4ge1xuICAgICAgICBpZiAobG9hZGVkKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBsb2FkZWQgPSB0cnVlO1xuICAgICAgICBjb25zdCBjb21tYW5kID0gXCJSRU1PVEVfQlJPV1NFUl9NRU1CRVJfR0VUXCIgLyogQlJPV1NFUl9NRU1CRVJfR0VUICovO1xuICAgICAgICBjb25zdCBtZXRhID0gZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5zZW5kU3luYyhjb21tYW5kLCBjb250ZXh0SWQsIG1ldGFJZCwgbmFtZSk7XG4gICAgICAgIHNldE9iamVjdE1lbWJlcnMocmVtb3RlTWVtYmVyRnVuY3Rpb24sIHJlbW90ZU1lbWJlckZ1bmN0aW9uLCBtZXRhLmlkLCBtZXRhLm1lbWJlcnMpO1xuICAgIH07XG4gICAgcmV0dXJuIG5ldyBQcm94eShyZW1vdGVNZW1iZXJGdW5jdGlvbiwge1xuICAgICAgICBzZXQ6ICh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9PSAncmVmJylcbiAgICAgICAgICAgICAgICBsb2FkUmVtb3RlUHJvcGVydGllcygpO1xuICAgICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldDogKHRhcmdldCwgcHJvcGVydHkpID0+IHtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gSVNfUkVNT1RFX1BST1hZKVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgaWYgKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBwcm9wZXJ0eSkpXG4gICAgICAgICAgICAgICAgbG9hZFJlbW90ZVByb3BlcnRpZXMoKTtcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gdGFyZ2V0W3Byb3BlcnR5XTtcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gJ3RvU3RyaW5nJyAmJiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUuYmluZCh0YXJnZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9LFxuICAgICAgICBvd25LZXlzOiAodGFyZ2V0KSA9PiB7XG4gICAgICAgICAgICBsb2FkUmVtb3RlUHJvcGVydGllcygpO1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogKHRhcmdldCwgcHJvcGVydHkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHkpO1xuICAgICAgICAgICAgaWYgKGRlc2NyaXB0b3IpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gICAgICAgICAgICBsb2FkUmVtb3RlUHJvcGVydGllcygpO1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbi8vIENvbnZlcnQgbWV0YSBkYXRhIGZyb20gYnJvd3NlciBpbnRvIHJlYWwgdmFsdWUuXG5mdW5jdGlvbiBtZXRhVG9WYWx1ZShtZXRhKSB7XG4gICAgaWYgKG1ldGEudHlwZSA9PT0gJ3ZhbHVlJykge1xuICAgICAgICByZXR1cm4gbWV0YS52YWx1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWV0YS50eXBlID09PSAnYXJyYXknKSB7XG4gICAgICAgIHJldHVybiBtZXRhLm1lbWJlcnMubWFwKChtZW1iZXIpID0+IG1ldGFUb1ZhbHVlKG1lbWJlcikpO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXRhLnR5cGUgPT09ICduYXRpdmVpbWFnZScpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVfdXRpbHNfMS5kZXNlcmlhbGl6ZShtZXRhLnZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWV0YS50eXBlID09PSAnYnVmZmVyJykge1xuICAgICAgICByZXR1cm4gQnVmZmVyLmZyb20obWV0YS52YWx1ZS5idWZmZXIsIG1ldGEudmFsdWUuYnl0ZU9mZnNldCwgbWV0YS52YWx1ZS5ieXRlTGVuZ3RoKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWV0YS50eXBlID09PSAncHJvbWlzZScpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IHRoZW46IG1ldGFUb1ZhbHVlKG1ldGEudGhlbikgfSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1ldGEudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICByZXR1cm4gbWV0YVRvRXJyb3IobWV0YSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1ldGEudHlwZSA9PT0gJ2V4Y2VwdGlvbicpIHtcbiAgICAgICAgaWYgKG1ldGEudmFsdWUudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgdGhyb3cgbWV0YVRvRXJyb3IobWV0YS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgdmFsdWUgdHlwZSBpbiBleGNlcHRpb246ICR7bWV0YS52YWx1ZS50eXBlfWApO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsZXQgcmV0O1xuICAgICAgICBpZiAoJ2lkJyBpbiBtZXRhKSB7XG4gICAgICAgICAgICBjb25zdCBjYWNoZWQgPSBnZXRDYWNoZWRSZW1vdGVPYmplY3QobWV0YS5pZCk7XG4gICAgICAgICAgICBpZiAoY2FjaGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FjaGVkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEEgc2hhZG93IGNsYXNzIHRvIHJlcHJlc2VudCB0aGUgcmVtb3RlIGZ1bmN0aW9uIG9iamVjdC5cbiAgICAgICAgaWYgKG1ldGEudHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY29uc3QgcmVtb3RlRnVuY3Rpb24gPSBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIGxldCBjb21tYW5kO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzICYmIHRoaXMuY29uc3RydWN0b3IgPT09IHJlbW90ZUZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQgPSBcIlJFTU9URV9CUk9XU0VSX0NPTlNUUlVDVE9SXCIgLyogQlJPV1NFUl9DT05TVFJVQ1RPUiAqLztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQgPSBcIlJFTU9URV9CUk9XU0VSX0ZVTkNUSU9OX0NBTExcIiAvKiBCUk9XU0VSX0ZVTkNUSU9OX0NBTEwgKi87XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG9iaiA9IGVsZWN0cm9uXzEuaXBjUmVuZGVyZXIuc2VuZFN5bmMoY29tbWFuZCwgY29udGV4dElkLCBtZXRhLmlkLCB3cmFwQXJncyhhcmdzKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGFUb1ZhbHVlKG9iaik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmV0ID0gcmVtb3RlRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBzZXRPYmplY3RNZW1iZXJzKHJldCwgcmV0LCBtZXRhLmlkLCBtZXRhLm1lbWJlcnMpO1xuICAgICAgICBzZXRPYmplY3RQcm90b3R5cGUocmV0LCByZXQsIG1ldGEuaWQsIG1ldGEucHJvdG8pO1xuICAgICAgICBpZiAocmV0LmNvbnN0cnVjdG9yICYmIHJldC5jb25zdHJ1Y3RvcltJU19SRU1PVEVfUFJPWFldKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocmV0LmNvbnN0cnVjdG9yLCAnbmFtZScsIHsgdmFsdWU6IG1ldGEubmFtZSB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBUcmFjayBkZWxlZ2F0ZSBvYmoncyBsaWZldGltZSAmIHRlbGwgYnJvd3NlciB0byBjbGVhbiB1cCB3aGVuIG9iamVjdCBpcyBHQ2VkLlxuICAgICAgICBlbGVjdHJvbklkcy5zZXQocmV0LCBtZXRhLmlkKTtcbiAgICAgICAgc2V0Q2FjaGVkUmVtb3RlT2JqZWN0KG1ldGEuaWQsIHJldCk7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgfVxufVxuZnVuY3Rpb24gbWV0YVRvRXJyb3IobWV0YSkge1xuICAgIGNvbnN0IG9iaiA9IG1ldGEudmFsdWU7XG4gICAgZm9yIChjb25zdCB7IG5hbWUsIHZhbHVlIH0gb2YgbWV0YS5tZW1iZXJzKSB7XG4gICAgICAgIG9ialtuYW1lXSA9IG1ldGFUb1ZhbHVlKHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbn1cbmZ1bmN0aW9uIGhhbmRsZU1lc3NhZ2UoY2hhbm5lbCwgaGFuZGxlcikge1xuICAgIGVsZWN0cm9uXzEuaXBjUmVuZGVyZXIub24oY2hhbm5lbCwgKGV2ZW50LCBwYXNzZWRDb250ZXh0SWQsIGlkLCAuLi5hcmdzKSA9PiB7XG4gICAgICAgIGlmIChldmVudC5zZW5kZXJJZCAhPT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgTWVzc2FnZSAke2NoYW5uZWx9IHNlbnQgYnkgdW5leHBlY3RlZCBXZWJDb250ZW50cyAoJHtldmVudC5zZW5kZXJJZH0pYCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhc3NlZENvbnRleHRJZCA9PT0gY29udGV4dElkKSB7XG4gICAgICAgICAgICBoYW5kbGVyKGlkLCAuLi5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIE1lc3NhZ2Ugc2VudCB0byBhbiB1bi1leGlzdCBjb250ZXh0LCBub3RpZnkgdGhlIGVycm9yIHRvIG1haW4gcHJvY2Vzcy5cbiAgICAgICAgICAgIGVsZWN0cm9uXzEuaXBjUmVuZGVyZXIuc2VuZChcIlJFTU9URV9CUk9XU0VSX1dST05HX0NPTlRFWFRfRVJST1JcIiAvKiBCUk9XU0VSX1dST05HX0NPTlRFWFRfRVJST1IgKi8sIGNvbnRleHRJZCwgcGFzc2VkQ29udGV4dElkLCBpZCk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmNvbnN0IGVuYWJsZVN0YWNrcyA9IHByb2Nlc3MuYXJndi5pbmNsdWRlcygnLS1lbmFibGUtYXBpLWZpbHRlcmluZy1sb2dnaW5nJyk7XG5mdW5jdGlvbiBnZXRDdXJyZW50U3RhY2soKSB7XG4gICAgY29uc3QgdGFyZ2V0ID0geyBzdGFjazogdW5kZWZpbmVkIH07XG4gICAgaWYgKGVuYWJsZVN0YWNrcykge1xuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0YXJnZXQsIGdldEN1cnJlbnRTdGFjayk7XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQuc3RhY2s7XG59XG4vLyBCcm93c2VyIGNhbGxzIGEgY2FsbGJhY2sgaW4gcmVuZGVyZXIuXG5oYW5kbGVNZXNzYWdlKFwiUkVNT1RFX1JFTkRFUkVSX0NBTExCQUNLXCIgLyogUkVOREVSRVJfQ0FMTEJBQ0sgKi8sIChpZCwgYXJncykgPT4ge1xuICAgIGNhbGxiYWNrc1JlZ2lzdHJ5LmFwcGx5KGlkLCBtZXRhVG9WYWx1ZShhcmdzKSk7XG59KTtcbi8vIEEgY2FsbGJhY2sgaW4gYnJvd3NlciBpcyByZWxlYXNlZC5cbmhhbmRsZU1lc3NhZ2UoXCJSRU1PVEVfUkVOREVSRVJfUkVMRUFTRV9DQUxMQkFDS1wiIC8qIFJFTkRFUkVSX1JFTEVBU0VfQ0FMTEJBQ0sgKi8sIChpZCkgPT4ge1xuICAgIGNhbGxiYWNrc1JlZ2lzdHJ5LnJlbW92ZShpZCk7XG59KTtcbmV4cG9ydHMucmVxdWlyZSA9IChtb2R1bGUpID0+IHtcbiAgICBjb25zdCBjb21tYW5kID0gXCJSRU1PVEVfQlJPV1NFUl9SRVFVSVJFXCIgLyogQlJPV1NFUl9SRVFVSVJFICovO1xuICAgIGNvbnN0IG1ldGEgPSBlbGVjdHJvbl8xLmlwY1JlbmRlcmVyLnNlbmRTeW5jKGNvbW1hbmQsIGNvbnRleHRJZCwgbW9kdWxlLCBnZXRDdXJyZW50U3RhY2soKSk7XG4gICAgcmV0dXJuIG1ldGFUb1ZhbHVlKG1ldGEpO1xufTtcbi8vIEFsaWFzIHRvIHJlbW90ZS5yZXF1aXJlKCdlbGVjdHJvbicpLnh4eC5cbmZ1bmN0aW9uIGdldEJ1aWx0aW4obW9kdWxlKSB7XG4gICAgY29uc3QgY29tbWFuZCA9IFwiUkVNT1RFX0JST1dTRVJfR0VUX0JVSUxUSU5cIiAvKiBCUk9XU0VSX0dFVF9CVUlMVElOICovO1xuICAgIGNvbnN0IG1ldGEgPSBlbGVjdHJvbl8xLmlwY1JlbmRlcmVyLnNlbmRTeW5jKGNvbW1hbmQsIGNvbnRleHRJZCwgbW9kdWxlLCBnZXRDdXJyZW50U3RhY2soKSk7XG4gICAgcmV0dXJuIG1ldGFUb1ZhbHVlKG1ldGEpO1xufVxuZXhwb3J0cy5nZXRCdWlsdGluID0gZ2V0QnVpbHRpbjtcbmZ1bmN0aW9uIGdldEN1cnJlbnRXaW5kb3coKSB7XG4gICAgY29uc3QgY29tbWFuZCA9IFwiUkVNT1RFX0JST1dTRVJfR0VUX0NVUlJFTlRfV0lORE9XXCIgLyogQlJPV1NFUl9HRVRfQ1VSUkVOVF9XSU5ET1cgKi87XG4gICAgY29uc3QgbWV0YSA9IGVsZWN0cm9uXzEuaXBjUmVuZGVyZXIuc2VuZFN5bmMoY29tbWFuZCwgY29udGV4dElkLCBnZXRDdXJyZW50U3RhY2soKSk7XG4gICAgcmV0dXJuIG1ldGFUb1ZhbHVlKG1ldGEpO1xufVxuZXhwb3J0cy5nZXRDdXJyZW50V2luZG93ID0gZ2V0Q3VycmVudFdpbmRvdztcbi8vIEdldCBjdXJyZW50IFdlYkNvbnRlbnRzIG9iamVjdC5cbmZ1bmN0aW9uIGdldEN1cnJlbnRXZWJDb250ZW50cygpIHtcbiAgICBjb25zdCBjb21tYW5kID0gXCJSRU1PVEVfQlJPV1NFUl9HRVRfQ1VSUkVOVF9XRUJfQ09OVEVOVFNcIiAvKiBCUk9XU0VSX0dFVF9DVVJSRU5UX1dFQl9DT05URU5UUyAqLztcbiAgICBjb25zdCBtZXRhID0gZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5zZW5kU3luYyhjb21tYW5kLCBjb250ZXh0SWQsIGdldEN1cnJlbnRTdGFjaygpKTtcbiAgICByZXR1cm4gbWV0YVRvVmFsdWUobWV0YSk7XG59XG5leHBvcnRzLmdldEN1cnJlbnRXZWJDb250ZW50cyA9IGdldEN1cnJlbnRXZWJDb250ZW50cztcbi8vIEdldCBhIGdsb2JhbCBvYmplY3QgaW4gYnJvd3Nlci5cbmZ1bmN0aW9uIGdldEdsb2JhbChuYW1lKSB7XG4gICAgY29uc3QgY29tbWFuZCA9IFwiUkVNT1RFX0JST1dTRVJfR0VUX0dMT0JBTFwiIC8qIEJST1dTRVJfR0VUX0dMT0JBTCAqLztcbiAgICBjb25zdCBtZXRhID0gZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5zZW5kU3luYyhjb21tYW5kLCBjb250ZXh0SWQsIG5hbWUsIGdldEN1cnJlbnRTdGFjaygpKTtcbiAgICByZXR1cm4gbWV0YVRvVmFsdWUobWV0YSk7XG59XG5leHBvcnRzLmdldEdsb2JhbCA9IGdldEdsb2JhbDtcbi8vIEdldCB0aGUgcHJvY2VzcyBvYmplY3QgaW4gYnJvd3Nlci5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncHJvY2VzcycsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogKCkgPT4gZXhwb3J0cy5nZXRHbG9iYWwoJ3Byb2Nlc3MnKVxufSk7XG4vLyBDcmVhdGUgYSBmdW5jdGlvbiB0aGF0IHdpbGwgcmV0dXJuIHRoZSBzcGVjaWZpZWQgdmFsdWUgd2hlbiBjYWxsZWQgaW4gYnJvd3Nlci5cbmZ1bmN0aW9uIGNyZWF0ZUZ1bmN0aW9uV2l0aFJldHVyblZhbHVlKHJldHVyblZhbHVlKSB7XG4gICAgY29uc3QgZnVuYyA9ICgpID0+IHJldHVyblZhbHVlO1xuICAgIGlzUmV0dXJuVmFsdWUuYWRkKGZ1bmMpO1xuICAgIHJldHVybiBmdW5jO1xufVxuZXhwb3J0cy5jcmVhdGVGdW5jdGlvbldpdGhSZXR1cm5WYWx1ZSA9IGNyZWF0ZUZ1bmN0aW9uV2l0aFJldHVyblZhbHVlO1xuY29uc3QgYWRkQnVpbHRpblByb3BlcnR5ID0gKG5hbWUpID0+IHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBnZXQ6ICgpID0+IGV4cG9ydHMuZ2V0QnVpbHRpbihuYW1lKVxuICAgIH0pO1xufTtcbm1vZHVsZV9uYW1lc18xLmJyb3dzZXJNb2R1bGVOYW1lc1xuICAgIC5mb3JFYWNoKGFkZEJ1aWx0aW5Qcm9wZXJ0eSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uL2Rpc3Qvc3JjL3JlbmRlcmVyJylcbiIsIi8qKlxuICogbWFya2VkIC0gYSBtYXJrZG93biBwYXJzZXJcbiAqIENvcHlyaWdodCAoYykgMjAxMS0yMDIxLCBDaHJpc3RvcGhlciBKZWZmcmV5LiAoTUlUIExpY2Vuc2VkKVxuICogaHR0cHM6Ly9naXRodWIuY29tL21hcmtlZGpzL21hcmtlZFxuICovXG5cbi8qKlxuICogRE8gTk9UIEVESVQgVEhJUyBGSUxFXG4gKiBUaGUgY29kZSBpbiB0aGlzIGZpbGUgaXMgZ2VuZXJhdGVkIGZyb20gZmlsZXMgaW4gLi9zcmMvXG4gKi9cblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsVGhpcyA6IGdsb2JhbCB8fCBzZWxmLCBnbG9iYWwubWFya2VkID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfVxuXG4gIGZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgICBpZiAoIW8pIHJldHVybjtcbiAgICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICAgIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgICBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICAgIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gICAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgICByZXR1cm4gYXJyMjtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyTG9vc2UobywgYWxsb3dBcnJheUxpa2UpIHtcbiAgICB2YXIgaXQgPSB0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSB8fCBvW1wiQEBpdGVyYXRvclwiXTtcbiAgICBpZiAoaXQpIHJldHVybiAoaXQgPSBpdC5jYWxsKG8pKS5uZXh0LmJpbmQoaXQpO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobykgfHwgKGl0ID0gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8pKSB8fCBhbGxvd0FycmF5TGlrZSAmJiBvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgaWYgKGl0KSBvID0gaXQ7XG4gICAgICB2YXIgaSA9IDA7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaSA+PSBvLmxlbmd0aCkgcmV0dXJuIHtcbiAgICAgICAgICBkb25lOiB0cnVlXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6IG9baSsrXVxuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGl0ZXJhdGUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG4gIH1cblxuICB2YXIgZGVmYXVsdHMkNSA9IHtleHBvcnRzOiB7fX07XG5cbiAgZnVuY3Rpb24gZ2V0RGVmYXVsdHMkMSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYmFzZVVybDogbnVsbCxcbiAgICAgIGJyZWFrczogZmFsc2UsXG4gICAgICBleHRlbnNpb25zOiBudWxsLFxuICAgICAgZ2ZtOiB0cnVlLFxuICAgICAgaGVhZGVySWRzOiB0cnVlLFxuICAgICAgaGVhZGVyUHJlZml4OiAnJyxcbiAgICAgIGhpZ2hsaWdodDogbnVsbCxcbiAgICAgIGxhbmdQcmVmaXg6ICdsYW5ndWFnZS0nLFxuICAgICAgbWFuZ2xlOiB0cnVlLFxuICAgICAgcGVkYW50aWM6IGZhbHNlLFxuICAgICAgcmVuZGVyZXI6IG51bGwsXG4gICAgICBzYW5pdGl6ZTogZmFsc2UsXG4gICAgICBzYW5pdGl6ZXI6IG51bGwsXG4gICAgICBzaWxlbnQ6IGZhbHNlLFxuICAgICAgc21hcnRMaXN0czogZmFsc2UsXG4gICAgICBzbWFydHlwYW50czogZmFsc2UsXG4gICAgICB0b2tlbml6ZXI6IG51bGwsXG4gICAgICB3YWxrVG9rZW5zOiBudWxsLFxuICAgICAgeGh0bWw6IGZhbHNlXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoYW5nZURlZmF1bHRzJDEobmV3RGVmYXVsdHMpIHtcbiAgICBkZWZhdWx0cyQ1LmV4cG9ydHMuZGVmYXVsdHMgPSBuZXdEZWZhdWx0cztcbiAgfVxuXG4gIGRlZmF1bHRzJDUuZXhwb3J0cyA9IHtcbiAgICBkZWZhdWx0czogZ2V0RGVmYXVsdHMkMSgpLFxuICAgIGdldERlZmF1bHRzOiBnZXREZWZhdWx0cyQxLFxuICAgIGNoYW5nZURlZmF1bHRzOiBjaGFuZ2VEZWZhdWx0cyQxXG4gIH07XG5cbiAgLyoqXG4gICAqIEhlbHBlcnNcbiAgICovXG4gIHZhciBlc2NhcGVUZXN0ID0gL1smPD5cIiddLztcbiAgdmFyIGVzY2FwZVJlcGxhY2UgPSAvWyY8PlwiJ10vZztcbiAgdmFyIGVzY2FwZVRlc3ROb0VuY29kZSA9IC9bPD5cIiddfCYoPyEjP1xcdys7KS87XG4gIHZhciBlc2NhcGVSZXBsYWNlTm9FbmNvZGUgPSAvWzw+XCInXXwmKD8hIz9cXHcrOykvZztcbiAgdmFyIGVzY2FwZVJlcGxhY2VtZW50cyA9IHtcbiAgICAnJic6ICcmYW1wOycsXG4gICAgJzwnOiAnJmx0OycsXG4gICAgJz4nOiAnJmd0OycsXG4gICAgJ1wiJzogJyZxdW90OycsXG4gICAgXCInXCI6ICcmIzM5OydcbiAgfTtcblxuICB2YXIgZ2V0RXNjYXBlUmVwbGFjZW1lbnQgPSBmdW5jdGlvbiBnZXRFc2NhcGVSZXBsYWNlbWVudChjaCkge1xuICAgIHJldHVybiBlc2NhcGVSZXBsYWNlbWVudHNbY2hdO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGVzY2FwZSQyKGh0bWwsIGVuY29kZSkge1xuICAgIGlmIChlbmNvZGUpIHtcbiAgICAgIGlmIChlc2NhcGVUZXN0LnRlc3QoaHRtbCkpIHtcbiAgICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZShlc2NhcGVSZXBsYWNlLCBnZXRFc2NhcGVSZXBsYWNlbWVudCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlc2NhcGVUZXN0Tm9FbmNvZGUudGVzdChodG1sKSkge1xuICAgICAgICByZXR1cm4gaHRtbC5yZXBsYWNlKGVzY2FwZVJlcGxhY2VOb0VuY29kZSwgZ2V0RXNjYXBlUmVwbGFjZW1lbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBodG1sO1xuICB9XG5cbiAgdmFyIHVuZXNjYXBlVGVzdCA9IC8mKCMoPzpcXGQrKXwoPzojeFswLTlBLUZhLWZdKyl8KD86XFx3KykpOz8vaWc7XG5cbiAgZnVuY3Rpb24gdW5lc2NhcGUkMShodG1sKSB7XG4gICAgLy8gZXhwbGljaXRseSBtYXRjaCBkZWNpbWFsLCBoZXgsIGFuZCBuYW1lZCBIVE1MIGVudGl0aWVzXG4gICAgcmV0dXJuIGh0bWwucmVwbGFjZSh1bmVzY2FwZVRlc3QsIGZ1bmN0aW9uIChfLCBuKSB7XG4gICAgICBuID0gbi50b0xvd2VyQ2FzZSgpO1xuICAgICAgaWYgKG4gPT09ICdjb2xvbicpIHJldHVybiAnOic7XG5cbiAgICAgIGlmIChuLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAgIHJldHVybiBuLmNoYXJBdCgxKSA9PT0gJ3gnID8gU3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChuLnN1YnN0cmluZygyKSwgMTYpKSA6IFN0cmluZy5mcm9tQ2hhckNvZGUoK24uc3Vic3RyaW5nKDEpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICcnO1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIGNhcmV0ID0gLyhefFteXFxbXSlcXF4vZztcblxuICBmdW5jdGlvbiBlZGl0JDEocmVnZXgsIG9wdCkge1xuICAgIHJlZ2V4ID0gcmVnZXguc291cmNlIHx8IHJlZ2V4O1xuICAgIG9wdCA9IG9wdCB8fCAnJztcbiAgICB2YXIgb2JqID0ge1xuICAgICAgcmVwbGFjZTogZnVuY3Rpb24gcmVwbGFjZShuYW1lLCB2YWwpIHtcbiAgICAgICAgdmFsID0gdmFsLnNvdXJjZSB8fCB2YWw7XG4gICAgICAgIHZhbCA9IHZhbC5yZXBsYWNlKGNhcmV0LCAnJDEnKTtcbiAgICAgICAgcmVnZXggPSByZWdleC5yZXBsYWNlKG5hbWUsIHZhbCk7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9LFxuICAgICAgZ2V0UmVnZXg6IGZ1bmN0aW9uIGdldFJlZ2V4KCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChyZWdleCwgb3B0KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgbm9uV29yZEFuZENvbG9uVGVzdCA9IC9bXlxcdzpdL2c7XG4gIHZhciBvcmlnaW5JbmRlcGVuZGVudFVybCA9IC9eJHxeW2Etel1bYS16MC05Ky4tXSo6fF5bPyNdL2k7XG5cbiAgZnVuY3Rpb24gY2xlYW5VcmwkMShzYW5pdGl6ZSwgYmFzZSwgaHJlZikge1xuICAgIGlmIChzYW5pdGl6ZSkge1xuICAgICAgdmFyIHByb3Q7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHByb3QgPSBkZWNvZGVVUklDb21wb25lbnQodW5lc2NhcGUkMShocmVmKSkucmVwbGFjZShub25Xb3JkQW5kQ29sb25UZXN0LCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm90LmluZGV4T2YoJ2phdmFzY3JpcHQ6JykgPT09IDAgfHwgcHJvdC5pbmRleE9mKCd2YnNjcmlwdDonKSA9PT0gMCB8fCBwcm90LmluZGV4T2YoJ2RhdGE6JykgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGJhc2UgJiYgIW9yaWdpbkluZGVwZW5kZW50VXJsLnRlc3QoaHJlZikpIHtcbiAgICAgIGhyZWYgPSByZXNvbHZlVXJsKGJhc2UsIGhyZWYpO1xuICAgIH1cblxuICAgIHRyeSB7XG4gICAgICBocmVmID0gZW5jb2RlVVJJKGhyZWYpLnJlcGxhY2UoLyUyNS9nLCAnJScpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBocmVmO1xuICB9XG5cbiAgdmFyIGJhc2VVcmxzID0ge307XG4gIHZhciBqdXN0RG9tYWluID0gL15bXjpdKzpcXC8qW14vXSokLztcbiAgdmFyIHByb3RvY29sID0gL14oW146XSs6KVtcXHNcXFNdKiQvO1xuICB2YXIgZG9tYWluID0gL14oW146XSs6XFwvKlteL10qKVtcXHNcXFNdKiQvO1xuXG4gIGZ1bmN0aW9uIHJlc29sdmVVcmwoYmFzZSwgaHJlZikge1xuICAgIGlmICghYmFzZVVybHNbJyAnICsgYmFzZV0pIHtcbiAgICAgIC8vIHdlIGNhbiBpZ25vcmUgZXZlcnl0aGluZyBpbiBiYXNlIGFmdGVyIHRoZSBsYXN0IHNsYXNoIG9mIGl0cyBwYXRoIGNvbXBvbmVudCxcbiAgICAgIC8vIGJ1dCB3ZSBtaWdodCBuZWVkIHRvIGFkZCBfdGhhdF9cbiAgICAgIC8vIGh0dHBzOi8vdG9vbHMuaWV0Zi5vcmcvaHRtbC9yZmMzOTg2I3NlY3Rpb24tM1xuICAgICAgaWYgKGp1c3REb21haW4udGVzdChiYXNlKSkge1xuICAgICAgICBiYXNlVXJsc1snICcgKyBiYXNlXSA9IGJhc2UgKyAnLyc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBiYXNlVXJsc1snICcgKyBiYXNlXSA9IHJ0cmltJDEoYmFzZSwgJy8nLCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBiYXNlID0gYmFzZVVybHNbJyAnICsgYmFzZV07XG4gICAgdmFyIHJlbGF0aXZlQmFzZSA9IGJhc2UuaW5kZXhPZignOicpID09PSAtMTtcblxuICAgIGlmIChocmVmLnN1YnN0cmluZygwLCAyKSA9PT0gJy8vJykge1xuICAgICAgaWYgKHJlbGF0aXZlQmFzZSkge1xuICAgICAgICByZXR1cm4gaHJlZjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJhc2UucmVwbGFjZShwcm90b2NvbCwgJyQxJykgKyBocmVmO1xuICAgIH0gZWxzZSBpZiAoaHJlZi5jaGFyQXQoMCkgPT09ICcvJykge1xuICAgICAgaWYgKHJlbGF0aXZlQmFzZSkge1xuICAgICAgICByZXR1cm4gaHJlZjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJhc2UucmVwbGFjZShkb21haW4sICckMScpICsgaHJlZjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGJhc2UgKyBocmVmO1xuICAgIH1cbiAgfVxuXG4gIHZhciBub29wVGVzdCQxID0ge1xuICAgIGV4ZWM6IGZ1bmN0aW9uIG5vb3BUZXN0KCkge31cbiAgfTtcblxuICBmdW5jdGlvbiBtZXJnZSQyKG9iaikge1xuICAgIHZhciBpID0gMSxcbiAgICAgICAgdGFyZ2V0LFxuICAgICAgICBrZXk7XG5cbiAgICBmb3IgKDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdGFyZ2V0ID0gYXJndW1lbnRzW2ldO1xuXG4gICAgICBmb3IgKGtleSBpbiB0YXJnZXQpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIGtleSkpIHtcbiAgICAgICAgICBvYmpba2V5XSA9IHRhcmdldFtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNwbGl0Q2VsbHMkMSh0YWJsZVJvdywgY291bnQpIHtcbiAgICAvLyBlbnN1cmUgdGhhdCBldmVyeSBjZWxsLWRlbGltaXRpbmcgcGlwZSBoYXMgYSBzcGFjZVxuICAgIC8vIGJlZm9yZSBpdCB0byBkaXN0aW5ndWlzaCBpdCBmcm9tIGFuIGVzY2FwZWQgcGlwZVxuICAgIHZhciByb3cgPSB0YWJsZVJvdy5yZXBsYWNlKC9cXHwvZywgZnVuY3Rpb24gKG1hdGNoLCBvZmZzZXQsIHN0cikge1xuICAgICAgdmFyIGVzY2FwZWQgPSBmYWxzZSxcbiAgICAgICAgICBjdXJyID0gb2Zmc2V0O1xuXG4gICAgICB3aGlsZSAoLS1jdXJyID49IDAgJiYgc3RyW2N1cnJdID09PSAnXFxcXCcpIHtcbiAgICAgICAgZXNjYXBlZCA9ICFlc2NhcGVkO1xuICAgICAgfVxuXG4gICAgICBpZiAoZXNjYXBlZCkge1xuICAgICAgICAvLyBvZGQgbnVtYmVyIG9mIHNsYXNoZXMgbWVhbnMgfCBpcyBlc2NhcGVkXG4gICAgICAgIC8vIHNvIHdlIGxlYXZlIGl0IGFsb25lXG4gICAgICAgIHJldHVybiAnfCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBhZGQgc3BhY2UgYmVmb3JlIHVuZXNjYXBlZCB8XG4gICAgICAgIHJldHVybiAnIHwnO1xuICAgICAgfVxuICAgIH0pLFxuICAgICAgICBjZWxscyA9IHJvdy5zcGxpdCgvIFxcfC8pO1xuICAgIHZhciBpID0gMDsgLy8gRmlyc3QvbGFzdCBjZWxsIGluIGEgcm93IGNhbm5vdCBiZSBlbXB0eSBpZiBpdCBoYXMgbm8gbGVhZGluZy90cmFpbGluZyBwaXBlXG5cbiAgICBpZiAoIWNlbGxzWzBdLnRyaW0oKSkge1xuICAgICAgY2VsbHMuc2hpZnQoKTtcbiAgICB9XG5cbiAgICBpZiAoIWNlbGxzW2NlbGxzLmxlbmd0aCAtIDFdLnRyaW0oKSkge1xuICAgICAgY2VsbHMucG9wKCk7XG4gICAgfVxuXG4gICAgaWYgKGNlbGxzLmxlbmd0aCA+IGNvdW50KSB7XG4gICAgICBjZWxscy5zcGxpY2UoY291bnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAoY2VsbHMubGVuZ3RoIDwgY291bnQpIHtcbiAgICAgICAgY2VsbHMucHVzaCgnJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yICg7IGkgPCBjZWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gbGVhZGluZyBvciB0cmFpbGluZyB3aGl0ZXNwYWNlIGlzIGlnbm9yZWQgcGVyIHRoZSBnZm0gc3BlY1xuICAgICAgY2VsbHNbaV0gPSBjZWxsc1tpXS50cmltKCkucmVwbGFjZSgvXFxcXFxcfC9nLCAnfCcpO1xuICAgIH1cblxuICAgIHJldHVybiBjZWxscztcbiAgfSAvLyBSZW1vdmUgdHJhaWxpbmcgJ2Mncy4gRXF1aXZhbGVudCB0byBzdHIucmVwbGFjZSgvYyokLywgJycpLlxuICAvLyAvYyokLyBpcyB2dWxuZXJhYmxlIHRvIFJFRE9TLlxuICAvLyBpbnZlcnQ6IFJlbW92ZSBzdWZmaXggb2Ygbm9uLWMgY2hhcnMgaW5zdGVhZC4gRGVmYXVsdCBmYWxzZXkuXG5cblxuICBmdW5jdGlvbiBydHJpbSQxKHN0ciwgYywgaW52ZXJ0KSB7XG4gICAgdmFyIGwgPSBzdHIubGVuZ3RoO1xuXG4gICAgaWYgKGwgPT09IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9IC8vIExlbmd0aCBvZiBzdWZmaXggbWF0Y2hpbmcgdGhlIGludmVydCBjb25kaXRpb24uXG5cblxuICAgIHZhciBzdWZmTGVuID0gMDsgLy8gU3RlcCBsZWZ0IHVudGlsIHdlIGZhaWwgdG8gbWF0Y2ggdGhlIGludmVydCBjb25kaXRpb24uXG5cbiAgICB3aGlsZSAoc3VmZkxlbiA8IGwpIHtcbiAgICAgIHZhciBjdXJyQ2hhciA9IHN0ci5jaGFyQXQobCAtIHN1ZmZMZW4gLSAxKTtcblxuICAgICAgaWYgKGN1cnJDaGFyID09PSBjICYmICFpbnZlcnQpIHtcbiAgICAgICAgc3VmZkxlbisrO1xuICAgICAgfSBlbHNlIGlmIChjdXJyQ2hhciAhPT0gYyAmJiBpbnZlcnQpIHtcbiAgICAgICAgc3VmZkxlbisrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0ci5zdWJzdHIoMCwgbCAtIHN1ZmZMZW4pO1xuICB9XG5cbiAgZnVuY3Rpb24gZmluZENsb3NpbmdCcmFja2V0JDEoc3RyLCBiKSB7XG4gICAgaWYgKHN0ci5pbmRleE9mKGJbMV0pID09PSAtMSkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHZhciBsID0gc3RyLmxlbmd0aDtcbiAgICB2YXIgbGV2ZWwgPSAwLFxuICAgICAgICBpID0gMDtcblxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoc3RyW2ldID09PSAnXFxcXCcpIHtcbiAgICAgICAgaSsrO1xuICAgICAgfSBlbHNlIGlmIChzdHJbaV0gPT09IGJbMF0pIHtcbiAgICAgICAgbGV2ZWwrKztcbiAgICAgIH0gZWxzZSBpZiAoc3RyW2ldID09PSBiWzFdKSB7XG4gICAgICAgIGxldmVsLS07XG5cbiAgICAgICAgaWYgKGxldmVsIDwgMCkge1xuICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tTYW5pdGl6ZURlcHJlY2F0aW9uJDEob3B0KSB7XG4gICAgaWYgKG9wdCAmJiBvcHQuc2FuaXRpemUgJiYgIW9wdC5zaWxlbnQpIHtcbiAgICAgIGNvbnNvbGUud2FybignbWFya2VkKCk6IHNhbml0aXplIGFuZCBzYW5pdGl6ZXIgcGFyYW1ldGVycyBhcmUgZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDAuNy4wLCBzaG91bGQgbm90IGJlIHVzZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiB0aGUgZnV0dXJlLiBSZWFkIG1vcmUgaGVyZTogaHR0cHM6Ly9tYXJrZWQuanMub3JnLyMvVVNJTkdfQURWQU5DRUQubWQjb3B0aW9ucycpO1xuICAgIH1cbiAgfSAvLyBjb3BpZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvNTQ1MDExMy84MDY3NzdcblxuXG4gIGZ1bmN0aW9uIHJlcGVhdFN0cmluZyQxKHBhdHRlcm4sIGNvdW50KSB7XG4gICAgaWYgKGNvdW50IDwgMSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSAnJztcblxuICAgIHdoaWxlIChjb3VudCA+IDEpIHtcbiAgICAgIGlmIChjb3VudCAmIDEpIHtcbiAgICAgICAgcmVzdWx0ICs9IHBhdHRlcm47XG4gICAgICB9XG5cbiAgICAgIGNvdW50ID4+PSAxO1xuICAgICAgcGF0dGVybiArPSBwYXR0ZXJuO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQgKyBwYXR0ZXJuO1xuICB9XG5cbiAgdmFyIGhlbHBlcnMgPSB7XG4gICAgZXNjYXBlOiBlc2NhcGUkMixcbiAgICB1bmVzY2FwZTogdW5lc2NhcGUkMSxcbiAgICBlZGl0OiBlZGl0JDEsXG4gICAgY2xlYW5Vcmw6IGNsZWFuVXJsJDEsXG4gICAgcmVzb2x2ZVVybDogcmVzb2x2ZVVybCxcbiAgICBub29wVGVzdDogbm9vcFRlc3QkMSxcbiAgICBtZXJnZTogbWVyZ2UkMixcbiAgICBzcGxpdENlbGxzOiBzcGxpdENlbGxzJDEsXG4gICAgcnRyaW06IHJ0cmltJDEsXG4gICAgZmluZENsb3NpbmdCcmFja2V0OiBmaW5kQ2xvc2luZ0JyYWNrZXQkMSxcbiAgICBjaGVja1Nhbml0aXplRGVwcmVjYXRpb246IGNoZWNrU2FuaXRpemVEZXByZWNhdGlvbiQxLFxuICAgIHJlcGVhdFN0cmluZzogcmVwZWF0U3RyaW5nJDFcbiAgfTtcblxuICB2YXIgZGVmYXVsdHMkNCA9IGRlZmF1bHRzJDUuZXhwb3J0cy5kZWZhdWx0cztcbiAgdmFyIHJ0cmltID0gaGVscGVycy5ydHJpbSxcbiAgICAgIHNwbGl0Q2VsbHMgPSBoZWxwZXJzLnNwbGl0Q2VsbHMsXG4gICAgICBfZXNjYXBlID0gaGVscGVycy5lc2NhcGUsXG4gICAgICBmaW5kQ2xvc2luZ0JyYWNrZXQgPSBoZWxwZXJzLmZpbmRDbG9zaW5nQnJhY2tldDtcblxuICBmdW5jdGlvbiBvdXRwdXRMaW5rKGNhcCwgbGluaywgcmF3LCBsZXhlcikge1xuICAgIHZhciBocmVmID0gbGluay5ocmVmO1xuICAgIHZhciB0aXRsZSA9IGxpbmsudGl0bGUgPyBfZXNjYXBlKGxpbmsudGl0bGUpIDogbnVsbDtcbiAgICB2YXIgdGV4dCA9IGNhcFsxXS5yZXBsYWNlKC9cXFxcKFtcXFtcXF1dKS9nLCAnJDEnKTtcblxuICAgIGlmIChjYXBbMF0uY2hhckF0KDApICE9PSAnIScpIHtcbiAgICAgIGxleGVyLnN0YXRlLmluTGluayA9IHRydWU7XG4gICAgICB2YXIgdG9rZW4gPSB7XG4gICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgcmF3OiByYXcsXG4gICAgICAgIGhyZWY6IGhyZWYsXG4gICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgdG9rZW5zOiBsZXhlci5pbmxpbmVUb2tlbnModGV4dCwgW10pXG4gICAgICB9O1xuICAgICAgbGV4ZXIuc3RhdGUuaW5MaW5rID0gZmFsc2U7XG4gICAgICByZXR1cm4gdG9rZW47XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHR5cGU6ICdpbWFnZScsXG4gICAgICAgIHJhdzogcmF3LFxuICAgICAgICBocmVmOiBocmVmLFxuICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgIHRleHQ6IF9lc2NhcGUodGV4dClcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaW5kZW50Q29kZUNvbXBlbnNhdGlvbihyYXcsIHRleHQpIHtcbiAgICB2YXIgbWF0Y2hJbmRlbnRUb0NvZGUgPSByYXcubWF0Y2goL14oXFxzKykoPzpgYGApLyk7XG5cbiAgICBpZiAobWF0Y2hJbmRlbnRUb0NvZGUgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH1cblxuICAgIHZhciBpbmRlbnRUb0NvZGUgPSBtYXRjaEluZGVudFRvQ29kZVsxXTtcbiAgICByZXR1cm4gdGV4dC5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICB2YXIgbWF0Y2hJbmRlbnRJbk5vZGUgPSBub2RlLm1hdGNoKC9eXFxzKy8pO1xuXG4gICAgICBpZiAobWF0Y2hJbmRlbnRJbk5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICB9XG5cbiAgICAgIHZhciBpbmRlbnRJbk5vZGUgPSBtYXRjaEluZGVudEluTm9kZVswXTtcblxuICAgICAgaWYgKGluZGVudEluTm9kZS5sZW5ndGggPj0gaW5kZW50VG9Db2RlLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gbm9kZS5zbGljZShpbmRlbnRUb0NvZGUubGVuZ3RoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfSkuam9pbignXFxuJyk7XG4gIH1cbiAgLyoqXG4gICAqIFRva2VuaXplclxuICAgKi9cblxuXG4gIHZhciBUb2tlbml6ZXJfMSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVG9rZW5pemVyKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgZGVmYXVsdHMkNDtcbiAgICB9XG5cbiAgICB2YXIgX3Byb3RvID0gVG9rZW5pemVyLnByb3RvdHlwZTtcblxuICAgIF9wcm90by5zcGFjZSA9IGZ1bmN0aW9uIHNwYWNlKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuYmxvY2submV3bGluZS5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgaWYgKGNhcFswXS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6ICdzcGFjZScsXG4gICAgICAgICAgICByYXc6IGNhcFswXVxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHJhdzogJ1xcbidcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmNvZGUgPSBmdW5jdGlvbiBjb2RlKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuYmxvY2suY29kZS5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIHRleHQgPSBjYXBbMF0ucmVwbGFjZSgvXiB7MSw0fS9nbSwgJycpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdjb2RlJyxcbiAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICBjb2RlQmxvY2tTdHlsZTogJ2luZGVudGVkJyxcbiAgICAgICAgICB0ZXh0OiAhdGhpcy5vcHRpb25zLnBlZGFudGljID8gcnRyaW0odGV4dCwgJ1xcbicpIDogdGV4dFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8uZmVuY2VzID0gZnVuY3Rpb24gZmVuY2VzKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuYmxvY2suZmVuY2VzLmV4ZWMoc3JjKTtcblxuICAgICAgaWYgKGNhcCkge1xuICAgICAgICB2YXIgcmF3ID0gY2FwWzBdO1xuICAgICAgICB2YXIgdGV4dCA9IGluZGVudENvZGVDb21wZW5zYXRpb24ocmF3LCBjYXBbM10gfHwgJycpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdjb2RlJyxcbiAgICAgICAgICByYXc6IHJhdyxcbiAgICAgICAgICBsYW5nOiBjYXBbMl0gPyBjYXBbMl0udHJpbSgpIDogY2FwWzJdLFxuICAgICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmhlYWRpbmcgPSBmdW5jdGlvbiBoZWFkaW5nKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuYmxvY2suaGVhZGluZy5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIHRleHQgPSBjYXBbMl0udHJpbSgpOyAvLyByZW1vdmUgdHJhaWxpbmcgI3NcblxuICAgICAgICBpZiAoLyMkLy50ZXN0KHRleHQpKSB7XG4gICAgICAgICAgdmFyIHRyaW1tZWQgPSBydHJpbSh0ZXh0LCAnIycpO1xuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgICAgICAgdGV4dCA9IHRyaW1tZWQudHJpbSgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIXRyaW1tZWQgfHwgLyAkLy50ZXN0KHRyaW1tZWQpKSB7XG4gICAgICAgICAgICAvLyBDb21tb25NYXJrIHJlcXVpcmVzIHNwYWNlIGJlZm9yZSB0cmFpbGluZyAjc1xuICAgICAgICAgICAgdGV4dCA9IHRyaW1tZWQudHJpbSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0b2tlbiA9IHtcbiAgICAgICAgICB0eXBlOiAnaGVhZGluZycsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgZGVwdGg6IGNhcFsxXS5sZW5ndGgsXG4gICAgICAgICAgdGV4dDogdGV4dCxcbiAgICAgICAgICB0b2tlbnM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubGV4ZXIuaW5saW5lKHRva2VuLnRleHQsIHRva2VuLnRva2Vucyk7XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmhyID0gZnVuY3Rpb24gaHIoc3JjKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5oci5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAnaHInLFxuICAgICAgICAgIHJhdzogY2FwWzBdXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5ibG9ja3F1b3RlID0gZnVuY3Rpb24gYmxvY2txdW90ZShzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmJsb2NrcXVvdGUuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHZhciB0ZXh0ID0gY2FwWzBdLnJlcGxhY2UoL14gKj4gPy9nbSwgJycpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdibG9ja3F1b3RlJyxcbiAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICB0b2tlbnM6IHRoaXMubGV4ZXIuYmxvY2tUb2tlbnModGV4dCwgW10pLFxuICAgICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmxpc3QgPSBmdW5jdGlvbiBsaXN0KHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuYmxvY2subGlzdC5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIHJhdywgaXN0YXNrLCBpc2NoZWNrZWQsIGluZGVudCwgaSwgYmxhbmtMaW5lLCBlbmRzV2l0aEJsYW5rTGluZSwgbGluZSwgbGluZXMsIGl0ZW1Db250ZW50cztcbiAgICAgICAgdmFyIGJ1bGwgPSBjYXBbMV0udHJpbSgpO1xuICAgICAgICB2YXIgaXNvcmRlcmVkID0gYnVsbC5sZW5ndGggPiAxO1xuICAgICAgICB2YXIgbGlzdCA9IHtcbiAgICAgICAgICB0eXBlOiAnbGlzdCcsXG4gICAgICAgICAgcmF3OiAnJyxcbiAgICAgICAgICBvcmRlcmVkOiBpc29yZGVyZWQsXG4gICAgICAgICAgc3RhcnQ6IGlzb3JkZXJlZCA/ICtidWxsLnNsaWNlKDAsIC0xKSA6ICcnLFxuICAgICAgICAgIGxvb3NlOiBmYWxzZSxcbiAgICAgICAgICBpdGVtczogW11cbiAgICAgICAgfTtcbiAgICAgICAgYnVsbCA9IGlzb3JkZXJlZCA/IFwiXFxcXGR7MSw5fVxcXFxcIiArIGJ1bGwuc2xpY2UoLTEpIDogXCJcXFxcXCIgKyBidWxsO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICAgICAgICBidWxsID0gaXNvcmRlcmVkID8gYnVsbCA6ICdbKistXSc7XG4gICAgICAgIH0gLy8gR2V0IG5leHQgbGlzdCBpdGVtXG5cblxuICAgICAgICB2YXIgaXRlbVJlZ2V4ID0gbmV3IFJlZ0V4cChcIl4oIHswLDN9XCIgKyBidWxsICsgXCIpKCg/OiBbXlxcXFxuXSp8ICopKD86XFxcXG5bXlxcXFxuXSopKig/OlxcXFxufCQpKVwiKTsgLy8gR2V0IGVhY2ggdG9wLWxldmVsIGl0ZW1cblxuICAgICAgICB3aGlsZSAoc3JjKSB7XG4gICAgICAgICAgaWYgKHRoaXMucnVsZXMuYmxvY2suaHIudGVzdChzcmMpKSB7XG4gICAgICAgICAgICAvLyBFbmQgbGlzdCBpZiB3ZSBlbmNvdW50ZXIgYW4gSFIgKHBvc3NpYmx5IG1vdmUgaW50byBpdGVtUmVnZXg/KVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCEoY2FwID0gaXRlbVJlZ2V4LmV4ZWMoc3JjKSkpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGxpbmVzID0gY2FwWzJdLnNwbGl0KCdcXG4nKTtcblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICAgICAgICAgIGluZGVudCA9IDI7XG4gICAgICAgICAgICBpdGVtQ29udGVudHMgPSBsaW5lc1swXS50cmltTGVmdCgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbmRlbnQgPSBjYXBbMl0uc2VhcmNoKC9bXiBdLyk7IC8vIEZpbmQgZmlyc3Qgbm9uLXNwYWNlIGNoYXJcblxuICAgICAgICAgICAgaW5kZW50ID0gY2FwWzFdLmxlbmd0aCArIChpbmRlbnQgPiA0ID8gMSA6IGluZGVudCk7IC8vIGludGVudGVkIGNvZGUgYmxvY2tzIGFmdGVyIDQgc3BhY2VzOyBpbmRlbnQgaXMgYWx3YXlzIDFcblxuICAgICAgICAgICAgaXRlbUNvbnRlbnRzID0gbGluZXNbMF0uc2xpY2UoaW5kZW50IC0gY2FwWzFdLmxlbmd0aCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYmxhbmtMaW5lID0gZmFsc2U7XG4gICAgICAgICAgcmF3ID0gY2FwWzBdO1xuXG4gICAgICAgICAgaWYgKCFsaW5lc1swXSAmJiAvXiAqJC8udGVzdChsaW5lc1sxXSkpIHtcbiAgICAgICAgICAgIC8vIGl0ZW1zIGJlZ2luIHdpdGggYXQgbW9zdCBvbmUgYmxhbmsgbGluZVxuICAgICAgICAgICAgcmF3ID0gY2FwWzFdICsgbGluZXMuc2xpY2UoMCwgMikuam9pbignXFxuJykgKyAnXFxuJztcbiAgICAgICAgICAgIGxpc3QubG9vc2UgPSB0cnVlO1xuICAgICAgICAgICAgbGluZXMgPSBbXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB2YXIgbmV4dEJ1bGxldFJlZ2V4ID0gbmV3IFJlZ0V4cChcIl4gezAsXCIgKyBNYXRoLm1pbigzLCBpbmRlbnQgLSAxKSArIFwifSg/OlsqKy1dfFxcXFxkezEsOX1bLildKVwiKTtcblxuICAgICAgICAgIGZvciAoaSA9IDE7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGluZSA9IGxpbmVzW2ldO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICAgICAgICAgIC8vIFJlLWFsaWduIHRvIGZvbGxvdyBjb21tb25tYXJrIG5lc3RpbmcgcnVsZXNcbiAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvXiB7MSw0fSg/PSggezR9KSpbXiBdKS9nLCAnICAnKTtcbiAgICAgICAgICAgIH0gLy8gRW5kIGxpc3QgaXRlbSBpZiBmb3VuZCBzdGFydCBvZiBuZXcgYnVsbGV0XG5cblxuICAgICAgICAgICAgaWYgKG5leHRCdWxsZXRSZWdleC50ZXN0KGxpbmUpKSB7XG4gICAgICAgICAgICAgIHJhdyA9IGNhcFsxXSArIGxpbmVzLnNsaWNlKDAsIGkpLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSAvLyBVbnRpbCB3ZSBlbmNvdW50ZXIgYSBibGFuayBsaW5lLCBpdGVtIGNvbnRlbnRzIGRvIG5vdCBuZWVkIGluZGVudGF0aW9uXG5cblxuICAgICAgICAgICAgaWYgKCFibGFua0xpbmUpIHtcbiAgICAgICAgICAgICAgaWYgKCFsaW5lLnRyaW0oKSkge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGN1cnJlbnQgbGluZSBpcyBlbXB0eVxuICAgICAgICAgICAgICAgIGJsYW5rTGluZSA9IHRydWU7XG4gICAgICAgICAgICAgIH0gLy8gRGVkZW50IGlmIHBvc3NpYmxlXG5cblxuICAgICAgICAgICAgICBpZiAobGluZS5zZWFyY2goL1teIF0vKSA+PSBpbmRlbnQpIHtcbiAgICAgICAgICAgICAgICBpdGVtQ29udGVudHMgKz0gJ1xcbicgKyBsaW5lLnNsaWNlKGluZGVudCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaXRlbUNvbnRlbnRzICs9ICdcXG4nICsgbGluZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSAvLyBEZWRlbnQgdGhpcyBsaW5lXG5cblxuICAgICAgICAgICAgaWYgKGxpbmUuc2VhcmNoKC9bXiBdLykgPj0gaW5kZW50IHx8ICFsaW5lLnRyaW0oKSkge1xuICAgICAgICAgICAgICBpdGVtQ29udGVudHMgKz0gJ1xcbicgKyBsaW5lLnNsaWNlKGluZGVudCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgLy8gTGluZSB3YXMgbm90IHByb3Blcmx5IGluZGVudGVkOyBlbmQgb2YgdGhpcyBpdGVtXG4gICAgICAgICAgICAgIHJhdyA9IGNhcFsxXSArIGxpbmVzLnNsaWNlKDAsIGkpLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghbGlzdC5sb29zZSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIHByZXZpb3VzIGl0ZW0gZW5kZWQgd2l0aCBhIGJsYW5rIGxpbmUsIHRoZSBsaXN0IGlzIGxvb3NlXG4gICAgICAgICAgICBpZiAoZW5kc1dpdGhCbGFua0xpbmUpIHtcbiAgICAgICAgICAgICAgbGlzdC5sb29zZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKC9cXG4gKlxcbiAqJC8udGVzdChyYXcpKSB7XG4gICAgICAgICAgICAgIGVuZHNXaXRoQmxhbmtMaW5lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IC8vIENoZWNrIGZvciB0YXNrIGxpc3QgaXRlbXNcblxuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5nZm0pIHtcbiAgICAgICAgICAgIGlzdGFzayA9IC9eXFxbWyB4WF1cXF0gLy5leGVjKGl0ZW1Db250ZW50cyk7XG5cbiAgICAgICAgICAgIGlmIChpc3Rhc2spIHtcbiAgICAgICAgICAgICAgaXNjaGVja2VkID0gaXN0YXNrWzBdICE9PSAnWyBdICc7XG4gICAgICAgICAgICAgIGl0ZW1Db250ZW50cyA9IGl0ZW1Db250ZW50cy5yZXBsYWNlKC9eXFxbWyB4WF1cXF0gKy8sICcnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaXN0Lml0ZW1zLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ2xpc3RfaXRlbScsXG4gICAgICAgICAgICByYXc6IHJhdyxcbiAgICAgICAgICAgIHRhc2s6ICEhaXN0YXNrLFxuICAgICAgICAgICAgY2hlY2tlZDogaXNjaGVja2VkLFxuICAgICAgICAgICAgbG9vc2U6IGZhbHNlLFxuICAgICAgICAgICAgdGV4dDogaXRlbUNvbnRlbnRzXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbGlzdC5yYXcgKz0gcmF3O1xuICAgICAgICAgIHNyYyA9IHNyYy5zbGljZShyYXcubGVuZ3RoKTtcbiAgICAgICAgfSAvLyBEbyBub3QgY29uc3VtZSBuZXdsaW5lcyBhdCBlbmQgb2YgZmluYWwgaXRlbS4gQWx0ZXJuYXRpdmVseSwgbWFrZSBpdGVtUmVnZXggKnN0YXJ0KiB3aXRoIGFueSBuZXdsaW5lcyB0byBzaW1wbGlmeS9zcGVlZCB1cCBlbmRzV2l0aEJsYW5rTGluZSBsb2dpY1xuXG5cbiAgICAgICAgbGlzdC5pdGVtc1tsaXN0Lml0ZW1zLmxlbmd0aCAtIDFdLnJhdyA9IHJhdy50cmltUmlnaHQoKTtcbiAgICAgICAgbGlzdC5pdGVtc1tsaXN0Lml0ZW1zLmxlbmd0aCAtIDFdLnRleHQgPSBpdGVtQ29udGVudHMudHJpbVJpZ2h0KCk7XG4gICAgICAgIGxpc3QucmF3ID0gbGlzdC5yYXcudHJpbVJpZ2h0KCk7XG4gICAgICAgIHZhciBsID0gbGlzdC5pdGVtcy5sZW5ndGg7IC8vIEl0ZW0gY2hpbGQgdG9rZW5zIGhhbmRsZWQgaGVyZSBhdCBlbmQgYmVjYXVzZSB3ZSBuZWVkZWQgdG8gaGF2ZSB0aGUgZmluYWwgaXRlbSB0byB0cmltIGl0IGZpcnN0XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIHRoaXMubGV4ZXIuc3RhdGUudG9wID0gZmFsc2U7XG4gICAgICAgICAgbGlzdC5pdGVtc1tpXS50b2tlbnMgPSB0aGlzLmxleGVyLmJsb2NrVG9rZW5zKGxpc3QuaXRlbXNbaV0udGV4dCwgW10pO1xuXG4gICAgICAgICAgaWYgKGxpc3QuaXRlbXNbaV0udG9rZW5zLnNvbWUoZnVuY3Rpb24gKHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0LnR5cGUgPT09ICdzcGFjZSc7XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIGxpc3QubG9vc2UgPSB0cnVlO1xuICAgICAgICAgICAgbGlzdC5pdGVtc1tpXS5sb29zZSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5odG1sID0gZnVuY3Rpb24gaHRtbChzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmh0bWwuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHZhciB0b2tlbiA9IHtcbiAgICAgICAgICB0eXBlOiAnaHRtbCcsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgcHJlOiAhdGhpcy5vcHRpb25zLnNhbml0aXplciAmJiAoY2FwWzFdID09PSAncHJlJyB8fCBjYXBbMV0gPT09ICdzY3JpcHQnIHx8IGNhcFsxXSA9PT0gJ3N0eWxlJyksXG4gICAgICAgICAgdGV4dDogY2FwWzBdXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSkge1xuICAgICAgICAgIHRva2VuLnR5cGUgPSAncGFyYWdyYXBoJztcbiAgICAgICAgICB0b2tlbi50ZXh0ID0gdGhpcy5vcHRpb25zLnNhbml0aXplciA/IHRoaXMub3B0aW9ucy5zYW5pdGl6ZXIoY2FwWzBdKSA6IF9lc2NhcGUoY2FwWzBdKTtcbiAgICAgICAgICB0b2tlbi50b2tlbnMgPSBbXTtcbiAgICAgICAgICB0aGlzLmxleGVyLmlubGluZSh0b2tlbi50ZXh0LCB0b2tlbi50b2tlbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8uZGVmID0gZnVuY3Rpb24gZGVmKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuYmxvY2suZGVmLmV4ZWMoc3JjKTtcblxuICAgICAgaWYgKGNhcCkge1xuICAgICAgICBpZiAoY2FwWzNdKSBjYXBbM10gPSBjYXBbM10uc3Vic3RyaW5nKDEsIGNhcFszXS5sZW5ndGggLSAxKTtcbiAgICAgICAgdmFyIHRhZyA9IGNhcFsxXS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZywgJyAnKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAnZGVmJyxcbiAgICAgICAgICB0YWc6IHRhZyxcbiAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICBocmVmOiBjYXBbMl0sXG4gICAgICAgICAgdGl0bGU6IGNhcFszXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8udGFibGUgPSBmdW5jdGlvbiB0YWJsZShzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLnRhYmxlLmV4ZWMoc3JjKTtcblxuICAgICAgaWYgKGNhcCkge1xuICAgICAgICB2YXIgaXRlbSA9IHtcbiAgICAgICAgICB0eXBlOiAndGFibGUnLFxuICAgICAgICAgIGhlYWRlcjogc3BsaXRDZWxscyhjYXBbMV0pLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdGV4dDogY1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBhbGlnbjogY2FwWzJdLnJlcGxhY2UoL14gKnxcXHwgKiQvZywgJycpLnNwbGl0KC8gKlxcfCAqLyksXG4gICAgICAgICAgcm93czogY2FwWzNdID8gY2FwWzNdLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpIDogW11cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoaXRlbS5oZWFkZXIubGVuZ3RoID09PSBpdGVtLmFsaWduLmxlbmd0aCkge1xuICAgICAgICAgIGl0ZW0ucmF3ID0gY2FwWzBdO1xuICAgICAgICAgIHZhciBsID0gaXRlbS5hbGlnbi5sZW5ndGg7XG4gICAgICAgICAgdmFyIGksIGosIGssIHJvdztcblxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGlmICgvXiAqLSs6ICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAncmlnaHQnO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ2NlbnRlcic7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKC9eICo6LSsgKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdsZWZ0JztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGwgPSBpdGVtLnJvd3MubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgICAgaXRlbS5yb3dzW2ldID0gc3BsaXRDZWxscyhpdGVtLnJvd3NbaV0sIGl0ZW0uaGVhZGVyLmxlbmd0aCkubWFwKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdGV4dDogY1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSAvLyBwYXJzZSBjaGlsZCB0b2tlbnMgaW5zaWRlIGhlYWRlcnMgYW5kIGNlbGxzXG4gICAgICAgICAgLy8gaGVhZGVyIGNoaWxkIHRva2Vuc1xuXG5cbiAgICAgICAgICBsID0gaXRlbS5oZWFkZXIubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgaXRlbS5oZWFkZXJbal0udG9rZW5zID0gW107XG4gICAgICAgICAgICB0aGlzLmxleGVyLmlubGluZVRva2VucyhpdGVtLmhlYWRlcltqXS50ZXh0LCBpdGVtLmhlYWRlcltqXS50b2tlbnMpO1xuICAgICAgICAgIH0gLy8gY2VsbCBjaGlsZCB0b2tlbnNcblxuXG4gICAgICAgICAgbCA9IGl0ZW0ucm93cy5sZW5ndGg7XG5cbiAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbDsgaisrKSB7XG4gICAgICAgICAgICByb3cgPSBpdGVtLnJvd3Nbal07XG5cbiAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCByb3cubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgcm93W2tdLnRva2VucyA9IFtdO1xuICAgICAgICAgICAgICB0aGlzLmxleGVyLmlubGluZVRva2Vucyhyb3dba10udGV4dCwgcm93W2tdLnRva2Vucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmxoZWFkaW5nID0gZnVuY3Rpb24gbGhlYWRpbmcoc3JjKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5saGVhZGluZy5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIHRva2VuID0ge1xuICAgICAgICAgIHR5cGU6ICdoZWFkaW5nJyxcbiAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICBkZXB0aDogY2FwWzJdLmNoYXJBdCgwKSA9PT0gJz0nID8gMSA6IDIsXG4gICAgICAgICAgdGV4dDogY2FwWzFdLFxuICAgICAgICAgIHRva2VuczogW11cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5sZXhlci5pbmxpbmUodG9rZW4udGV4dCwgdG9rZW4udG9rZW5zKTtcbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8ucGFyYWdyYXBoID0gZnVuY3Rpb24gcGFyYWdyYXBoKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuYmxvY2sucGFyYWdyYXBoLmV4ZWMoc3JjKTtcblxuICAgICAgaWYgKGNhcCkge1xuICAgICAgICB2YXIgdG9rZW4gPSB7XG4gICAgICAgICAgdHlwZTogJ3BhcmFncmFwaCcsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgdGV4dDogY2FwWzFdLmNoYXJBdChjYXBbMV0ubGVuZ3RoIC0gMSkgPT09ICdcXG4nID8gY2FwWzFdLnNsaWNlKDAsIC0xKSA6IGNhcFsxXSxcbiAgICAgICAgICB0b2tlbnM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubGV4ZXIuaW5saW5lKHRva2VuLnRleHQsIHRva2VuLnRva2Vucyk7XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLnRleHQgPSBmdW5jdGlvbiB0ZXh0KHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuYmxvY2sudGV4dC5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIHRva2VuID0ge1xuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICB0ZXh0OiBjYXBbMF0sXG4gICAgICAgICAgdG9rZW5zOiBbXVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxleGVyLmlubGluZSh0b2tlbi50ZXh0LCB0b2tlbi50b2tlbnMpO1xuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5lc2NhcGUgPSBmdW5jdGlvbiBlc2NhcGUoc3JjKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUuZXNjYXBlLmV4ZWMoc3JjKTtcblxuICAgICAgaWYgKGNhcCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdlc2NhcGUnLFxuICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgIHRleHQ6IF9lc2NhcGUoY2FwWzFdKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8udGFnID0gZnVuY3Rpb24gdGFnKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLnRhZy5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgaWYgKCF0aGlzLmxleGVyLnN0YXRlLmluTGluayAmJiAvXjxhIC9pLnRlc3QoY2FwWzBdKSkge1xuICAgICAgICAgIHRoaXMubGV4ZXIuc3RhdGUuaW5MaW5rID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxleGVyLnN0YXRlLmluTGluayAmJiAvXjxcXC9hPi9pLnRlc3QoY2FwWzBdKSkge1xuICAgICAgICAgIHRoaXMubGV4ZXIuc3RhdGUuaW5MaW5rID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMubGV4ZXIuc3RhdGUuaW5SYXdCbG9jayAmJiAvXjwocHJlfGNvZGV8a2JkfHNjcmlwdCkoXFxzfD4pL2kudGVzdChjYXBbMF0pKSB7XG4gICAgICAgICAgdGhpcy5sZXhlci5zdGF0ZS5pblJhd0Jsb2NrID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmxleGVyLnN0YXRlLmluUmF3QmxvY2sgJiYgL148XFwvKHByZXxjb2RlfGtiZHxzY3JpcHQpKFxcc3w+KS9pLnRlc3QoY2FwWzBdKSkge1xuICAgICAgICAgIHRoaXMubGV4ZXIuc3RhdGUuaW5SYXdCbG9jayA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiB0aGlzLm9wdGlvbnMuc2FuaXRpemUgPyAndGV4dCcgOiAnaHRtbCcsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgaW5MaW5rOiB0aGlzLmxleGVyLnN0YXRlLmluTGluayxcbiAgICAgICAgICBpblJhd0Jsb2NrOiB0aGlzLmxleGVyLnN0YXRlLmluUmF3QmxvY2ssXG4gICAgICAgICAgdGV4dDogdGhpcy5vcHRpb25zLnNhbml0aXplID8gdGhpcy5vcHRpb25zLnNhbml0aXplciA/IHRoaXMub3B0aW9ucy5zYW5pdGl6ZXIoY2FwWzBdKSA6IF9lc2NhcGUoY2FwWzBdKSA6IGNhcFswXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8ubGluayA9IGZ1bmN0aW9uIGxpbmsoc3JjKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUubGluay5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIHRyaW1tZWRVcmwgPSBjYXBbMl0udHJpbSgpO1xuXG4gICAgICAgIGlmICghdGhpcy5vcHRpb25zLnBlZGFudGljICYmIC9ePC8udGVzdCh0cmltbWVkVXJsKSkge1xuICAgICAgICAgIC8vIGNvbW1vbm1hcmsgcmVxdWlyZXMgbWF0Y2hpbmcgYW5nbGUgYnJhY2tldHNcbiAgICAgICAgICBpZiAoIS8+JC8udGVzdCh0cmltbWVkVXJsKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gLy8gZW5kaW5nIGFuZ2xlIGJyYWNrZXQgY2Fubm90IGJlIGVzY2FwZWRcblxuXG4gICAgICAgICAgdmFyIHJ0cmltU2xhc2ggPSBydHJpbSh0cmltbWVkVXJsLnNsaWNlKDAsIC0xKSwgJ1xcXFwnKTtcblxuICAgICAgICAgIGlmICgodHJpbW1lZFVybC5sZW5ndGggLSBydHJpbVNsYXNoLmxlbmd0aCkgJSAyID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGZpbmQgY2xvc2luZyBwYXJlbnRoZXNpc1xuICAgICAgICAgIHZhciBsYXN0UGFyZW5JbmRleCA9IGZpbmRDbG9zaW5nQnJhY2tldChjYXBbMl0sICcoKScpO1xuXG4gICAgICAgICAgaWYgKGxhc3RQYXJlbkluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IGNhcFswXS5pbmRleE9mKCchJykgPT09IDAgPyA1IDogNDtcbiAgICAgICAgICAgIHZhciBsaW5rTGVuID0gc3RhcnQgKyBjYXBbMV0ubGVuZ3RoICsgbGFzdFBhcmVuSW5kZXg7XG4gICAgICAgICAgICBjYXBbMl0gPSBjYXBbMl0uc3Vic3RyaW5nKDAsIGxhc3RQYXJlbkluZGV4KTtcbiAgICAgICAgICAgIGNhcFswXSA9IGNhcFswXS5zdWJzdHJpbmcoMCwgbGlua0xlbikudHJpbSgpO1xuICAgICAgICAgICAgY2FwWzNdID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhyZWYgPSBjYXBbMl07XG4gICAgICAgIHZhciB0aXRsZSA9ICcnO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICAgICAgICAvLyBzcGxpdCBwZWRhbnRpYyBocmVmIGFuZCB0aXRsZVxuICAgICAgICAgIHZhciBsaW5rID0gL14oW14nXCJdKlteXFxzXSlcXHMrKFsnXCJdKSguKilcXDIvLmV4ZWMoaHJlZik7XG5cbiAgICAgICAgICBpZiAobGluaykge1xuICAgICAgICAgICAgaHJlZiA9IGxpbmtbMV07XG4gICAgICAgICAgICB0aXRsZSA9IGxpbmtbM107XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRpdGxlID0gY2FwWzNdID8gY2FwWzNdLnNsaWNlKDEsIC0xKSA6ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgaHJlZiA9IGhyZWYudHJpbSgpO1xuXG4gICAgICAgIGlmICgvXjwvLnRlc3QoaHJlZikpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljICYmICEvPiQvLnRlc3QodHJpbW1lZFVybCkpIHtcbiAgICAgICAgICAgIC8vIHBlZGFudGljIGFsbG93cyBzdGFydGluZyBhbmdsZSBicmFja2V0IHdpdGhvdXQgZW5kaW5nIGFuZ2xlIGJyYWNrZXRcbiAgICAgICAgICAgIGhyZWYgPSBocmVmLnNsaWNlKDEpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBocmVmID0gaHJlZi5zbGljZSgxLCAtMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dHB1dExpbmsoY2FwLCB7XG4gICAgICAgICAgaHJlZjogaHJlZiA/IGhyZWYucmVwbGFjZSh0aGlzLnJ1bGVzLmlubGluZS5fZXNjYXBlcywgJyQxJykgOiBocmVmLFxuICAgICAgICAgIHRpdGxlOiB0aXRsZSA/IHRpdGxlLnJlcGxhY2UodGhpcy5ydWxlcy5pbmxpbmUuX2VzY2FwZXMsICckMScpIDogdGl0bGVcbiAgICAgICAgfSwgY2FwWzBdLCB0aGlzLmxleGVyKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLnJlZmxpbmsgPSBmdW5jdGlvbiByZWZsaW5rKHNyYywgbGlua3MpIHtcbiAgICAgIHZhciBjYXA7XG5cbiAgICAgIGlmICgoY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUucmVmbGluay5leGVjKHNyYykpIHx8IChjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS5ub2xpbmsuZXhlYyhzcmMpKSkge1xuICAgICAgICB2YXIgbGluayA9IChjYXBbMl0gfHwgY2FwWzFdKS5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gICAgICAgIGxpbmsgPSBsaW5rc1tsaW5rLnRvTG93ZXJDYXNlKCldO1xuXG4gICAgICAgIGlmICghbGluayB8fCAhbGluay5ocmVmKSB7XG4gICAgICAgICAgdmFyIHRleHQgPSBjYXBbMF0uY2hhckF0KDApO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICByYXc6IHRleHQsXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXRMaW5rKGNhcCwgbGluaywgY2FwWzBdLCB0aGlzLmxleGVyKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmVtU3Ryb25nID0gZnVuY3Rpb24gZW1TdHJvbmcoc3JjLCBtYXNrZWRTcmMsIHByZXZDaGFyKSB7XG4gICAgICBpZiAocHJldkNoYXIgPT09IHZvaWQgMCkge1xuICAgICAgICBwcmV2Q2hhciA9ICcnO1xuICAgICAgfVxuXG4gICAgICB2YXIgbWF0Y2ggPSB0aGlzLnJ1bGVzLmlubGluZS5lbVN0cm9uZy5sRGVsaW0uZXhlYyhzcmMpO1xuICAgICAgaWYgKCFtYXRjaCkgcmV0dXJuOyAvLyBfIGNhbid0IGJlIGJldHdlZW4gdHdvIGFscGhhbnVtZXJpY3MuIFxccHtMfVxccHtOfSBpbmNsdWRlcyBub24tZW5nbGlzaCBhbHBoYWJldC9udW1iZXJzIGFzIHdlbGxcblxuICAgICAgaWYgKG1hdGNoWzNdICYmIHByZXZDaGFyLm1hdGNoKC8oPzpbMC05QS1aYS16XFx4QUFcXHhCMlxceEIzXFx4QjVcXHhCOVxceEJBXFx4QkMtXFx4QkVcXHhDMC1cXHhENlxceEQ4LVxceEY2XFx4RjgtXFx1MDJDMVxcdTAyQzYtXFx1MDJEMVxcdTAyRTAtXFx1MDJFNFxcdTAyRUNcXHUwMkVFXFx1MDM3MC1cXHUwMzc0XFx1MDM3NlxcdTAzNzdcXHUwMzdBLVxcdTAzN0RcXHUwMzdGXFx1MDM4NlxcdTAzODgtXFx1MDM4QVxcdTAzOENcXHUwMzhFLVxcdTAzQTFcXHUwM0EzLVxcdTAzRjVcXHUwM0Y3LVxcdTA0ODFcXHUwNDhBLVxcdTA1MkZcXHUwNTMxLVxcdTA1NTZcXHUwNTU5XFx1MDU2MC1cXHUwNTg4XFx1MDVEMC1cXHUwNUVBXFx1MDVFRi1cXHUwNUYyXFx1MDYyMC1cXHUwNjRBXFx1MDY2MC1cXHUwNjY5XFx1MDY2RVxcdTA2NkZcXHUwNjcxLVxcdTA2RDNcXHUwNkQ1XFx1MDZFNVxcdTA2RTZcXHUwNkVFLVxcdTA2RkNcXHUwNkZGXFx1MDcxMFxcdTA3MTItXFx1MDcyRlxcdTA3NEQtXFx1MDdBNVxcdTA3QjFcXHUwN0MwLVxcdTA3RUFcXHUwN0Y0XFx1MDdGNVxcdTA3RkFcXHUwODAwLVxcdTA4MTVcXHUwODFBXFx1MDgyNFxcdTA4MjhcXHUwODQwLVxcdTA4NThcXHUwODYwLVxcdTA4NkFcXHUwOEEwLVxcdTA4QjRcXHUwOEI2LVxcdTA4QzdcXHUwOTA0LVxcdTA5MzlcXHUwOTNEXFx1MDk1MFxcdTA5NTgtXFx1MDk2MVxcdTA5NjYtXFx1MDk2RlxcdTA5NzEtXFx1MDk4MFxcdTA5ODUtXFx1MDk4Q1xcdTA5OEZcXHUwOTkwXFx1MDk5My1cXHUwOUE4XFx1MDlBQS1cXHUwOUIwXFx1MDlCMlxcdTA5QjYtXFx1MDlCOVxcdTA5QkRcXHUwOUNFXFx1MDlEQ1xcdTA5RERcXHUwOURGLVxcdTA5RTFcXHUwOUU2LVxcdTA5RjFcXHUwOUY0LVxcdTA5RjlcXHUwOUZDXFx1MEEwNS1cXHUwQTBBXFx1MEEwRlxcdTBBMTBcXHUwQTEzLVxcdTBBMjhcXHUwQTJBLVxcdTBBMzBcXHUwQTMyXFx1MEEzM1xcdTBBMzVcXHUwQTM2XFx1MEEzOFxcdTBBMzlcXHUwQTU5LVxcdTBBNUNcXHUwQTVFXFx1MEE2Ni1cXHUwQTZGXFx1MEE3Mi1cXHUwQTc0XFx1MEE4NS1cXHUwQThEXFx1MEE4Ri1cXHUwQTkxXFx1MEE5My1cXHUwQUE4XFx1MEFBQS1cXHUwQUIwXFx1MEFCMlxcdTBBQjNcXHUwQUI1LVxcdTBBQjlcXHUwQUJEXFx1MEFEMFxcdTBBRTBcXHUwQUUxXFx1MEFFNi1cXHUwQUVGXFx1MEFGOVxcdTBCMDUtXFx1MEIwQ1xcdTBCMEZcXHUwQjEwXFx1MEIxMy1cXHUwQjI4XFx1MEIyQS1cXHUwQjMwXFx1MEIzMlxcdTBCMzNcXHUwQjM1LVxcdTBCMzlcXHUwQjNEXFx1MEI1Q1xcdTBCNURcXHUwQjVGLVxcdTBCNjFcXHUwQjY2LVxcdTBCNkZcXHUwQjcxLVxcdTBCNzdcXHUwQjgzXFx1MEI4NS1cXHUwQjhBXFx1MEI4RS1cXHUwQjkwXFx1MEI5Mi1cXHUwQjk1XFx1MEI5OVxcdTBCOUFcXHUwQjlDXFx1MEI5RVxcdTBCOUZcXHUwQkEzXFx1MEJBNFxcdTBCQTgtXFx1MEJBQVxcdTBCQUUtXFx1MEJCOVxcdTBCRDBcXHUwQkU2LVxcdTBCRjJcXHUwQzA1LVxcdTBDMENcXHUwQzBFLVxcdTBDMTBcXHUwQzEyLVxcdTBDMjhcXHUwQzJBLVxcdTBDMzlcXHUwQzNEXFx1MEM1OC1cXHUwQzVBXFx1MEM2MFxcdTBDNjFcXHUwQzY2LVxcdTBDNkZcXHUwQzc4LVxcdTBDN0VcXHUwQzgwXFx1MEM4NS1cXHUwQzhDXFx1MEM4RS1cXHUwQzkwXFx1MEM5Mi1cXHUwQ0E4XFx1MENBQS1cXHUwQ0IzXFx1MENCNS1cXHUwQ0I5XFx1MENCRFxcdTBDREVcXHUwQ0UwXFx1MENFMVxcdTBDRTYtXFx1MENFRlxcdTBDRjFcXHUwQ0YyXFx1MEQwNC1cXHUwRDBDXFx1MEQwRS1cXHUwRDEwXFx1MEQxMi1cXHUwRDNBXFx1MEQzRFxcdTBENEVcXHUwRDU0LVxcdTBENTZcXHUwRDU4LVxcdTBENjFcXHUwRDY2LVxcdTBENzhcXHUwRDdBLVxcdTBEN0ZcXHUwRDg1LVxcdTBEOTZcXHUwRDlBLVxcdTBEQjFcXHUwREIzLVxcdTBEQkJcXHUwREJEXFx1MERDMC1cXHUwREM2XFx1MERFNi1cXHUwREVGXFx1MEUwMS1cXHUwRTMwXFx1MEUzMlxcdTBFMzNcXHUwRTQwLVxcdTBFNDZcXHUwRTUwLVxcdTBFNTlcXHUwRTgxXFx1MEU4MlxcdTBFODRcXHUwRTg2LVxcdTBFOEFcXHUwRThDLVxcdTBFQTNcXHUwRUE1XFx1MEVBNy1cXHUwRUIwXFx1MEVCMlxcdTBFQjNcXHUwRUJEXFx1MEVDMC1cXHUwRUM0XFx1MEVDNlxcdTBFRDAtXFx1MEVEOVxcdTBFREMtXFx1MEVERlxcdTBGMDBcXHUwRjIwLVxcdTBGMzNcXHUwRjQwLVxcdTBGNDdcXHUwRjQ5LVxcdTBGNkNcXHUwRjg4LVxcdTBGOENcXHUxMDAwLVxcdTEwMkFcXHUxMDNGLVxcdTEwNDlcXHUxMDUwLVxcdTEwNTVcXHUxMDVBLVxcdTEwNURcXHUxMDYxXFx1MTA2NVxcdTEwNjZcXHUxMDZFLVxcdTEwNzBcXHUxMDc1LVxcdTEwODFcXHUxMDhFXFx1MTA5MC1cXHUxMDk5XFx1MTBBMC1cXHUxMEM1XFx1MTBDN1xcdTEwQ0RcXHUxMEQwLVxcdTEwRkFcXHUxMEZDLVxcdTEyNDhcXHUxMjRBLVxcdTEyNERcXHUxMjUwLVxcdTEyNTZcXHUxMjU4XFx1MTI1QS1cXHUxMjVEXFx1MTI2MC1cXHUxMjg4XFx1MTI4QS1cXHUxMjhEXFx1MTI5MC1cXHUxMkIwXFx1MTJCMi1cXHUxMkI1XFx1MTJCOC1cXHUxMkJFXFx1MTJDMFxcdTEyQzItXFx1MTJDNVxcdTEyQzgtXFx1MTJENlxcdTEyRDgtXFx1MTMxMFxcdTEzMTItXFx1MTMxNVxcdTEzMTgtXFx1MTM1QVxcdTEzNjktXFx1MTM3Q1xcdTEzODAtXFx1MTM4RlxcdTEzQTAtXFx1MTNGNVxcdTEzRjgtXFx1MTNGRFxcdTE0MDEtXFx1MTY2Q1xcdTE2NkYtXFx1MTY3RlxcdTE2ODEtXFx1MTY5QVxcdTE2QTAtXFx1MTZFQVxcdTE2RUUtXFx1MTZGOFxcdTE3MDAtXFx1MTcwQ1xcdTE3MEUtXFx1MTcxMVxcdTE3MjAtXFx1MTczMVxcdTE3NDAtXFx1MTc1MVxcdTE3NjAtXFx1MTc2Q1xcdTE3NkUtXFx1MTc3MFxcdTE3ODAtXFx1MTdCM1xcdTE3RDdcXHUxN0RDXFx1MTdFMC1cXHUxN0U5XFx1MTdGMC1cXHUxN0Y5XFx1MTgxMC1cXHUxODE5XFx1MTgyMC1cXHUxODc4XFx1MTg4MC1cXHUxODg0XFx1MTg4Ny1cXHUxOEE4XFx1MThBQVxcdTE4QjAtXFx1MThGNVxcdTE5MDAtXFx1MTkxRVxcdTE5NDYtXFx1MTk2RFxcdTE5NzAtXFx1MTk3NFxcdTE5ODAtXFx1MTlBQlxcdTE5QjAtXFx1MTlDOVxcdTE5RDAtXFx1MTlEQVxcdTFBMDAtXFx1MUExNlxcdTFBMjAtXFx1MUE1NFxcdTFBODAtXFx1MUE4OVxcdTFBOTAtXFx1MUE5OVxcdTFBQTdcXHUxQjA1LVxcdTFCMzNcXHUxQjQ1LVxcdTFCNEJcXHUxQjUwLVxcdTFCNTlcXHUxQjgzLVxcdTFCQTBcXHUxQkFFLVxcdTFCRTVcXHUxQzAwLVxcdTFDMjNcXHUxQzQwLVxcdTFDNDlcXHUxQzRELVxcdTFDN0RcXHUxQzgwLVxcdTFDODhcXHUxQzkwLVxcdTFDQkFcXHUxQ0JELVxcdTFDQkZcXHUxQ0U5LVxcdTFDRUNcXHUxQ0VFLVxcdTFDRjNcXHUxQ0Y1XFx1MUNGNlxcdTFDRkFcXHUxRDAwLVxcdTFEQkZcXHUxRTAwLVxcdTFGMTVcXHUxRjE4LVxcdTFGMURcXHUxRjIwLVxcdTFGNDVcXHUxRjQ4LVxcdTFGNERcXHUxRjUwLVxcdTFGNTdcXHUxRjU5XFx1MUY1QlxcdTFGNURcXHUxRjVGLVxcdTFGN0RcXHUxRjgwLVxcdTFGQjRcXHUxRkI2LVxcdTFGQkNcXHUxRkJFXFx1MUZDMi1cXHUxRkM0XFx1MUZDNi1cXHUxRkNDXFx1MUZEMC1cXHUxRkQzXFx1MUZENi1cXHUxRkRCXFx1MUZFMC1cXHUxRkVDXFx1MUZGMi1cXHUxRkY0XFx1MUZGNi1cXHUxRkZDXFx1MjA3MFxcdTIwNzFcXHUyMDc0LVxcdTIwNzlcXHUyMDdGLVxcdTIwODlcXHUyMDkwLVxcdTIwOUNcXHUyMTAyXFx1MjEwN1xcdTIxMEEtXFx1MjExM1xcdTIxMTVcXHUyMTE5LVxcdTIxMURcXHUyMTI0XFx1MjEyNlxcdTIxMjhcXHUyMTJBLVxcdTIxMkRcXHUyMTJGLVxcdTIxMzlcXHUyMTNDLVxcdTIxM0ZcXHUyMTQ1LVxcdTIxNDlcXHUyMTRFXFx1MjE1MC1cXHUyMTg5XFx1MjQ2MC1cXHUyNDlCXFx1MjRFQS1cXHUyNEZGXFx1Mjc3Ni1cXHUyNzkzXFx1MkMwMC1cXHUyQzJFXFx1MkMzMC1cXHUyQzVFXFx1MkM2MC1cXHUyQ0U0XFx1MkNFQi1cXHUyQ0VFXFx1MkNGMlxcdTJDRjNcXHUyQ0ZEXFx1MkQwMC1cXHUyRDI1XFx1MkQyN1xcdTJEMkRcXHUyRDMwLVxcdTJENjdcXHUyRDZGXFx1MkQ4MC1cXHUyRDk2XFx1MkRBMC1cXHUyREE2XFx1MkRBOC1cXHUyREFFXFx1MkRCMC1cXHUyREI2XFx1MkRCOC1cXHUyREJFXFx1MkRDMC1cXHUyREM2XFx1MkRDOC1cXHUyRENFXFx1MkREMC1cXHUyREQ2XFx1MkREOC1cXHUyRERFXFx1MkUyRlxcdTMwMDUtXFx1MzAwN1xcdTMwMjEtXFx1MzAyOVxcdTMwMzEtXFx1MzAzNVxcdTMwMzgtXFx1MzAzQ1xcdTMwNDEtXFx1MzA5NlxcdTMwOUQtXFx1MzA5RlxcdTMwQTEtXFx1MzBGQVxcdTMwRkMtXFx1MzBGRlxcdTMxMDUtXFx1MzEyRlxcdTMxMzEtXFx1MzE4RVxcdTMxOTItXFx1MzE5NVxcdTMxQTAtXFx1MzFCRlxcdTMxRjAtXFx1MzFGRlxcdTMyMjAtXFx1MzIyOVxcdTMyNDgtXFx1MzI0RlxcdTMyNTEtXFx1MzI1RlxcdTMyODAtXFx1MzI4OVxcdTMyQjEtXFx1MzJCRlxcdTM0MDAtXFx1NERCRlxcdTRFMDAtXFx1OUZGQ1xcdUEwMDAtXFx1QTQ4Q1xcdUE0RDAtXFx1QTRGRFxcdUE1MDAtXFx1QTYwQ1xcdUE2MTAtXFx1QTYyQlxcdUE2NDAtXFx1QTY2RVxcdUE2N0YtXFx1QTY5RFxcdUE2QTAtXFx1QTZFRlxcdUE3MTctXFx1QTcxRlxcdUE3MjItXFx1QTc4OFxcdUE3OEItXFx1QTdCRlxcdUE3QzItXFx1QTdDQVxcdUE3RjUtXFx1QTgwMVxcdUE4MDMtXFx1QTgwNVxcdUE4MDctXFx1QTgwQVxcdUE4MEMtXFx1QTgyMlxcdUE4MzAtXFx1QTgzNVxcdUE4NDAtXFx1QTg3M1xcdUE4ODItXFx1QThCM1xcdUE4RDAtXFx1QThEOVxcdUE4RjItXFx1QThGN1xcdUE4RkJcXHVBOEZEXFx1QThGRVxcdUE5MDAtXFx1QTkyNVxcdUE5MzAtXFx1QTk0NlxcdUE5NjAtXFx1QTk3Q1xcdUE5ODQtXFx1QTlCMlxcdUE5Q0YtXFx1QTlEOVxcdUE5RTAtXFx1QTlFNFxcdUE5RTYtXFx1QTlGRVxcdUFBMDAtXFx1QUEyOFxcdUFBNDAtXFx1QUE0MlxcdUFBNDQtXFx1QUE0QlxcdUFBNTAtXFx1QUE1OVxcdUFBNjAtXFx1QUE3NlxcdUFBN0FcXHVBQTdFLVxcdUFBQUZcXHVBQUIxXFx1QUFCNVxcdUFBQjZcXHVBQUI5LVxcdUFBQkRcXHVBQUMwXFx1QUFDMlxcdUFBREItXFx1QUFERFxcdUFBRTAtXFx1QUFFQVxcdUFBRjItXFx1QUFGNFxcdUFCMDEtXFx1QUIwNlxcdUFCMDktXFx1QUIwRVxcdUFCMTEtXFx1QUIxNlxcdUFCMjAtXFx1QUIyNlxcdUFCMjgtXFx1QUIyRVxcdUFCMzAtXFx1QUI1QVxcdUFCNUMtXFx1QUI2OVxcdUFCNzAtXFx1QUJFMlxcdUFCRjAtXFx1QUJGOVxcdUFDMDAtXFx1RDdBM1xcdUQ3QjAtXFx1RDdDNlxcdUQ3Q0ItXFx1RDdGQlxcdUY5MDAtXFx1RkE2RFxcdUZBNzAtXFx1RkFEOVxcdUZCMDAtXFx1RkIwNlxcdUZCMTMtXFx1RkIxN1xcdUZCMURcXHVGQjFGLVxcdUZCMjhcXHVGQjJBLVxcdUZCMzZcXHVGQjM4LVxcdUZCM0NcXHVGQjNFXFx1RkI0MFxcdUZCNDFcXHVGQjQzXFx1RkI0NFxcdUZCNDYtXFx1RkJCMVxcdUZCRDMtXFx1RkQzRFxcdUZENTAtXFx1RkQ4RlxcdUZEOTItXFx1RkRDN1xcdUZERjAtXFx1RkRGQlxcdUZFNzAtXFx1RkU3NFxcdUZFNzYtXFx1RkVGQ1xcdUZGMTAtXFx1RkYxOVxcdUZGMjEtXFx1RkYzQVxcdUZGNDEtXFx1RkY1QVxcdUZGNjYtXFx1RkZCRVxcdUZGQzItXFx1RkZDN1xcdUZGQ0EtXFx1RkZDRlxcdUZGRDItXFx1RkZEN1xcdUZGREEtXFx1RkZEQ118XFx1RDgwMFtcXHVEQzAwLVxcdURDMEJcXHVEQzBELVxcdURDMjZcXHVEQzI4LVxcdURDM0FcXHVEQzNDXFx1REMzRFxcdURDM0YtXFx1REM0RFxcdURDNTAtXFx1REM1RFxcdURDODAtXFx1RENGQVxcdUREMDctXFx1REQzM1xcdURENDAtXFx1REQ3OFxcdUREOEFcXHVERDhCXFx1REU4MC1cXHVERTlDXFx1REVBMC1cXHVERUQwXFx1REVFMS1cXHVERUZCXFx1REYwMC1cXHVERjIzXFx1REYyRC1cXHVERjRBXFx1REY1MC1cXHVERjc1XFx1REY4MC1cXHVERjlEXFx1REZBMC1cXHVERkMzXFx1REZDOC1cXHVERkNGXFx1REZEMS1cXHVERkQ1XXxcXHVEODAxW1xcdURDMDAtXFx1REM5RFxcdURDQTAtXFx1RENBOVxcdURDQjAtXFx1RENEM1xcdURDRDgtXFx1RENGQlxcdUREMDAtXFx1REQyN1xcdUREMzAtXFx1REQ2M1xcdURFMDAtXFx1REYzNlxcdURGNDAtXFx1REY1NVxcdURGNjAtXFx1REY2N118XFx1RDgwMltcXHVEQzAwLVxcdURDMDVcXHVEQzA4XFx1REMwQS1cXHVEQzM1XFx1REMzN1xcdURDMzhcXHVEQzNDXFx1REMzRi1cXHVEQzU1XFx1REM1OC1cXHVEQzc2XFx1REM3OS1cXHVEQzlFXFx1RENBNy1cXHVEQ0FGXFx1RENFMC1cXHVEQ0YyXFx1RENGNFxcdURDRjVcXHVEQ0ZCLVxcdUREMUJcXHVERDIwLVxcdUREMzlcXHVERDgwLVxcdUREQjdcXHVEREJDLVxcdUREQ0ZcXHVEREQyLVxcdURFMDBcXHVERTEwLVxcdURFMTNcXHVERTE1LVxcdURFMTdcXHVERTE5LVxcdURFMzVcXHVERTQwLVxcdURFNDhcXHVERTYwLVxcdURFN0VcXHVERTgwLVxcdURFOUZcXHVERUMwLVxcdURFQzdcXHVERUM5LVxcdURFRTRcXHVERUVCLVxcdURFRUZcXHVERjAwLVxcdURGMzVcXHVERjQwLVxcdURGNTVcXHVERjU4LVxcdURGNzJcXHVERjc4LVxcdURGOTFcXHVERkE5LVxcdURGQUZdfFxcdUQ4MDNbXFx1REMwMC1cXHVEQzQ4XFx1REM4MC1cXHVEQ0IyXFx1RENDMC1cXHVEQ0YyXFx1RENGQS1cXHVERDIzXFx1REQzMC1cXHVERDM5XFx1REU2MC1cXHVERTdFXFx1REU4MC1cXHVERUE5XFx1REVCMFxcdURFQjFcXHVERjAwLVxcdURGMjdcXHVERjMwLVxcdURGNDVcXHVERjUxLVxcdURGNTRcXHVERkIwLVxcdURGQ0JcXHVERkUwLVxcdURGRjZdfFxcdUQ4MDRbXFx1REMwMy1cXHVEQzM3XFx1REM1Mi1cXHVEQzZGXFx1REM4My1cXHVEQ0FGXFx1RENEMC1cXHVEQ0U4XFx1RENGMC1cXHVEQ0Y5XFx1REQwMy1cXHVERDI2XFx1REQzNi1cXHVERDNGXFx1REQ0NFxcdURENDdcXHVERDUwLVxcdURENzJcXHVERDc2XFx1REQ4My1cXHVEREIyXFx1RERDMS1cXHVEREM0XFx1REREMC1cXHVERERBXFx1REREQ1xcdURERTEtXFx1RERGNFxcdURFMDAtXFx1REUxMVxcdURFMTMtXFx1REUyQlxcdURFODAtXFx1REU4NlxcdURFODhcXHVERThBLVxcdURFOERcXHVERThGLVxcdURFOURcXHVERTlGLVxcdURFQThcXHVERUIwLVxcdURFREVcXHVERUYwLVxcdURFRjlcXHVERjA1LVxcdURGMENcXHVERjBGXFx1REYxMFxcdURGMTMtXFx1REYyOFxcdURGMkEtXFx1REYzMFxcdURGMzJcXHVERjMzXFx1REYzNS1cXHVERjM5XFx1REYzRFxcdURGNTBcXHVERjVELVxcdURGNjFdfFxcdUQ4MDVbXFx1REMwMC1cXHVEQzM0XFx1REM0Ny1cXHVEQzRBXFx1REM1MC1cXHVEQzU5XFx1REM1Ri1cXHVEQzYxXFx1REM4MC1cXHVEQ0FGXFx1RENDNFxcdURDQzVcXHVEQ0M3XFx1RENEMC1cXHVEQ0Q5XFx1REQ4MC1cXHVEREFFXFx1REREOC1cXHVERERCXFx1REUwMC1cXHVERTJGXFx1REU0NFxcdURFNTAtXFx1REU1OVxcdURFODAtXFx1REVBQVxcdURFQjhcXHVERUMwLVxcdURFQzlcXHVERjAwLVxcdURGMUFcXHVERjMwLVxcdURGM0JdfFxcdUQ4MDZbXFx1REMwMC1cXHVEQzJCXFx1RENBMC1cXHVEQ0YyXFx1RENGRi1cXHVERDA2XFx1REQwOVxcdUREMEMtXFx1REQxM1xcdUREMTVcXHVERDE2XFx1REQxOC1cXHVERDJGXFx1REQzRlxcdURENDFcXHVERDUwLVxcdURENTlcXHVEREEwLVxcdUREQTdcXHVEREFBLVxcdURERDBcXHVEREUxXFx1RERFM1xcdURFMDBcXHVERTBCLVxcdURFMzJcXHVERTNBXFx1REU1MFxcdURFNUMtXFx1REU4OVxcdURFOURcXHVERUMwLVxcdURFRjhdfFxcdUQ4MDdbXFx1REMwMC1cXHVEQzA4XFx1REMwQS1cXHVEQzJFXFx1REM0MFxcdURDNTAtXFx1REM2Q1xcdURDNzItXFx1REM4RlxcdUREMDAtXFx1REQwNlxcdUREMDhcXHVERDA5XFx1REQwQi1cXHVERDMwXFx1REQ0NlxcdURENTAtXFx1REQ1OVxcdURENjAtXFx1REQ2NVxcdURENjdcXHVERDY4XFx1REQ2QS1cXHVERDg5XFx1REQ5OFxcdUREQTAtXFx1RERBOVxcdURFRTAtXFx1REVGMlxcdURGQjBcXHVERkMwLVxcdURGRDRdfFxcdUQ4MDhbXFx1REMwMC1cXHVERjk5XXxcXHVEODA5W1xcdURDMDAtXFx1REM2RVxcdURDODAtXFx1REQ0M118W1xcdUQ4MENcXHVEODFDLVxcdUQ4MjBcXHVEODIyXFx1RDg0MC1cXHVEODY4XFx1RDg2QS1cXHVEODZDXFx1RDg2Ri1cXHVEODcyXFx1RDg3NC1cXHVEODc5XFx1RDg4MC1cXHVEODgzXVtcXHVEQzAwLVxcdURGRkZdfFxcdUQ4MERbXFx1REMwMC1cXHVEQzJFXXxcXHVEODExW1xcdURDMDAtXFx1REU0Nl18XFx1RDgxQVtcXHVEQzAwLVxcdURFMzhcXHVERTQwLVxcdURFNUVcXHVERTYwLVxcdURFNjlcXHVERUQwLVxcdURFRURcXHVERjAwLVxcdURGMkZcXHVERjQwLVxcdURGNDNcXHVERjUwLVxcdURGNTlcXHVERjVCLVxcdURGNjFcXHVERjYzLVxcdURGNzdcXHVERjdELVxcdURGOEZdfFxcdUQ4MUJbXFx1REU0MC1cXHVERTk2XFx1REYwMC1cXHVERjRBXFx1REY1MFxcdURGOTMtXFx1REY5RlxcdURGRTBcXHVERkUxXFx1REZFM118XFx1RDgyMVtcXHVEQzAwLVxcdURGRjddfFxcdUQ4MjNbXFx1REMwMC1cXHVEQ0Q1XFx1REQwMC1cXHVERDA4XXxcXHVEODJDW1xcdURDMDAtXFx1REQxRVxcdURENTAtXFx1REQ1MlxcdURENjQtXFx1REQ2N1xcdURENzAtXFx1REVGQl18XFx1RDgyRltcXHVEQzAwLVxcdURDNkFcXHVEQzcwLVxcdURDN0NcXHVEQzgwLVxcdURDODhcXHVEQzkwLVxcdURDOTldfFxcdUQ4MzRbXFx1REVFMC1cXHVERUYzXFx1REY2MC1cXHVERjc4XXxcXHVEODM1W1xcdURDMDAtXFx1REM1NFxcdURDNTYtXFx1REM5Q1xcdURDOUVcXHVEQzlGXFx1RENBMlxcdURDQTVcXHVEQ0E2XFx1RENBOS1cXHVEQ0FDXFx1RENBRS1cXHVEQ0I5XFx1RENCQlxcdURDQkQtXFx1RENDM1xcdURDQzUtXFx1REQwNVxcdUREMDctXFx1REQwQVxcdUREMEQtXFx1REQxNFxcdUREMTYtXFx1REQxQ1xcdUREMUUtXFx1REQzOVxcdUREM0ItXFx1REQzRVxcdURENDAtXFx1REQ0NFxcdURENDZcXHVERDRBLVxcdURENTBcXHVERDUyLVxcdURFQTVcXHVERUE4LVxcdURFQzBcXHVERUMyLVxcdURFREFcXHVERURDLVxcdURFRkFcXHVERUZDLVxcdURGMTRcXHVERjE2LVxcdURGMzRcXHVERjM2LVxcdURGNEVcXHVERjUwLVxcdURGNkVcXHVERjcwLVxcdURGODhcXHVERjhBLVxcdURGQThcXHVERkFBLVxcdURGQzJcXHVERkM0LVxcdURGQ0JcXHVERkNFLVxcdURGRkZdfFxcdUQ4MzhbXFx1REQwMC1cXHVERDJDXFx1REQzNy1cXHVERDNEXFx1REQ0MC1cXHVERDQ5XFx1REQ0RVxcdURFQzAtXFx1REVFQlxcdURFRjAtXFx1REVGOV18XFx1RDgzQVtcXHVEQzAwLVxcdURDQzRcXHVEQ0M3LVxcdURDQ0ZcXHVERDAwLVxcdURENDNcXHVERDRCXFx1REQ1MC1cXHVERDU5XXxcXHVEODNCW1xcdURDNzEtXFx1RENBQlxcdURDQUQtXFx1RENBRlxcdURDQjEtXFx1RENCNFxcdUREMDEtXFx1REQyRFxcdUREMkYtXFx1REQzRFxcdURFMDAtXFx1REUwM1xcdURFMDUtXFx1REUxRlxcdURFMjFcXHVERTIyXFx1REUyNFxcdURFMjdcXHVERTI5LVxcdURFMzJcXHVERTM0LVxcdURFMzdcXHVERTM5XFx1REUzQlxcdURFNDJcXHVERTQ3XFx1REU0OVxcdURFNEJcXHVERTRELVxcdURFNEZcXHVERTUxXFx1REU1MlxcdURFNTRcXHVERTU3XFx1REU1OVxcdURFNUJcXHVERTVEXFx1REU1RlxcdURFNjFcXHVERTYyXFx1REU2NFxcdURFNjctXFx1REU2QVxcdURFNkMtXFx1REU3MlxcdURFNzQtXFx1REU3N1xcdURFNzktXFx1REU3Q1xcdURFN0VcXHVERTgwLVxcdURFODlcXHVERThCLVxcdURFOUJcXHVERUExLVxcdURFQTNcXHVERUE1LVxcdURFQTlcXHVERUFCLVxcdURFQkJdfFxcdUQ4M0NbXFx1REQwMC1cXHVERDBDXXxcXHVEODNFW1xcdURGRjAtXFx1REZGOV18XFx1RDg2OVtcXHVEQzAwLVxcdURFRERcXHVERjAwLVxcdURGRkZdfFxcdUQ4NkRbXFx1REMwMC1cXHVERjM0XFx1REY0MC1cXHVERkZGXXxcXHVEODZFW1xcdURDMDAtXFx1REMxRFxcdURDMjAtXFx1REZGRl18XFx1RDg3M1tcXHVEQzAwLVxcdURFQTFcXHVERUIwLVxcdURGRkZdfFxcdUQ4N0FbXFx1REMwMC1cXHVERkUwXXxcXHVEODdFW1xcdURDMDAtXFx1REUxRF18XFx1RDg4NFtcXHVEQzAwLVxcdURGNEFdKS8pKSByZXR1cm47XG4gICAgICB2YXIgbmV4dENoYXIgPSBtYXRjaFsxXSB8fCBtYXRjaFsyXSB8fCAnJztcblxuICAgICAgaWYgKCFuZXh0Q2hhciB8fCBuZXh0Q2hhciAmJiAocHJldkNoYXIgPT09ICcnIHx8IHRoaXMucnVsZXMuaW5saW5lLnB1bmN0dWF0aW9uLmV4ZWMocHJldkNoYXIpKSkge1xuICAgICAgICB2YXIgbExlbmd0aCA9IG1hdGNoWzBdLmxlbmd0aCAtIDE7XG4gICAgICAgIHZhciByRGVsaW0sXG4gICAgICAgICAgICByTGVuZ3RoLFxuICAgICAgICAgICAgZGVsaW1Ub3RhbCA9IGxMZW5ndGgsXG4gICAgICAgICAgICBtaWREZWxpbVRvdGFsID0gMDtcbiAgICAgICAgdmFyIGVuZFJlZyA9IG1hdGNoWzBdWzBdID09PSAnKicgPyB0aGlzLnJ1bGVzLmlubGluZS5lbVN0cm9uZy5yRGVsaW1Bc3QgOiB0aGlzLnJ1bGVzLmlubGluZS5lbVN0cm9uZy5yRGVsaW1VbmQ7XG4gICAgICAgIGVuZFJlZy5sYXN0SW5kZXggPSAwOyAvLyBDbGlwIG1hc2tlZFNyYyB0byBzYW1lIHNlY3Rpb24gb2Ygc3RyaW5nIGFzIHNyYyAobW92ZSB0byBsZXhlcj8pXG5cbiAgICAgICAgbWFza2VkU3JjID0gbWFza2VkU3JjLnNsaWNlKC0xICogc3JjLmxlbmd0aCArIGxMZW5ndGgpO1xuXG4gICAgICAgIHdoaWxlICgobWF0Y2ggPSBlbmRSZWcuZXhlYyhtYXNrZWRTcmMpKSAhPSBudWxsKSB7XG4gICAgICAgICAgckRlbGltID0gbWF0Y2hbMV0gfHwgbWF0Y2hbMl0gfHwgbWF0Y2hbM10gfHwgbWF0Y2hbNF0gfHwgbWF0Y2hbNV0gfHwgbWF0Y2hbNl07XG4gICAgICAgICAgaWYgKCFyRGVsaW0pIGNvbnRpbnVlOyAvLyBza2lwIHNpbmdsZSAqIGluIF9fYWJjKmFiY19fXG5cbiAgICAgICAgICByTGVuZ3RoID0gckRlbGltLmxlbmd0aDtcblxuICAgICAgICAgIGlmIChtYXRjaFszXSB8fCBtYXRjaFs0XSkge1xuICAgICAgICAgICAgLy8gZm91bmQgYW5vdGhlciBMZWZ0IERlbGltXG4gICAgICAgICAgICBkZWxpbVRvdGFsICs9IHJMZW5ndGg7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoWzVdIHx8IG1hdGNoWzZdKSB7XG4gICAgICAgICAgICAvLyBlaXRoZXIgTGVmdCBvciBSaWdodCBEZWxpbVxuICAgICAgICAgICAgaWYgKGxMZW5ndGggJSAzICYmICEoKGxMZW5ndGggKyByTGVuZ3RoKSAlIDMpKSB7XG4gICAgICAgICAgICAgIG1pZERlbGltVG90YWwgKz0gckxlbmd0aDtcbiAgICAgICAgICAgICAgY29udGludWU7IC8vIENvbW1vbk1hcmsgRW1waGFzaXMgUnVsZXMgOS0xMFxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGRlbGltVG90YWwgLT0gckxlbmd0aDtcbiAgICAgICAgICBpZiAoZGVsaW1Ub3RhbCA+IDApIGNvbnRpbnVlOyAvLyBIYXZlbid0IGZvdW5kIGVub3VnaCBjbG9zaW5nIGRlbGltaXRlcnNcbiAgICAgICAgICAvLyBSZW1vdmUgZXh0cmEgY2hhcmFjdGVycy4gKmEqKiogLT4gKmEqXG5cbiAgICAgICAgICByTGVuZ3RoID0gTWF0aC5taW4ockxlbmd0aCwgckxlbmd0aCArIGRlbGltVG90YWwgKyBtaWREZWxpbVRvdGFsKTsgLy8gQ3JlYXRlIGBlbWAgaWYgc21hbGxlc3QgZGVsaW1pdGVyIGhhcyBvZGQgY2hhciBjb3VudC4gKmEqKipcblxuICAgICAgICAgIGlmIChNYXRoLm1pbihsTGVuZ3RoLCByTGVuZ3RoKSAlIDIpIHtcbiAgICAgICAgICAgIHZhciBfdGV4dCA9IHNyYy5zbGljZSgxLCBsTGVuZ3RoICsgbWF0Y2guaW5kZXggKyByTGVuZ3RoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgdHlwZTogJ2VtJyxcbiAgICAgICAgICAgICAgcmF3OiBzcmMuc2xpY2UoMCwgbExlbmd0aCArIG1hdGNoLmluZGV4ICsgckxlbmd0aCArIDEpLFxuICAgICAgICAgICAgICB0ZXh0OiBfdGV4dCxcbiAgICAgICAgICAgICAgdG9rZW5zOiB0aGlzLmxleGVyLmlubGluZVRva2VucyhfdGV4dCwgW10pXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0gLy8gQ3JlYXRlICdzdHJvbmcnIGlmIHNtYWxsZXN0IGRlbGltaXRlciBoYXMgZXZlbiBjaGFyIGNvdW50LiAqKmEqKipcblxuXG4gICAgICAgICAgdmFyIHRleHQgPSBzcmMuc2xpY2UoMiwgbExlbmd0aCArIG1hdGNoLmluZGV4ICsgckxlbmd0aCAtIDEpO1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnc3Ryb25nJyxcbiAgICAgICAgICAgIHJhdzogc3JjLnNsaWNlKDAsIGxMZW5ndGggKyBtYXRjaC5pbmRleCArIHJMZW5ndGggKyAxKSxcbiAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICB0b2tlbnM6IHRoaXMubGV4ZXIuaW5saW5lVG9rZW5zKHRleHQsIFtdKVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmNvZGVzcGFuID0gZnVuY3Rpb24gY29kZXNwYW4oc3JjKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUuY29kZS5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIHRleHQgPSBjYXBbMl0ucmVwbGFjZSgvXFxuL2csICcgJyk7XG4gICAgICAgIHZhciBoYXNOb25TcGFjZUNoYXJzID0gL1teIF0vLnRlc3QodGV4dCk7XG4gICAgICAgIHZhciBoYXNTcGFjZUNoYXJzT25Cb3RoRW5kcyA9IC9eIC8udGVzdCh0ZXh0KSAmJiAvICQvLnRlc3QodGV4dCk7XG5cbiAgICAgICAgaWYgKGhhc05vblNwYWNlQ2hhcnMgJiYgaGFzU3BhY2VDaGFyc09uQm90aEVuZHMpIHtcbiAgICAgICAgICB0ZXh0ID0gdGV4dC5zdWJzdHJpbmcoMSwgdGV4dC5sZW5ndGggLSAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHQgPSBfZXNjYXBlKHRleHQsIHRydWUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdjb2Rlc3BhbicsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8uYnIgPSBmdW5jdGlvbiBicihzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS5ici5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAnYnInLFxuICAgICAgICAgIHJhdzogY2FwWzBdXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5kZWwgPSBmdW5jdGlvbiBkZWwoc3JjKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUuZGVsLmV4ZWMoc3JjKTtcblxuICAgICAgaWYgKGNhcCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdkZWwnLFxuICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgIHRleHQ6IGNhcFsyXSxcbiAgICAgICAgICB0b2tlbnM6IHRoaXMubGV4ZXIuaW5saW5lVG9rZW5zKGNhcFsyXSwgW10pXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5hdXRvbGluayA9IGZ1bmN0aW9uIGF1dG9saW5rKHNyYywgbWFuZ2xlKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUuYXV0b2xpbmsuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHZhciB0ZXh0LCBocmVmO1xuXG4gICAgICAgIGlmIChjYXBbMl0gPT09ICdAJykge1xuICAgICAgICAgIHRleHQgPSBfZXNjYXBlKHRoaXMub3B0aW9ucy5tYW5nbGUgPyBtYW5nbGUoY2FwWzFdKSA6IGNhcFsxXSk7XG4gICAgICAgICAgaHJlZiA9ICdtYWlsdG86JyArIHRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dCA9IF9lc2NhcGUoY2FwWzFdKTtcbiAgICAgICAgICBocmVmID0gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgaHJlZjogaHJlZixcbiAgICAgICAgICB0b2tlbnM6IFt7XG4gICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICByYXc6IHRleHQsXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgICAgfV1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLnVybCA9IGZ1bmN0aW9uIHVybChzcmMsIG1hbmdsZSkge1xuICAgICAgdmFyIGNhcDtcblxuICAgICAgaWYgKGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLnVybC5leGVjKHNyYykpIHtcbiAgICAgICAgdmFyIHRleHQsIGhyZWY7XG5cbiAgICAgICAgaWYgKGNhcFsyXSA9PT0gJ0AnKSB7XG4gICAgICAgICAgdGV4dCA9IF9lc2NhcGUodGhpcy5vcHRpb25zLm1hbmdsZSA/IG1hbmdsZShjYXBbMF0pIDogY2FwWzBdKTtcbiAgICAgICAgICBocmVmID0gJ21haWx0bzonICsgdGV4dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBkbyBleHRlbmRlZCBhdXRvbGluayBwYXRoIHZhbGlkYXRpb25cbiAgICAgICAgICB2YXIgcHJldkNhcFplcm87XG5cbiAgICAgICAgICBkbyB7XG4gICAgICAgICAgICBwcmV2Q2FwWmVybyA9IGNhcFswXTtcbiAgICAgICAgICAgIGNhcFswXSA9IHRoaXMucnVsZXMuaW5saW5lLl9iYWNrcGVkYWwuZXhlYyhjYXBbMF0pWzBdO1xuICAgICAgICAgIH0gd2hpbGUgKHByZXZDYXBaZXJvICE9PSBjYXBbMF0pO1xuXG4gICAgICAgICAgdGV4dCA9IF9lc2NhcGUoY2FwWzBdKTtcblxuICAgICAgICAgIGlmIChjYXBbMV0gPT09ICd3d3cuJykge1xuICAgICAgICAgICAgaHJlZiA9ICdodHRwOi8vJyArIHRleHQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhyZWYgPSB0ZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogJ2xpbmsnLFxuICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgaHJlZjogaHJlZixcbiAgICAgICAgICB0b2tlbnM6IFt7XG4gICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICByYXc6IHRleHQsXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgICAgfV1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmlubGluZVRleHQgPSBmdW5jdGlvbiBpbmxpbmVUZXh0KHNyYywgc21hcnR5cGFudHMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS50ZXh0LmV4ZWMoc3JjKTtcblxuICAgICAgaWYgKGNhcCkge1xuICAgICAgICB2YXIgdGV4dDtcblxuICAgICAgICBpZiAodGhpcy5sZXhlci5zdGF0ZS5pblJhd0Jsb2NrKSB7XG4gICAgICAgICAgdGV4dCA9IHRoaXMub3B0aW9ucy5zYW5pdGl6ZSA/IHRoaXMub3B0aW9ucy5zYW5pdGl6ZXIgPyB0aGlzLm9wdGlvbnMuc2FuaXRpemVyKGNhcFswXSkgOiBfZXNjYXBlKGNhcFswXSkgOiBjYXBbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dCA9IF9lc2NhcGUodGhpcy5vcHRpb25zLnNtYXJ0eXBhbnRzID8gc21hcnR5cGFudHMoY2FwWzBdKSA6IGNhcFswXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBUb2tlbml6ZXI7XG4gIH0oKTtcblxuICB2YXIgbm9vcFRlc3QgPSBoZWxwZXJzLm5vb3BUZXN0LFxuICAgICAgZWRpdCA9IGhlbHBlcnMuZWRpdCxcbiAgICAgIG1lcmdlJDEgPSBoZWxwZXJzLm1lcmdlO1xuICAvKipcbiAgICogQmxvY2stTGV2ZWwgR3JhbW1hclxuICAgKi9cblxuICB2YXIgYmxvY2skMSA9IHtcbiAgICBuZXdsaW5lOiAvXig/OiAqKD86XFxufCQpKSsvLFxuICAgIGNvZGU6IC9eKCB7NH1bXlxcbl0rKD86XFxuKD86ICooPzpcXG58JCkpKik/KSsvLFxuICAgIGZlbmNlczogL14gezAsM30oYHszLH0oPz1bXmBcXG5dKlxcbil8fnszLH0pKFteXFxuXSopXFxuKD86fChbXFxzXFxTXSo/KVxcbikoPzogezAsM31cXDFbfmBdKiAqKD89XFxufCQpfCQpLyxcbiAgICBocjogL14gezAsM30oKD86LSAqKXszLH18KD86XyAqKXszLH18KD86XFwqICopezMsfSkoPzpcXG4rfCQpLyxcbiAgICBoZWFkaW5nOiAvXiB7MCwzfSgjezEsNn0pKD89XFxzfCQpKC4qKSg/Olxcbit8JCkvLFxuICAgIGJsb2NrcXVvdGU6IC9eKCB7MCwzfT4gPyhwYXJhZ3JhcGh8W15cXG5dKikoPzpcXG58JCkpKy8sXG4gICAgbGlzdDogL14oIHswLDN9YnVsbCkoIFteXFxuXSs/KT8oPzpcXG58JCkvLFxuICAgIGh0bWw6ICdeIHswLDN9KD86JyAvLyBvcHRpb25hbCBpbmRlbnRhdGlvblxuICAgICsgJzwoc2NyaXB0fHByZXxzdHlsZXx0ZXh0YXJlYSlbXFxcXHM+XVtcXFxcc1xcXFxTXSo/KD86PC9cXFxcMT5bXlxcXFxuXSpcXFxcbit8JCknIC8vICgxKVxuICAgICsgJ3xjb21tZW50W15cXFxcbl0qKFxcXFxuK3wkKScgLy8gKDIpXG4gICAgKyAnfDxcXFxcP1tcXFxcc1xcXFxTXSo/KD86XFxcXD8+XFxcXG4qfCQpJyAvLyAoMylcbiAgICArICd8PCFbQS1aXVtcXFxcc1xcXFxTXSo/KD86PlxcXFxuKnwkKScgLy8gKDQpXG4gICAgKyAnfDwhXFxcXFtDREFUQVxcXFxbW1xcXFxzXFxcXFNdKj8oPzpcXFxcXVxcXFxdPlxcXFxuKnwkKScgLy8gKDUpXG4gICAgKyAnfDwvPyh0YWcpKD86ICt8XFxcXG58Lz8+KVtcXFxcc1xcXFxTXSo/KD86KD86XFxcXG4gKikrXFxcXG58JCknIC8vICg2KVxuICAgICsgJ3w8KD8hc2NyaXB0fHByZXxzdHlsZXx0ZXh0YXJlYSkoW2Etel1bXFxcXHctXSopKD86YXR0cmlidXRlKSo/ICovPz4oPz1bIFxcXFx0XSooPzpcXFxcbnwkKSlbXFxcXHNcXFxcU10qPyg/Oig/OlxcXFxuICopK1xcXFxufCQpJyAvLyAoNykgb3BlbiB0YWdcbiAgICArICd8PC8oPyFzY3JpcHR8cHJlfHN0eWxlfHRleHRhcmVhKVthLXpdW1xcXFx3LV0qXFxcXHMqPig/PVsgXFxcXHRdKig/OlxcXFxufCQpKVtcXFxcc1xcXFxTXSo/KD86KD86XFxcXG4gKikrXFxcXG58JCknIC8vICg3KSBjbG9zaW5nIHRhZ1xuICAgICsgJyknLFxuICAgIGRlZjogL14gezAsM31cXFsobGFiZWwpXFxdOiAqXFxuPyAqPD8oW15cXHM+XSspPj8oPzooPzogK1xcbj8gKnwgKlxcbiAqKSh0aXRsZSkpPyAqKD86XFxuK3wkKS8sXG4gICAgdGFibGU6IG5vb3BUZXN0LFxuICAgIGxoZWFkaW5nOiAvXihbXlxcbl0rKVxcbiB7MCwzfSg9K3wtKykgKig/Olxcbit8JCkvLFxuICAgIC8vIHJlZ2V4IHRlbXBsYXRlLCBwbGFjZWhvbGRlcnMgd2lsbCBiZSByZXBsYWNlZCBhY2NvcmRpbmcgdG8gZGlmZmVyZW50IHBhcmFncmFwaFxuICAgIC8vIGludGVycnVwdGlvbiBydWxlcyBvZiBjb21tb25tYXJrIGFuZCB0aGUgb3JpZ2luYWwgbWFya2Rvd24gc3BlYzpcbiAgICBfcGFyYWdyYXBoOiAvXihbXlxcbl0rKD86XFxuKD8haHJ8aGVhZGluZ3xsaGVhZGluZ3xibG9ja3F1b3RlfGZlbmNlc3xsaXN0fGh0bWx8ICtcXG4pW15cXG5dKykqKS8sXG4gICAgdGV4dDogL15bXlxcbl0rL1xuICB9O1xuICBibG9jayQxLl9sYWJlbCA9IC8oPyFcXHMqXFxdKSg/OlxcXFxbXFxbXFxdXXxbXlxcW1xcXV0pKy87XG4gIGJsb2NrJDEuX3RpdGxlID0gLyg/OlwiKD86XFxcXFwiP3xbXlwiXFxcXF0pKlwifCdbXidcXG5dKig/OlxcblteJ1xcbl0rKSpcXG4/J3xcXChbXigpXSpcXCkpLztcbiAgYmxvY2skMS5kZWYgPSBlZGl0KGJsb2NrJDEuZGVmKS5yZXBsYWNlKCdsYWJlbCcsIGJsb2NrJDEuX2xhYmVsKS5yZXBsYWNlKCd0aXRsZScsIGJsb2NrJDEuX3RpdGxlKS5nZXRSZWdleCgpO1xuICBibG9jayQxLmJ1bGxldCA9IC8oPzpbKistXXxcXGR7MSw5fVsuKV0pLztcbiAgYmxvY2skMS5saXN0SXRlbVN0YXJ0ID0gZWRpdCgvXiggKikoYnVsbCkgKi8pLnJlcGxhY2UoJ2J1bGwnLCBibG9jayQxLmJ1bGxldCkuZ2V0UmVnZXgoKTtcbiAgYmxvY2skMS5saXN0ID0gZWRpdChibG9jayQxLmxpc3QpLnJlcGxhY2UoL2J1bGwvZywgYmxvY2skMS5idWxsZXQpLnJlcGxhY2UoJ2hyJywgJ1xcXFxuKyg/PVxcXFwxPyg/Oig/Oi0gKil7Myx9fCg/Ol8gKil7Myx9fCg/OlxcXFwqICopezMsfSkoPzpcXFxcbit8JCkpJykucmVwbGFjZSgnZGVmJywgJ1xcXFxuKyg/PScgKyBibG9jayQxLmRlZi5zb3VyY2UgKyAnKScpLmdldFJlZ2V4KCk7XG4gIGJsb2NrJDEuX3RhZyA9ICdhZGRyZXNzfGFydGljbGV8YXNpZGV8YmFzZXxiYXNlZm9udHxibG9ja3F1b3RlfGJvZHl8Y2FwdGlvbicgKyAnfGNlbnRlcnxjb2x8Y29sZ3JvdXB8ZGR8ZGV0YWlsc3xkaWFsb2d8ZGlyfGRpdnxkbHxkdHxmaWVsZHNldHxmaWdjYXB0aW9uJyArICd8ZmlndXJlfGZvb3Rlcnxmb3JtfGZyYW1lfGZyYW1lc2V0fGhbMS02XXxoZWFkfGhlYWRlcnxocnxodG1sfGlmcmFtZScgKyAnfGxlZ2VuZHxsaXxsaW5rfG1haW58bWVudXxtZW51aXRlbXxtZXRhfG5hdnxub2ZyYW1lc3xvbHxvcHRncm91cHxvcHRpb24nICsgJ3xwfHBhcmFtfHNlY3Rpb258c291cmNlfHN1bW1hcnl8dGFibGV8dGJvZHl8dGR8dGZvb3R8dGh8dGhlYWR8dGl0bGV8dHInICsgJ3x0cmFja3x1bCc7XG4gIGJsb2NrJDEuX2NvbW1lbnQgPSAvPCEtLSg/IS0/PilbXFxzXFxTXSo/KD86LS0+fCQpLztcbiAgYmxvY2skMS5odG1sID0gZWRpdChibG9jayQxLmh0bWwsICdpJykucmVwbGFjZSgnY29tbWVudCcsIGJsb2NrJDEuX2NvbW1lbnQpLnJlcGxhY2UoJ3RhZycsIGJsb2NrJDEuX3RhZykucmVwbGFjZSgnYXR0cmlidXRlJywgLyArW2EtekEtWjpfXVtcXHcuOi1dKig/OiAqPSAqXCJbXlwiXFxuXSpcInwgKj0gKidbXidcXG5dKid8ICo9ICpbXlxcc1wiJz08PmBdKyk/LykuZ2V0UmVnZXgoKTtcbiAgYmxvY2skMS5wYXJhZ3JhcGggPSBlZGl0KGJsb2NrJDEuX3BhcmFncmFwaCkucmVwbGFjZSgnaHInLCBibG9jayQxLmhyKS5yZXBsYWNlKCdoZWFkaW5nJywgJyB7MCwzfSN7MSw2fSAnKS5yZXBsYWNlKCd8bGhlYWRpbmcnLCAnJykgLy8gc2V0ZXggaGVhZGluZ3MgZG9uJ3QgaW50ZXJydXB0IGNvbW1vbm1hcmsgcGFyYWdyYXBoc1xuICAucmVwbGFjZSgnYmxvY2txdW90ZScsICcgezAsM30+JykucmVwbGFjZSgnZmVuY2VzJywgJyB7MCwzfSg/OmB7Myx9KD89W15gXFxcXG5dKlxcXFxuKXx+ezMsfSlbXlxcXFxuXSpcXFxcbicpLnJlcGxhY2UoJ2xpc3QnLCAnIHswLDN9KD86WyorLV18MVsuKV0pICcpIC8vIG9ubHkgbGlzdHMgc3RhcnRpbmcgZnJvbSAxIGNhbiBpbnRlcnJ1cHRcbiAgLnJlcGxhY2UoJ2h0bWwnLCAnPC8/KD86dGFnKSg/OiArfFxcXFxufC8/Pil8PCg/OnNjcmlwdHxwcmV8c3R5bGV8dGV4dGFyZWF8IS0tKScpLnJlcGxhY2UoJ3RhZycsIGJsb2NrJDEuX3RhZykgLy8gcGFycyBjYW4gYmUgaW50ZXJydXB0ZWQgYnkgdHlwZSAoNikgaHRtbCBibG9ja3NcbiAgLmdldFJlZ2V4KCk7XG4gIGJsb2NrJDEuYmxvY2txdW90ZSA9IGVkaXQoYmxvY2skMS5ibG9ja3F1b3RlKS5yZXBsYWNlKCdwYXJhZ3JhcGgnLCBibG9jayQxLnBhcmFncmFwaCkuZ2V0UmVnZXgoKTtcbiAgLyoqXG4gICAqIE5vcm1hbCBCbG9jayBHcmFtbWFyXG4gICAqL1xuXG4gIGJsb2NrJDEubm9ybWFsID0gbWVyZ2UkMSh7fSwgYmxvY2skMSk7XG4gIC8qKlxuICAgKiBHRk0gQmxvY2sgR3JhbW1hclxuICAgKi9cblxuICBibG9jayQxLmdmbSA9IG1lcmdlJDEoe30sIGJsb2NrJDEubm9ybWFsLCB7XG4gICAgdGFibGU6ICdeICooW15cXFxcbiBdLipcXFxcfC4qKVxcXFxuJyAvLyBIZWFkZXJcbiAgICArICcgezAsM30oPzpcXFxcfCAqKT8oOj8tKzo/ICooPzpcXFxcfCAqOj8tKzo/ICopKilcXFxcfD8nIC8vIEFsaWduXG4gICAgKyAnKD86XFxcXG4oKD86KD8hICpcXFxcbnxocnxoZWFkaW5nfGJsb2NrcXVvdGV8Y29kZXxmZW5jZXN8bGlzdHxodG1sKS4qKD86XFxcXG58JCkpKilcXFxcbip8JCknIC8vIENlbGxzXG5cbiAgfSk7XG4gIGJsb2NrJDEuZ2ZtLnRhYmxlID0gZWRpdChibG9jayQxLmdmbS50YWJsZSkucmVwbGFjZSgnaHInLCBibG9jayQxLmhyKS5yZXBsYWNlKCdoZWFkaW5nJywgJyB7MCwzfSN7MSw2fSAnKS5yZXBsYWNlKCdibG9ja3F1b3RlJywgJyB7MCwzfT4nKS5yZXBsYWNlKCdjb2RlJywgJyB7NH1bXlxcXFxuXScpLnJlcGxhY2UoJ2ZlbmNlcycsICcgezAsM30oPzpgezMsfSg/PVteYFxcXFxuXSpcXFxcbil8fnszLH0pW15cXFxcbl0qXFxcXG4nKS5yZXBsYWNlKCdsaXN0JywgJyB7MCwzfSg/OlsqKy1dfDFbLildKSAnKSAvLyBvbmx5IGxpc3RzIHN0YXJ0aW5nIGZyb20gMSBjYW4gaW50ZXJydXB0XG4gIC5yZXBsYWNlKCdodG1sJywgJzwvPyg/OnRhZykoPzogK3xcXFxcbnwvPz4pfDwoPzpzY3JpcHR8cHJlfHN0eWxlfHRleHRhcmVhfCEtLSknKS5yZXBsYWNlKCd0YWcnLCBibG9jayQxLl90YWcpIC8vIHRhYmxlcyBjYW4gYmUgaW50ZXJydXB0ZWQgYnkgdHlwZSAoNikgaHRtbCBibG9ja3NcbiAgLmdldFJlZ2V4KCk7XG4gIC8qKlxuICAgKiBQZWRhbnRpYyBncmFtbWFyIChvcmlnaW5hbCBKb2huIEdydWJlcidzIGxvb3NlIG1hcmtkb3duIHNwZWNpZmljYXRpb24pXG4gICAqL1xuXG4gIGJsb2NrJDEucGVkYW50aWMgPSBtZXJnZSQxKHt9LCBibG9jayQxLm5vcm1hbCwge1xuICAgIGh0bWw6IGVkaXQoJ14gKig/OmNvbW1lbnQgKig/OlxcXFxufFxcXFxzKiQpJyArICd8PCh0YWcpW1xcXFxzXFxcXFNdKz88L1xcXFwxPiAqKD86XFxcXG57Mix9fFxcXFxzKiQpJyAvLyBjbG9zZWQgdGFnXG4gICAgKyAnfDx0YWcoPzpcIlteXCJdKlwifFxcJ1teXFwnXSpcXCd8XFxcXHNbXlxcJ1wiLz5cXFxcc10qKSo/Lz8+ICooPzpcXFxcbnsyLH18XFxcXHMqJCkpJykucmVwbGFjZSgnY29tbWVudCcsIGJsb2NrJDEuX2NvbW1lbnQpLnJlcGxhY2UoL3RhZy9nLCAnKD8hKD86JyArICdhfGVtfHN0cm9uZ3xzbWFsbHxzfGNpdGV8cXxkZm58YWJicnxkYXRhfHRpbWV8Y29kZXx2YXJ8c2FtcHxrYmR8c3ViJyArICd8c3VwfGl8Ynx1fG1hcmt8cnVieXxydHxycHxiZGl8YmRvfHNwYW58YnJ8d2JyfGluc3xkZWx8aW1nKScgKyAnXFxcXGIpXFxcXHcrKD8hOnxbXlxcXFx3XFxcXHNAXSpAKVxcXFxiJykuZ2V0UmVnZXgoKSxcbiAgICBkZWY6IC9eICpcXFsoW15cXF1dKylcXF06ICo8PyhbXlxccz5dKyk+Pyg/OiArKFtcIihdW15cXG5dK1tcIildKSk/ICooPzpcXG4rfCQpLyxcbiAgICBoZWFkaW5nOiAvXigjezEsNn0pKC4qKSg/Olxcbit8JCkvLFxuICAgIGZlbmNlczogbm9vcFRlc3QsXG4gICAgLy8gZmVuY2VzIG5vdCBzdXBwb3J0ZWRcbiAgICBwYXJhZ3JhcGg6IGVkaXQoYmxvY2skMS5ub3JtYWwuX3BhcmFncmFwaCkucmVwbGFjZSgnaHInLCBibG9jayQxLmhyKS5yZXBsYWNlKCdoZWFkaW5nJywgJyAqI3sxLDZ9ICpbXlxcbl0nKS5yZXBsYWNlKCdsaGVhZGluZycsIGJsb2NrJDEubGhlYWRpbmcpLnJlcGxhY2UoJ2Jsb2NrcXVvdGUnLCAnIHswLDN9PicpLnJlcGxhY2UoJ3xmZW5jZXMnLCAnJykucmVwbGFjZSgnfGxpc3QnLCAnJykucmVwbGFjZSgnfGh0bWwnLCAnJykuZ2V0UmVnZXgoKVxuICB9KTtcbiAgLyoqXG4gICAqIElubGluZS1MZXZlbCBHcmFtbWFyXG4gICAqL1xuXG4gIHZhciBpbmxpbmUkMSA9IHtcbiAgICBlc2NhcGU6IC9eXFxcXChbIVwiIyQlJicoKSorLFxcLS4vOjs8PT4/QFxcW1xcXVxcXFxeX2B7fH1+XSkvLFxuICAgIGF1dG9saW5rOiAvXjwoc2NoZW1lOlteXFxzXFx4MDAtXFx4MWY8Pl0qfGVtYWlsKT4vLFxuICAgIHVybDogbm9vcFRlc3QsXG4gICAgdGFnOiAnXmNvbW1lbnQnICsgJ3xePC9bYS16QS1aXVtcXFxcdzotXSpcXFxccyo+JyAvLyBzZWxmLWNsb3NpbmcgdGFnXG4gICAgKyAnfF48W2EtekEtWl1bXFxcXHctXSooPzphdHRyaWJ1dGUpKj9cXFxccyovPz4nIC8vIG9wZW4gdGFnXG4gICAgKyAnfF48XFxcXD9bXFxcXHNcXFxcU10qP1xcXFw/PicgLy8gcHJvY2Vzc2luZyBpbnN0cnVjdGlvbiwgZS5nLiA8P3BocCA/PlxuICAgICsgJ3xePCFbYS16QS1aXStcXFxcc1tcXFxcc1xcXFxTXSo/PicgLy8gZGVjbGFyYXRpb24sIGUuZy4gPCFET0NUWVBFIGh0bWw+XG4gICAgKyAnfF48IVxcXFxbQ0RBVEFcXFxcW1tcXFxcc1xcXFxTXSo/XFxcXF1cXFxcXT4nLFxuICAgIC8vIENEQVRBIHNlY3Rpb25cbiAgICBsaW5rOiAvXiE/XFxbKGxhYmVsKVxcXVxcKFxccyooaHJlZikoPzpcXHMrKHRpdGxlKSk/XFxzKlxcKS8sXG4gICAgcmVmbGluazogL14hP1xcWyhsYWJlbClcXF1cXFsoPyFcXHMqXFxdKSgoPzpcXFxcW1xcW1xcXV0/fFteXFxbXFxdXFxcXF0pKylcXF0vLFxuICAgIG5vbGluazogL14hP1xcWyg/IVxccypcXF0pKCg/OlxcW1teXFxbXFxdXSpcXF18XFxcXFtcXFtcXF1dfFteXFxbXFxdXSkqKVxcXSg/OlxcW1xcXSk/LyxcbiAgICByZWZsaW5rU2VhcmNoOiAncmVmbGlua3xub2xpbmsoPyFcXFxcKCknLFxuICAgIGVtU3Ryb25nOiB7XG4gICAgICBsRGVsaW06IC9eKD86XFwqKyg/OihbcHVuY3RfXSl8W15cXHMqXSkpfF5fKyg/OihbcHVuY3QqXSl8KFteXFxzX10pKS8sXG4gICAgICAvLyAgICAgICAgKDEpIGFuZCAoMikgY2FuIG9ubHkgYmUgYSBSaWdodCBEZWxpbWl0ZXIuICgzKSBhbmQgKDQpIGNhbiBvbmx5IGJlIExlZnQuICAoNSkgYW5kICg2KSBjYW4gYmUgZWl0aGVyIExlZnQgb3IgUmlnaHQuXG4gICAgICAvLyAgICAgICAgKCkgU2tpcCBvdGhlciBkZWxpbWl0ZXIgKDEpICMqKiogICAgICAgICAgICAgICAgICAgKDIpIGEqKiojLCBhKioqICAgICAgICAgICAgICAgICAgICgzKSAjKioqYSwgKioqYSAgICAgICAgICAgICAgICAgKDQpICoqKiMgICAgICAgICAgICAgICg1KSAjKioqIyAgICAgICAgICAgICAgICAgKDYpIGEqKiphXG4gICAgICByRGVsaW1Bc3Q6IC9cXF9cXF9bXl8qXSo/XFwqW15fKl0qP1xcX1xcX3xbcHVuY3RfXShcXCorKSg/PVtcXHNdfCQpfFtecHVuY3QqX1xcc10oXFwqKykoPz1bcHVuY3RfXFxzXXwkKXxbcHVuY3RfXFxzXShcXCorKSg/PVtecHVuY3QqX1xcc10pfFtcXHNdKFxcKispKD89W3B1bmN0X10pfFtwdW5jdF9dKFxcKispKD89W3B1bmN0X10pfFtecHVuY3QqX1xcc10oXFwqKykoPz1bXnB1bmN0Kl9cXHNdKS8sXG4gICAgICByRGVsaW1VbmQ6IC9cXCpcXCpbXl8qXSo/XFxfW15fKl0qP1xcKlxcKnxbcHVuY3QqXShcXF8rKSg/PVtcXHNdfCQpfFtecHVuY3QqX1xcc10oXFxfKykoPz1bcHVuY3QqXFxzXXwkKXxbcHVuY3QqXFxzXShcXF8rKSg/PVtecHVuY3QqX1xcc10pfFtcXHNdKFxcXyspKD89W3B1bmN0Kl0pfFtwdW5jdCpdKFxcXyspKD89W3B1bmN0Kl0pLyAvLyBeLSBOb3QgYWxsb3dlZCBmb3IgX1xuXG4gICAgfSxcbiAgICBjb2RlOiAvXihgKykoW15gXXxbXmBdW1xcc1xcU10qP1teYF0pXFwxKD8hYCkvLFxuICAgIGJyOiAvXiggezIsfXxcXFxcKVxcbig/IVxccyokKS8sXG4gICAgZGVsOiBub29wVGVzdCxcbiAgICB0ZXh0OiAvXihgK3xbXmBdKSg/Oig/PSB7Mix9XFxuKXxbXFxzXFxTXSo/KD86KD89W1xcXFw8IVxcW2AqX118XFxiX3wkKXxbXiBdKD89IHsyLH1cXG4pKSkvLFxuICAgIHB1bmN0dWF0aW9uOiAvXihbXFxzcHVuY3R1YXRpb25dKS9cbiAgfTsgLy8gbGlzdCBvZiBwdW5jdHVhdGlvbiBtYXJrcyBmcm9tIENvbW1vbk1hcmsgc3BlY1xuICAvLyB3aXRob3V0ICogYW5kIF8gdG8gaGFuZGxlIHRoZSBkaWZmZXJlbnQgZW1waGFzaXMgbWFya2VycyAqIGFuZCBfXG5cbiAgaW5saW5lJDEuX3B1bmN0dWF0aW9uID0gJyFcIiMkJSZcXCcoKStcXFxcLS4sLzo7PD0+P0BcXFxcW1xcXFxdYF57fH1+JztcbiAgaW5saW5lJDEucHVuY3R1YXRpb24gPSBlZGl0KGlubGluZSQxLnB1bmN0dWF0aW9uKS5yZXBsYWNlKC9wdW5jdHVhdGlvbi9nLCBpbmxpbmUkMS5fcHVuY3R1YXRpb24pLmdldFJlZ2V4KCk7IC8vIHNlcXVlbmNlcyBlbSBzaG91bGQgc2tpcCBvdmVyIFt0aXRsZV0obGluayksIGBjb2RlYCwgPGh0bWw+XG5cbiAgaW5saW5lJDEuYmxvY2tTa2lwID0gL1xcW1teXFxdXSo/XFxdXFwoW15cXCldKj9cXCl8YFteYF0qP2B8PFtePl0qPz4vZztcbiAgaW5saW5lJDEuZXNjYXBlZEVtU3QgPSAvXFxcXFxcKnxcXFxcXy9nO1xuICBpbmxpbmUkMS5fY29tbWVudCA9IGVkaXQoYmxvY2skMS5fY29tbWVudCkucmVwbGFjZSgnKD86LS0+fCQpJywgJy0tPicpLmdldFJlZ2V4KCk7XG4gIGlubGluZSQxLmVtU3Ryb25nLmxEZWxpbSA9IGVkaXQoaW5saW5lJDEuZW1TdHJvbmcubERlbGltKS5yZXBsYWNlKC9wdW5jdC9nLCBpbmxpbmUkMS5fcHVuY3R1YXRpb24pLmdldFJlZ2V4KCk7XG4gIGlubGluZSQxLmVtU3Ryb25nLnJEZWxpbUFzdCA9IGVkaXQoaW5saW5lJDEuZW1TdHJvbmcuckRlbGltQXN0LCAnZycpLnJlcGxhY2UoL3B1bmN0L2csIGlubGluZSQxLl9wdW5jdHVhdGlvbikuZ2V0UmVnZXgoKTtcbiAgaW5saW5lJDEuZW1TdHJvbmcuckRlbGltVW5kID0gZWRpdChpbmxpbmUkMS5lbVN0cm9uZy5yRGVsaW1VbmQsICdnJykucmVwbGFjZSgvcHVuY3QvZywgaW5saW5lJDEuX3B1bmN0dWF0aW9uKS5nZXRSZWdleCgpO1xuICBpbmxpbmUkMS5fZXNjYXBlcyA9IC9cXFxcKFshXCIjJCUmJygpKissXFwtLi86Ozw9Pj9AXFxbXFxdXFxcXF5fYHt8fX5dKS9nO1xuICBpbmxpbmUkMS5fc2NoZW1lID0gL1thLXpBLVpdW2EtekEtWjAtOSsuLV17MSwzMX0vO1xuICBpbmxpbmUkMS5fZW1haWwgPSAvW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXSsoQClbYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8oPzpcXC5bYS16QS1aMC05XSg/OlthLXpBLVowLTktXXswLDYxfVthLXpBLVowLTldKT8pKyg/IVstX10pLztcbiAgaW5saW5lJDEuYXV0b2xpbmsgPSBlZGl0KGlubGluZSQxLmF1dG9saW5rKS5yZXBsYWNlKCdzY2hlbWUnLCBpbmxpbmUkMS5fc2NoZW1lKS5yZXBsYWNlKCdlbWFpbCcsIGlubGluZSQxLl9lbWFpbCkuZ2V0UmVnZXgoKTtcbiAgaW5saW5lJDEuX2F0dHJpYnV0ZSA9IC9cXHMrW2EtekEtWjpfXVtcXHcuOi1dKig/Olxccyo9XFxzKlwiW15cIl0qXCJ8XFxzKj1cXHMqJ1teJ10qJ3xcXHMqPVxccypbXlxcc1wiJz08PmBdKyk/LztcbiAgaW5saW5lJDEudGFnID0gZWRpdChpbmxpbmUkMS50YWcpLnJlcGxhY2UoJ2NvbW1lbnQnLCBpbmxpbmUkMS5fY29tbWVudCkucmVwbGFjZSgnYXR0cmlidXRlJywgaW5saW5lJDEuX2F0dHJpYnV0ZSkuZ2V0UmVnZXgoKTtcbiAgaW5saW5lJDEuX2xhYmVsID0gLyg/OlxcWyg/OlxcXFwufFteXFxbXFxdXFxcXF0pKlxcXXxcXFxcLnxgW15gXSpgfFteXFxbXFxdXFxcXGBdKSo/LztcbiAgaW5saW5lJDEuX2hyZWYgPSAvPCg/OlxcXFwufFteXFxuPD5cXFxcXSkrPnxbXlxcc1xceDAwLVxceDFmXSovO1xuICBpbmxpbmUkMS5fdGl0bGUgPSAvXCIoPzpcXFxcXCI/fFteXCJcXFxcXSkqXCJ8Jyg/OlxcXFwnP3xbXidcXFxcXSkqJ3xcXCgoPzpcXFxcXFwpP3xbXilcXFxcXSkqXFwpLztcbiAgaW5saW5lJDEubGluayA9IGVkaXQoaW5saW5lJDEubGluaykucmVwbGFjZSgnbGFiZWwnLCBpbmxpbmUkMS5fbGFiZWwpLnJlcGxhY2UoJ2hyZWYnLCBpbmxpbmUkMS5faHJlZikucmVwbGFjZSgndGl0bGUnLCBpbmxpbmUkMS5fdGl0bGUpLmdldFJlZ2V4KCk7XG4gIGlubGluZSQxLnJlZmxpbmsgPSBlZGl0KGlubGluZSQxLnJlZmxpbmspLnJlcGxhY2UoJ2xhYmVsJywgaW5saW5lJDEuX2xhYmVsKS5nZXRSZWdleCgpO1xuICBpbmxpbmUkMS5yZWZsaW5rU2VhcmNoID0gZWRpdChpbmxpbmUkMS5yZWZsaW5rU2VhcmNoLCAnZycpLnJlcGxhY2UoJ3JlZmxpbmsnLCBpbmxpbmUkMS5yZWZsaW5rKS5yZXBsYWNlKCdub2xpbmsnLCBpbmxpbmUkMS5ub2xpbmspLmdldFJlZ2V4KCk7XG4gIC8qKlxuICAgKiBOb3JtYWwgSW5saW5lIEdyYW1tYXJcbiAgICovXG5cbiAgaW5saW5lJDEubm9ybWFsID0gbWVyZ2UkMSh7fSwgaW5saW5lJDEpO1xuICAvKipcbiAgICogUGVkYW50aWMgSW5saW5lIEdyYW1tYXJcbiAgICovXG5cbiAgaW5saW5lJDEucGVkYW50aWMgPSBtZXJnZSQxKHt9LCBpbmxpbmUkMS5ub3JtYWwsIHtcbiAgICBzdHJvbmc6IHtcbiAgICAgIHN0YXJ0OiAvXl9ffFxcKlxcKi8sXG4gICAgICBtaWRkbGU6IC9eX18oPz1cXFMpKFtcXHNcXFNdKj9cXFMpX18oPyFfKXxeXFwqXFwqKD89XFxTKShbXFxzXFxTXSo/XFxTKVxcKlxcKig/IVxcKikvLFxuICAgICAgZW5kQXN0OiAvXFwqXFwqKD8hXFwqKS9nLFxuICAgICAgZW5kVW5kOiAvX18oPyFfKS9nXG4gICAgfSxcbiAgICBlbToge1xuICAgICAgc3RhcnQ6IC9eX3xcXCovLFxuICAgICAgbWlkZGxlOiAvXigpXFwqKD89XFxTKShbXFxzXFxTXSo/XFxTKVxcKig/IVxcKil8Xl8oPz1cXFMpKFtcXHNcXFNdKj9cXFMpXyg/IV8pLyxcbiAgICAgIGVuZEFzdDogL1xcKig/IVxcKikvZyxcbiAgICAgIGVuZFVuZDogL18oPyFfKS9nXG4gICAgfSxcbiAgICBsaW5rOiBlZGl0KC9eIT9cXFsobGFiZWwpXFxdXFwoKC4qPylcXCkvKS5yZXBsYWNlKCdsYWJlbCcsIGlubGluZSQxLl9sYWJlbCkuZ2V0UmVnZXgoKSxcbiAgICByZWZsaW5rOiBlZGl0KC9eIT9cXFsobGFiZWwpXFxdXFxzKlxcWyhbXlxcXV0qKVxcXS8pLnJlcGxhY2UoJ2xhYmVsJywgaW5saW5lJDEuX2xhYmVsKS5nZXRSZWdleCgpXG4gIH0pO1xuICAvKipcbiAgICogR0ZNIElubGluZSBHcmFtbWFyXG4gICAqL1xuXG4gIGlubGluZSQxLmdmbSA9IG1lcmdlJDEoe30sIGlubGluZSQxLm5vcm1hbCwge1xuICAgIGVzY2FwZTogZWRpdChpbmxpbmUkMS5lc2NhcGUpLnJlcGxhY2UoJ10pJywgJ358XSknKS5nZXRSZWdleCgpLFxuICAgIF9leHRlbmRlZF9lbWFpbDogL1tBLVphLXowLTkuXystXSsoQClbYS16QS1aMC05LV9dKyg/OlxcLlthLXpBLVowLTktX10qW2EtekEtWjAtOV0pKyg/IVstX10pLyxcbiAgICB1cmw6IC9eKCg/OmZ0cHxodHRwcz8pOlxcL1xcL3x3d3dcXC4pKD86W2EtekEtWjAtOVxcLV0rXFwuPykrW15cXHM8XSp8XmVtYWlsLyxcbiAgICBfYmFja3BlZGFsOiAvKD86W14/IS4sOjsqX34oKSZdK3xcXChbXildKlxcKXwmKD8hW2EtekEtWjAtOV0rOyQpfFs/IS4sOjsqX34pXSsoPyEkKSkrLyxcbiAgICBkZWw6IC9eKH5+PykoPz1bXlxcc35dKShbXFxzXFxTXSo/W15cXHN+XSlcXDEoPz1bXn5dfCQpLyxcbiAgICB0ZXh0OiAvXihbYH5dK3xbXmB+XSkoPzooPz0gezIsfVxcbil8KD89W2EtekEtWjAtOS4hIyQlJicqK1xcLz0/X2B7XFx8fX4tXStAKXxbXFxzXFxTXSo/KD86KD89W1xcXFw8IVxcW2Aqfl9dfFxcYl98aHR0cHM/OlxcL1xcL3xmdHA6XFwvXFwvfHd3d1xcLnwkKXxbXiBdKD89IHsyLH1cXG4pfFteYS16QS1aMC05LiEjJCUmJyorXFwvPT9fYHtcXHx9fi1dKD89W2EtekEtWjAtOS4hIyQlJicqK1xcLz0/X2B7XFx8fX4tXStAKSkpL1xuICB9KTtcbiAgaW5saW5lJDEuZ2ZtLnVybCA9IGVkaXQoaW5saW5lJDEuZ2ZtLnVybCwgJ2knKS5yZXBsYWNlKCdlbWFpbCcsIGlubGluZSQxLmdmbS5fZXh0ZW5kZWRfZW1haWwpLmdldFJlZ2V4KCk7XG4gIC8qKlxuICAgKiBHRk0gKyBMaW5lIEJyZWFrcyBJbmxpbmUgR3JhbW1hclxuICAgKi9cblxuICBpbmxpbmUkMS5icmVha3MgPSBtZXJnZSQxKHt9LCBpbmxpbmUkMS5nZm0sIHtcbiAgICBicjogZWRpdChpbmxpbmUkMS5icikucmVwbGFjZSgnezIsfScsICcqJykuZ2V0UmVnZXgoKSxcbiAgICB0ZXh0OiBlZGl0KGlubGluZSQxLmdmbS50ZXh0KS5yZXBsYWNlKCdcXFxcYl8nLCAnXFxcXGJffCB7Mix9XFxcXG4nKS5yZXBsYWNlKC9cXHsyLFxcfS9nLCAnKicpLmdldFJlZ2V4KClcbiAgfSk7XG4gIHZhciBydWxlcyA9IHtcbiAgICBibG9jazogYmxvY2skMSxcbiAgICBpbmxpbmU6IGlubGluZSQxXG4gIH07XG5cbiAgdmFyIFRva2VuaXplciQxID0gVG9rZW5pemVyXzE7XG4gIHZhciBkZWZhdWx0cyQzID0gZGVmYXVsdHMkNS5leHBvcnRzLmRlZmF1bHRzO1xuICB2YXIgYmxvY2sgPSBydWxlcy5ibG9jayxcbiAgICAgIGlubGluZSA9IHJ1bGVzLmlubGluZTtcbiAgdmFyIHJlcGVhdFN0cmluZyA9IGhlbHBlcnMucmVwZWF0U3RyaW5nO1xuICAvKipcbiAgICogc21hcnR5cGFudHMgdGV4dCByZXBsYWNlbWVudFxuICAgKi9cblxuICBmdW5jdGlvbiBzbWFydHlwYW50cyh0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHQgLy8gZW0tZGFzaGVzXG4gICAgLnJlcGxhY2UoLy0tLS9nLCBcIlxcdTIwMTRcIikgLy8gZW4tZGFzaGVzXG4gICAgLnJlcGxhY2UoLy0tL2csIFwiXFx1MjAxM1wiKSAvLyBvcGVuaW5nIHNpbmdsZXNcbiAgICAucmVwbGFjZSgvKF58Wy1cXHUyMDE0LyhcXFt7XCJcXHNdKScvZywgXCIkMVxcdTIwMThcIikgLy8gY2xvc2luZyBzaW5nbGVzICYgYXBvc3Ryb3BoZXNcbiAgICAucmVwbGFjZSgvJy9nLCBcIlxcdTIwMTlcIikgLy8gb3BlbmluZyBkb3VibGVzXG4gICAgLnJlcGxhY2UoLyhefFstXFx1MjAxNC8oXFxbe1xcdTIwMThcXHNdKVwiL2csIFwiJDFcXHUyMDFDXCIpIC8vIGNsb3NpbmcgZG91Ymxlc1xuICAgIC5yZXBsYWNlKC9cIi9nLCBcIlxcdTIwMURcIikgLy8gZWxsaXBzZXNcbiAgICAucmVwbGFjZSgvXFwuezN9L2csIFwiXFx1MjAyNlwiKTtcbiAgfVxuICAvKipcbiAgICogbWFuZ2xlIGVtYWlsIGFkZHJlc3Nlc1xuICAgKi9cblxuXG4gIGZ1bmN0aW9uIG1hbmdsZSh0ZXh0KSB7XG4gICAgdmFyIG91dCA9ICcnLFxuICAgICAgICBpLFxuICAgICAgICBjaDtcbiAgICB2YXIgbCA9IHRleHQubGVuZ3RoO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgY2ggPSB0ZXh0LmNoYXJDb2RlQXQoaSk7XG5cbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC41KSB7XG4gICAgICAgIGNoID0gJ3gnICsgY2gudG9TdHJpbmcoMTYpO1xuICAgICAgfVxuXG4gICAgICBvdXQgKz0gJyYjJyArIGNoICsgJzsnO1xuICAgIH1cblxuICAgIHJldHVybiBvdXQ7XG4gIH1cbiAgLyoqXG4gICAqIEJsb2NrIExleGVyXG4gICAqL1xuXG5cbiAgdmFyIExleGVyXzEgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIExleGVyKG9wdGlvbnMpIHtcbiAgICAgIHRoaXMudG9rZW5zID0gW107XG4gICAgICB0aGlzLnRva2Vucy5saW5rcyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IGRlZmF1bHRzJDM7XG4gICAgICB0aGlzLm9wdGlvbnMudG9rZW5pemVyID0gdGhpcy5vcHRpb25zLnRva2VuaXplciB8fCBuZXcgVG9rZW5pemVyJDEoKTtcbiAgICAgIHRoaXMudG9rZW5pemVyID0gdGhpcy5vcHRpb25zLnRva2VuaXplcjtcbiAgICAgIHRoaXMudG9rZW5pemVyLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLnRva2VuaXplci5sZXhlciA9IHRoaXM7XG4gICAgICB0aGlzLmlubGluZVF1ZXVlID0gW107XG4gICAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgICBpbkxpbms6IGZhbHNlLFxuICAgICAgICBpblJhd0Jsb2NrOiBmYWxzZSxcbiAgICAgICAgdG9wOiB0cnVlXG4gICAgICB9O1xuICAgICAgdmFyIHJ1bGVzID0ge1xuICAgICAgICBibG9jazogYmxvY2subm9ybWFsLFxuICAgICAgICBpbmxpbmU6IGlubGluZS5ub3JtYWxcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICAgICAgcnVsZXMuYmxvY2sgPSBibG9jay5wZWRhbnRpYztcbiAgICAgICAgcnVsZXMuaW5saW5lID0gaW5saW5lLnBlZGFudGljO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgICAgIHJ1bGVzLmJsb2NrID0gYmxvY2suZ2ZtO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuYnJlYWtzKSB7XG4gICAgICAgICAgcnVsZXMuaW5saW5lID0gaW5saW5lLmJyZWFrcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBydWxlcy5pbmxpbmUgPSBpbmxpbmUuZ2ZtO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMudG9rZW5pemVyLnJ1bGVzID0gcnVsZXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBSdWxlc1xuICAgICAqL1xuXG5cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgTGV4IE1ldGhvZFxuICAgICAqL1xuICAgIExleGVyLmxleCA9IGZ1bmN0aW9uIGxleChzcmMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBsZXhlciA9IG5ldyBMZXhlcihvcHRpb25zKTtcbiAgICAgIHJldHVybiBsZXhlci5sZXgoc3JjKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhdGljIExleCBJbmxpbmUgTWV0aG9kXG4gICAgICovXG4gICAgO1xuXG4gICAgTGV4ZXIubGV4SW5saW5lID0gZnVuY3Rpb24gbGV4SW5saW5lKHNyYywgb3B0aW9ucykge1xuICAgICAgdmFyIGxleGVyID0gbmV3IExleGVyKG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIGxleGVyLmlubGluZVRva2VucyhzcmMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQcmVwcm9jZXNzaW5nXG4gICAgICovXG4gICAgO1xuXG4gICAgdmFyIF9wcm90byA9IExleGVyLnByb3RvdHlwZTtcblxuICAgIF9wcm90by5sZXggPSBmdW5jdGlvbiBsZXgoc3JjKSB7XG4gICAgICBzcmMgPSBzcmMucmVwbGFjZSgvXFxyXFxufFxcci9nLCAnXFxuJykucmVwbGFjZSgvXFx0L2csICcgICAgJyk7XG4gICAgICB0aGlzLmJsb2NrVG9rZW5zKHNyYywgdGhpcy50b2tlbnMpO1xuICAgICAgdmFyIG5leHQ7XG5cbiAgICAgIHdoaWxlIChuZXh0ID0gdGhpcy5pbmxpbmVRdWV1ZS5zaGlmdCgpKSB7XG4gICAgICAgIHRoaXMuaW5saW5lVG9rZW5zKG5leHQuc3JjLCBuZXh0LnRva2Vucyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnRva2VucztcbiAgICB9XG4gICAgLyoqXG4gICAgICogTGV4aW5nXG4gICAgICovXG4gICAgO1xuXG4gICAgX3Byb3RvLmJsb2NrVG9rZW5zID0gZnVuY3Rpb24gYmxvY2tUb2tlbnMoc3JjLCB0b2tlbnMpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIGlmICh0b2tlbnMgPT09IHZvaWQgMCkge1xuICAgICAgICB0b2tlbnMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgICBzcmMgPSBzcmMucmVwbGFjZSgvXiArJC9nbSwgJycpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG9rZW4sIGxhc3RUb2tlbiwgY3V0U3JjLCBsYXN0UGFyYWdyYXBoQ2xpcHBlZDtcblxuICAgICAgd2hpbGUgKHNyYykge1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmV4dGVuc2lvbnMgJiYgdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMuYmxvY2sgJiYgdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMuYmxvY2suc29tZShmdW5jdGlvbiAoZXh0VG9rZW5pemVyKSB7XG4gICAgICAgICAgaWYgKHRva2VuID0gZXh0VG9rZW5pemVyLmNhbGwoe1xuICAgICAgICAgICAgbGV4ZXI6IF90aGlzXG4gICAgICAgICAgfSwgc3JjLCB0b2tlbnMpKSB7XG4gICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIG5ld2xpbmVcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnNwYWNlKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuXG4gICAgICAgICAgaWYgKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBjb2RlXG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5jb2RlKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIGxhc3RUb2tlbiA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07IC8vIEFuIGluZGVudGVkIGNvZGUgYmxvY2sgY2Fubm90IGludGVycnVwdCBhIHBhcmFncmFwaC5cblxuICAgICAgICAgIGlmIChsYXN0VG9rZW4gJiYgKGxhc3RUb2tlbi50eXBlID09PSAncGFyYWdyYXBoJyB8fCBsYXN0VG9rZW4udHlwZSA9PT0gJ3RleHQnKSkge1xuICAgICAgICAgICAgbGFzdFRva2VuLnJhdyArPSAnXFxuJyArIHRva2VuLnJhdztcbiAgICAgICAgICAgIGxhc3RUb2tlbi50ZXh0ICs9ICdcXG4nICsgdG9rZW4udGV4dDtcbiAgICAgICAgICAgIHRoaXMuaW5saW5lUXVldWVbdGhpcy5pbmxpbmVRdWV1ZS5sZW5ndGggLSAxXS5zcmMgPSBsYXN0VG9rZW4udGV4dDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIGZlbmNlc1xuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuZmVuY2VzKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBoZWFkaW5nXG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5oZWFkaW5nKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBoclxuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuaHIoc3JjKSkge1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIGJsb2NrcXVvdGVcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmJsb2NrcXVvdGUoc3JjKSkge1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIGxpc3RcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmxpc3Qoc3JjKSkge1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIGh0bWxcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmh0bWwoc3JjKSkge1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIGRlZlxuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuZGVmKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIGxhc3RUb2tlbiA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICBpZiAobGFzdFRva2VuICYmIChsYXN0VG9rZW4udHlwZSA9PT0gJ3BhcmFncmFwaCcgfHwgbGFzdFRva2VuLnR5cGUgPT09ICd0ZXh0JykpIHtcbiAgICAgICAgICAgIGxhc3RUb2tlbi5yYXcgKz0gJ1xcbicgKyB0b2tlbi5yYXc7XG4gICAgICAgICAgICBsYXN0VG9rZW4udGV4dCArPSAnXFxuJyArIHRva2VuLnJhdztcbiAgICAgICAgICAgIHRoaXMuaW5saW5lUXVldWVbdGhpcy5pbmxpbmVRdWV1ZS5sZW5ndGggLSAxXS5zcmMgPSBsYXN0VG9rZW4udGV4dDtcbiAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLnRva2Vucy5saW5rc1t0b2tlbi50YWddKSB7XG4gICAgICAgICAgICB0aGlzLnRva2Vucy5saW5rc1t0b2tlbi50YWddID0ge1xuICAgICAgICAgICAgICBocmVmOiB0b2tlbi5ocmVmLFxuICAgICAgICAgICAgICB0aXRsZTogdG9rZW4udGl0bGVcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gdGFibGUgKGdmbSlcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnRhYmxlKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBsaGVhZGluZ1xuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIubGhlYWRpbmcoc3JjKSkge1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIHRvcC1sZXZlbCBwYXJhZ3JhcGhcbiAgICAgICAgLy8gcHJldmVudCBwYXJhZ3JhcGggY29uc3VtaW5nIGV4dGVuc2lvbnMgYnkgY2xpcHBpbmcgJ3NyYycgdG8gZXh0ZW5zaW9uIHN0YXJ0XG5cblxuICAgICAgICBjdXRTcmMgPSBzcmM7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5leHRlbnNpb25zICYmIHRoaXMub3B0aW9ucy5leHRlbnNpb25zLnN0YXJ0QmxvY2spIHtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHN0YXJ0SW5kZXggPSBJbmZpbml0eTtcbiAgICAgICAgICAgIHZhciB0ZW1wU3JjID0gc3JjLnNsaWNlKDEpO1xuICAgICAgICAgICAgdmFyIHRlbXBTdGFydCA9IHZvaWQgMDtcblxuICAgICAgICAgICAgX3RoaXMub3B0aW9ucy5leHRlbnNpb25zLnN0YXJ0QmxvY2suZm9yRWFjaChmdW5jdGlvbiAoZ2V0U3RhcnRJbmRleCkge1xuICAgICAgICAgICAgICB0ZW1wU3RhcnQgPSBnZXRTdGFydEluZGV4LmNhbGwoe1xuICAgICAgICAgICAgICAgIGxleGVyOiB0aGlzXG4gICAgICAgICAgICAgIH0sIHRlbXBTcmMpO1xuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgdGVtcFN0YXJ0ID09PSAnbnVtYmVyJyAmJiB0ZW1wU3RhcnQgPj0gMCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBNYXRoLm1pbihzdGFydEluZGV4LCB0ZW1wU3RhcnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0SW5kZXggPCBJbmZpbml0eSAmJiBzdGFydEluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgY3V0U3JjID0gc3JjLnN1YnN0cmluZygwLCBzdGFydEluZGV4ICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnRvcCAmJiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5wYXJhZ3JhcGgoY3V0U3JjKSkpIHtcbiAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgaWYgKGxhc3RQYXJhZ3JhcGhDbGlwcGVkICYmIGxhc3RUb2tlbi50eXBlID09PSAncGFyYWdyYXBoJykge1xuICAgICAgICAgICAgbGFzdFRva2VuLnJhdyArPSAnXFxuJyArIHRva2VuLnJhdztcbiAgICAgICAgICAgIGxhc3RUb2tlbi50ZXh0ICs9ICdcXG4nICsgdG9rZW4udGV4dDtcbiAgICAgICAgICAgIHRoaXMuaW5saW5lUXVldWUucG9wKCk7XG4gICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlW3RoaXMuaW5saW5lUXVldWUubGVuZ3RoIC0gMV0uc3JjID0gbGFzdFRva2VuLnRleHQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsYXN0UGFyYWdyYXBoQ2xpcHBlZCA9IGN1dFNyYy5sZW5ndGggIT09IHNyYy5sZW5ndGg7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyB0ZXh0XG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci50ZXh0KHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIGxhc3RUb2tlbiA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICBpZiAobGFzdFRva2VuICYmIGxhc3RUb2tlbi50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGxhc3RUb2tlbi5yYXcgKz0gJ1xcbicgKyB0b2tlbi5yYXc7XG4gICAgICAgICAgICBsYXN0VG9rZW4udGV4dCArPSAnXFxuJyArIHRva2VuLnRleHQ7XG4gICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlLnBvcCgpO1xuICAgICAgICAgICAgdGhpcy5pbmxpbmVRdWV1ZVt0aGlzLmlubGluZVF1ZXVlLmxlbmd0aCAtIDFdLnNyYyA9IGxhc3RUb2tlbi50ZXh0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc3JjKSB7XG4gICAgICAgICAgdmFyIGVyck1zZyA9ICdJbmZpbml0ZSBsb29wIG9uIGJ5dGU6ICcgKyBzcmMuY2hhckNvZGVBdCgwKTtcblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVyck1zZyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhdGUudG9wID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0b2tlbnM7XG4gICAgfTtcblxuICAgIF9wcm90by5pbmxpbmUgPSBmdW5jdGlvbiBpbmxpbmUoc3JjLCB0b2tlbnMpIHtcbiAgICAgIHRoaXMuaW5saW5lUXVldWUucHVzaCh7XG4gICAgICAgIHNyYzogc3JjLFxuICAgICAgICB0b2tlbnM6IHRva2Vuc1xuICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExleGluZy9Db21waWxpbmdcbiAgICAgKi9cbiAgICA7XG5cbiAgICBfcHJvdG8uaW5saW5lVG9rZW5zID0gZnVuY3Rpb24gaW5saW5lVG9rZW5zKHNyYywgdG9rZW5zKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgaWYgKHRva2VucyA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHRva2VucyA9IFtdO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG9rZW4sIGxhc3RUb2tlbiwgY3V0U3JjOyAvLyBTdHJpbmcgd2l0aCBsaW5rcyBtYXNrZWQgdG8gYXZvaWQgaW50ZXJmZXJlbmNlIHdpdGggZW0gYW5kIHN0cm9uZ1xuXG4gICAgICB2YXIgbWFza2VkU3JjID0gc3JjO1xuICAgICAgdmFyIG1hdGNoO1xuICAgICAgdmFyIGtlZXBQcmV2Q2hhciwgcHJldkNoYXI7IC8vIE1hc2sgb3V0IHJlZmxpbmtzXG5cbiAgICAgIGlmICh0aGlzLnRva2Vucy5saW5rcykge1xuICAgICAgICB2YXIgbGlua3MgPSBPYmplY3Qua2V5cyh0aGlzLnRva2Vucy5saW5rcyk7XG5cbiAgICAgICAgaWYgKGxpbmtzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB3aGlsZSAoKG1hdGNoID0gdGhpcy50b2tlbml6ZXIucnVsZXMuaW5saW5lLnJlZmxpbmtTZWFyY2guZXhlYyhtYXNrZWRTcmMpKSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAobGlua3MuaW5jbHVkZXMobWF0Y2hbMF0uc2xpY2UobWF0Y2hbMF0ubGFzdEluZGV4T2YoJ1snKSArIDEsIC0xKSkpIHtcbiAgICAgICAgICAgICAgbWFza2VkU3JjID0gbWFza2VkU3JjLnNsaWNlKDAsIG1hdGNoLmluZGV4KSArICdbJyArIHJlcGVhdFN0cmluZygnYScsIG1hdGNoWzBdLmxlbmd0aCAtIDIpICsgJ10nICsgbWFza2VkU3JjLnNsaWNlKHRoaXMudG9rZW5pemVyLnJ1bGVzLmlubGluZS5yZWZsaW5rU2VhcmNoLmxhc3RJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IC8vIE1hc2sgb3V0IG90aGVyIGJsb2Nrc1xuXG5cbiAgICAgIHdoaWxlICgobWF0Y2ggPSB0aGlzLnRva2VuaXplci5ydWxlcy5pbmxpbmUuYmxvY2tTa2lwLmV4ZWMobWFza2VkU3JjKSkgIT0gbnVsbCkge1xuICAgICAgICBtYXNrZWRTcmMgPSBtYXNrZWRTcmMuc2xpY2UoMCwgbWF0Y2guaW5kZXgpICsgJ1snICsgcmVwZWF0U3RyaW5nKCdhJywgbWF0Y2hbMF0ubGVuZ3RoIC0gMikgKyAnXScgKyBtYXNrZWRTcmMuc2xpY2UodGhpcy50b2tlbml6ZXIucnVsZXMuaW5saW5lLmJsb2NrU2tpcC5sYXN0SW5kZXgpO1xuICAgICAgfSAvLyBNYXNrIG91dCBlc2NhcGVkIGVtICYgc3Ryb25nIGRlbGltaXRlcnNcblxuXG4gICAgICB3aGlsZSAoKG1hdGNoID0gdGhpcy50b2tlbml6ZXIucnVsZXMuaW5saW5lLmVzY2FwZWRFbVN0LmV4ZWMobWFza2VkU3JjKSkgIT0gbnVsbCkge1xuICAgICAgICBtYXNrZWRTcmMgPSBtYXNrZWRTcmMuc2xpY2UoMCwgbWF0Y2guaW5kZXgpICsgJysrJyArIG1hc2tlZFNyYy5zbGljZSh0aGlzLnRva2VuaXplci5ydWxlcy5pbmxpbmUuZXNjYXBlZEVtU3QubGFzdEluZGV4KTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHNyYykge1xuICAgICAgICBpZiAoIWtlZXBQcmV2Q2hhcikge1xuICAgICAgICAgIHByZXZDaGFyID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBrZWVwUHJldkNoYXIgPSBmYWxzZTsgLy8gZXh0ZW5zaW9uc1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucyAmJiB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucy5pbmxpbmUgJiYgdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMuaW5saW5lLnNvbWUoZnVuY3Rpb24gKGV4dFRva2VuaXplcikge1xuICAgICAgICAgIGlmICh0b2tlbiA9IGV4dFRva2VuaXplci5jYWxsKHtcbiAgICAgICAgICAgIGxleGVyOiBfdGhpczJcbiAgICAgICAgICB9LCBzcmMsIHRva2VucykpIHtcbiAgICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0pKSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gZXNjYXBlXG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5lc2NhcGUoc3JjKSkge1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIHRhZ1xuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIudGFnKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIGxhc3RUb2tlbiA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICBpZiAobGFzdFRva2VuICYmIHRva2VuLnR5cGUgPT09ICd0ZXh0JyAmJiBsYXN0VG9rZW4udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBsYXN0VG9rZW4ucmF3ICs9IHRva2VuLnJhdztcbiAgICAgICAgICAgIGxhc3RUb2tlbi50ZXh0ICs9IHRva2VuLnRleHQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBsaW5rXG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5saW5rKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyByZWZsaW5rLCBub2xpbmtcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnJlZmxpbmsoc3JjLCB0aGlzLnRva2Vucy5saW5rcykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIGxhc3RUb2tlbiA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICBpZiAobGFzdFRva2VuICYmIHRva2VuLnR5cGUgPT09ICd0ZXh0JyAmJiBsYXN0VG9rZW4udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBsYXN0VG9rZW4ucmF3ICs9IHRva2VuLnJhdztcbiAgICAgICAgICAgIGxhc3RUb2tlbi50ZXh0ICs9IHRva2VuLnRleHQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBlbSAmIHN0cm9uZ1xuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuZW1TdHJvbmcoc3JjLCBtYXNrZWRTcmMsIHByZXZDaGFyKSkge1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIGNvZGVcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmNvZGVzcGFuKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBiclxuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuYnIoc3JjKSkge1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIGRlbCAoZ2ZtKVxuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuZGVsKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBhdXRvbGlua1xuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuYXV0b2xpbmsoc3JjLCBtYW5nbGUpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gdXJsIChnZm0pXG5cblxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaW5MaW5rICYmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnVybChzcmMsIG1hbmdsZSkpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gdGV4dFxuICAgICAgICAvLyBwcmV2ZW50IGlubGluZVRleHQgY29uc3VtaW5nIGV4dGVuc2lvbnMgYnkgY2xpcHBpbmcgJ3NyYycgdG8gZXh0ZW5zaW9uIHN0YXJ0XG5cblxuICAgICAgICBjdXRTcmMgPSBzcmM7XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5leHRlbnNpb25zICYmIHRoaXMub3B0aW9ucy5leHRlbnNpb25zLnN0YXJ0SW5saW5lKSB7XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzdGFydEluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgICAgICB2YXIgdGVtcFNyYyA9IHNyYy5zbGljZSgxKTtcbiAgICAgICAgICAgIHZhciB0ZW1wU3RhcnQgPSB2b2lkIDA7XG5cbiAgICAgICAgICAgIF90aGlzMi5vcHRpb25zLmV4dGVuc2lvbnMuc3RhcnRJbmxpbmUuZm9yRWFjaChmdW5jdGlvbiAoZ2V0U3RhcnRJbmRleCkge1xuICAgICAgICAgICAgICB0ZW1wU3RhcnQgPSBnZXRTdGFydEluZGV4LmNhbGwoe1xuICAgICAgICAgICAgICAgIGxleGVyOiB0aGlzXG4gICAgICAgICAgICAgIH0sIHRlbXBTcmMpO1xuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgdGVtcFN0YXJ0ID09PSAnbnVtYmVyJyAmJiB0ZW1wU3RhcnQgPj0gMCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0SW5kZXggPSBNYXRoLm1pbihzdGFydEluZGV4LCB0ZW1wU3RhcnQpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0SW5kZXggPCBJbmZpbml0eSAmJiBzdGFydEluZGV4ID49IDApIHtcbiAgICAgICAgICAgICAgY3V0U3JjID0gc3JjLnN1YnN0cmluZygwLCBzdGFydEluZGV4ICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmlubGluZVRleHQoY3V0U3JjLCBzbWFydHlwYW50cykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuXG4gICAgICAgICAgaWYgKHRva2VuLnJhdy5zbGljZSgtMSkgIT09ICdfJykge1xuICAgICAgICAgICAgLy8gVHJhY2sgcHJldkNoYXIgYmVmb3JlIHN0cmluZyBvZiBfX19fIHN0YXJ0ZWRcbiAgICAgICAgICAgIHByZXZDaGFyID0gdG9rZW4ucmF3LnNsaWNlKC0xKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBrZWVwUHJldkNoYXIgPSB0cnVlO1xuICAgICAgICAgIGxhc3RUb2tlbiA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07XG5cbiAgICAgICAgICBpZiAobGFzdFRva2VuICYmIGxhc3RUb2tlbi50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgIGxhc3RUb2tlbi5yYXcgKz0gdG9rZW4ucmF3O1xuICAgICAgICAgICAgbGFzdFRva2VuLnRleHQgKz0gdG9rZW4udGV4dDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNyYykge1xuICAgICAgICAgIHZhciBlcnJNc2cgPSAnSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgc3JjLmNoYXJDb2RlQXQoMCk7XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJNc2cpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH07XG5cbiAgICBfY3JlYXRlQ2xhc3MoTGV4ZXIsIG51bGwsIFt7XG4gICAgICBrZXk6IFwicnVsZXNcIixcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGJsb2NrOiBibG9jayxcbiAgICAgICAgICBpbmxpbmU6IGlubGluZVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1dKTtcblxuICAgIHJldHVybiBMZXhlcjtcbiAgfSgpO1xuXG4gIHZhciBkZWZhdWx0cyQyID0gZGVmYXVsdHMkNS5leHBvcnRzLmRlZmF1bHRzO1xuICB2YXIgY2xlYW5VcmwgPSBoZWxwZXJzLmNsZWFuVXJsLFxuICAgICAgZXNjYXBlJDEgPSBoZWxwZXJzLmVzY2FwZTtcbiAgLyoqXG4gICAqIFJlbmRlcmVyXG4gICAqL1xuXG4gIHZhciBSZW5kZXJlcl8xID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBSZW5kZXJlcihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IGRlZmF1bHRzJDI7XG4gICAgfVxuXG4gICAgdmFyIF9wcm90byA9IFJlbmRlcmVyLnByb3RvdHlwZTtcblxuICAgIF9wcm90by5jb2RlID0gZnVuY3Rpb24gY29kZShfY29kZSwgaW5mb3N0cmluZywgZXNjYXBlZCkge1xuICAgICAgdmFyIGxhbmcgPSAoaW5mb3N0cmluZyB8fCAnJykubWF0Y2goL1xcUyovKVswXTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oaWdobGlnaHQpIHtcbiAgICAgICAgdmFyIG91dCA9IHRoaXMub3B0aW9ucy5oaWdobGlnaHQoX2NvZGUsIGxhbmcpO1xuXG4gICAgICAgIGlmIChvdXQgIT0gbnVsbCAmJiBvdXQgIT09IF9jb2RlKSB7XG4gICAgICAgICAgZXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgX2NvZGUgPSBvdXQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2NvZGUgPSBfY29kZS5yZXBsYWNlKC9cXG4kLywgJycpICsgJ1xcbic7XG5cbiAgICAgIGlmICghbGFuZykge1xuICAgICAgICByZXR1cm4gJzxwcmU+PGNvZGU+JyArIChlc2NhcGVkID8gX2NvZGUgOiBlc2NhcGUkMShfY29kZSwgdHJ1ZSkpICsgJzwvY29kZT48L3ByZT5cXG4nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzxwcmU+PGNvZGUgY2xhc3M9XCInICsgdGhpcy5vcHRpb25zLmxhbmdQcmVmaXggKyBlc2NhcGUkMShsYW5nLCB0cnVlKSArICdcIj4nICsgKGVzY2FwZWQgPyBfY29kZSA6IGVzY2FwZSQxKF9jb2RlLCB0cnVlKSkgKyAnPC9jb2RlPjwvcHJlPlxcbic7XG4gICAgfTtcblxuICAgIF9wcm90by5ibG9ja3F1b3RlID0gZnVuY3Rpb24gYmxvY2txdW90ZShxdW90ZSkge1xuICAgICAgcmV0dXJuICc8YmxvY2txdW90ZT5cXG4nICsgcXVvdGUgKyAnPC9ibG9ja3F1b3RlPlxcbic7XG4gICAgfTtcblxuICAgIF9wcm90by5odG1sID0gZnVuY3Rpb24gaHRtbChfaHRtbCkge1xuICAgICAgcmV0dXJuIF9odG1sO1xuICAgIH07XG5cbiAgICBfcHJvdG8uaGVhZGluZyA9IGZ1bmN0aW9uIGhlYWRpbmcodGV4dCwgbGV2ZWwsIHJhdywgc2x1Z2dlcikge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5oZWFkZXJJZHMpIHtcbiAgICAgICAgcmV0dXJuICc8aCcgKyBsZXZlbCArICcgaWQ9XCInICsgdGhpcy5vcHRpb25zLmhlYWRlclByZWZpeCArIHNsdWdnZXIuc2x1ZyhyYXcpICsgJ1wiPicgKyB0ZXh0ICsgJzwvaCcgKyBsZXZlbCArICc+XFxuJztcbiAgICAgIH0gLy8gaWdub3JlIElEc1xuXG5cbiAgICAgIHJldHVybiAnPGgnICsgbGV2ZWwgKyAnPicgKyB0ZXh0ICsgJzwvaCcgKyBsZXZlbCArICc+XFxuJztcbiAgICB9O1xuXG4gICAgX3Byb3RvLmhyID0gZnVuY3Rpb24gaHIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnhodG1sID8gJzxoci8+XFxuJyA6ICc8aHI+XFxuJztcbiAgICB9O1xuXG4gICAgX3Byb3RvLmxpc3QgPSBmdW5jdGlvbiBsaXN0KGJvZHksIG9yZGVyZWQsIHN0YXJ0KSB7XG4gICAgICB2YXIgdHlwZSA9IG9yZGVyZWQgPyAnb2wnIDogJ3VsJyxcbiAgICAgICAgICBzdGFydGF0dCA9IG9yZGVyZWQgJiYgc3RhcnQgIT09IDEgPyAnIHN0YXJ0PVwiJyArIHN0YXJ0ICsgJ1wiJyA6ICcnO1xuICAgICAgcmV0dXJuICc8JyArIHR5cGUgKyBzdGFydGF0dCArICc+XFxuJyArIGJvZHkgKyAnPC8nICsgdHlwZSArICc+XFxuJztcbiAgICB9O1xuXG4gICAgX3Byb3RvLmxpc3RpdGVtID0gZnVuY3Rpb24gbGlzdGl0ZW0odGV4dCkge1xuICAgICAgcmV0dXJuICc8bGk+JyArIHRleHQgKyAnPC9saT5cXG4nO1xuICAgIH07XG5cbiAgICBfcHJvdG8uY2hlY2tib3ggPSBmdW5jdGlvbiBjaGVja2JveChjaGVja2VkKSB7XG4gICAgICByZXR1cm4gJzxpbnB1dCAnICsgKGNoZWNrZWQgPyAnY2hlY2tlZD1cIlwiICcgOiAnJykgKyAnZGlzYWJsZWQ9XCJcIiB0eXBlPVwiY2hlY2tib3hcIicgKyAodGhpcy5vcHRpb25zLnhodG1sID8gJyAvJyA6ICcnKSArICc+ICc7XG4gICAgfTtcblxuICAgIF9wcm90by5wYXJhZ3JhcGggPSBmdW5jdGlvbiBwYXJhZ3JhcGgodGV4dCkge1xuICAgICAgcmV0dXJuICc8cD4nICsgdGV4dCArICc8L3A+XFxuJztcbiAgICB9O1xuXG4gICAgX3Byb3RvLnRhYmxlID0gZnVuY3Rpb24gdGFibGUoaGVhZGVyLCBib2R5KSB7XG4gICAgICBpZiAoYm9keSkgYm9keSA9ICc8dGJvZHk+JyArIGJvZHkgKyAnPC90Ym9keT4nO1xuICAgICAgcmV0dXJuICc8dGFibGU+XFxuJyArICc8dGhlYWQ+XFxuJyArIGhlYWRlciArICc8L3RoZWFkPlxcbicgKyBib2R5ICsgJzwvdGFibGU+XFxuJztcbiAgICB9O1xuXG4gICAgX3Byb3RvLnRhYmxlcm93ID0gZnVuY3Rpb24gdGFibGVyb3coY29udGVudCkge1xuICAgICAgcmV0dXJuICc8dHI+XFxuJyArIGNvbnRlbnQgKyAnPC90cj5cXG4nO1xuICAgIH07XG5cbiAgICBfcHJvdG8udGFibGVjZWxsID0gZnVuY3Rpb24gdGFibGVjZWxsKGNvbnRlbnQsIGZsYWdzKSB7XG4gICAgICB2YXIgdHlwZSA9IGZsYWdzLmhlYWRlciA/ICd0aCcgOiAndGQnO1xuICAgICAgdmFyIHRhZyA9IGZsYWdzLmFsaWduID8gJzwnICsgdHlwZSArICcgYWxpZ249XCInICsgZmxhZ3MuYWxpZ24gKyAnXCI+JyA6ICc8JyArIHR5cGUgKyAnPic7XG4gICAgICByZXR1cm4gdGFnICsgY29udGVudCArICc8LycgKyB0eXBlICsgJz5cXG4nO1xuICAgIH0gLy8gc3BhbiBsZXZlbCByZW5kZXJlclxuICAgIDtcblxuICAgIF9wcm90by5zdHJvbmcgPSBmdW5jdGlvbiBzdHJvbmcodGV4dCkge1xuICAgICAgcmV0dXJuICc8c3Ryb25nPicgKyB0ZXh0ICsgJzwvc3Ryb25nPic7XG4gICAgfTtcblxuICAgIF9wcm90by5lbSA9IGZ1bmN0aW9uIGVtKHRleHQpIHtcbiAgICAgIHJldHVybiAnPGVtPicgKyB0ZXh0ICsgJzwvZW0+JztcbiAgICB9O1xuXG4gICAgX3Byb3RvLmNvZGVzcGFuID0gZnVuY3Rpb24gY29kZXNwYW4odGV4dCkge1xuICAgICAgcmV0dXJuICc8Y29kZT4nICsgdGV4dCArICc8L2NvZGU+JztcbiAgICB9O1xuXG4gICAgX3Byb3RvLmJyID0gZnVuY3Rpb24gYnIoKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnhodG1sID8gJzxici8+JyA6ICc8YnI+JztcbiAgICB9O1xuXG4gICAgX3Byb3RvLmRlbCA9IGZ1bmN0aW9uIGRlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gJzxkZWw+JyArIHRleHQgKyAnPC9kZWw+JztcbiAgICB9O1xuXG4gICAgX3Byb3RvLmxpbmsgPSBmdW5jdGlvbiBsaW5rKGhyZWYsIHRpdGxlLCB0ZXh0KSB7XG4gICAgICBocmVmID0gY2xlYW5VcmwodGhpcy5vcHRpb25zLnNhbml0aXplLCB0aGlzLm9wdGlvbnMuYmFzZVVybCwgaHJlZik7XG5cbiAgICAgIGlmIChocmVmID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfVxuXG4gICAgICB2YXIgb3V0ID0gJzxhIGhyZWY9XCInICsgZXNjYXBlJDEoaHJlZikgKyAnXCInO1xuXG4gICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgb3V0ICs9ICcgdGl0bGU9XCInICsgdGl0bGUgKyAnXCInO1xuICAgICAgfVxuXG4gICAgICBvdXQgKz0gJz4nICsgdGV4dCArICc8L2E+JztcbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcblxuICAgIF9wcm90by5pbWFnZSA9IGZ1bmN0aW9uIGltYWdlKGhyZWYsIHRpdGxlLCB0ZXh0KSB7XG4gICAgICBocmVmID0gY2xlYW5VcmwodGhpcy5vcHRpb25zLnNhbml0aXplLCB0aGlzLm9wdGlvbnMuYmFzZVVybCwgaHJlZik7XG5cbiAgICAgIGlmIChocmVmID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0ZXh0O1xuICAgICAgfVxuXG4gICAgICB2YXIgb3V0ID0gJzxpbWcgc3JjPVwiJyArIGhyZWYgKyAnXCIgYWx0PVwiJyArIHRleHQgKyAnXCInO1xuXG4gICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgb3V0ICs9ICcgdGl0bGU9XCInICsgdGl0bGUgKyAnXCInO1xuICAgICAgfVxuXG4gICAgICBvdXQgKz0gdGhpcy5vcHRpb25zLnhodG1sID8gJy8+JyA6ICc+JztcbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcblxuICAgIF9wcm90by50ZXh0ID0gZnVuY3Rpb24gdGV4dChfdGV4dCkge1xuICAgICAgcmV0dXJuIF90ZXh0O1xuICAgIH07XG5cbiAgICByZXR1cm4gUmVuZGVyZXI7XG4gIH0oKTtcblxuICAvKipcbiAgICogVGV4dFJlbmRlcmVyXG4gICAqIHJldHVybnMgb25seSB0aGUgdGV4dHVhbCBwYXJ0IG9mIHRoZSB0b2tlblxuICAgKi9cblxuICB2YXIgVGV4dFJlbmRlcmVyXzEgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRleHRSZW5kZXJlcigpIHt9XG5cbiAgICB2YXIgX3Byb3RvID0gVGV4dFJlbmRlcmVyLnByb3RvdHlwZTtcblxuICAgIC8vIG5vIG5lZWQgZm9yIGJsb2NrIGxldmVsIHJlbmRlcmVyc1xuICAgIF9wcm90by5zdHJvbmcgPSBmdW5jdGlvbiBzdHJvbmcodGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfTtcblxuICAgIF9wcm90by5lbSA9IGZ1bmN0aW9uIGVtKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH07XG5cbiAgICBfcHJvdG8uY29kZXNwYW4gPSBmdW5jdGlvbiBjb2Rlc3Bhbih0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmRlbCA9IGZ1bmN0aW9uIGRlbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmh0bWwgPSBmdW5jdGlvbiBodG1sKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH07XG5cbiAgICBfcHJvdG8udGV4dCA9IGZ1bmN0aW9uIHRleHQoX3RleHQpIHtcbiAgICAgIHJldHVybiBfdGV4dDtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmxpbmsgPSBmdW5jdGlvbiBsaW5rKGhyZWYsIHRpdGxlLCB0ZXh0KSB7XG4gICAgICByZXR1cm4gJycgKyB0ZXh0O1xuICAgIH07XG5cbiAgICBfcHJvdG8uaW1hZ2UgPSBmdW5jdGlvbiBpbWFnZShocmVmLCB0aXRsZSwgdGV4dCkge1xuICAgICAgcmV0dXJuICcnICsgdGV4dDtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmJyID0gZnVuY3Rpb24gYnIoKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfTtcblxuICAgIHJldHVybiBUZXh0UmVuZGVyZXI7XG4gIH0oKTtcblxuICAvKipcbiAgICogU2x1Z2dlciBnZW5lcmF0ZXMgaGVhZGVyIGlkXG4gICAqL1xuXG4gIHZhciBTbHVnZ2VyXzEgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNsdWdnZXIoKSB7XG4gICAgICB0aGlzLnNlZW4gPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgX3Byb3RvID0gU2x1Z2dlci5wcm90b3R5cGU7XG5cbiAgICBfcHJvdG8uc2VyaWFsaXplID0gZnVuY3Rpb24gc2VyaWFsaXplKHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWUudG9Mb3dlckNhc2UoKS50cmltKCkgLy8gcmVtb3ZlIGh0bWwgdGFnc1xuICAgICAgLnJlcGxhY2UoLzxbIVxcL2Etel0uKj8+L2lnLCAnJykgLy8gcmVtb3ZlIHVud2FudGVkIGNoYXJzXG4gICAgICAucmVwbGFjZSgvW1xcdTIwMDAtXFx1MjA2RlxcdTJFMDAtXFx1MkU3RlxcXFwnIVwiIyQlJigpKissLi86Ozw9Pj9AW1xcXV5ge3x9fl0vZywgJycpLnJlcGxhY2UoL1xccy9nLCAnLScpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBGaW5kcyB0aGUgbmV4dCBzYWZlICh1bmlxdWUpIHNsdWcgdG8gdXNlXG4gICAgICovXG4gICAgO1xuXG4gICAgX3Byb3RvLmdldE5leHRTYWZlU2x1ZyA9IGZ1bmN0aW9uIGdldE5leHRTYWZlU2x1ZyhvcmlnaW5hbFNsdWcsIGlzRHJ5UnVuKSB7XG4gICAgICB2YXIgc2x1ZyA9IG9yaWdpbmFsU2x1ZztcbiAgICAgIHZhciBvY2N1cmVuY2VBY2N1bXVsYXRvciA9IDA7XG5cbiAgICAgIGlmICh0aGlzLnNlZW4uaGFzT3duUHJvcGVydHkoc2x1ZykpIHtcbiAgICAgICAgb2NjdXJlbmNlQWNjdW11bGF0b3IgPSB0aGlzLnNlZW5bb3JpZ2luYWxTbHVnXTtcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgb2NjdXJlbmNlQWNjdW11bGF0b3IrKztcbiAgICAgICAgICBzbHVnID0gb3JpZ2luYWxTbHVnICsgJy0nICsgb2NjdXJlbmNlQWNjdW11bGF0b3I7XG4gICAgICAgIH0gd2hpbGUgKHRoaXMuc2Vlbi5oYXNPd25Qcm9wZXJ0eShzbHVnKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNEcnlSdW4pIHtcbiAgICAgICAgdGhpcy5zZWVuW29yaWdpbmFsU2x1Z10gPSBvY2N1cmVuY2VBY2N1bXVsYXRvcjtcbiAgICAgICAgdGhpcy5zZWVuW3NsdWddID0gMDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHNsdWc7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbnZlcnQgc3RyaW5nIHRvIHVuaXF1ZSBpZFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gICAgICogQHBhcmFtIHtib29sZWFufSBvcHRpb25zLmRyeXJ1biBHZW5lcmF0ZXMgdGhlIG5leHQgdW5pcXVlIHNsdWcgd2l0aG91dCB1cGRhdGluZyB0aGUgaW50ZXJuYWwgYWNjdW11bGF0b3IuXG4gICAgICovXG4gICAgO1xuXG4gICAgX3Byb3RvLnNsdWcgPSBmdW5jdGlvbiBzbHVnKHZhbHVlLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNsdWcgPSB0aGlzLnNlcmlhbGl6ZSh2YWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcy5nZXROZXh0U2FmZVNsdWcoc2x1Zywgb3B0aW9ucy5kcnlydW4pO1xuICAgIH07XG5cbiAgICByZXR1cm4gU2x1Z2dlcjtcbiAgfSgpO1xuXG4gIHZhciBSZW5kZXJlciQxID0gUmVuZGVyZXJfMTtcbiAgdmFyIFRleHRSZW5kZXJlciQxID0gVGV4dFJlbmRlcmVyXzE7XG4gIHZhciBTbHVnZ2VyJDEgPSBTbHVnZ2VyXzE7XG4gIHZhciBkZWZhdWx0cyQxID0gZGVmYXVsdHMkNS5leHBvcnRzLmRlZmF1bHRzO1xuICB2YXIgdW5lc2NhcGUgPSBoZWxwZXJzLnVuZXNjYXBlO1xuICAvKipcbiAgICogUGFyc2luZyAmIENvbXBpbGluZ1xuICAgKi9cblxuICB2YXIgUGFyc2VyXzEgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBhcnNlcihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IGRlZmF1bHRzJDE7XG4gICAgICB0aGlzLm9wdGlvbnMucmVuZGVyZXIgPSB0aGlzLm9wdGlvbnMucmVuZGVyZXIgfHwgbmV3IFJlbmRlcmVyJDEoKTtcbiAgICAgIHRoaXMucmVuZGVyZXIgPSB0aGlzLm9wdGlvbnMucmVuZGVyZXI7XG4gICAgICB0aGlzLnJlbmRlcmVyLm9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICB0aGlzLnRleHRSZW5kZXJlciA9IG5ldyBUZXh0UmVuZGVyZXIkMSgpO1xuICAgICAgdGhpcy5zbHVnZ2VyID0gbmV3IFNsdWdnZXIkMSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgUGFyc2UgTWV0aG9kXG4gICAgICovXG5cblxuICAgIFBhcnNlci5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKHRva2Vucywgb3B0aW9ucykge1xuICAgICAgdmFyIHBhcnNlciA9IG5ldyBQYXJzZXIob3B0aW9ucyk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlKHRva2Vucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBQYXJzZSBJbmxpbmUgTWV0aG9kXG4gICAgICovXG4gICAgO1xuXG4gICAgUGFyc2VyLnBhcnNlSW5saW5lID0gZnVuY3Rpb24gcGFyc2VJbmxpbmUodG9rZW5zLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcGFyc2VyID0gbmV3IFBhcnNlcihvcHRpb25zKTtcbiAgICAgIHJldHVybiBwYXJzZXIucGFyc2VJbmxpbmUodG9rZW5zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUGFyc2UgTG9vcFxuICAgICAqL1xuICAgIDtcblxuICAgIHZhciBfcHJvdG8gPSBQYXJzZXIucHJvdG90eXBlO1xuXG4gICAgX3Byb3RvLnBhcnNlID0gZnVuY3Rpb24gcGFyc2UodG9rZW5zLCB0b3ApIHtcbiAgICAgIGlmICh0b3AgPT09IHZvaWQgMCkge1xuICAgICAgICB0b3AgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3V0ID0gJycsXG4gICAgICAgICAgaSxcbiAgICAgICAgICBqLFxuICAgICAgICAgIGssXG4gICAgICAgICAgbDIsXG4gICAgICAgICAgbDMsXG4gICAgICAgICAgcm93LFxuICAgICAgICAgIGNlbGwsXG4gICAgICAgICAgaGVhZGVyLFxuICAgICAgICAgIGJvZHksXG4gICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgb3JkZXJlZCxcbiAgICAgICAgICBzdGFydCxcbiAgICAgICAgICBsb29zZSxcbiAgICAgICAgICBpdGVtQm9keSxcbiAgICAgICAgICBpdGVtLFxuICAgICAgICAgIGNoZWNrZWQsXG4gICAgICAgICAgdGFzayxcbiAgICAgICAgICBjaGVja2JveCxcbiAgICAgICAgICByZXQ7XG4gICAgICB2YXIgbCA9IHRva2Vucy5sZW5ndGg7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07IC8vIFJ1biBhbnkgcmVuZGVyZXIgZXh0ZW5zaW9uc1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucyAmJiB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucy5yZW5kZXJlcnMgJiYgdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMucmVuZGVyZXJzW3Rva2VuLnR5cGVdKSB7XG4gICAgICAgICAgcmV0ID0gdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMucmVuZGVyZXJzW3Rva2VuLnR5cGVdLmNhbGwoe1xuICAgICAgICAgICAgcGFyc2VyOiB0aGlzXG4gICAgICAgICAgfSwgdG9rZW4pO1xuXG4gICAgICAgICAgaWYgKHJldCAhPT0gZmFsc2UgfHwgIVsnc3BhY2UnLCAnaHInLCAnaGVhZGluZycsICdjb2RlJywgJ3RhYmxlJywgJ2Jsb2NrcXVvdGUnLCAnbGlzdCcsICdodG1sJywgJ3BhcmFncmFwaCcsICd0ZXh0J10uaW5jbHVkZXModG9rZW4udHlwZSkpIHtcbiAgICAgICAgICAgIG91dCArPSByZXQgfHwgJyc7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdzcGFjZSc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAnaHInOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5ocigpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2hlYWRpbmcnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5oZWFkaW5nKHRoaXMucGFyc2VJbmxpbmUodG9rZW4udG9rZW5zKSwgdG9rZW4uZGVwdGgsIHVuZXNjYXBlKHRoaXMucGFyc2VJbmxpbmUodG9rZW4udG9rZW5zLCB0aGlzLnRleHRSZW5kZXJlcikpLCB0aGlzLnNsdWdnZXIpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2NvZGUnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5jb2RlKHRva2VuLnRleHQsIHRva2VuLmxhbmcsIHRva2VuLmVzY2FwZWQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ3RhYmxlJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaGVhZGVyID0gJyc7IC8vIGhlYWRlclxuXG4gICAgICAgICAgICAgIGNlbGwgPSAnJztcbiAgICAgICAgICAgICAgbDIgPSB0b2tlbi5oZWFkZXIubGVuZ3RoO1xuXG4gICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBsMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgY2VsbCArPSB0aGlzLnJlbmRlcmVyLnRhYmxlY2VsbCh0aGlzLnBhcnNlSW5saW5lKHRva2VuLmhlYWRlcltqXS50b2tlbnMpLCB7XG4gICAgICAgICAgICAgICAgICBoZWFkZXI6IHRydWUsXG4gICAgICAgICAgICAgICAgICBhbGlnbjogdG9rZW4uYWxpZ25bal1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGhlYWRlciArPSB0aGlzLnJlbmRlcmVyLnRhYmxlcm93KGNlbGwpO1xuICAgICAgICAgICAgICBib2R5ID0gJyc7XG4gICAgICAgICAgICAgIGwyID0gdG9rZW4ucm93cy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGwyOyBqKyspIHtcbiAgICAgICAgICAgICAgICByb3cgPSB0b2tlbi5yb3dzW2pdO1xuICAgICAgICAgICAgICAgIGNlbGwgPSAnJztcbiAgICAgICAgICAgICAgICBsMyA9IHJvdy5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbDM7IGsrKykge1xuICAgICAgICAgICAgICAgICAgY2VsbCArPSB0aGlzLnJlbmRlcmVyLnRhYmxlY2VsbCh0aGlzLnBhcnNlSW5saW5lKHJvd1trXS50b2tlbnMpLCB7XG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduOiB0b2tlbi5hbGlnbltrXVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgYm9keSArPSB0aGlzLnJlbmRlcmVyLnRhYmxlcm93KGNlbGwpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIudGFibGUoaGVhZGVyLCBib2R5KTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdibG9ja3F1b3RlJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgYm9keSA9IHRoaXMucGFyc2UodG9rZW4udG9rZW5zKTtcbiAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuYmxvY2txdW90ZShib2R5KTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3JkZXJlZCA9IHRva2VuLm9yZGVyZWQ7XG4gICAgICAgICAgICAgIHN0YXJ0ID0gdG9rZW4uc3RhcnQ7XG4gICAgICAgICAgICAgIGxvb3NlID0gdG9rZW4ubG9vc2U7XG4gICAgICAgICAgICAgIGwyID0gdG9rZW4uaXRlbXMubGVuZ3RoO1xuICAgICAgICAgICAgICBib2R5ID0gJyc7XG5cbiAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGwyOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpdGVtID0gdG9rZW4uaXRlbXNbal07XG4gICAgICAgICAgICAgICAgY2hlY2tlZCA9IGl0ZW0uY2hlY2tlZDtcbiAgICAgICAgICAgICAgICB0YXNrID0gaXRlbS50YXNrO1xuICAgICAgICAgICAgICAgIGl0ZW1Cb2R5ID0gJyc7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXRlbS50YXNrKSB7XG4gICAgICAgICAgICAgICAgICBjaGVja2JveCA9IHRoaXMucmVuZGVyZXIuY2hlY2tib3goY2hlY2tlZCk7XG5cbiAgICAgICAgICAgICAgICAgIGlmIChsb29zZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS50b2tlbnMubGVuZ3RoID4gMCAmJiBpdGVtLnRva2Vuc1swXS50eXBlID09PSAncGFyYWdyYXBoJykge1xuICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udG9rZW5zWzBdLnRleHQgPSBjaGVja2JveCArICcgJyArIGl0ZW0udG9rZW5zWzBdLnRleHQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbS50b2tlbnNbMF0udG9rZW5zICYmIGl0ZW0udG9rZW5zWzBdLnRva2Vucy5sZW5ndGggPiAwICYmIGl0ZW0udG9rZW5zWzBdLnRva2Vuc1swXS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udG9rZW5zWzBdLnRva2Vuc1swXS50ZXh0ID0gY2hlY2tib3ggKyAnICcgKyBpdGVtLnRva2Vuc1swXS50b2tlbnNbMF0udGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgaXRlbS50b2tlbnMudW5zaGlmdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBjaGVja2JveFxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpdGVtQm9keSArPSBjaGVja2JveDtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpdGVtQm9keSArPSB0aGlzLnBhcnNlKGl0ZW0udG9rZW5zLCBsb29zZSk7XG4gICAgICAgICAgICAgICAgYm9keSArPSB0aGlzLnJlbmRlcmVyLmxpc3RpdGVtKGl0ZW1Cb2R5LCB0YXNrLCBjaGVja2VkKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmxpc3QoYm9keSwgb3JkZXJlZCwgc3RhcnQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAvLyBUT0RPIHBhcnNlIGlubGluZSBjb250ZW50IGlmIHBhcmFtZXRlciBtYXJrZG93bj0xXG4gICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmh0bWwodG9rZW4udGV4dCk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAncGFyYWdyYXBoJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIucGFyYWdyYXBoKHRoaXMucGFyc2VJbmxpbmUodG9rZW4udG9rZW5zKSk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGJvZHkgPSB0b2tlbi50b2tlbnMgPyB0aGlzLnBhcnNlSW5saW5lKHRva2VuLnRva2VucykgOiB0b2tlbi50ZXh0O1xuXG4gICAgICAgICAgICAgIHdoaWxlIChpICsgMSA8IGwgJiYgdG9rZW5zW2kgKyAxXS50eXBlID09PSAndGV4dCcpIHtcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1srK2ldO1xuICAgICAgICAgICAgICAgIGJvZHkgKz0gJ1xcbicgKyAodG9rZW4udG9rZW5zID8gdGhpcy5wYXJzZUlubGluZSh0b2tlbi50b2tlbnMpIDogdG9rZW4udGV4dCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBvdXQgKz0gdG9wID8gdGhpcy5yZW5kZXJlci5wYXJhZ3JhcGgoYm9keSkgOiBib2R5O1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhciBlcnJNc2cgPSAnVG9rZW4gd2l0aCBcIicgKyB0b2tlbi50eXBlICsgJ1wiIHR5cGUgd2FzIG5vdCBmb3VuZC4nO1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJNc2cpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBhcnNlIElubGluZSBUb2tlbnNcbiAgICAgKi9cbiAgICA7XG5cbiAgICBfcHJvdG8ucGFyc2VJbmxpbmUgPSBmdW5jdGlvbiBwYXJzZUlubGluZSh0b2tlbnMsIHJlbmRlcmVyKSB7XG4gICAgICByZW5kZXJlciA9IHJlbmRlcmVyIHx8IHRoaXMucmVuZGVyZXI7XG4gICAgICB2YXIgb3V0ID0gJycsXG4gICAgICAgICAgaSxcbiAgICAgICAgICB0b2tlbixcbiAgICAgICAgICByZXQ7XG4gICAgICB2YXIgbCA9IHRva2Vucy5sZW5ndGg7XG5cbiAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07IC8vIFJ1biBhbnkgcmVuZGVyZXIgZXh0ZW5zaW9uc1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucyAmJiB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucy5yZW5kZXJlcnMgJiYgdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMucmVuZGVyZXJzW3Rva2VuLnR5cGVdKSB7XG4gICAgICAgICAgcmV0ID0gdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMucmVuZGVyZXJzW3Rva2VuLnR5cGVdLmNhbGwoe1xuICAgICAgICAgICAgcGFyc2VyOiB0aGlzXG4gICAgICAgICAgfSwgdG9rZW4pO1xuXG4gICAgICAgICAgaWYgKHJldCAhPT0gZmFsc2UgfHwgIVsnZXNjYXBlJywgJ2h0bWwnLCAnbGluaycsICdpbWFnZScsICdzdHJvbmcnLCAnZW0nLCAnY29kZXNwYW4nLCAnYnInLCAnZGVsJywgJ3RleHQnXS5pbmNsdWRlcyh0b2tlbi50eXBlKSkge1xuICAgICAgICAgICAgb3V0ICs9IHJldCB8fCAnJztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICAgIGNhc2UgJ2VzY2FwZSc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci50ZXh0KHRva2VuLnRleHQpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIuaHRtbCh0b2tlbi50ZXh0KTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdsaW5rJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmxpbmsodG9rZW4uaHJlZiwgdG9rZW4udGl0bGUsIHRoaXMucGFyc2VJbmxpbmUodG9rZW4udG9rZW5zLCByZW5kZXJlcikpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2ltYWdlJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmltYWdlKHRva2VuLmhyZWYsIHRva2VuLnRpdGxlLCB0b2tlbi50ZXh0KTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdzdHJvbmcnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIuc3Ryb25nKHRoaXMucGFyc2VJbmxpbmUodG9rZW4udG9rZW5zLCByZW5kZXJlcikpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2VtJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmVtKHRoaXMucGFyc2VJbmxpbmUodG9rZW4udG9rZW5zLCByZW5kZXJlcikpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2NvZGVzcGFuJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmNvZGVzcGFuKHRva2VuLnRleHQpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2JyJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmJyKCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAnZGVsJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmRlbCh0aGlzLnBhcnNlSW5saW5lKHRva2VuLnRva2VucywgcmVuZGVyZXIpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLnRleHQodG9rZW4udGV4dCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdmFyIGVyck1zZyA9ICdUb2tlbiB3aXRoIFwiJyArIHRva2VuLnR5cGUgKyAnXCIgdHlwZSB3YXMgbm90IGZvdW5kLic7XG5cbiAgICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVyck1zZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFBhcnNlcjtcbiAgfSgpO1xuXG4gIHZhciBMZXhlciA9IExleGVyXzE7XG4gIHZhciBQYXJzZXIgPSBQYXJzZXJfMTtcbiAgdmFyIFRva2VuaXplciA9IFRva2VuaXplcl8xO1xuICB2YXIgUmVuZGVyZXIgPSBSZW5kZXJlcl8xO1xuICB2YXIgVGV4dFJlbmRlcmVyID0gVGV4dFJlbmRlcmVyXzE7XG4gIHZhciBTbHVnZ2VyID0gU2x1Z2dlcl8xO1xuICB2YXIgbWVyZ2UgPSBoZWxwZXJzLm1lcmdlLFxuICAgICAgY2hlY2tTYW5pdGl6ZURlcHJlY2F0aW9uID0gaGVscGVycy5jaGVja1Nhbml0aXplRGVwcmVjYXRpb24sXG4gICAgICBlc2NhcGUgPSBoZWxwZXJzLmVzY2FwZTtcbiAgdmFyIGdldERlZmF1bHRzID0gZGVmYXVsdHMkNS5leHBvcnRzLmdldERlZmF1bHRzLFxuICAgICAgY2hhbmdlRGVmYXVsdHMgPSBkZWZhdWx0cyQ1LmV4cG9ydHMuY2hhbmdlRGVmYXVsdHMsXG4gICAgICBkZWZhdWx0cyA9IGRlZmF1bHRzJDUuZXhwb3J0cy5kZWZhdWx0cztcbiAgLyoqXG4gICAqIE1hcmtlZFxuICAgKi9cblxuICBmdW5jdGlvbiBtYXJrZWQoc3JjLCBvcHQsIGNhbGxiYWNrKSB7XG4gICAgLy8gdGhyb3cgZXJyb3IgaW4gY2FzZSBvZiBub24gc3RyaW5nIGlucHV0XG4gICAgaWYgKHR5cGVvZiBzcmMgPT09ICd1bmRlZmluZWQnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXJrZWQoKTogaW5wdXQgcGFyYW1ldGVyIGlzIHVuZGVmaW5lZCBvciBudWxsJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzcmMgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hcmtlZCgpOiBpbnB1dCBwYXJhbWV0ZXIgaXMgb2YgdHlwZSAnICsgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHNyYykgKyAnLCBzdHJpbmcgZXhwZWN0ZWQnKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG9wdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBvcHQ7XG4gICAgICBvcHQgPSBudWxsO1xuICAgIH1cblxuICAgIG9wdCA9IG1lcmdlKHt9LCBtYXJrZWQuZGVmYXVsdHMsIG9wdCB8fCB7fSk7XG4gICAgY2hlY2tTYW5pdGl6ZURlcHJlY2F0aW9uKG9wdCk7XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIHZhciBoaWdobGlnaHQgPSBvcHQuaGlnaGxpZ2h0O1xuICAgICAgdmFyIHRva2VucztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgdG9rZW5zID0gTGV4ZXIubGV4KHNyYywgb3B0KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGUpO1xuICAgICAgfVxuXG4gICAgICB2YXIgZG9uZSA9IGZ1bmN0aW9uIGRvbmUoZXJyKSB7XG4gICAgICAgIHZhciBvdXQ7XG5cbiAgICAgICAgaWYgKCFlcnIpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYgKG9wdC53YWxrVG9rZW5zKSB7XG4gICAgICAgICAgICAgIG1hcmtlZC53YWxrVG9rZW5zKHRva2Vucywgb3B0LndhbGtUb2tlbnMpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBvdXQgPSBQYXJzZXIucGFyc2UodG9rZW5zLCBvcHQpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGVyciA9IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgb3B0LmhpZ2hsaWdodCA9IGhpZ2hsaWdodDtcbiAgICAgICAgcmV0dXJuIGVyciA/IGNhbGxiYWNrKGVycikgOiBjYWxsYmFjayhudWxsLCBvdXQpO1xuICAgICAgfTtcblxuICAgICAgaWYgKCFoaWdobGlnaHQgfHwgaGlnaGxpZ2h0Lmxlbmd0aCA8IDMpIHtcbiAgICAgICAgcmV0dXJuIGRvbmUoKTtcbiAgICAgIH1cblxuICAgICAgZGVsZXRlIG9wdC5oaWdobGlnaHQ7XG4gICAgICBpZiAoIXRva2Vucy5sZW5ndGgpIHJldHVybiBkb25lKCk7XG4gICAgICB2YXIgcGVuZGluZyA9IDA7XG4gICAgICBtYXJrZWQud2Fsa1Rva2Vucyh0b2tlbnMsIGZ1bmN0aW9uICh0b2tlbikge1xuICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gJ2NvZGUnKSB7XG4gICAgICAgICAgcGVuZGluZysrO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaGlnaGxpZ2h0KHRva2VuLnRleHQsIHRva2VuLmxhbmcsIGZ1bmN0aW9uIChlcnIsIGNvZGUpIHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIHJldHVybiBkb25lKGVycik7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoY29kZSAhPSBudWxsICYmIGNvZGUgIT09IHRva2VuLnRleHQpIHtcbiAgICAgICAgICAgICAgICB0b2tlbi50ZXh0ID0gY29kZTtcbiAgICAgICAgICAgICAgICB0b2tlbi5lc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHBlbmRpbmctLTtcblxuICAgICAgICAgICAgICBpZiAocGVuZGluZyA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAocGVuZGluZyA9PT0gMCkge1xuICAgICAgICBkb25lKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgdmFyIF90b2tlbnMgPSBMZXhlci5sZXgoc3JjLCBvcHQpO1xuXG4gICAgICBpZiAob3B0LndhbGtUb2tlbnMpIHtcbiAgICAgICAgbWFya2VkLndhbGtUb2tlbnMoX3Rva2Vucywgb3B0LndhbGtUb2tlbnMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUGFyc2VyLnBhcnNlKF90b2tlbnMsIG9wdCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZS5tZXNzYWdlICs9ICdcXG5QbGVhc2UgcmVwb3J0IHRoaXMgdG8gaHR0cHM6Ly9naXRodWIuY29tL21hcmtlZGpzL21hcmtlZC4nO1xuXG4gICAgICBpZiAob3B0LnNpbGVudCkge1xuICAgICAgICByZXR1cm4gJzxwPkFuIGVycm9yIG9jY3VycmVkOjwvcD48cHJlPicgKyBlc2NhcGUoZS5tZXNzYWdlICsgJycsIHRydWUpICsgJzwvcHJlPic7XG4gICAgICB9XG5cbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG4gIC8qKlxuICAgKiBPcHRpb25zXG4gICAqL1xuXG5cbiAgbWFya2VkLm9wdGlvbnMgPSBtYXJrZWQuc2V0T3B0aW9ucyA9IGZ1bmN0aW9uIChvcHQpIHtcbiAgICBtZXJnZShtYXJrZWQuZGVmYXVsdHMsIG9wdCk7XG4gICAgY2hhbmdlRGVmYXVsdHMobWFya2VkLmRlZmF1bHRzKTtcbiAgICByZXR1cm4gbWFya2VkO1xuICB9O1xuXG4gIG1hcmtlZC5nZXREZWZhdWx0cyA9IGdldERlZmF1bHRzO1xuICBtYXJrZWQuZGVmYXVsdHMgPSBkZWZhdWx0cztcbiAgLyoqXG4gICAqIFVzZSBFeHRlbnNpb25cbiAgICovXG5cbiAgbWFya2VkLnVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHZhciBvcHRzID0gbWVyZ2UuYXBwbHkodm9pZCAwLCBbe31dLmNvbmNhdChhcmdzKSk7XG4gICAgdmFyIGV4dGVuc2lvbnMgPSBtYXJrZWQuZGVmYXVsdHMuZXh0ZW5zaW9ucyB8fCB7XG4gICAgICByZW5kZXJlcnM6IHt9LFxuICAgICAgY2hpbGRUb2tlbnM6IHt9XG4gICAgfTtcbiAgICB2YXIgaGFzRXh0ZW5zaW9ucztcbiAgICBhcmdzLmZvckVhY2goZnVuY3Rpb24gKHBhY2spIHtcbiAgICAgIC8vID09LS0gUGFyc2UgXCJhZGRvblwiIGV4dGVuc2lvbnMgLS09PSAvL1xuICAgICAgaWYgKHBhY2suZXh0ZW5zaW9ucykge1xuICAgICAgICBoYXNFeHRlbnNpb25zID0gdHJ1ZTtcbiAgICAgICAgcGFjay5leHRlbnNpb25zLmZvckVhY2goZnVuY3Rpb24gKGV4dCkge1xuICAgICAgICAgIGlmICghZXh0Lm5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZXh0ZW5zaW9uIG5hbWUgcmVxdWlyZWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZXh0LnJlbmRlcmVyKSB7XG4gICAgICAgICAgICAvLyBSZW5kZXJlciBleHRlbnNpb25zXG4gICAgICAgICAgICB2YXIgcHJldlJlbmRlcmVyID0gZXh0ZW5zaW9ucy5yZW5kZXJlcnMgPyBleHRlbnNpb25zLnJlbmRlcmVyc1tleHQubmFtZV0gOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAocHJldlJlbmRlcmVyKSB7XG4gICAgICAgICAgICAgIC8vIFJlcGxhY2UgZXh0ZW5zaW9uIHdpdGggZnVuYyB0byBydW4gbmV3IGV4dGVuc2lvbiBidXQgZmFsbCBiYWNrIGlmIGZhbHNlXG4gICAgICAgICAgICAgIGV4dGVuc2lvbnMucmVuZGVyZXJzW2V4dC5uYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgICAgICAgICAgIGFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gZXh0LnJlbmRlcmVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHJldCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgIHJldCA9IHByZXZSZW5kZXJlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZXh0ZW5zaW9ucy5yZW5kZXJlcnNbZXh0Lm5hbWVdID0gZXh0LnJlbmRlcmVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChleHQudG9rZW5pemVyKSB7XG4gICAgICAgICAgICAvLyBUb2tlbml6ZXIgRXh0ZW5zaW9uc1xuICAgICAgICAgICAgaWYgKCFleHQubGV2ZWwgfHwgZXh0LmxldmVsICE9PSAnYmxvY2snICYmIGV4dC5sZXZlbCAhPT0gJ2lubGluZScpIHtcbiAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZXh0ZW5zaW9uIGxldmVsIG11c3QgYmUgJ2Jsb2NrJyBvciAnaW5saW5lJ1wiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4dGVuc2lvbnNbZXh0LmxldmVsXSkge1xuICAgICAgICAgICAgICBleHRlbnNpb25zW2V4dC5sZXZlbF0udW5zaGlmdChleHQudG9rZW5pemVyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGV4dGVuc2lvbnNbZXh0LmxldmVsXSA9IFtleHQudG9rZW5pemVyXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGV4dC5zdGFydCkge1xuICAgICAgICAgICAgICAvLyBGdW5jdGlvbiB0byBjaGVjayBmb3Igc3RhcnQgb2YgdG9rZW5cbiAgICAgICAgICAgICAgaWYgKGV4dC5sZXZlbCA9PT0gJ2Jsb2NrJykge1xuICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb25zLnN0YXJ0QmxvY2spIHtcbiAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnMuc3RhcnRCbG9jay5wdXNoKGV4dC5zdGFydCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnMuc3RhcnRCbG9jayA9IFtleHQuc3RhcnRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChleHQubGV2ZWwgPT09ICdpbmxpbmUnKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV4dGVuc2lvbnMuc3RhcnRJbmxpbmUpIHtcbiAgICAgICAgICAgICAgICAgIGV4dGVuc2lvbnMuc3RhcnRJbmxpbmUucHVzaChleHQuc3RhcnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBleHRlbnNpb25zLnN0YXJ0SW5saW5lID0gW2V4dC5zdGFydF07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGV4dC5jaGlsZFRva2Vucykge1xuICAgICAgICAgICAgLy8gQ2hpbGQgdG9rZW5zIHRvIGJlIHZpc2l0ZWQgYnkgd2Fsa1Rva2Vuc1xuICAgICAgICAgICAgZXh0ZW5zaW9ucy5jaGlsZFRva2Vuc1tleHQubmFtZV0gPSBleHQuY2hpbGRUb2tlbnM7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gLy8gPT0tLSBQYXJzZSBcIm92ZXJ3cml0ZVwiIGV4dGVuc2lvbnMgLS09PSAvL1xuXG5cbiAgICAgIGlmIChwYWNrLnJlbmRlcmVyKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHJlbmRlcmVyID0gbWFya2VkLmRlZmF1bHRzLnJlbmRlcmVyIHx8IG5ldyBSZW5kZXJlcigpO1xuXG4gICAgICAgICAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AocHJvcCkge1xuICAgICAgICAgICAgdmFyIHByZXZSZW5kZXJlciA9IHJlbmRlcmVyW3Byb3BdOyAvLyBSZXBsYWNlIHJlbmRlcmVyIHdpdGggZnVuYyB0byBydW4gZXh0ZW5zaW9uLCBidXQgZmFsbCBiYWNrIGlmIGZhbHNlXG5cbiAgICAgICAgICAgIHJlbmRlcmVyW3Byb3BdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgICAgICAgICAgICBhcmdzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgcmV0ID0gcGFjay5yZW5kZXJlcltwcm9wXS5hcHBseShyZW5kZXJlciwgYXJncyk7XG5cbiAgICAgICAgICAgICAgaWYgKHJldCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXQgPSBwcmV2UmVuZGVyZXIuYXBwbHkocmVuZGVyZXIsIGFyZ3MpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gcGFjay5yZW5kZXJlcikge1xuICAgICAgICAgICAgX2xvb3AocHJvcCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb3B0cy5yZW5kZXJlciA9IHJlbmRlcmVyO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAocGFjay50b2tlbml6ZXIpIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgdG9rZW5pemVyID0gbWFya2VkLmRlZmF1bHRzLnRva2VuaXplciB8fCBuZXcgVG9rZW5pemVyKCk7XG5cbiAgICAgICAgICB2YXIgX2xvb3AyID0gZnVuY3Rpb24gX2xvb3AyKHByb3ApIHtcbiAgICAgICAgICAgIHZhciBwcmV2VG9rZW5pemVyID0gdG9rZW5pemVyW3Byb3BdOyAvLyBSZXBsYWNlIHRva2VuaXplciB3aXRoIGZ1bmMgdG8gcnVuIGV4dGVuc2lvbiwgYnV0IGZhbGwgYmFjayBpZiBmYWxzZVxuXG4gICAgICAgICAgICB0b2tlbml6ZXJbcHJvcF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuNCksIF9rZXk0ID0gMDsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgICAgICAgICAgICAgIGFyZ3NbX2tleTRdID0gYXJndW1lbnRzW19rZXk0XTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHZhciByZXQgPSBwYWNrLnRva2VuaXplcltwcm9wXS5hcHBseSh0b2tlbml6ZXIsIGFyZ3MpO1xuXG4gICAgICAgICAgICAgIGlmIChyZXQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gcHJldlRva2VuaXplci5hcHBseSh0b2tlbml6ZXIsIGFyZ3MpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gcGFjay50b2tlbml6ZXIpIHtcbiAgICAgICAgICAgIF9sb29wMihwcm9wKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBvcHRzLnRva2VuaXplciA9IHRva2VuaXplcjtcbiAgICAgICAgfSkoKTtcbiAgICAgIH0gLy8gPT0tLSBQYXJzZSBXYWxrVG9rZW5zIGV4dGVuc2lvbnMgLS09PSAvL1xuXG5cbiAgICAgIGlmIChwYWNrLndhbGtUb2tlbnMpIHtcbiAgICAgICAgdmFyIHdhbGtUb2tlbnMgPSBtYXJrZWQuZGVmYXVsdHMud2Fsa1Rva2VucztcblxuICAgICAgICBvcHRzLndhbGtUb2tlbnMgPSBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgICBwYWNrLndhbGtUb2tlbnMuY2FsbChfdGhpcywgdG9rZW4pO1xuXG4gICAgICAgICAgaWYgKHdhbGtUb2tlbnMpIHtcbiAgICAgICAgICAgIHdhbGtUb2tlbnModG9rZW4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgaWYgKGhhc0V4dGVuc2lvbnMpIHtcbiAgICAgICAgb3B0cy5leHRlbnNpb25zID0gZXh0ZW5zaW9ucztcbiAgICAgIH1cblxuICAgICAgbWFya2VkLnNldE9wdGlvbnMob3B0cyk7XG4gICAgfSk7XG4gIH07XG4gIC8qKlxuICAgKiBSdW4gY2FsbGJhY2sgZm9yIGV2ZXJ5IHRva2VuXG4gICAqL1xuXG5cbiAgbWFya2VkLndhbGtUb2tlbnMgPSBmdW5jdGlvbiAodG9rZW5zLCBjYWxsYmFjaykge1xuICAgIHZhciBfbG9vcDMgPSBmdW5jdGlvbiBfbG9vcDMoKSB7XG4gICAgICB2YXIgdG9rZW4gPSBfc3RlcC52YWx1ZTtcbiAgICAgIGNhbGxiYWNrKHRva2VuKTtcblxuICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3RhYmxlJzpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaXRlcmF0b3IyID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXJMb29zZSh0b2tlbi5oZWFkZXIpLCBfc3RlcDI7ICEoX3N0ZXAyID0gX2l0ZXJhdG9yMigpKS5kb25lOykge1xuICAgICAgICAgICAgICB2YXIgY2VsbCA9IF9zdGVwMi52YWx1ZTtcbiAgICAgICAgICAgICAgbWFya2VkLndhbGtUb2tlbnMoY2VsbC50b2tlbnMsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMyA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyTG9vc2UodG9rZW4ucm93cyksIF9zdGVwMzsgIShfc3RlcDMgPSBfaXRlcmF0b3IzKCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgIHZhciByb3cgPSBfc3RlcDMudmFsdWU7XG5cbiAgICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yNCA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyTG9vc2Uocm93KSwgX3N0ZXA0OyAhKF9zdGVwNCA9IF9pdGVyYXRvcjQoKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgICB2YXIgX2NlbGwgPSBfc3RlcDQudmFsdWU7XG4gICAgICAgICAgICAgICAgbWFya2VkLndhbGtUb2tlbnMoX2NlbGwudG9rZW5zLCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGNhc2UgJ2xpc3QnOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1hcmtlZC53YWxrVG9rZW5zKHRva2VuLml0ZW1zLCBjYWxsYmFjayk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpZiAobWFya2VkLmRlZmF1bHRzLmV4dGVuc2lvbnMgJiYgbWFya2VkLmRlZmF1bHRzLmV4dGVuc2lvbnMuY2hpbGRUb2tlbnMgJiYgbWFya2VkLmRlZmF1bHRzLmV4dGVuc2lvbnMuY2hpbGRUb2tlbnNbdG9rZW4udHlwZV0pIHtcbiAgICAgICAgICAgICAgLy8gV2FsayBhbnkgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgICBtYXJrZWQuZGVmYXVsdHMuZXh0ZW5zaW9ucy5jaGlsZFRva2Vuc1t0b2tlbi50eXBlXS5mb3JFYWNoKGZ1bmN0aW9uIChjaGlsZFRva2Vucykge1xuICAgICAgICAgICAgICAgIG1hcmtlZC53YWxrVG9rZW5zKHRva2VuW2NoaWxkVG9rZW5zXSwgY2FsbGJhY2spO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodG9rZW4udG9rZW5zKSB7XG4gICAgICAgICAgICAgIG1hcmtlZC53YWxrVG9rZW5zKHRva2VuLnRva2VucywgY2FsbGJhY2spO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXJMb29zZSh0b2tlbnMpLCBfc3RlcDsgIShfc3RlcCA9IF9pdGVyYXRvcigpKS5kb25lOykge1xuICAgICAgX2xvb3AzKCk7XG4gICAgfVxuICB9O1xuICAvKipcbiAgICogUGFyc2UgSW5saW5lXG4gICAqL1xuXG5cbiAgbWFya2VkLnBhcnNlSW5saW5lID0gZnVuY3Rpb24gKHNyYywgb3B0KSB7XG4gICAgLy8gdGhyb3cgZXJyb3IgaW4gY2FzZSBvZiBub24gc3RyaW5nIGlucHV0XG4gICAgaWYgKHR5cGVvZiBzcmMgPT09ICd1bmRlZmluZWQnIHx8IHNyYyA9PT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXJrZWQucGFyc2VJbmxpbmUoKTogaW5wdXQgcGFyYW1ldGVyIGlzIHVuZGVmaW5lZCBvciBudWxsJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzcmMgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hcmtlZC5wYXJzZUlubGluZSgpOiBpbnB1dCBwYXJhbWV0ZXIgaXMgb2YgdHlwZSAnICsgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHNyYykgKyAnLCBzdHJpbmcgZXhwZWN0ZWQnKTtcbiAgICB9XG5cbiAgICBvcHQgPSBtZXJnZSh7fSwgbWFya2VkLmRlZmF1bHRzLCBvcHQgfHwge30pO1xuICAgIGNoZWNrU2FuaXRpemVEZXByZWNhdGlvbihvcHQpO1xuXG4gICAgdHJ5IHtcbiAgICAgIHZhciB0b2tlbnMgPSBMZXhlci5sZXhJbmxpbmUoc3JjLCBvcHQpO1xuXG4gICAgICBpZiAob3B0LndhbGtUb2tlbnMpIHtcbiAgICAgICAgbWFya2VkLndhbGtUb2tlbnModG9rZW5zLCBvcHQud2Fsa1Rva2Vucyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBQYXJzZXIucGFyc2VJbmxpbmUodG9rZW5zLCBvcHQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUubWVzc2FnZSArPSAnXFxuUGxlYXNlIHJlcG9ydCB0aGlzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZWRqcy9tYXJrZWQuJztcblxuICAgICAgaWYgKG9wdC5zaWxlbnQpIHtcbiAgICAgICAgcmV0dXJuICc8cD5BbiBlcnJvciBvY2N1cnJlZDo8L3A+PHByZT4nICsgZXNjYXBlKGUubWVzc2FnZSArICcnLCB0cnVlKSArICc8L3ByZT4nO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIEV4cG9zZVxuICAgKi9cblxuXG4gIG1hcmtlZC5QYXJzZXIgPSBQYXJzZXI7XG4gIG1hcmtlZC5wYXJzZXIgPSBQYXJzZXIucGFyc2U7XG4gIG1hcmtlZC5SZW5kZXJlciA9IFJlbmRlcmVyO1xuICBtYXJrZWQuVGV4dFJlbmRlcmVyID0gVGV4dFJlbmRlcmVyO1xuICBtYXJrZWQuTGV4ZXIgPSBMZXhlcjtcbiAgbWFya2VkLmxleGVyID0gTGV4ZXIubGV4O1xuICBtYXJrZWQuVG9rZW5pemVyID0gVG9rZW5pemVyO1xuICBtYXJrZWQuU2x1Z2dlciA9IFNsdWdnZXI7XG4gIG1hcmtlZC5wYXJzZSA9IG1hcmtlZDtcbiAgdmFyIG1hcmtlZF8xID0gbWFya2VkO1xuXG4gIHJldHVybiBtYXJrZWRfMTtcblxufSkpKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBtYXJrZWQgPSByZXF1aXJlKCdtYXJrZWQnKTtcbnZhciBpcGNSZW5kZXJlciA9IHJlcXVpcmUoJ2VsZWN0cm9uJykuaXBjUmVuZGVyZXI7XG52YXIgcmVtb3RlID0gcmVxdWlyZSgnQGVsZWN0cm9uL3JlbW90ZScpO1xudmFyIGdldEZpbGVGcm9tVXNlciA9IHJlbW90ZS5yZXF1aXJlKCcuLi9zcmMvbGliL2RpYWxvZycpLmdldEZpbGVGcm9tVXNlcjtcbnZhciBtYXJrZG93blZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFya2Rvd24nKTtcbnZhciBodG1sVmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNodG1sJyk7XG52YXIgbmV3RmlsZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXctZmlsZScpO1xudmFyIG9wZW5GaWxlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29wZW4tZmlsZScpO1xudmFyIHNhdmVNYXJrZG93bkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzYXZlLW1hcmtkb3duJyk7XG52YXIgcmV2ZXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JldmVydCcpO1xudmFyIHNhdmVIdG1sQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NhdmUtaHRtbCcpO1xudmFyIHNob3dGaWxlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Nob3ctZmlsZScpO1xudmFyIG9wZW5JbkRlZmF1bHRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3Blbi1pbi1kZWZhdWx0Jyk7XG52YXIgcmVuZGVyTWFya2Rvd25Ub0h0bWwgPSBmdW5jdGlvbiAobWFya2Rvd24pIHtcbiAgICBodG1sVmlldy5pbm5lckhUTUwgPSBtYXJrZWQobWFya2Rvd24sIHsgc2FuaXRpemU6IHRydWUgfSk7XG59O1xubWFya2Rvd25WaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB2YXIgY3VycmVudENvbnRlbnQgPSAoX2EgPSBldmVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRhcmdldC52YWx1ZTtcbiAgICByZW5kZXJNYXJrZG93blRvSHRtbChjdXJyZW50Q29udGVudCk7XG59KTtcbm9wZW5GaWxlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGdldEZpbGVGcm9tVXNlcigpO1xufSk7XG5pcGNSZW5kZXJlci5vbignZmlsZS1vcGVuZWQnLCBmdW5jdGlvbiAoZXZlbnQsIGZpbGUsIGNvbnRlbnQpIHtcbiAgICBjb25zb2xlLmxvZygncmVjZWl2ZTonLCBldmVudCwgZmlsZSk7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIG1hcmtkb3duVmlldyA9PT0gbnVsbCB8fCBtYXJrZG93blZpZXcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG1hcmtkb3duVmlldy52YWx1ZSA9IGNvbnRlbnQ7XG4gICAgcmVuZGVyTWFya2Rvd25Ub0h0bWwoY29udGVudCk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==