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
const electron_1 = __webpack_require__(/*! electron */ "./node_modules/_electron@14.0.0@electron/index.js");
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
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

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
        return this.get(id).apply(__webpack_require__.g, ...args);
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
const electron_1 = __webpack_require__(/*! electron */ "./node_modules/_electron@14.0.0@electron/index.js");
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
        return v8Util.getHiddenValue(__webpack_require__.g, 'contextId');
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

/***/ "./node_modules/_electron@14.0.0@electron/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/_electron@14.0.0@electron/index.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __dirname = "/";
const fs = __webpack_require__(/*! fs */ "fs");
const path = __webpack_require__(/*! path */ "?eb0f");

const pathFile = path.join(__dirname, 'path.txt');

function getElectronPath () {
  let executablePath;
  if (fs.existsSync(pathFile)) {
    executablePath = fs.readFileSync(pathFile, 'utf-8');
  }
  if (process.env.ELECTRON_OVERRIDE_DIST_PATH) {
    return path.join(process.env.ELECTRON_OVERRIDE_DIST_PATH, executablePath || 'electron');
  }
  if (executablePath) {
    return path.join(__dirname, 'dist', executablePath);
  } else {
    throw new Error('Electron failed to install correctly, please delete node_modules/electron and try installing again');
  }
}

module.exports = getElectronPath();


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

/***/ "fs":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** external {"F_OK":0,"R_OK":4,"W_OK":2,"X_OK":1,"constants":{"UV_FS_SYMLINK_DIR":1,"UV_FS_SYMLINK_JUNCTION":2,"O_RDONLY":0,"O_WRONLY":1,"O_RDWR":2,"UV_DIRENT_UNKNOWN":0,"UV_DIRENT_FILE":1,"UV_DIRENT_DIR":2,"UV_DIRENT_LINK":3,"UV_DIRENT_FIFO":4,"UV_DIRENT_SOCKET":5,"UV_DIRENT_CHAR":6,"UV_DIRENT_BLOCK":7,"S_IFMT":61440,"S_IFREG":32768,"S_IFDIR":16384,"S_IFCHR":8192,"S_IFBLK":24576,"S_IFIFO":4096,"S_IFLNK":40960,"S_IFSOCK":49152,"O_CREAT":512,"O_EXCL":2048,"UV_FS_O_FILEMAP":0,"O_NOCTTY":131072,"O_TRUNC":1024,"O_APPEND":8,"O_DIRECTORY":1048576,"O_NOFOLLOW":256,"O_SYNC":128,"O_DSYNC":4194304,"O_SYMLINK":2097152,"O_NONBLOCK":4,"S_IRWXU":448,"S_IRUSR":256,"S_IWUSR":128,"S_IXUSR":64,"S_IRWXG":56,"S_IRGRP":32,"S_IWGRP":16,"S_IXGRP":8,"S_IRWXO":7,"S_IROTH":4,"S_IWOTH":2,"S_IXOTH":1,"F_OK":0,"R_OK":4,"W_OK":2,"X_OK":1,"UV_FS_COPYFILE_EXCL":1,"COPYFILE_EXCL":1,"UV_FS_COPYFILE_FICLONE":2,"COPYFILE_FICLONE":2,"UV_FS_COPYFILE_FICLONE_FORCE":4,"COPYFILE_FICLONE_FORCE":4},"promises":{}} ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = undefined;

/***/ }),

/***/ "?eb0f":
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
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
var ipcRenderer = __webpack_require__(/*! electron */ "./node_modules/_electron@14.0.0@electron/index.js").ipcRenderer;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHNfd2ViZ2xfYWFhOGFhMTAuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCOzs7Ozs7Ozs7Ozs7QUNkYjtBQUNiLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCwwQkFBMEIsR0FBRyx5QkFBeUI7QUFDdEQsK0JBQStCLG1CQUFPLENBQUMsK0hBQXdCO0FBQy9ELHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDakRhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELG1CQUFtQixHQUFHLGlCQUFpQixHQUFHLDRCQUE0QixHQUFHLGlCQUFpQjtBQUMxRixtQkFBbUIsbUJBQU8sQ0FBQyxtRUFBVTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLGFBQWE7QUFDckQsK0JBQStCLDJCQUEyQjtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGFBQWE7QUFDM0QsbUNBQW1DLDRCQUE0QjtBQUMvRDtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLDRCQUE0QjtBQUM1QyxnQkFBZ0IsZ0JBQWdCO0FBQ2hDLGtDQUFrQyxvQ0FBb0M7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsNkJBQTZCO0FBQ2pELG9CQUFvQixnQkFBZ0I7QUFDcEMsc0NBQXNDLHFDQUFxQztBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjs7Ozs7Ozs7Ozs7O0FDL0dOO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLHFCQUFNO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5Qjs7Ozs7Ozs7Ozs7O0FDL0RaO0FBQ2I7QUFDQTtBQUNBLG1DQUFtQyxvQ0FBb0MsZ0JBQWdCO0FBQ3ZGLENBQUM7QUFDRDtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RDtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLHFHQUFVOzs7Ozs7Ozs7Ozs7QUNkbEI7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QscUNBQXFDLEdBQUcsaUJBQWlCLEdBQUcsNkJBQTZCLEdBQUcsd0JBQXdCLEdBQUcsa0JBQWtCO0FBQ3pJLDZCQUE2QixtQkFBTyxDQUFDLDZIQUFzQjtBQUMzRCxxQkFBcUIsbUJBQU8sQ0FBQyxtSEFBc0I7QUFDbkQsbUJBQW1CLG1CQUFPLENBQUMsbUVBQVU7QUFDckMsdUJBQXVCLG1CQUFPLENBQUMsdUhBQXdCO0FBQ3ZELCtCQUErQixtQkFBTyxDQUFDLHVJQUFnQztBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDLHFCQUFNO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0M7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsOEJBQThCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFdBQVcsc0JBQXNCO0FBQ2pDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsZUFBZTs7QUFFZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVyxrQkFBa0I7QUFDN0I7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQU07OztBQUdOLHFCQUFxQjs7QUFFckI7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOzs7QUFHSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0MsSUFBSTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esa0NBQWtDOztBQUVsQztBQUNBOztBQUVB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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSOztBQUVBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBLGlEQUFpRDs7QUFFakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxvQ0FBb0M7O0FBRXBDO0FBQ0E7QUFDQSxrQ0FBa0M7O0FBRWxDO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFROzs7QUFHUjtBQUNBO0FBQ0EsUUFBUTs7O0FBR1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDhCQUE4Qjs7QUFFOUI7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7O0FBRUE7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7OztBQUdWO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTs7O0FBR1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVOzs7QUFHVjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlOztBQUVmO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7OztBQUdSO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkRBQTZELFdBQVcsRUFBRTtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixlQUFlLFNBQVM7QUFDeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLEdBQUc7V0FDSDtXQUNBO1dBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7QUNQWTtBQUNiLGFBQWEsbUJBQU8sQ0FBQyxpRUFBUTtBQUM3QixrQkFBa0Isb0dBQStCO0FBQ2pELGFBQWEsbUJBQU8sQ0FBQyxtR0FBa0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRDQUE0QyxnQkFBZ0I7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9maXJlLy4vbm9kZV9tb2R1bGVzL19AZWxlY3Ryb25fcmVtb3RlQDEuMi4xQEBlbGVjdHJvbi9yZW1vdGUvZGlzdC9zcmMvY29tbW9uL2dldC1lbGVjdHJvbi1iaW5kaW5nLmpzIiwid2VicGFjazovL2ZpcmUvLi9ub2RlX21vZHVsZXMvX0BlbGVjdHJvbl9yZW1vdGVAMS4yLjFAQGVsZWN0cm9uL3JlbW90ZS9kaXN0L3NyYy9jb21tb24vbW9kdWxlLW5hbWVzLmpzIiwid2VicGFjazovL2ZpcmUvLi9ub2RlX21vZHVsZXMvX0BlbGVjdHJvbl9yZW1vdGVAMS4yLjFAQGVsZWN0cm9uL3JlbW90ZS9kaXN0L3NyYy9jb21tb24vdHlwZS11dGlscy5qcyIsIndlYnBhY2s6Ly9maXJlLy4vbm9kZV9tb2R1bGVzL19AZWxlY3Ryb25fcmVtb3RlQDEuMi4xQEBlbGVjdHJvbi9yZW1vdGUvZGlzdC9zcmMvcmVuZGVyZXIvY2FsbGJhY2tzLXJlZ2lzdHJ5LmpzIiwid2VicGFjazovL2ZpcmUvLi9ub2RlX21vZHVsZXMvX0BlbGVjdHJvbl9yZW1vdGVAMS4yLjFAQGVsZWN0cm9uL3JlbW90ZS9kaXN0L3NyYy9yZW5kZXJlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9maXJlLy4vbm9kZV9tb2R1bGVzL19AZWxlY3Ryb25fcmVtb3RlQDEuMi4xQEBlbGVjdHJvbi9yZW1vdGUvZGlzdC9zcmMvcmVuZGVyZXIvcmVtb3RlLmpzIiwid2VicGFjazovL2ZpcmUvLi9ub2RlX21vZHVsZXMvX0BlbGVjdHJvbl9yZW1vdGVAMS4yLjFAQGVsZWN0cm9uL3JlbW90ZS9yZW5kZXJlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9maXJlLy4vbm9kZV9tb2R1bGVzL19lbGVjdHJvbkAxNC4wLjBAZWxlY3Ryb24vaW5kZXguanMiLCJ3ZWJwYWNrOi8vZmlyZS8uL25vZGVfbW9kdWxlcy9fbWFya2VkQDMuMC4yQG1hcmtlZC9saWIvbWFya2VkLmpzIiwid2VicGFjazovL2ZpcmUvZXh0ZXJuYWwgdmFyIHtcIkZfT0tcIjowLFwiUl9PS1wiOjQsXCJXX09LXCI6MixcIlhfT0tcIjoxLFwiY29uc3RhbnRzXCI6e1wiVVZfRlNfU1lNTElOS19ESVJcIjoxLFwiVVZfRlNfU1lNTElOS19KVU5DVElPTlwiOjIsXCJPX1JET05MWVwiOjAsXCJPX1dST05MWVwiOjEsXCJPX1JEV1JcIjoyLFwiVVZfRElSRU5UX1VOS05PV05cIjowLFwiVVZfRElSRU5UX0ZJTEVcIjoxLFwiVVZfRElSRU5UX0RJUlwiOjIsXCJVVl9ESVJFTlRfTElOS1wiOjMsXCJVVl9ESVJFTlRfRklGT1wiOjQsXCJVVl9ESVJFTlRfU09DS0VUXCI6NSxcIlVWX0RJUkVOVF9DSEFSXCI6NixcIlVWX0RJUkVOVF9CTE9DS1wiOjcsXCJTX0lGTVRcIjo2MTQ0MCxcIlNfSUZSRUdcIjozMjc2OCxcIlNfSUZESVJcIjoxNjM4NCxcIlNfSUZDSFJcIjo4MTkyLFwiU19JRkJMS1wiOjI0NTc2LFwiU19JRklGT1wiOjQwOTYsXCJTX0lGTE5LXCI6NDA5NjAsXCJTX0lGU09DS1wiOjQ5MTUyLFwiT19DUkVBVFwiOjUxMixcIk9fRVhDTFwiOjIwNDgsXCJVVl9GU19PX0ZJTEVNQVBcIjowLFwiT19OT0NUVFlcIjoxMzEwNzIsXCJPX1RSVU5DXCI6MTAyNCxcIk9fQVBQRU5EXCI6OCxcIk9fRElSRUNUT1JZXCI6MTA0ODU3NixcIk9fTk9GT0xMT1dcIjoyNTYsXCJPX1NZTkNcIjoxMjgsXCJPX0RTWU5DXCI6NDE5NDMwNCxcIk9fU1lNTElOS1wiOjIwOTcxNTIsXCJPX05PTkJMT0NLXCI6NCxcIlNfSVJXWFVcIjo0NDgsXCJTX0lSVVNSXCI6MjU2LFwiU19JV1VTUlwiOjEyOCxcIlNfSVhVU1JcIjo2NCxcIlNfSVJXWEdcIjo1NixcIlNfSVJHUlBcIjozMixcIlNfSVdHUlBcIjoxNixcIlNfSVhHUlBcIjo4LFwiU19JUldYT1wiOjcsXCJTX0lST1RIXCI6NCxcIlNfSVdPVEhcIjoyLFwiU19JWE9USFwiOjEsXCJGX09LXCI6MCxcIlJfT0tcIjo0LFwiV19PS1wiOjIsXCJYX09LXCI6MSxcIlVWX0ZTX0NPUFlGSUxFX0VYQ0xcIjoxLFwiQ09QWUZJTEVfRVhDTFwiOjEsXCJVVl9GU19DT1BZRklMRV9GSUNMT05FXCI6MixcIkNPUFlGSUxFX0ZJQ0xPTkVcIjoyLFwiVVZfRlNfQ09QWUZJTEVfRklDTE9ORV9GT1JDRVwiOjQsXCJDT1BZRklMRV9GSUNMT05FX0ZPUkNFXCI6NH0sXCJwcm9taXNlc1wiOnt9fSIsIndlYnBhY2s6Ly9maXJlL2lnbm9yZWR8L1VzZXJzL2Zlbmd3ZW54dWFuL0Rlc2t0b3AvZWxlY3Ryb24vRmlyZS9ub2RlX21vZHVsZXMvX2VsZWN0cm9uQDE0LjAuMEBlbGVjdHJvbnxwYXRoIiwid2VicGFjazovL2ZpcmUvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vZmlyZS93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2ZpcmUvLi9yZW5kZXIvcmVuZGVyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRFbGVjdHJvbkJpbmRpbmcgPSB2b2lkIDA7XG5jb25zdCBnZXRFbGVjdHJvbkJpbmRpbmcgPSAobmFtZSkgPT4ge1xuICAgIGlmIChwcm9jZXNzLl9saW5rZWRCaW5kaW5nKSB7XG4gICAgICAgIHJldHVybiBwcm9jZXNzLl9saW5rZWRCaW5kaW5nKCdlbGVjdHJvbl9jb21tb25fJyArIG5hbWUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChwcm9jZXNzLmVsZWN0cm9uQmluZGluZykge1xuICAgICAgICByZXR1cm4gcHJvY2Vzcy5lbGVjdHJvbkJpbmRpbmcobmFtZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG59O1xuZXhwb3J0cy5nZXRFbGVjdHJvbkJpbmRpbmcgPSBnZXRFbGVjdHJvbkJpbmRpbmc7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuYnJvd3Nlck1vZHVsZU5hbWVzID0gZXhwb3J0cy5jb21tb25Nb2R1bGVOYW1lcyA9IHZvaWQgMDtcbmNvbnN0IGdldF9lbGVjdHJvbl9iaW5kaW5nXzEgPSByZXF1aXJlKFwiLi9nZXQtZWxlY3Ryb24tYmluZGluZ1wiKTtcbmV4cG9ydHMuY29tbW9uTW9kdWxlTmFtZXMgPSBbXG4gICAgJ2NsaXBib2FyZCcsXG4gICAgJ25hdGl2ZUltYWdlJyxcbiAgICAnc2hlbGwnLFxuXTtcbmV4cG9ydHMuYnJvd3Nlck1vZHVsZU5hbWVzID0gW1xuICAgICdhcHAnLFxuICAgICdhdXRvVXBkYXRlcicsXG4gICAgJ0Jhc2VXaW5kb3cnLFxuICAgICdCcm93c2VyVmlldycsXG4gICAgJ0Jyb3dzZXJXaW5kb3cnLFxuICAgICdjb250ZW50VHJhY2luZycsXG4gICAgJ2NyYXNoUmVwb3J0ZXInLFxuICAgICdkaWFsb2cnLFxuICAgICdnbG9iYWxTaG9ydGN1dCcsXG4gICAgJ2lwY01haW4nLFxuICAgICdpbkFwcFB1cmNoYXNlJyxcbiAgICAnTWVudScsXG4gICAgJ01lbnVJdGVtJyxcbiAgICAnbmF0aXZlVGhlbWUnLFxuICAgICduZXQnLFxuICAgICduZXRMb2cnLFxuICAgICdNZXNzYWdlQ2hhbm5lbE1haW4nLFxuICAgICdOb3RpZmljYXRpb24nLFxuICAgICdwb3dlck1vbml0b3InLFxuICAgICdwb3dlclNhdmVCbG9ja2VyJyxcbiAgICAncHJvdG9jb2wnLFxuICAgICdzY3JlZW4nLFxuICAgICdzZXNzaW9uJyxcbiAgICAnU2hhcmVNZW51JyxcbiAgICAnc3lzdGVtUHJlZmVyZW5jZXMnLFxuICAgICdUb3BMZXZlbFdpbmRvdycsXG4gICAgJ1RvdWNoQmFyJyxcbiAgICAnVHJheScsXG4gICAgJ1ZpZXcnLFxuICAgICd3ZWJDb250ZW50cycsXG4gICAgJ1dlYkNvbnRlbnRzVmlldycsXG4gICAgJ3dlYkZyYW1lTWFpbicsXG5dLmNvbmNhdChleHBvcnRzLmNvbW1vbk1vZHVsZU5hbWVzKTtcbmNvbnN0IGZlYXR1cmVzID0gZ2V0X2VsZWN0cm9uX2JpbmRpbmdfMS5nZXRFbGVjdHJvbkJpbmRpbmcoJ2ZlYXR1cmVzJyk7XG5pZiAoIWZlYXR1cmVzIHx8IGZlYXR1cmVzLmlzRGVza3RvcENhcHR1cmVyRW5hYmxlZCgpKSB7XG4gICAgZXhwb3J0cy5icm93c2VyTW9kdWxlTmFtZXMucHVzaCgnZGVza3RvcENhcHR1cmVyJyk7XG59XG5pZiAoIWZlYXR1cmVzIHx8IGZlYXR1cmVzLmlzVmlld0FwaUVuYWJsZWQoKSkge1xuICAgIGV4cG9ydHMuYnJvd3Nlck1vZHVsZU5hbWVzLnB1c2goJ0ltYWdlVmlldycpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmRlc2VyaWFsaXplID0gZXhwb3J0cy5zZXJpYWxpemUgPSBleHBvcnRzLmlzU2VyaWFsaXphYmxlT2JqZWN0ID0gZXhwb3J0cy5pc1Byb21pc2UgPSB2b2lkIDA7XG5jb25zdCBlbGVjdHJvbl8xID0gcmVxdWlyZShcImVsZWN0cm9uXCIpO1xuZnVuY3Rpb24gaXNQcm9taXNlKHZhbCkge1xuICAgIHJldHVybiAodmFsICYmXG4gICAgICAgIHZhbC50aGVuICYmXG4gICAgICAgIHZhbC50aGVuIGluc3RhbmNlb2YgRnVuY3Rpb24gJiZcbiAgICAgICAgdmFsLmNvbnN0cnVjdG9yICYmXG4gICAgICAgIHZhbC5jb25zdHJ1Y3Rvci5yZWplY3QgJiZcbiAgICAgICAgdmFsLmNvbnN0cnVjdG9yLnJlamVjdCBpbnN0YW5jZW9mIEZ1bmN0aW9uICYmXG4gICAgICAgIHZhbC5jb25zdHJ1Y3Rvci5yZXNvbHZlICYmXG4gICAgICAgIHZhbC5jb25zdHJ1Y3Rvci5yZXNvbHZlIGluc3RhbmNlb2YgRnVuY3Rpb24pO1xufVxuZXhwb3J0cy5pc1Byb21pc2UgPSBpc1Byb21pc2U7XG5jb25zdCBzZXJpYWxpemFibGVUeXBlcyA9IFtcbiAgICBCb29sZWFuLFxuICAgIE51bWJlcixcbiAgICBTdHJpbmcsXG4gICAgRGF0ZSxcbiAgICBFcnJvcixcbiAgICBSZWdFeHAsXG4gICAgQXJyYXlCdWZmZXJcbl07XG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvV2ViX1dvcmtlcnNfQVBJL1N0cnVjdHVyZWRfY2xvbmVfYWxnb3JpdGhtI1N1cHBvcnRlZF90eXBlc1xuZnVuY3Rpb24gaXNTZXJpYWxpemFibGVPYmplY3QodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KHZhbHVlKSB8fCBzZXJpYWxpemFibGVUeXBlcy5zb21lKHR5cGUgPT4gdmFsdWUgaW5zdGFuY2VvZiB0eXBlKTtcbn1cbmV4cG9ydHMuaXNTZXJpYWxpemFibGVPYmplY3QgPSBpc1NlcmlhbGl6YWJsZU9iamVjdDtcbmNvbnN0IG9iamVjdE1hcCA9IGZ1bmN0aW9uIChzb3VyY2UsIG1hcHBlcikge1xuICAgIGNvbnN0IHNvdXJjZUVudHJpZXMgPSBPYmplY3QuZW50cmllcyhzb3VyY2UpO1xuICAgIGNvbnN0IHRhcmdldEVudHJpZXMgPSBzb3VyY2VFbnRyaWVzLm1hcCgoW2tleSwgdmFsXSkgPT4gW2tleSwgbWFwcGVyKHZhbCldKTtcbiAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKHRhcmdldEVudHJpZXMpO1xufTtcbmZ1bmN0aW9uIHNlcmlhbGl6ZU5hdGl2ZUltYWdlKGltYWdlKSB7XG4gICAgY29uc3QgcmVwcmVzZW50YXRpb25zID0gW107XG4gICAgY29uc3Qgc2NhbGVGYWN0b3JzID0gaW1hZ2UuZ2V0U2NhbGVGYWN0b3JzKCk7XG4gICAgLy8gVXNlIEJ1ZmZlciB3aGVuIHRoZXJlJ3Mgb25seSBvbmUgcmVwcmVzZW50YXRpb24gZm9yIGJldHRlciBwZXJmLlxuICAgIC8vIFRoaXMgYXZvaWRzIGNvbXByZXNzaW5nIHRvL2Zyb20gUE5HIHdoZXJlIGl0J3Mgbm90IG5lY2Vzc2FyeSB0b1xuICAgIC8vIGVuc3VyZSB1bmlxdWVuZXNzIG9mIGRhdGFVUkxzIChzaW5jZSB0aGVyZSdzIG9ubHkgb25lKS5cbiAgICBpZiAoc2NhbGVGYWN0b3JzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb25zdCBzY2FsZUZhY3RvciA9IHNjYWxlRmFjdG9yc1swXTtcbiAgICAgICAgY29uc3Qgc2l6ZSA9IGltYWdlLmdldFNpemUoc2NhbGVGYWN0b3IpO1xuICAgICAgICBjb25zdCBidWZmZXIgPSBpbWFnZS50b0JpdG1hcCh7IHNjYWxlRmFjdG9yIH0pO1xuICAgICAgICByZXByZXNlbnRhdGlvbnMucHVzaCh7IHNjYWxlRmFjdG9yLCBzaXplLCBidWZmZXIgfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBDb25zdHJ1Y3QgZnJvbSBkYXRhVVJMcyB0byBlbnN1cmUgdGhhdCB0aGV5IGFyZSBub3QgbG9zdCBpbiBjcmVhdGlvbi5cbiAgICAgICAgZm9yIChjb25zdCBzY2FsZUZhY3RvciBvZiBzY2FsZUZhY3RvcnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSBpbWFnZS5nZXRTaXplKHNjYWxlRmFjdG9yKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGFVUkwgPSBpbWFnZS50b0RhdGFVUkwoeyBzY2FsZUZhY3RvciB9KTtcbiAgICAgICAgICAgIHJlcHJlc2VudGF0aW9ucy5wdXNoKHsgc2NhbGVGYWN0b3IsIHNpemUsIGRhdGFVUkwgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHsgX19FTEVDVFJPTl9TRVJJQUxJWkVEX05hdGl2ZUltYWdlX186IHRydWUsIHJlcHJlc2VudGF0aW9ucyB9O1xufVxuZnVuY3Rpb24gZGVzZXJpYWxpemVOYXRpdmVJbWFnZSh2YWx1ZSkge1xuICAgIGNvbnN0IGltYWdlID0gZWxlY3Ryb25fMS5uYXRpdmVJbWFnZS5jcmVhdGVFbXB0eSgpO1xuICAgIC8vIFVzZSBCdWZmZXIgd2hlbiB0aGVyZSdzIG9ubHkgb25lIHJlcHJlc2VudGF0aW9uIGZvciBiZXR0ZXIgcGVyZi5cbiAgICAvLyBUaGlzIGF2b2lkcyBjb21wcmVzc2luZyB0by9mcm9tIFBORyB3aGVyZSBpdCdzIG5vdCBuZWNlc3NhcnkgdG9cbiAgICAvLyBlbnN1cmUgdW5pcXVlbmVzcyBvZiBkYXRhVVJMcyAoc2luY2UgdGhlcmUncyBvbmx5IG9uZSkuXG4gICAgaWYgKHZhbHVlLnJlcHJlc2VudGF0aW9ucy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgY29uc3QgeyBidWZmZXIsIHNpemUsIHNjYWxlRmFjdG9yIH0gPSB2YWx1ZS5yZXByZXNlbnRhdGlvbnNbMF07XG4gICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gc2l6ZTtcbiAgICAgICAgaW1hZ2UuYWRkUmVwcmVzZW50YXRpb24oeyBidWZmZXIsIHNjYWxlRmFjdG9yLCB3aWR0aCwgaGVpZ2h0IH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gQ29uc3RydWN0IGZyb20gZGF0YVVSTHMgdG8gZW5zdXJlIHRoYXQgdGhleSBhcmUgbm90IGxvc3QgaW4gY3JlYXRpb24uXG4gICAgICAgIGZvciAoY29uc3QgcmVwIG9mIHZhbHVlLnJlcHJlc2VudGF0aW9ucykge1xuICAgICAgICAgICAgY29uc3QgeyBkYXRhVVJMLCBzaXplLCBzY2FsZUZhY3RvciB9ID0gcmVwO1xuICAgICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBzaXplO1xuICAgICAgICAgICAgaW1hZ2UuYWRkUmVwcmVzZW50YXRpb24oeyBkYXRhVVJMLCBzY2FsZUZhY3Rvciwgd2lkdGgsIGhlaWdodCB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaW1hZ2U7XG59XG5mdW5jdGlvbiBzZXJpYWxpemUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IubmFtZSA9PT0gJ05hdGl2ZUltYWdlJykge1xuICAgICAgICByZXR1cm4gc2VyaWFsaXplTmF0aXZlSW1hZ2UodmFsdWUpO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlLm1hcChzZXJpYWxpemUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChpc1NlcmlhbGl6YWJsZU9iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICByZXR1cm4gb2JqZWN0TWFwKHZhbHVlLCBzZXJpYWxpemUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbn1cbmV4cG9ydHMuc2VyaWFsaXplID0gc2VyaWFsaXplO1xuZnVuY3Rpb24gZGVzZXJpYWxpemUodmFsdWUpIHtcbiAgICBpZiAodmFsdWUgJiYgdmFsdWUuX19FTEVDVFJPTl9TRVJJQUxJWkVEX05hdGl2ZUltYWdlX18pIHtcbiAgICAgICAgcmV0dXJuIGRlc2VyaWFsaXplTmF0aXZlSW1hZ2UodmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWUubWFwKGRlc2VyaWFsaXplKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoaXNTZXJpYWxpemFibGVPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgZWxzZSBpZiAodmFsdWUgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdE1hcCh2YWx1ZSwgZGVzZXJpYWxpemUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVzZXJpYWxpemUgPSBkZXNlcmlhbGl6ZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5DYWxsYmFja3NSZWdpc3RyeSA9IHZvaWQgMDtcbmNsYXNzIENhbGxiYWNrc1JlZ2lzdHJ5IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5uZXh0SWQgPSAwO1xuICAgICAgICB0aGlzLmNhbGxiYWNrcyA9IHt9O1xuICAgICAgICB0aGlzLmNhbGxiYWNrSWRzID0gbmV3IFdlYWtNYXAoKTtcbiAgICAgICAgdGhpcy5sb2NhdGlvbkluZm8gPSBuZXcgV2Vha01hcCgpO1xuICAgIH1cbiAgICBhZGQoY2FsbGJhY2spIHtcbiAgICAgICAgLy8gVGhlIGNhbGxiYWNrIGlzIGFscmVhZHkgYWRkZWQuXG4gICAgICAgIGxldCBpZCA9IHRoaXMuY2FsbGJhY2tJZHMuZ2V0KGNhbGxiYWNrKTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIGlkID0gdGhpcy5uZXh0SWQgKz0gMTtcbiAgICAgICAgdGhpcy5jYWxsYmFja3NbaWRdID0gY2FsbGJhY2s7XG4gICAgICAgIHRoaXMuY2FsbGJhY2tJZHMuc2V0KGNhbGxiYWNrLCBpZCk7XG4gICAgICAgIC8vIENhcHR1cmUgdGhlIGxvY2F0aW9uIG9mIHRoZSBmdW5jdGlvbiBhbmQgcHV0IGl0IGluIHRoZSBJRCBzdHJpbmcsXG4gICAgICAgIC8vIHNvIHRoYXQgcmVsZWFzZSBlcnJvcnMgY2FuIGJlIHRyYWNrZWQgZG93biBlYXNpbHkuXG4gICAgICAgIGNvbnN0IHJlZ2V4cCA9IC9hdCAoLiopL2dpO1xuICAgICAgICBjb25zdCBzdGFja1N0cmluZyA9IChuZXcgRXJyb3IoKSkuc3RhY2s7XG4gICAgICAgIGlmICghc3RhY2tTdHJpbmcpXG4gICAgICAgICAgICByZXR1cm4gaWQ7XG4gICAgICAgIGxldCBmaWxlbmFtZUFuZExpbmU7XG4gICAgICAgIGxldCBtYXRjaDtcbiAgICAgICAgd2hpbGUgKChtYXRjaCA9IHJlZ2V4cC5leGVjKHN0YWNrU3RyaW5nKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gbWF0Y2hbMV07XG4gICAgICAgICAgICBpZiAobG9jYXRpb24uaW5jbHVkZXMoJyhuYXRpdmUpJykpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBpZiAobG9jYXRpb24uaW5jbHVkZXMoJyg8YW5vbnltb3VzPiknKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGlmIChsb2NhdGlvbi5pbmNsdWRlcygnY2FsbGJhY2tzLXJlZ2lzdHJ5LmpzJykpXG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICBpZiAobG9jYXRpb24uaW5jbHVkZXMoJ3JlbW90ZS5qcycpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgaWYgKGxvY2F0aW9uLmluY2x1ZGVzKCdAZWxlY3Ryb24vcmVtb3RlL2Rpc3QnKSlcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIGNvbnN0IHJlZiA9IC8oW14vXildKilcXCk/JC9naS5leGVjKGxvY2F0aW9uKTtcbiAgICAgICAgICAgIGlmIChyZWYpXG4gICAgICAgICAgICAgICAgZmlsZW5hbWVBbmRMaW5lID0gcmVmWzFdO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5sb2NhdGlvbkluZm8uc2V0KGNhbGxiYWNrLCBmaWxlbmFtZUFuZExpbmUpO1xuICAgICAgICByZXR1cm4gaWQ7XG4gICAgfVxuICAgIGdldChpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jYWxsYmFja3NbaWRdIHx8IGZ1bmN0aW9uICgpIHsgfTtcbiAgICB9XG4gICAgZ2V0TG9jYXRpb24oY2FsbGJhY2spIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9jYXRpb25JbmZvLmdldChjYWxsYmFjayk7XG4gICAgfVxuICAgIGFwcGx5KGlkLCAuLi5hcmdzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChpZCkuYXBwbHkoZ2xvYmFsLCAuLi5hcmdzKTtcbiAgICB9XG4gICAgcmVtb3ZlKGlkKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5jYWxsYmFja3NbaWRdO1xuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tJZHMuZGVsZXRlKGNhbGxiYWNrKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNhbGxiYWNrc1tpZF07XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkNhbGxiYWNrc1JlZ2lzdHJ5ID0gQ2FsbGJhY2tzUmVnaXN0cnk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGZ1bmN0aW9uKCkgeyByZXR1cm4gbVtrXTsgfSB9KTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuaWYgKHByb2Nlc3MudHlwZSA9PT0gJ2Jyb3dzZXInKVxuICAgIHRocm93IG5ldyBFcnJvcihgXCJAZWxlY3Ryb24vcmVtb3RlXCIgY2Fubm90IGJlIHJlcXVpcmVkIGluIHRoZSBicm93c2VyIHByb2Nlc3MuIEluc3RlYWQgcmVxdWlyZShcIkBlbGVjdHJvbi9yZW1vdGUvbWFpblwiKS5gKTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9yZW1vdGVcIiksIGV4cG9ydHMpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmNyZWF0ZUZ1bmN0aW9uV2l0aFJldHVyblZhbHVlID0gZXhwb3J0cy5nZXRHbG9iYWwgPSBleHBvcnRzLmdldEN1cnJlbnRXZWJDb250ZW50cyA9IGV4cG9ydHMuZ2V0Q3VycmVudFdpbmRvdyA9IGV4cG9ydHMuZ2V0QnVpbHRpbiA9IHZvaWQgMDtcbmNvbnN0IGNhbGxiYWNrc19yZWdpc3RyeV8xID0gcmVxdWlyZShcIi4vY2FsbGJhY2tzLXJlZ2lzdHJ5XCIpO1xuY29uc3QgdHlwZV91dGlsc18xID0gcmVxdWlyZShcIi4uL2NvbW1vbi90eXBlLXV0aWxzXCIpO1xuY29uc3QgZWxlY3Ryb25fMSA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTtcbmNvbnN0IG1vZHVsZV9uYW1lc18xID0gcmVxdWlyZShcIi4uL2NvbW1vbi9tb2R1bGUtbmFtZXNcIik7XG5jb25zdCBnZXRfZWxlY3Ryb25fYmluZGluZ18xID0gcmVxdWlyZShcIi4uL2NvbW1vbi9nZXQtZWxlY3Ryb24tYmluZGluZ1wiKTtcbmNvbnN0IGNhbGxiYWNrc1JlZ2lzdHJ5ID0gbmV3IGNhbGxiYWNrc19yZWdpc3RyeV8xLkNhbGxiYWNrc1JlZ2lzdHJ5KCk7XG5jb25zdCByZW1vdGVPYmplY3RDYWNoZSA9IG5ldyBNYXAoKTtcbmNvbnN0IGZpbmFsaXphdGlvblJlZ2lzdHJ5ID0gbmV3IEZpbmFsaXphdGlvblJlZ2lzdHJ5KChpZCkgPT4ge1xuICAgIGNvbnN0IHJlZiA9IHJlbW90ZU9iamVjdENhY2hlLmdldChpZCk7XG4gICAgaWYgKHJlZiAhPT0gdW5kZWZpbmVkICYmIHJlZi5kZXJlZigpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVtb3RlT2JqZWN0Q2FjaGUuZGVsZXRlKGlkKTtcbiAgICAgICAgZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5zZW5kKFwiUkVNT1RFX0JST1dTRVJfREVSRUZFUkVOQ0VcIiAvKiBCUk9XU0VSX0RFUkVGRVJFTkNFICovLCBjb250ZXh0SWQsIGlkLCAwKTtcbiAgICB9XG59KTtcbmNvbnN0IGVsZWN0cm9uSWRzID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IGlzUmV0dXJuVmFsdWUgPSBuZXcgV2Vha1NldCgpO1xuZnVuY3Rpb24gZ2V0Q2FjaGVkUmVtb3RlT2JqZWN0KGlkKSB7XG4gICAgY29uc3QgcmVmID0gcmVtb3RlT2JqZWN0Q2FjaGUuZ2V0KGlkKTtcbiAgICBpZiAocmVmICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY29uc3QgZGVyZWYgPSByZWYuZGVyZWYoKTtcbiAgICAgICAgaWYgKGRlcmVmICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gZGVyZWY7XG4gICAgfVxufVxuZnVuY3Rpb24gc2V0Q2FjaGVkUmVtb3RlT2JqZWN0KGlkLCB2YWx1ZSkge1xuICAgIGNvbnN0IHdyID0gbmV3IFdlYWtSZWYodmFsdWUpO1xuICAgIHJlbW90ZU9iamVjdENhY2hlLnNldChpZCwgd3IpO1xuICAgIGZpbmFsaXphdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKHZhbHVlLCBpZCk7XG4gICAgcmV0dXJuIHZhbHVlO1xufVxuZnVuY3Rpb24gZ2V0Q29udGV4dElkKCkge1xuICAgIGNvbnN0IHY4VXRpbCA9IGdldF9lbGVjdHJvbl9iaW5kaW5nXzEuZ2V0RWxlY3Ryb25CaW5kaW5nKCd2OF91dGlsJyk7XG4gICAgaWYgKHY4VXRpbCkge1xuICAgICAgICByZXR1cm4gdjhVdGlsLmdldEhpZGRlblZhbHVlKGdsb2JhbCwgJ2NvbnRleHRJZCcpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdFbGVjdHJvbiA+PXYxMy4wLjAtYmV0YS42IHJlcXVpcmVkIHRvIHN1cHBvcnQgc2FuZGJveGVkIHJlbmRlcmVycycpO1xuICAgIH1cbn1cbi8vIEFuIHVuaXF1ZSBJRCB0aGF0IGNhbiByZXByZXNlbnQgY3VycmVudCBjb250ZXh0LlxuY29uc3QgY29udGV4dElkID0gcHJvY2Vzcy5jb250ZXh0SWQgfHwgZ2V0Q29udGV4dElkKCk7XG4vLyBOb3RpZnkgdGhlIG1haW4gcHJvY2VzcyB3aGVuIGN1cnJlbnQgY29udGV4dCBpcyBnb2luZyB0byBiZSByZWxlYXNlZC5cbi8vIE5vdGUgdGhhdCB3aGVuIHRoZSByZW5kZXJlciBwcm9jZXNzIGlzIGRlc3Ryb3llZCwgdGhlIG1lc3NhZ2UgbWF5IG5vdCBiZVxuLy8gc2VudCwgd2UgYWxzbyBsaXN0ZW4gdG8gdGhlIFwicmVuZGVyLXZpZXctZGVsZXRlZFwiIGV2ZW50IGluIHRoZSBtYWluIHByb2Nlc3Ncbi8vIHRvIGd1YXJkIHRoYXQgc2l0dWF0aW9uLlxucHJvY2Vzcy5vbignZXhpdCcsICgpID0+IHtcbiAgICBjb25zdCBjb21tYW5kID0gXCJSRU1PVEVfQlJPV1NFUl9DT05URVhUX1JFTEVBU0VcIiAvKiBCUk9XU0VSX0NPTlRFWFRfUkVMRUFTRSAqLztcbiAgICBlbGVjdHJvbl8xLmlwY1JlbmRlcmVyLnNlbmQoY29tbWFuZCwgY29udGV4dElkKTtcbn0pO1xuY29uc3QgSVNfUkVNT1RFX1BST1hZID0gU3ltYm9sKCdpcy1yZW1vdGUtcHJveHknKTtcbi8vIENvbnZlcnQgdGhlIGFyZ3VtZW50cyBvYmplY3QgaW50byBhbiBhcnJheSBvZiBtZXRhIGRhdGEuXG5mdW5jdGlvbiB3cmFwQXJncyhhcmdzLCB2aXNpdGVkID0gbmV3IFNldCgpKSB7XG4gICAgY29uc3QgdmFsdWVUb01ldGEgPSAodmFsdWUpID0+IHtcbiAgICAgICAgLy8gQ2hlY2sgZm9yIGNpcmN1bGFyIHJlZmVyZW5jZS5cbiAgICAgICAgaWYgKHZpc2l0ZWQuaGFzKHZhbHVlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBudWxsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lID09PSAnTmF0aXZlSW1hZ2UnKSB7XG4gICAgICAgICAgICByZXR1cm4geyB0eXBlOiAnbmF0aXZlaW1hZ2UnLCB2YWx1ZTogdHlwZV91dGlsc18xLnNlcmlhbGl6ZSh2YWx1ZSkgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgICAgdmlzaXRlZC5hZGQodmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgbWV0YSA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnYXJyYXknLFxuICAgICAgICAgICAgICAgIHZhbHVlOiB3cmFwQXJncyh2YWx1ZSwgdmlzaXRlZClcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2aXNpdGVkLmRlbGV0ZSh2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbWV0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnYnVmZmVyJyxcbiAgICAgICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlX3V0aWxzXzEuaXNTZXJpYWxpemFibGVPYmplY3QodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVfdXRpbHNfMS5pc1Byb21pc2UodmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Byb21pc2UnLFxuICAgICAgICAgICAgICAgICAgICB0aGVuOiB2YWx1ZVRvTWV0YShmdW5jdGlvbiAob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChlbGVjdHJvbklkcy5oYXModmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3JlbW90ZS1vYmplY3QnLFxuICAgICAgICAgICAgICAgICAgICBpZDogZWxlY3Ryb25JZHMuZ2V0KHZhbHVlKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBtZXRhID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdvYmplY3QnLFxuICAgICAgICAgICAgICAgIG5hbWU6IHZhbHVlLmNvbnN0cnVjdG9yID8gdmFsdWUuY29uc3RydWN0b3IubmFtZSA6ICcnLFxuICAgICAgICAgICAgICAgIG1lbWJlcnM6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmlzaXRlZC5hZGQodmFsdWUpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBwcm9wIGluIHZhbHVlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZ3VhcmQtZm9yLWluXG4gICAgICAgICAgICAgICAgbWV0YS5tZW1iZXJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBwcm9wLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVUb01ldGEodmFsdWVbcHJvcF0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2aXNpdGVkLmRlbGV0ZSh2YWx1ZSk7XG4gICAgICAgICAgICByZXR1cm4gbWV0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgJiYgaXNSZXR1cm5WYWx1ZS5oYXModmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICdmdW5jdGlvbi13aXRoLXJldHVybi12YWx1ZScsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlVG9NZXRhKHZhbHVlKCkpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZnVuY3Rpb24nLFxuICAgICAgICAgICAgICAgIGlkOiBjYWxsYmFja3NSZWdpc3RyeS5hZGQodmFsdWUpLFxuICAgICAgICAgICAgICAgIGxvY2F0aW9uOiBjYWxsYmFja3NSZWdpc3RyeS5nZXRMb2NhdGlvbih2YWx1ZSksXG4gICAgICAgICAgICAgICAgbGVuZ3RoOiB2YWx1ZS5sZW5ndGhcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICAgICAgICAgICAgdmFsdWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBhcmdzLm1hcCh2YWx1ZVRvTWV0YSk7XG59XG4vLyBQb3B1bGF0ZSBvYmplY3QncyBtZW1iZXJzIGZyb20gZGVzY3JpcHRvcnMuXG4vLyBUaGUgfHJlZnwgd2lsbCBiZSBrZXB0IHJlZmVyZW5jZWQgYnkgfG1lbWJlcnN8LlxuLy8gVGhpcyBtYXRjaGVzIHxnZXRPYmplY3RNZW1lYmVyc3wgaW4gcnBjLXNlcnZlci5cbmZ1bmN0aW9uIHNldE9iamVjdE1lbWJlcnMocmVmLCBvYmplY3QsIG1ldGFJZCwgbWVtYmVycykge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShtZW1iZXJzKSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGZvciAoY29uc3QgbWVtYmVyIG9mIG1lbWJlcnMpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIG1lbWJlci5uYW1lKSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBjb25zdCBkZXNjcmlwdG9yID0geyBlbnVtZXJhYmxlOiBtZW1iZXIuZW51bWVyYWJsZSB9O1xuICAgICAgICBpZiAobWVtYmVyLnR5cGUgPT09ICdtZXRob2QnKSB7XG4gICAgICAgICAgICBjb25zdCByZW1vdGVNZW1iZXJGdW5jdGlvbiA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbW1hbmQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMgJiYgdGhpcy5jb25zdHJ1Y3RvciA9PT0gcmVtb3RlTWVtYmVyRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZCA9IFwiUkVNT1RFX0JST1dTRVJfTUVNQkVSX0NPTlNUUlVDVE9SXCIgLyogQlJPV1NFUl9NRU1CRVJfQ09OU1RSVUNUT1IgKi87XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb21tYW5kID0gXCJSRU1PVEVfQlJPV1NFUl9NRU1CRVJfQ0FMTFwiIC8qIEJST1dTRVJfTUVNQkVSX0NBTEwgKi87XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IHJldCA9IGVsZWN0cm9uXzEuaXBjUmVuZGVyZXIuc2VuZFN5bmMoY29tbWFuZCwgY29udGV4dElkLCBtZXRhSWQsIG1lbWJlci5uYW1lLCB3cmFwQXJncyhhcmdzKSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGFUb1ZhbHVlKHJldCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IGRlc2NyaXB0b3JGdW5jdGlvbiA9IHByb3h5RnVuY3Rpb25Qcm9wZXJ0aWVzKHJlbW90ZU1lbWJlckZ1bmN0aW9uLCBtZXRhSWQsIG1lbWJlci5uYW1lKTtcbiAgICAgICAgICAgIGRlc2NyaXB0b3IuZ2V0ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3JGdW5jdGlvbi5yZWYgPSByZWY7IC8vIFRoZSBtZW1iZXIgc2hvdWxkIHJlZmVyZW5jZSBpdHMgb2JqZWN0LlxuICAgICAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yRnVuY3Rpb247XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgLy8gRW5hYmxlIG1vbmtleS1wYXRjaCB0aGUgbWV0aG9kXG4gICAgICAgICAgICBkZXNjcmlwdG9yLnNldCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3JGdW5jdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAobWVtYmVyLnR5cGUgPT09ICdnZXQnKSB7XG4gICAgICAgICAgICBkZXNjcmlwdG9yLmdldCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb21tYW5kID0gXCJSRU1PVEVfQlJPV1NFUl9NRU1CRVJfR0VUXCIgLyogQlJPV1NFUl9NRU1CRVJfR0VUICovO1xuICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBlbGVjdHJvbl8xLmlwY1JlbmRlcmVyLnNlbmRTeW5jKGNvbW1hbmQsIGNvbnRleHRJZCwgbWV0YUlkLCBtZW1iZXIubmFtZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ldGFUb1ZhbHVlKG1ldGEpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChtZW1iZXIud3JpdGFibGUpIHtcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLnNldCA9ICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcmdzID0gd3JhcEFyZ3MoW3ZhbHVlXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbW1hbmQgPSBcIlJFTU9URV9CUk9XU0VSX01FTUJFUl9TRVRcIiAvKiBCUk9XU0VSX01FTUJFUl9TRVQgKi87XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1ldGEgPSBlbGVjdHJvbl8xLmlwY1JlbmRlcmVyLnNlbmRTeW5jKGNvbW1hbmQsIGNvbnRleHRJZCwgbWV0YUlkLCBtZW1iZXIubmFtZSwgYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChtZXRhICE9IG51bGwpXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhVG9WYWx1ZShtZXRhKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iamVjdCwgbWVtYmVyLm5hbWUsIGRlc2NyaXB0b3IpO1xuICAgIH1cbn1cbi8vIFBvcHVsYXRlIG9iamVjdCdzIHByb3RvdHlwZSBmcm9tIGRlc2NyaXB0b3IuXG4vLyBUaGlzIG1hdGNoZXMgfGdldE9iamVjdFByb3RvdHlwZXwgaW4gcnBjLXNlcnZlci5cbmZ1bmN0aW9uIHNldE9iamVjdFByb3RvdHlwZShyZWYsIG9iamVjdCwgbWV0YUlkLCBkZXNjcmlwdG9yKSB7XG4gICAgaWYgKGRlc2NyaXB0b3IgPT09IG51bGwpXG4gICAgICAgIHJldHVybjtcbiAgICBjb25zdCBwcm90byA9IHt9O1xuICAgIHNldE9iamVjdE1lbWJlcnMocmVmLCBwcm90bywgbWV0YUlkLCBkZXNjcmlwdG9yLm1lbWJlcnMpO1xuICAgIHNldE9iamVjdFByb3RvdHlwZShyZWYsIHByb3RvLCBtZXRhSWQsIGRlc2NyaXB0b3IucHJvdG8pO1xuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihvYmplY3QsIHByb3RvKTtcbn1cbi8vIFdyYXAgZnVuY3Rpb24gaW4gUHJveHkgZm9yIGFjY2Vzc2luZyByZW1vdGUgcHJvcGVydGllc1xuZnVuY3Rpb24gcHJveHlGdW5jdGlvblByb3BlcnRpZXMocmVtb3RlTWVtYmVyRnVuY3Rpb24sIG1ldGFJZCwgbmFtZSkge1xuICAgIGxldCBsb2FkZWQgPSBmYWxzZTtcbiAgICAvLyBMYXppbHkgbG9hZCBmdW5jdGlvbiBwcm9wZXJ0aWVzXG4gICAgY29uc3QgbG9hZFJlbW90ZVByb3BlcnRpZXMgPSAoKSA9PiB7XG4gICAgICAgIGlmIChsb2FkZWQpXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIGxvYWRlZCA9IHRydWU7XG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBcIlJFTU9URV9CUk9XU0VSX01FTUJFUl9HRVRcIiAvKiBCUk9XU0VSX01FTUJFUl9HRVQgKi87XG4gICAgICAgIGNvbnN0IG1ldGEgPSBlbGVjdHJvbl8xLmlwY1JlbmRlcmVyLnNlbmRTeW5jKGNvbW1hbmQsIGNvbnRleHRJZCwgbWV0YUlkLCBuYW1lKTtcbiAgICAgICAgc2V0T2JqZWN0TWVtYmVycyhyZW1vdGVNZW1iZXJGdW5jdGlvbiwgcmVtb3RlTWVtYmVyRnVuY3Rpb24sIG1ldGEuaWQsIG1ldGEubWVtYmVycyk7XG4gICAgfTtcbiAgICByZXR1cm4gbmV3IFByb3h5KHJlbW90ZU1lbWJlckZ1bmN0aW9uLCB7XG4gICAgICAgIHNldDogKHRhcmdldCwgcHJvcGVydHksIHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAocHJvcGVydHkgIT09ICdyZWYnKVxuICAgICAgICAgICAgICAgIGxvYWRSZW1vdGVQcm9wZXJ0aWVzKCk7XG4gICAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0OiAodGFyZ2V0LCBwcm9wZXJ0eSkgPT4ge1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSBJU19SRU1PVEVfUFJPWFkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0YXJnZXQsIHByb3BlcnR5KSlcbiAgICAgICAgICAgICAgICBsb2FkUmVtb3RlUHJvcGVydGllcygpO1xuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSB0YXJnZXRbcHJvcGVydHldO1xuICAgICAgICAgICAgaWYgKHByb3BlcnR5ID09PSAndG9TdHJpbmcnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZS5iaW5kKHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIG93bktleXM6ICh0YXJnZXQpID0+IHtcbiAgICAgICAgICAgIGxvYWRSZW1vdGVQcm9wZXJ0aWVzKCk7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAodGFyZ2V0LCBwcm9wZXJ0eSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eSk7XG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRvcilcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgICAgICAgICAgIGxvYWRSZW1vdGVQcm9wZXJ0aWVzKCk7XG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8gQ29udmVydCBtZXRhIGRhdGEgZnJvbSBicm93c2VyIGludG8gcmVhbCB2YWx1ZS5cbmZ1bmN0aW9uIG1ldGFUb1ZhbHVlKG1ldGEpIHtcbiAgICBpZiAobWV0YS50eXBlID09PSAndmFsdWUnKSB7XG4gICAgICAgIHJldHVybiBtZXRhLnZhbHVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXRhLnR5cGUgPT09ICdhcnJheScpIHtcbiAgICAgICAgcmV0dXJuIG1ldGEubWVtYmVycy5tYXAoKG1lbWJlcikgPT4gbWV0YVRvVmFsdWUobWVtYmVyKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1ldGEudHlwZSA9PT0gJ25hdGl2ZWltYWdlJykge1xuICAgICAgICByZXR1cm4gdHlwZV91dGlsc18xLmRlc2VyaWFsaXplKG1ldGEudmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXRhLnR5cGUgPT09ICdidWZmZXInKSB7XG4gICAgICAgIHJldHVybiBCdWZmZXIuZnJvbShtZXRhLnZhbHVlLmJ1ZmZlciwgbWV0YS52YWx1ZS5ieXRlT2Zmc2V0LCBtZXRhLnZhbHVlLmJ5dGVMZW5ndGgpO1xuICAgIH1cbiAgICBlbHNlIGlmIChtZXRhLnR5cGUgPT09ICdwcm9taXNlJykge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgdGhlbjogbWV0YVRvVmFsdWUobWV0YS50aGVuKSB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWV0YS50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgIHJldHVybiBtZXRhVG9FcnJvcihtZXRhKTtcbiAgICB9XG4gICAgZWxzZSBpZiAobWV0YS50eXBlID09PSAnZXhjZXB0aW9uJykge1xuICAgICAgICBpZiAobWV0YS52YWx1ZS50eXBlID09PSAnZXJyb3InKSB7XG4gICAgICAgICAgICB0aHJvdyBtZXRhVG9FcnJvcihtZXRhLnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5leHBlY3RlZCB2YWx1ZSB0eXBlIGluIGV4Y2VwdGlvbjogJHttZXRhLnZhbHVlLnR5cGV9YCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGxldCByZXQ7XG4gICAgICAgIGlmICgnaWQnIGluIG1ldGEpIHtcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlZCA9IGdldENhY2hlZFJlbW90ZU9iamVjdChtZXRhLmlkKTtcbiAgICAgICAgICAgIGlmIChjYWNoZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWNoZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gQSBzaGFkb3cgY2xhc3MgdG8gcmVwcmVzZW50IHRoZSByZW1vdGUgZnVuY3Rpb24gb2JqZWN0LlxuICAgICAgICBpZiAobWV0YS50eXBlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjb25zdCByZW1vdGVGdW5jdGlvbiA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgbGV0IGNvbW1hbmQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMgJiYgdGhpcy5jb25zdHJ1Y3RvciA9PT0gcmVtb3RlRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZCA9IFwiUkVNT1RFX0JST1dTRVJfQ09OU1RSVUNUT1JcIiAvKiBCUk9XU0VSX0NPTlNUUlVDVE9SICovO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZCA9IFwiUkVNT1RFX0JST1dTRVJfRlVOQ1RJT05fQ0FMTFwiIC8qIEJST1dTRVJfRlVOQ1RJT05fQ0FMTCAqLztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3Qgb2JqID0gZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5zZW5kU3luYyhjb21tYW5kLCBjb250ZXh0SWQsIG1ldGEuaWQsIHdyYXBBcmdzKGFyZ3MpKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWV0YVRvVmFsdWUob2JqKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXQgPSByZW1vdGVGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIHNldE9iamVjdE1lbWJlcnMocmV0LCByZXQsIG1ldGEuaWQsIG1ldGEubWVtYmVycyk7XG4gICAgICAgIHNldE9iamVjdFByb3RvdHlwZShyZXQsIHJldCwgbWV0YS5pZCwgbWV0YS5wcm90byk7XG4gICAgICAgIGlmIChyZXQuY29uc3RydWN0b3IgJiYgcmV0LmNvbnN0cnVjdG9yW0lTX1JFTU9URV9QUk9YWV0pIHtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXQuY29uc3RydWN0b3IsICduYW1lJywgeyB2YWx1ZTogbWV0YS5uYW1lIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFRyYWNrIGRlbGVnYXRlIG9iaidzIGxpZmV0aW1lICYgdGVsbCBicm93c2VyIHRvIGNsZWFuIHVwIHdoZW4gb2JqZWN0IGlzIEdDZWQuXG4gICAgICAgIGVsZWN0cm9uSWRzLnNldChyZXQsIG1ldGEuaWQpO1xuICAgICAgICBzZXRDYWNoZWRSZW1vdGVPYmplY3QobWV0YS5pZCwgcmV0KTtcbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG59XG5mdW5jdGlvbiBtZXRhVG9FcnJvcihtZXRhKSB7XG4gICAgY29uc3Qgb2JqID0gbWV0YS52YWx1ZTtcbiAgICBmb3IgKGNvbnN0IHsgbmFtZSwgdmFsdWUgfSBvZiBtZXRhLm1lbWJlcnMpIHtcbiAgICAgICAgb2JqW25hbWVdID0gbWV0YVRvVmFsdWUodmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqO1xufVxuZnVuY3Rpb24gaGFuZGxlTWVzc2FnZShjaGFubmVsLCBoYW5kbGVyKSB7XG4gICAgZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5vbihjaGFubmVsLCAoZXZlbnQsIHBhc3NlZENvbnRleHRJZCwgaWQsIC4uLmFyZ3MpID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LnNlbmRlcklkICE9PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBNZXNzYWdlICR7Y2hhbm5lbH0gc2VudCBieSB1bmV4cGVjdGVkIFdlYkNvbnRlbnRzICgke2V2ZW50LnNlbmRlcklkfSlgKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGFzc2VkQ29udGV4dElkID09PSBjb250ZXh0SWQpIHtcbiAgICAgICAgICAgIGhhbmRsZXIoaWQsIC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gTWVzc2FnZSBzZW50IHRvIGFuIHVuLWV4aXN0IGNvbnRleHQsIG5vdGlmeSB0aGUgZXJyb3IgdG8gbWFpbiBwcm9jZXNzLlxuICAgICAgICAgICAgZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5zZW5kKFwiUkVNT1RFX0JST1dTRVJfV1JPTkdfQ09OVEVYVF9FUlJPUlwiIC8qIEJST1dTRVJfV1JPTkdfQ09OVEVYVF9FUlJPUiAqLywgY29udGV4dElkLCBwYXNzZWRDb250ZXh0SWQsIGlkKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuY29uc3QgZW5hYmxlU3RhY2tzID0gcHJvY2Vzcy5hcmd2LmluY2x1ZGVzKCctLWVuYWJsZS1hcGktZmlsdGVyaW5nLWxvZ2dpbmcnKTtcbmZ1bmN0aW9uIGdldEN1cnJlbnRTdGFjaygpIHtcbiAgICBjb25zdCB0YXJnZXQgPSB7IHN0YWNrOiB1bmRlZmluZWQgfTtcbiAgICBpZiAoZW5hYmxlU3RhY2tzKSB7XG4gICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRhcmdldCwgZ2V0Q3VycmVudFN0YWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIHRhcmdldC5zdGFjaztcbn1cbi8vIEJyb3dzZXIgY2FsbHMgYSBjYWxsYmFjayBpbiByZW5kZXJlci5cbmhhbmRsZU1lc3NhZ2UoXCJSRU1PVEVfUkVOREVSRVJfQ0FMTEJBQ0tcIiAvKiBSRU5ERVJFUl9DQUxMQkFDSyAqLywgKGlkLCBhcmdzKSA9PiB7XG4gICAgY2FsbGJhY2tzUmVnaXN0cnkuYXBwbHkoaWQsIG1ldGFUb1ZhbHVlKGFyZ3MpKTtcbn0pO1xuLy8gQSBjYWxsYmFjayBpbiBicm93c2VyIGlzIHJlbGVhc2VkLlxuaGFuZGxlTWVzc2FnZShcIlJFTU9URV9SRU5ERVJFUl9SRUxFQVNFX0NBTExCQUNLXCIgLyogUkVOREVSRVJfUkVMRUFTRV9DQUxMQkFDSyAqLywgKGlkKSA9PiB7XG4gICAgY2FsbGJhY2tzUmVnaXN0cnkucmVtb3ZlKGlkKTtcbn0pO1xuZXhwb3J0cy5yZXF1aXJlID0gKG1vZHVsZSkgPT4ge1xuICAgIGNvbnN0IGNvbW1hbmQgPSBcIlJFTU9URV9CUk9XU0VSX1JFUVVJUkVcIiAvKiBCUk9XU0VSX1JFUVVJUkUgKi87XG4gICAgY29uc3QgbWV0YSA9IGVsZWN0cm9uXzEuaXBjUmVuZGVyZXIuc2VuZFN5bmMoY29tbWFuZCwgY29udGV4dElkLCBtb2R1bGUsIGdldEN1cnJlbnRTdGFjaygpKTtcbiAgICByZXR1cm4gbWV0YVRvVmFsdWUobWV0YSk7XG59O1xuLy8gQWxpYXMgdG8gcmVtb3RlLnJlcXVpcmUoJ2VsZWN0cm9uJykueHh4LlxuZnVuY3Rpb24gZ2V0QnVpbHRpbihtb2R1bGUpIHtcbiAgICBjb25zdCBjb21tYW5kID0gXCJSRU1PVEVfQlJPV1NFUl9HRVRfQlVJTFRJTlwiIC8qIEJST1dTRVJfR0VUX0JVSUxUSU4gKi87XG4gICAgY29uc3QgbWV0YSA9IGVsZWN0cm9uXzEuaXBjUmVuZGVyZXIuc2VuZFN5bmMoY29tbWFuZCwgY29udGV4dElkLCBtb2R1bGUsIGdldEN1cnJlbnRTdGFjaygpKTtcbiAgICByZXR1cm4gbWV0YVRvVmFsdWUobWV0YSk7XG59XG5leHBvcnRzLmdldEJ1aWx0aW4gPSBnZXRCdWlsdGluO1xuZnVuY3Rpb24gZ2V0Q3VycmVudFdpbmRvdygpIHtcbiAgICBjb25zdCBjb21tYW5kID0gXCJSRU1PVEVfQlJPV1NFUl9HRVRfQ1VSUkVOVF9XSU5ET1dcIiAvKiBCUk9XU0VSX0dFVF9DVVJSRU5UX1dJTkRPVyAqLztcbiAgICBjb25zdCBtZXRhID0gZWxlY3Ryb25fMS5pcGNSZW5kZXJlci5zZW5kU3luYyhjb21tYW5kLCBjb250ZXh0SWQsIGdldEN1cnJlbnRTdGFjaygpKTtcbiAgICByZXR1cm4gbWV0YVRvVmFsdWUobWV0YSk7XG59XG5leHBvcnRzLmdldEN1cnJlbnRXaW5kb3cgPSBnZXRDdXJyZW50V2luZG93O1xuLy8gR2V0IGN1cnJlbnQgV2ViQ29udGVudHMgb2JqZWN0LlxuZnVuY3Rpb24gZ2V0Q3VycmVudFdlYkNvbnRlbnRzKCkge1xuICAgIGNvbnN0IGNvbW1hbmQgPSBcIlJFTU9URV9CUk9XU0VSX0dFVF9DVVJSRU5UX1dFQl9DT05URU5UU1wiIC8qIEJST1dTRVJfR0VUX0NVUlJFTlRfV0VCX0NPTlRFTlRTICovO1xuICAgIGNvbnN0IG1ldGEgPSBlbGVjdHJvbl8xLmlwY1JlbmRlcmVyLnNlbmRTeW5jKGNvbW1hbmQsIGNvbnRleHRJZCwgZ2V0Q3VycmVudFN0YWNrKCkpO1xuICAgIHJldHVybiBtZXRhVG9WYWx1ZShtZXRhKTtcbn1cbmV4cG9ydHMuZ2V0Q3VycmVudFdlYkNvbnRlbnRzID0gZ2V0Q3VycmVudFdlYkNvbnRlbnRzO1xuLy8gR2V0IGEgZ2xvYmFsIG9iamVjdCBpbiBicm93c2VyLlxuZnVuY3Rpb24gZ2V0R2xvYmFsKG5hbWUpIHtcbiAgICBjb25zdCBjb21tYW5kID0gXCJSRU1PVEVfQlJPV1NFUl9HRVRfR0xPQkFMXCIgLyogQlJPV1NFUl9HRVRfR0xPQkFMICovO1xuICAgIGNvbnN0IG1ldGEgPSBlbGVjdHJvbl8xLmlwY1JlbmRlcmVyLnNlbmRTeW5jKGNvbW1hbmQsIGNvbnRleHRJZCwgbmFtZSwgZ2V0Q3VycmVudFN0YWNrKCkpO1xuICAgIHJldHVybiBtZXRhVG9WYWx1ZShtZXRhKTtcbn1cbmV4cG9ydHMuZ2V0R2xvYmFsID0gZ2V0R2xvYmFsO1xuLy8gR2V0IHRoZSBwcm9jZXNzIG9iamVjdCBpbiBicm93c2VyLlxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdwcm9jZXNzJywge1xuICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgZ2V0OiAoKSA9PiBleHBvcnRzLmdldEdsb2JhbCgncHJvY2VzcycpXG59KTtcbi8vIENyZWF0ZSBhIGZ1bmN0aW9uIHRoYXQgd2lsbCByZXR1cm4gdGhlIHNwZWNpZmllZCB2YWx1ZSB3aGVuIGNhbGxlZCBpbiBicm93c2VyLlxuZnVuY3Rpb24gY3JlYXRlRnVuY3Rpb25XaXRoUmV0dXJuVmFsdWUocmV0dXJuVmFsdWUpIHtcbiAgICBjb25zdCBmdW5jID0gKCkgPT4gcmV0dXJuVmFsdWU7XG4gICAgaXNSZXR1cm5WYWx1ZS5hZGQoZnVuYyk7XG4gICAgcmV0dXJuIGZ1bmM7XG59XG5leHBvcnRzLmNyZWF0ZUZ1bmN0aW9uV2l0aFJldHVyblZhbHVlID0gY3JlYXRlRnVuY3Rpb25XaXRoUmV0dXJuVmFsdWU7XG5jb25zdCBhZGRCdWlsdGluUHJvcGVydHkgPSAobmFtZSkgPT4ge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGdldDogKCkgPT4gZXhwb3J0cy5nZXRCdWlsdGluKG5hbWUpXG4gICAgfSk7XG59O1xubW9kdWxlX25hbWVzXzEuYnJvd3Nlck1vZHVsZU5hbWVzXG4gICAgLmZvckVhY2goYWRkQnVpbHRpblByb3BlcnR5KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vZGlzdC9zcmMvcmVuZGVyZXInKVxuIiwiY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuY29uc3QgcGF0aEZpbGUgPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAncGF0aC50eHQnKTtcblxuZnVuY3Rpb24gZ2V0RWxlY3Ryb25QYXRoICgpIHtcbiAgbGV0IGV4ZWN1dGFibGVQYXRoO1xuICBpZiAoZnMuZXhpc3RzU3luYyhwYXRoRmlsZSkpIHtcbiAgICBleGVjdXRhYmxlUGF0aCA9IGZzLnJlYWRGaWxlU3luYyhwYXRoRmlsZSwgJ3V0Zi04Jyk7XG4gIH1cbiAgaWYgKHByb2Nlc3MuZW52LkVMRUNUUk9OX09WRVJSSURFX0RJU1RfUEFUSCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4ocHJvY2Vzcy5lbnYuRUxFQ1RST05fT1ZFUlJJREVfRElTVF9QQVRILCBleGVjdXRhYmxlUGF0aCB8fCAnZWxlY3Ryb24nKTtcbiAgfVxuICBpZiAoZXhlY3V0YWJsZVBhdGgpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2Rpc3QnLCBleGVjdXRhYmxlUGF0aCk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFbGVjdHJvbiBmYWlsZWQgdG8gaW5zdGFsbCBjb3JyZWN0bHksIHBsZWFzZSBkZWxldGUgbm9kZV9tb2R1bGVzL2VsZWN0cm9uIGFuZCB0cnkgaW5zdGFsbGluZyBhZ2FpbicpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0RWxlY3Ryb25QYXRoKCk7XG4iLCIvKipcbiAqIG1hcmtlZCAtIGEgbWFya2Rvd24gcGFyc2VyXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAyMSwgQ2hyaXN0b3BoZXIgSmVmZnJleS4gKE1JVCBMaWNlbnNlZClcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZWRqcy9tYXJrZWRcbiAqL1xuXG4vKipcbiAqIERPIE5PVCBFRElUIFRISVMgRklMRVxuICogVGhlIGNvZGUgaW4gdGhpcyBmaWxlIGlzIGdlbmVyYXRlZCBmcm9tIGZpbGVzIGluIC4vc3JjL1xuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJyA/IGdsb2JhbFRoaXMgOiBnbG9iYWwgfHwgc2VsZiwgZ2xvYmFsLm1hcmtlZCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH1cblxuICBmdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gICAgaWYgKCFvKSByZXR1cm47XG4gICAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbiAgICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gICAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgICBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTtcbiAgICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIH1cblxuICBmdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICAgIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgcmV0dXJuIGFycjI7XG4gIH1cblxuICBmdW5jdGlvbiBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlckxvb3NlKG8sIGFsbG93QXJyYXlMaWtlKSB7XG4gICAgdmFyIGl0ID0gdHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl0gfHwgb1tcIkBAaXRlcmF0b3JcIl07XG4gICAgaWYgKGl0KSByZXR1cm4gKGl0ID0gaXQuY2FsbChvKSkubmV4dC5iaW5kKGl0KTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KG8pIHx8IChpdCA9IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvKSkgfHwgYWxsb3dBcnJheUxpa2UgJiYgbyAmJiB0eXBlb2Ygby5sZW5ndGggPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGlmIChpdCkgbyA9IGl0O1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGkgPj0gby5sZW5ndGgpIHJldHVybiB7XG4gICAgICAgICAgZG9uZTogdHJ1ZVxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGRvbmU6IGZhbHNlLFxuICAgICAgICAgIHZhbHVlOiBvW2krK11cbiAgICAgICAgfTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBpdGVyYXRlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpO1xuICB9XG5cbiAgdmFyIGRlZmF1bHRzJDUgPSB7ZXhwb3J0czoge319O1xuXG4gIGZ1bmN0aW9uIGdldERlZmF1bHRzJDEoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJhc2VVcmw6IG51bGwsXG4gICAgICBicmVha3M6IGZhbHNlLFxuICAgICAgZXh0ZW5zaW9uczogbnVsbCxcbiAgICAgIGdmbTogdHJ1ZSxcbiAgICAgIGhlYWRlcklkczogdHJ1ZSxcbiAgICAgIGhlYWRlclByZWZpeDogJycsXG4gICAgICBoaWdobGlnaHQ6IG51bGwsXG4gICAgICBsYW5nUHJlZml4OiAnbGFuZ3VhZ2UtJyxcbiAgICAgIG1hbmdsZTogdHJ1ZSxcbiAgICAgIHBlZGFudGljOiBmYWxzZSxcbiAgICAgIHJlbmRlcmVyOiBudWxsLFxuICAgICAgc2FuaXRpemU6IGZhbHNlLFxuICAgICAgc2FuaXRpemVyOiBudWxsLFxuICAgICAgc2lsZW50OiBmYWxzZSxcbiAgICAgIHNtYXJ0TGlzdHM6IGZhbHNlLFxuICAgICAgc21hcnR5cGFudHM6IGZhbHNlLFxuICAgICAgdG9rZW5pemVyOiBudWxsLFxuICAgICAgd2Fsa1Rva2VuczogbnVsbCxcbiAgICAgIHhodG1sOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBjaGFuZ2VEZWZhdWx0cyQxKG5ld0RlZmF1bHRzKSB7XG4gICAgZGVmYXVsdHMkNS5leHBvcnRzLmRlZmF1bHRzID0gbmV3RGVmYXVsdHM7XG4gIH1cblxuICBkZWZhdWx0cyQ1LmV4cG9ydHMgPSB7XG4gICAgZGVmYXVsdHM6IGdldERlZmF1bHRzJDEoKSxcbiAgICBnZXREZWZhdWx0czogZ2V0RGVmYXVsdHMkMSxcbiAgICBjaGFuZ2VEZWZhdWx0czogY2hhbmdlRGVmYXVsdHMkMVxuICB9O1xuXG4gIC8qKlxuICAgKiBIZWxwZXJzXG4gICAqL1xuICB2YXIgZXNjYXBlVGVzdCA9IC9bJjw+XCInXS87XG4gIHZhciBlc2NhcGVSZXBsYWNlID0gL1smPD5cIiddL2c7XG4gIHZhciBlc2NhcGVUZXN0Tm9FbmNvZGUgPSAvWzw+XCInXXwmKD8hIz9cXHcrOykvO1xuICB2YXIgZXNjYXBlUmVwbGFjZU5vRW5jb2RlID0gL1s8PlwiJ118Jig/ISM/XFx3KzspL2c7XG4gIHZhciBlc2NhcGVSZXBsYWNlbWVudHMgPSB7XG4gICAgJyYnOiAnJmFtcDsnLFxuICAgICc8JzogJyZsdDsnLFxuICAgICc+JzogJyZndDsnLFxuICAgICdcIic6ICcmcXVvdDsnLFxuICAgIFwiJ1wiOiAnJiMzOTsnXG4gIH07XG5cbiAgdmFyIGdldEVzY2FwZVJlcGxhY2VtZW50ID0gZnVuY3Rpb24gZ2V0RXNjYXBlUmVwbGFjZW1lbnQoY2gpIHtcbiAgICByZXR1cm4gZXNjYXBlUmVwbGFjZW1lbnRzW2NoXTtcbiAgfTtcblxuICBmdW5jdGlvbiBlc2NhcGUkMihodG1sLCBlbmNvZGUpIHtcbiAgICBpZiAoZW5jb2RlKSB7XG4gICAgICBpZiAoZXNjYXBlVGVzdC50ZXN0KGh0bWwpKSB7XG4gICAgICAgIHJldHVybiBodG1sLnJlcGxhY2UoZXNjYXBlUmVwbGFjZSwgZ2V0RXNjYXBlUmVwbGFjZW1lbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoZXNjYXBlVGVzdE5vRW5jb2RlLnRlc3QoaHRtbCkpIHtcbiAgICAgICAgcmV0dXJuIGh0bWwucmVwbGFjZShlc2NhcGVSZXBsYWNlTm9FbmNvZGUsIGdldEVzY2FwZVJlcGxhY2VtZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gIHZhciB1bmVzY2FwZVRlc3QgPSAvJigjKD86XFxkKyl8KD86I3hbMC05QS1GYS1mXSspfCg/OlxcdyspKTs/L2lnO1xuXG4gIGZ1bmN0aW9uIHVuZXNjYXBlJDEoaHRtbCkge1xuICAgIC8vIGV4cGxpY2l0bHkgbWF0Y2ggZGVjaW1hbCwgaGV4LCBhbmQgbmFtZWQgSFRNTCBlbnRpdGllc1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UodW5lc2NhcGVUZXN0LCBmdW5jdGlvbiAoXywgbikge1xuICAgICAgbiA9IG4udG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmIChuID09PSAnY29sb24nKSByZXR1cm4gJzonO1xuXG4gICAgICBpZiAobi5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgICByZXR1cm4gbi5jaGFyQXQoMSkgPT09ICd4JyA/IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQobi5zdWJzdHJpbmcoMiksIDE2KSkgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKCtuLnN1YnN0cmluZygxKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnJztcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBjYXJldCA9IC8oXnxbXlxcW10pXFxeL2c7XG5cbiAgZnVuY3Rpb24gZWRpdCQxKHJlZ2V4LCBvcHQpIHtcbiAgICByZWdleCA9IHJlZ2V4LnNvdXJjZSB8fCByZWdleDtcbiAgICBvcHQgPSBvcHQgfHwgJyc7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIHJlcGxhY2U6IGZ1bmN0aW9uIHJlcGxhY2UobmFtZSwgdmFsKSB7XG4gICAgICAgIHZhbCA9IHZhbC5zb3VyY2UgfHwgdmFsO1xuICAgICAgICB2YWwgPSB2YWwucmVwbGFjZShjYXJldCwgJyQxJyk7XG4gICAgICAgIHJlZ2V4ID0gcmVnZXgucmVwbGFjZShuYW1lLCB2YWwpO1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfSxcbiAgICAgIGdldFJlZ2V4OiBmdW5jdGlvbiBnZXRSZWdleCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAocmVnZXgsIG9wdCk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIG5vbldvcmRBbmRDb2xvblRlc3QgPSAvW15cXHc6XS9nO1xuICB2YXIgb3JpZ2luSW5kZXBlbmRlbnRVcmwgPSAvXiR8XlthLXpdW2EtejAtOSsuLV0qOnxeWz8jXS9pO1xuXG4gIGZ1bmN0aW9uIGNsZWFuVXJsJDEoc2FuaXRpemUsIGJhc2UsIGhyZWYpIHtcbiAgICBpZiAoc2FuaXRpemUpIHtcbiAgICAgIHZhciBwcm90O1xuXG4gICAgICB0cnkge1xuICAgICAgICBwcm90ID0gZGVjb2RlVVJJQ29tcG9uZW50KHVuZXNjYXBlJDEoaHJlZikpLnJlcGxhY2Uobm9uV29yZEFuZENvbG9uVGVzdCwgJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJvdC5pbmRleE9mKCdqYXZhc2NyaXB0OicpID09PSAwIHx8IHByb3QuaW5kZXhPZigndmJzY3JpcHQ6JykgPT09IDAgfHwgcHJvdC5pbmRleE9mKCdkYXRhOicpID09PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiYXNlICYmICFvcmlnaW5JbmRlcGVuZGVudFVybC50ZXN0KGhyZWYpKSB7XG4gICAgICBocmVmID0gcmVzb2x2ZVVybChiYXNlLCBocmVmKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgaHJlZiA9IGVuY29kZVVSSShocmVmKS5yZXBsYWNlKC8lMjUvZywgJyUnKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gaHJlZjtcbiAgfVxuXG4gIHZhciBiYXNlVXJscyA9IHt9O1xuICB2YXIganVzdERvbWFpbiA9IC9eW146XSs6XFwvKlteL10qJC87XG4gIHZhciBwcm90b2NvbCA9IC9eKFteOl0rOilbXFxzXFxTXSokLztcbiAgdmFyIGRvbWFpbiA9IC9eKFteOl0rOlxcLypbXi9dKilbXFxzXFxTXSokLztcblxuICBmdW5jdGlvbiByZXNvbHZlVXJsKGJhc2UsIGhyZWYpIHtcbiAgICBpZiAoIWJhc2VVcmxzWycgJyArIGJhc2VdKSB7XG4gICAgICAvLyB3ZSBjYW4gaWdub3JlIGV2ZXJ5dGhpbmcgaW4gYmFzZSBhZnRlciB0aGUgbGFzdCBzbGFzaCBvZiBpdHMgcGF0aCBjb21wb25lbnQsXG4gICAgICAvLyBidXQgd2UgbWlnaHQgbmVlZCB0byBhZGQgX3RoYXRfXG4gICAgICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjMzk4NiNzZWN0aW9uLTNcbiAgICAgIGlmIChqdXN0RG9tYWluLnRlc3QoYmFzZSkpIHtcbiAgICAgICAgYmFzZVVybHNbJyAnICsgYmFzZV0gPSBiYXNlICsgJy8nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFzZVVybHNbJyAnICsgYmFzZV0gPSBydHJpbSQxKGJhc2UsICcvJywgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYmFzZSA9IGJhc2VVcmxzWycgJyArIGJhc2VdO1xuICAgIHZhciByZWxhdGl2ZUJhc2UgPSBiYXNlLmluZGV4T2YoJzonKSA9PT0gLTE7XG5cbiAgICBpZiAoaHJlZi5zdWJzdHJpbmcoMCwgMikgPT09ICcvLycpIHtcbiAgICAgIGlmIChyZWxhdGl2ZUJhc2UpIHtcbiAgICAgICAgcmV0dXJuIGhyZWY7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiYXNlLnJlcGxhY2UocHJvdG9jb2wsICckMScpICsgaHJlZjtcbiAgICB9IGVsc2UgaWYgKGhyZWYuY2hhckF0KDApID09PSAnLycpIHtcbiAgICAgIGlmIChyZWxhdGl2ZUJhc2UpIHtcbiAgICAgICAgcmV0dXJuIGhyZWY7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBiYXNlLnJlcGxhY2UoZG9tYWluLCAnJDEnKSArIGhyZWY7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBiYXNlICsgaHJlZjtcbiAgICB9XG4gIH1cblxuICB2YXIgbm9vcFRlc3QkMSA9IHtcbiAgICBleGVjOiBmdW5jdGlvbiBub29wVGVzdCgpIHt9XG4gIH07XG5cbiAgZnVuY3Rpb24gbWVyZ2UkMihvYmopIHtcbiAgICB2YXIgaSA9IDEsXG4gICAgICAgIHRhcmdldCxcbiAgICAgICAga2V5O1xuXG4gICAgZm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRhcmdldCA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yIChrZXkgaW4gdGFyZ2V0KSB7XG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodGFyZ2V0LCBrZXkpKSB7XG4gICAgICAgICAgb2JqW2tleV0gPSB0YXJnZXRba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICBmdW5jdGlvbiBzcGxpdENlbGxzJDEodGFibGVSb3csIGNvdW50KSB7XG4gICAgLy8gZW5zdXJlIHRoYXQgZXZlcnkgY2VsbC1kZWxpbWl0aW5nIHBpcGUgaGFzIGEgc3BhY2VcbiAgICAvLyBiZWZvcmUgaXQgdG8gZGlzdGluZ3Vpc2ggaXQgZnJvbSBhbiBlc2NhcGVkIHBpcGVcbiAgICB2YXIgcm93ID0gdGFibGVSb3cucmVwbGFjZSgvXFx8L2csIGZ1bmN0aW9uIChtYXRjaCwgb2Zmc2V0LCBzdHIpIHtcbiAgICAgIHZhciBlc2NhcGVkID0gZmFsc2UsXG4gICAgICAgICAgY3VyciA9IG9mZnNldDtcblxuICAgICAgd2hpbGUgKC0tY3VyciA+PSAwICYmIHN0cltjdXJyXSA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIGVzY2FwZWQgPSAhZXNjYXBlZDtcbiAgICAgIH1cblxuICAgICAgaWYgKGVzY2FwZWQpIHtcbiAgICAgICAgLy8gb2RkIG51bWJlciBvZiBzbGFzaGVzIG1lYW5zIHwgaXMgZXNjYXBlZFxuICAgICAgICAvLyBzbyB3ZSBsZWF2ZSBpdCBhbG9uZVxuICAgICAgICByZXR1cm4gJ3wnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gYWRkIHNwYWNlIGJlZm9yZSB1bmVzY2FwZWQgfFxuICAgICAgICByZXR1cm4gJyB8JztcbiAgICAgIH1cbiAgICB9KSxcbiAgICAgICAgY2VsbHMgPSByb3cuc3BsaXQoLyBcXHwvKTtcbiAgICB2YXIgaSA9IDA7IC8vIEZpcnN0L2xhc3QgY2VsbCBpbiBhIHJvdyBjYW5ub3QgYmUgZW1wdHkgaWYgaXQgaGFzIG5vIGxlYWRpbmcvdHJhaWxpbmcgcGlwZVxuXG4gICAgaWYgKCFjZWxsc1swXS50cmltKCkpIHtcbiAgICAgIGNlbGxzLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgaWYgKCFjZWxsc1tjZWxscy5sZW5ndGggLSAxXS50cmltKCkpIHtcbiAgICAgIGNlbGxzLnBvcCgpO1xuICAgIH1cblxuICAgIGlmIChjZWxscy5sZW5ndGggPiBjb3VudCkge1xuICAgICAgY2VsbHMuc3BsaWNlKGNvdW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKGNlbGxzLmxlbmd0aCA8IGNvdW50KSB7XG4gICAgICAgIGNlbGxzLnB1c2goJycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoOyBpIDwgY2VsbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIC8vIGxlYWRpbmcgb3IgdHJhaWxpbmcgd2hpdGVzcGFjZSBpcyBpZ25vcmVkIHBlciB0aGUgZ2ZtIHNwZWNcbiAgICAgIGNlbGxzW2ldID0gY2VsbHNbaV0udHJpbSgpLnJlcGxhY2UoL1xcXFxcXHwvZywgJ3wnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2VsbHM7XG4gIH0gLy8gUmVtb3ZlIHRyYWlsaW5nICdjJ3MuIEVxdWl2YWxlbnQgdG8gc3RyLnJlcGxhY2UoL2MqJC8sICcnKS5cbiAgLy8gL2MqJC8gaXMgdnVsbmVyYWJsZSB0byBSRURPUy5cbiAgLy8gaW52ZXJ0OiBSZW1vdmUgc3VmZml4IG9mIG5vbi1jIGNoYXJzIGluc3RlYWQuIERlZmF1bHQgZmFsc2V5LlxuXG5cbiAgZnVuY3Rpb24gcnRyaW0kMShzdHIsIGMsIGludmVydCkge1xuICAgIHZhciBsID0gc3RyLmxlbmd0aDtcblxuICAgIGlmIChsID09PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSAvLyBMZW5ndGggb2Ygc3VmZml4IG1hdGNoaW5nIHRoZSBpbnZlcnQgY29uZGl0aW9uLlxuXG5cbiAgICB2YXIgc3VmZkxlbiA9IDA7IC8vIFN0ZXAgbGVmdCB1bnRpbCB3ZSBmYWlsIHRvIG1hdGNoIHRoZSBpbnZlcnQgY29uZGl0aW9uLlxuXG4gICAgd2hpbGUgKHN1ZmZMZW4gPCBsKSB7XG4gICAgICB2YXIgY3VyckNoYXIgPSBzdHIuY2hhckF0KGwgLSBzdWZmTGVuIC0gMSk7XG5cbiAgICAgIGlmIChjdXJyQ2hhciA9PT0gYyAmJiAhaW52ZXJ0KSB7XG4gICAgICAgIHN1ZmZMZW4rKztcbiAgICAgIH0gZWxzZSBpZiAoY3VyckNoYXIgIT09IGMgJiYgaW52ZXJ0KSB7XG4gICAgICAgIHN1ZmZMZW4rKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdHIuc3Vic3RyKDAsIGwgLSBzdWZmTGVuKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmRDbG9zaW5nQnJhY2tldCQxKHN0ciwgYikge1xuICAgIGlmIChzdHIuaW5kZXhPZihiWzFdKSA9PT0gLTEpIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG5cbiAgICB2YXIgbCA9IHN0ci5sZW5ndGg7XG4gICAgdmFyIGxldmVsID0gMCxcbiAgICAgICAgaSA9IDA7XG5cbiAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHN0cltpXSA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIGkrKztcbiAgICAgIH0gZWxzZSBpZiAoc3RyW2ldID09PSBiWzBdKSB7XG4gICAgICAgIGxldmVsKys7XG4gICAgICB9IGVsc2UgaWYgKHN0cltpXSA9PT0gYlsxXSkge1xuICAgICAgICBsZXZlbC0tO1xuXG4gICAgICAgIGlmIChsZXZlbCA8IDApIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNoZWNrU2FuaXRpemVEZXByZWNhdGlvbiQxKG9wdCkge1xuICAgIGlmIChvcHQgJiYgb3B0LnNhbml0aXplICYmICFvcHQuc2lsZW50KSB7XG4gICAgICBjb25zb2xlLndhcm4oJ21hcmtlZCgpOiBzYW5pdGl6ZSBhbmQgc2FuaXRpemVyIHBhcmFtZXRlcnMgYXJlIGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAwLjcuMCwgc2hvdWxkIG5vdCBiZSB1c2VkIGFuZCB3aWxsIGJlIHJlbW92ZWQgaW4gdGhlIGZ1dHVyZS4gUmVhZCBtb3JlIGhlcmU6IGh0dHBzOi8vbWFya2VkLmpzLm9yZy8jL1VTSU5HX0FEVkFOQ0VELm1kI29wdGlvbnMnKTtcbiAgICB9XG4gIH0gLy8gY29waWVkIGZyb20gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzU0NTAxMTMvODA2Nzc3XG5cblxuICBmdW5jdGlvbiByZXBlYXRTdHJpbmckMShwYXR0ZXJuLCBjb3VudCkge1xuICAgIGlmIChjb3VudCA8IDEpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0gJyc7XG5cbiAgICB3aGlsZSAoY291bnQgPiAxKSB7XG4gICAgICBpZiAoY291bnQgJiAxKSB7XG4gICAgICAgIHJlc3VsdCArPSBwYXR0ZXJuO1xuICAgICAgfVxuXG4gICAgICBjb3VudCA+Pj0gMTtcbiAgICAgIHBhdHRlcm4gKz0gcGF0dGVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0ICsgcGF0dGVybjtcbiAgfVxuXG4gIHZhciBoZWxwZXJzID0ge1xuICAgIGVzY2FwZTogZXNjYXBlJDIsXG4gICAgdW5lc2NhcGU6IHVuZXNjYXBlJDEsXG4gICAgZWRpdDogZWRpdCQxLFxuICAgIGNsZWFuVXJsOiBjbGVhblVybCQxLFxuICAgIHJlc29sdmVVcmw6IHJlc29sdmVVcmwsXG4gICAgbm9vcFRlc3Q6IG5vb3BUZXN0JDEsXG4gICAgbWVyZ2U6IG1lcmdlJDIsXG4gICAgc3BsaXRDZWxsczogc3BsaXRDZWxscyQxLFxuICAgIHJ0cmltOiBydHJpbSQxLFxuICAgIGZpbmRDbG9zaW5nQnJhY2tldDogZmluZENsb3NpbmdCcmFja2V0JDEsXG4gICAgY2hlY2tTYW5pdGl6ZURlcHJlY2F0aW9uOiBjaGVja1Nhbml0aXplRGVwcmVjYXRpb24kMSxcbiAgICByZXBlYXRTdHJpbmc6IHJlcGVhdFN0cmluZyQxXG4gIH07XG5cbiAgdmFyIGRlZmF1bHRzJDQgPSBkZWZhdWx0cyQ1LmV4cG9ydHMuZGVmYXVsdHM7XG4gIHZhciBydHJpbSA9IGhlbHBlcnMucnRyaW0sXG4gICAgICBzcGxpdENlbGxzID0gaGVscGVycy5zcGxpdENlbGxzLFxuICAgICAgX2VzY2FwZSA9IGhlbHBlcnMuZXNjYXBlLFxuICAgICAgZmluZENsb3NpbmdCcmFja2V0ID0gaGVscGVycy5maW5kQ2xvc2luZ0JyYWNrZXQ7XG5cbiAgZnVuY3Rpb24gb3V0cHV0TGluayhjYXAsIGxpbmssIHJhdywgbGV4ZXIpIHtcbiAgICB2YXIgaHJlZiA9IGxpbmsuaHJlZjtcbiAgICB2YXIgdGl0bGUgPSBsaW5rLnRpdGxlID8gX2VzY2FwZShsaW5rLnRpdGxlKSA6IG51bGw7XG4gICAgdmFyIHRleHQgPSBjYXBbMV0ucmVwbGFjZSgvXFxcXChbXFxbXFxdXSkvZywgJyQxJyk7XG5cbiAgICBpZiAoY2FwWzBdLmNoYXJBdCgwKSAhPT0gJyEnKSB7XG4gICAgICBsZXhlci5zdGF0ZS5pbkxpbmsgPSB0cnVlO1xuICAgICAgdmFyIHRva2VuID0ge1xuICAgICAgICB0eXBlOiAnbGluaycsXG4gICAgICAgIHJhdzogcmF3LFxuICAgICAgICBocmVmOiBocmVmLFxuICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgIHRva2VuczogbGV4ZXIuaW5saW5lVG9rZW5zKHRleHQsIFtdKVxuICAgICAgfTtcbiAgICAgIGxleGVyLnN0YXRlLmluTGluayA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRva2VuO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICByYXc6IHJhdyxcbiAgICAgICAgaHJlZjogaHJlZixcbiAgICAgICAgdGl0bGU6IHRpdGxlLFxuICAgICAgICB0ZXh0OiBfZXNjYXBlKHRleHQpXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluZGVudENvZGVDb21wZW5zYXRpb24ocmF3LCB0ZXh0KSB7XG4gICAgdmFyIG1hdGNoSW5kZW50VG9Db2RlID0gcmF3Lm1hdGNoKC9eKFxccyspKD86YGBgKS8pO1xuXG4gICAgaWYgKG1hdGNoSW5kZW50VG9Db2RlID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG5cbiAgICB2YXIgaW5kZW50VG9Db2RlID0gbWF0Y2hJbmRlbnRUb0NvZGVbMV07XG4gICAgcmV0dXJuIHRleHQuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbiAobm9kZSkge1xuICAgICAgdmFyIG1hdGNoSW5kZW50SW5Ob2RlID0gbm9kZS5tYXRjaCgvXlxccysvKTtcblxuICAgICAgaWYgKG1hdGNoSW5kZW50SW5Ob2RlID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuXG4gICAgICB2YXIgaW5kZW50SW5Ob2RlID0gbWF0Y2hJbmRlbnRJbk5vZGVbMF07XG5cbiAgICAgIGlmIChpbmRlbnRJbk5vZGUubGVuZ3RoID49IGluZGVudFRvQ29kZS5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIG5vZGUuc2xpY2UoaW5kZW50VG9Db2RlLmxlbmd0aCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0pLmpvaW4oJ1xcbicpO1xuICB9XG4gIC8qKlxuICAgKiBUb2tlbml6ZXJcbiAgICovXG5cblxuICB2YXIgVG9rZW5pemVyXzEgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFRva2VuaXplcihvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IGRlZmF1bHRzJDQ7XG4gICAgfVxuXG4gICAgdmFyIF9wcm90byA9IFRva2VuaXplci5wcm90b3R5cGU7XG5cbiAgICBfcHJvdG8uc3BhY2UgPSBmdW5jdGlvbiBzcGFjZShzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLm5ld2xpbmUuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIGlmIChjYXBbMF0ubGVuZ3RoID4gMSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0eXBlOiAnc3BhY2UnLFxuICAgICAgICAgICAgcmF3OiBjYXBbMF1cbiAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByYXc6ICdcXG4nXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5jb2RlID0gZnVuY3Rpb24gY29kZShzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmNvZGUuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHZhciB0ZXh0ID0gY2FwWzBdLnJlcGxhY2UoL14gezEsNH0vZ20sICcnKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAnY29kZScsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgY29kZUJsb2NrU3R5bGU6ICdpbmRlbnRlZCcsXG4gICAgICAgICAgdGV4dDogIXRoaXMub3B0aW9ucy5wZWRhbnRpYyA/IHJ0cmltKHRleHQsICdcXG4nKSA6IHRleHRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmZlbmNlcyA9IGZ1bmN0aW9uIGZlbmNlcyhzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmZlbmNlcy5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIHJhdyA9IGNhcFswXTtcbiAgICAgICAgdmFyIHRleHQgPSBpbmRlbnRDb2RlQ29tcGVuc2F0aW9uKHJhdywgY2FwWzNdIHx8ICcnKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAnY29kZScsXG4gICAgICAgICAgcmF3OiByYXcsXG4gICAgICAgICAgbGFuZzogY2FwWzJdID8gY2FwWzJdLnRyaW0oKSA6IGNhcFsyXSxcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5oZWFkaW5nID0gZnVuY3Rpb24gaGVhZGluZyhzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmhlYWRpbmcuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHZhciB0ZXh0ID0gY2FwWzJdLnRyaW0oKTsgLy8gcmVtb3ZlIHRyYWlsaW5nICNzXG5cbiAgICAgICAgaWYgKC8jJC8udGVzdCh0ZXh0KSkge1xuICAgICAgICAgIHZhciB0cmltbWVkID0gcnRyaW0odGV4dCwgJyMnKTtcblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICAgICAgICAgIHRleHQgPSB0cmltbWVkLnRyaW0oKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCF0cmltbWVkIHx8IC8gJC8udGVzdCh0cmltbWVkKSkge1xuICAgICAgICAgICAgLy8gQ29tbW9uTWFyayByZXF1aXJlcyBzcGFjZSBiZWZvcmUgdHJhaWxpbmcgI3NcbiAgICAgICAgICAgIHRleHQgPSB0cmltbWVkLnRyaW0oKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdG9rZW4gPSB7XG4gICAgICAgICAgdHlwZTogJ2hlYWRpbmcnLFxuICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgIGRlcHRoOiBjYXBbMV0ubGVuZ3RoLFxuICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgdG9rZW5zOiBbXVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxleGVyLmlubGluZSh0b2tlbi50ZXh0LCB0b2tlbi50b2tlbnMpO1xuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5ociA9IGZ1bmN0aW9uIGhyKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuYmxvY2suaHIuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogJ2hyJyxcbiAgICAgICAgICByYXc6IGNhcFswXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8uYmxvY2txdW90ZSA9IGZ1bmN0aW9uIGJsb2NrcXVvdGUoc3JjKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5ibG9ja3F1b3RlLmV4ZWMoc3JjKTtcblxuICAgICAgaWYgKGNhcCkge1xuICAgICAgICB2YXIgdGV4dCA9IGNhcFswXS5yZXBsYWNlKC9eICo+ID8vZ20sICcnKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAnYmxvY2txdW90ZScsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgdG9rZW5zOiB0aGlzLmxleGVyLmJsb2NrVG9rZW5zKHRleHQsIFtdKSxcbiAgICAgICAgICB0ZXh0OiB0ZXh0XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5saXN0ID0gZnVuY3Rpb24gbGlzdChzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmxpc3QuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHZhciByYXcsIGlzdGFzaywgaXNjaGVja2VkLCBpbmRlbnQsIGksIGJsYW5rTGluZSwgZW5kc1dpdGhCbGFua0xpbmUsIGxpbmUsIGxpbmVzLCBpdGVtQ29udGVudHM7XG4gICAgICAgIHZhciBidWxsID0gY2FwWzFdLnRyaW0oKTtcbiAgICAgICAgdmFyIGlzb3JkZXJlZCA9IGJ1bGwubGVuZ3RoID4gMTtcbiAgICAgICAgdmFyIGxpc3QgPSB7XG4gICAgICAgICAgdHlwZTogJ2xpc3QnLFxuICAgICAgICAgIHJhdzogJycsXG4gICAgICAgICAgb3JkZXJlZDogaXNvcmRlcmVkLFxuICAgICAgICAgIHN0YXJ0OiBpc29yZGVyZWQgPyArYnVsbC5zbGljZSgwLCAtMSkgOiAnJyxcbiAgICAgICAgICBsb29zZTogZmFsc2UsXG4gICAgICAgICAgaXRlbXM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIGJ1bGwgPSBpc29yZGVyZWQgPyBcIlxcXFxkezEsOX1cXFxcXCIgKyBidWxsLnNsaWNlKC0xKSA6IFwiXFxcXFwiICsgYnVsbDtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICAgICAgYnVsbCA9IGlzb3JkZXJlZCA/IGJ1bGwgOiAnWyorLV0nO1xuICAgICAgICB9IC8vIEdldCBuZXh0IGxpc3QgaXRlbVxuXG5cbiAgICAgICAgdmFyIGl0ZW1SZWdleCA9IG5ldyBSZWdFeHAoXCJeKCB7MCwzfVwiICsgYnVsbCArIFwiKSgoPzogW15cXFxcbl0qfCAqKSg/OlxcXFxuW15cXFxcbl0qKSooPzpcXFxcbnwkKSlcIik7IC8vIEdldCBlYWNoIHRvcC1sZXZlbCBpdGVtXG5cbiAgICAgICAgd2hpbGUgKHNyYykge1xuICAgICAgICAgIGlmICh0aGlzLnJ1bGVzLmJsb2NrLmhyLnRlc3Qoc3JjKSkge1xuICAgICAgICAgICAgLy8gRW5kIGxpc3QgaWYgd2UgZW5jb3VudGVyIGFuIEhSIChwb3NzaWJseSBtb3ZlIGludG8gaXRlbVJlZ2V4PylcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghKGNhcCA9IGl0ZW1SZWdleC5leGVjKHNyYykpKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsaW5lcyA9IGNhcFsyXS5zcGxpdCgnXFxuJyk7XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICAgICAgICBpbmRlbnQgPSAyO1xuICAgICAgICAgICAgaXRlbUNvbnRlbnRzID0gbGluZXNbMF0udHJpbUxlZnQoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaW5kZW50ID0gY2FwWzJdLnNlYXJjaCgvW14gXS8pOyAvLyBGaW5kIGZpcnN0IG5vbi1zcGFjZSBjaGFyXG5cbiAgICAgICAgICAgIGluZGVudCA9IGNhcFsxXS5sZW5ndGggKyAoaW5kZW50ID4gNCA/IDEgOiBpbmRlbnQpOyAvLyBpbnRlbnRlZCBjb2RlIGJsb2NrcyBhZnRlciA0IHNwYWNlczsgaW5kZW50IGlzIGFsd2F5cyAxXG5cbiAgICAgICAgICAgIGl0ZW1Db250ZW50cyA9IGxpbmVzWzBdLnNsaWNlKGluZGVudCAtIGNhcFsxXS5sZW5ndGgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGJsYW5rTGluZSA9IGZhbHNlO1xuICAgICAgICAgIHJhdyA9IGNhcFswXTtcblxuICAgICAgICAgIGlmICghbGluZXNbMF0gJiYgL14gKiQvLnRlc3QobGluZXNbMV0pKSB7XG4gICAgICAgICAgICAvLyBpdGVtcyBiZWdpbiB3aXRoIGF0IG1vc3Qgb25lIGJsYW5rIGxpbmVcbiAgICAgICAgICAgIHJhdyA9IGNhcFsxXSArIGxpbmVzLnNsaWNlKDAsIDIpLmpvaW4oJ1xcbicpICsgJ1xcbic7XG4gICAgICAgICAgICBsaXN0Lmxvb3NlID0gdHJ1ZTtcbiAgICAgICAgICAgIGxpbmVzID0gW107XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIG5leHRCdWxsZXRSZWdleCA9IG5ldyBSZWdFeHAoXCJeIHswLFwiICsgTWF0aC5taW4oMywgaW5kZW50IC0gMSkgKyBcIn0oPzpbKistXXxcXFxcZHsxLDl9Wy4pXSlcIik7XG5cbiAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgbGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxpbmUgPSBsaW5lc1tpXTtcblxuICAgICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYykge1xuICAgICAgICAgICAgICAvLyBSZS1hbGlnbiB0byBmb2xsb3cgY29tbW9ubWFyayBuZXN0aW5nIHJ1bGVzXG4gICAgICAgICAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL14gezEsNH0oPz0oIHs0fSkqW14gXSkvZywgJyAgJyk7XG4gICAgICAgICAgICB9IC8vIEVuZCBsaXN0IGl0ZW0gaWYgZm91bmQgc3RhcnQgb2YgbmV3IGJ1bGxldFxuXG5cbiAgICAgICAgICAgIGlmIChuZXh0QnVsbGV0UmVnZXgudGVzdChsaW5lKSkge1xuICAgICAgICAgICAgICByYXcgPSBjYXBbMV0gKyBsaW5lcy5zbGljZSgwLCBpKS5qb2luKCdcXG4nKSArICdcXG4nO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gLy8gVW50aWwgd2UgZW5jb3VudGVyIGEgYmxhbmsgbGluZSwgaXRlbSBjb250ZW50cyBkbyBub3QgbmVlZCBpbmRlbnRhdGlvblxuXG5cbiAgICAgICAgICAgIGlmICghYmxhbmtMaW5lKSB7XG4gICAgICAgICAgICAgIGlmICghbGluZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiBjdXJyZW50IGxpbmUgaXMgZW1wdHlcbiAgICAgICAgICAgICAgICBibGFua0xpbmUgPSB0cnVlO1xuICAgICAgICAgICAgICB9IC8vIERlZGVudCBpZiBwb3NzaWJsZVxuXG5cbiAgICAgICAgICAgICAgaWYgKGxpbmUuc2VhcmNoKC9bXiBdLykgPj0gaW5kZW50KSB7XG4gICAgICAgICAgICAgICAgaXRlbUNvbnRlbnRzICs9ICdcXG4nICsgbGluZS5zbGljZShpbmRlbnQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGl0ZW1Db250ZW50cyArPSAnXFxuJyArIGxpbmU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gLy8gRGVkZW50IHRoaXMgbGluZVxuXG5cbiAgICAgICAgICAgIGlmIChsaW5lLnNlYXJjaCgvW14gXS8pID49IGluZGVudCB8fCAhbGluZS50cmltKCkpIHtcbiAgICAgICAgICAgICAgaXRlbUNvbnRlbnRzICs9ICdcXG4nICsgbGluZS5zbGljZShpbmRlbnQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIExpbmUgd2FzIG5vdCBwcm9wZXJseSBpbmRlbnRlZDsgZW5kIG9mIHRoaXMgaXRlbVxuICAgICAgICAgICAgICByYXcgPSBjYXBbMV0gKyBsaW5lcy5zbGljZSgwLCBpKS5qb2luKCdcXG4nKSArICdcXG4nO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWxpc3QubG9vc2UpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBwcmV2aW91cyBpdGVtIGVuZGVkIHdpdGggYSBibGFuayBsaW5lLCB0aGUgbGlzdCBpcyBsb29zZVxuICAgICAgICAgICAgaWYgKGVuZHNXaXRoQmxhbmtMaW5lKSB7XG4gICAgICAgICAgICAgIGxpc3QubG9vc2UgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgvXFxuICpcXG4gKiQvLnRlc3QocmF3KSkge1xuICAgICAgICAgICAgICBlbmRzV2l0aEJsYW5rTGluZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSAvLyBDaGVjayBmb3IgdGFzayBsaXN0IGl0ZW1zXG5cblxuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZ2ZtKSB7XG4gICAgICAgICAgICBpc3Rhc2sgPSAvXlxcW1sgeFhdXFxdIC8uZXhlYyhpdGVtQ29udGVudHMpO1xuXG4gICAgICAgICAgICBpZiAoaXN0YXNrKSB7XG4gICAgICAgICAgICAgIGlzY2hlY2tlZCA9IGlzdGFza1swXSAhPT0gJ1sgXSAnO1xuICAgICAgICAgICAgICBpdGVtQ29udGVudHMgPSBpdGVtQ29udGVudHMucmVwbGFjZSgvXlxcW1sgeFhdXFxdICsvLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGlzdC5pdGVtcy5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICdsaXN0X2l0ZW0nLFxuICAgICAgICAgICAgcmF3OiByYXcsXG4gICAgICAgICAgICB0YXNrOiAhIWlzdGFzayxcbiAgICAgICAgICAgIGNoZWNrZWQ6IGlzY2hlY2tlZCxcbiAgICAgICAgICAgIGxvb3NlOiBmYWxzZSxcbiAgICAgICAgICAgIHRleHQ6IGl0ZW1Db250ZW50c1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGxpc3QucmF3ICs9IHJhdztcbiAgICAgICAgICBzcmMgPSBzcmMuc2xpY2UocmF3Lmxlbmd0aCk7XG4gICAgICAgIH0gLy8gRG8gbm90IGNvbnN1bWUgbmV3bGluZXMgYXQgZW5kIG9mIGZpbmFsIGl0ZW0uIEFsdGVybmF0aXZlbHksIG1ha2UgaXRlbVJlZ2V4ICpzdGFydCogd2l0aCBhbnkgbmV3bGluZXMgdG8gc2ltcGxpZnkvc3BlZWQgdXAgZW5kc1dpdGhCbGFua0xpbmUgbG9naWNcblxuXG4gICAgICAgIGxpc3QuaXRlbXNbbGlzdC5pdGVtcy5sZW5ndGggLSAxXS5yYXcgPSByYXcudHJpbVJpZ2h0KCk7XG4gICAgICAgIGxpc3QuaXRlbXNbbGlzdC5pdGVtcy5sZW5ndGggLSAxXS50ZXh0ID0gaXRlbUNvbnRlbnRzLnRyaW1SaWdodCgpO1xuICAgICAgICBsaXN0LnJhdyA9IGxpc3QucmF3LnRyaW1SaWdodCgpO1xuICAgICAgICB2YXIgbCA9IGxpc3QuaXRlbXMubGVuZ3RoOyAvLyBJdGVtIGNoaWxkIHRva2VucyBoYW5kbGVkIGhlcmUgYXQgZW5kIGJlY2F1c2Ugd2UgbmVlZGVkIHRvIGhhdmUgdGhlIGZpbmFsIGl0ZW0gdG8gdHJpbSBpdCBmaXJzdFxuXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICB0aGlzLmxleGVyLnN0YXRlLnRvcCA9IGZhbHNlO1xuICAgICAgICAgIGxpc3QuaXRlbXNbaV0udG9rZW5zID0gdGhpcy5sZXhlci5ibG9ja1Rva2VucyhsaXN0Lml0ZW1zW2ldLnRleHQsIFtdKTtcblxuICAgICAgICAgIGlmIChsaXN0Lml0ZW1zW2ldLnRva2Vucy5zb21lKGZ1bmN0aW9uICh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdC50eXBlID09PSAnc3BhY2UnO1xuICAgICAgICAgIH0pKSB7XG4gICAgICAgICAgICBsaXN0Lmxvb3NlID0gdHJ1ZTtcbiAgICAgICAgICAgIGxpc3QuaXRlbXNbaV0ubG9vc2UgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8uaHRtbCA9IGZ1bmN0aW9uIGh0bWwoc3JjKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5ibG9jay5odG1sLmV4ZWMoc3JjKTtcblxuICAgICAgaWYgKGNhcCkge1xuICAgICAgICB2YXIgdG9rZW4gPSB7XG4gICAgICAgICAgdHlwZTogJ2h0bWwnLFxuICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgIHByZTogIXRoaXMub3B0aW9ucy5zYW5pdGl6ZXIgJiYgKGNhcFsxXSA9PT0gJ3ByZScgfHwgY2FwWzFdID09PSAnc2NyaXB0JyB8fCBjYXBbMV0gPT09ICdzdHlsZScpLFxuICAgICAgICAgIHRleHQ6IGNhcFswXVxuICAgICAgICB9O1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2FuaXRpemUpIHtcbiAgICAgICAgICB0b2tlbi50eXBlID0gJ3BhcmFncmFwaCc7XG4gICAgICAgICAgdG9rZW4udGV4dCA9IHRoaXMub3B0aW9ucy5zYW5pdGl6ZXIgPyB0aGlzLm9wdGlvbnMuc2FuaXRpemVyKGNhcFswXSkgOiBfZXNjYXBlKGNhcFswXSk7XG4gICAgICAgICAgdG9rZW4udG9rZW5zID0gW107XG4gICAgICAgICAgdGhpcy5sZXhlci5pbmxpbmUodG9rZW4udGV4dCwgdG9rZW4udG9rZW5zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmRlZiA9IGZ1bmN0aW9uIGRlZihzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLmRlZi5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgaWYgKGNhcFszXSkgY2FwWzNdID0gY2FwWzNdLnN1YnN0cmluZygxLCBjYXBbM10ubGVuZ3RoIC0gMSk7XG4gICAgICAgIHZhciB0YWcgPSBjYXBbMV0udG9Mb3dlckNhc2UoKS5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogJ2RlZicsXG4gICAgICAgICAgdGFnOiB0YWcsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgaHJlZjogY2FwWzJdLFxuICAgICAgICAgIHRpdGxlOiBjYXBbM11cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLnRhYmxlID0gZnVuY3Rpb24gdGFibGUoc3JjKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5ibG9jay50YWJsZS5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIGl0ZW0gPSB7XG4gICAgICAgICAgdHlwZTogJ3RhYmxlJyxcbiAgICAgICAgICBoZWFkZXI6IHNwbGl0Q2VsbHMoY2FwWzFdKS5tYXAoZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHRleHQ6IGNcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSksXG4gICAgICAgICAgYWxpZ246IGNhcFsyXS5yZXBsYWNlKC9eICp8XFx8ICokL2csICcnKS5zcGxpdCgvICpcXHwgKi8pLFxuICAgICAgICAgIHJvd3M6IGNhcFszXSA/IGNhcFszXS5yZXBsYWNlKC9cXG4kLywgJycpLnNwbGl0KCdcXG4nKSA6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGl0ZW0uaGVhZGVyLmxlbmd0aCA9PT0gaXRlbS5hbGlnbi5sZW5ndGgpIHtcbiAgICAgICAgICBpdGVtLnJhdyA9IGNhcFswXTtcbiAgICAgICAgICB2YXIgbCA9IGl0ZW0uYWxpZ24ubGVuZ3RoO1xuICAgICAgICAgIHZhciBpLCBqLCBrLCByb3c7XG5cbiAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoL14gKi0rOiAqJC8udGVzdChpdGVtLmFsaWduW2ldKSkge1xuICAgICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gJ3JpZ2h0JztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoL14gKjotKzogKiQvLnRlc3QoaXRlbS5hbGlnbltpXSkpIHtcbiAgICAgICAgICAgICAgaXRlbS5hbGlnbltpXSA9ICdjZW50ZXInO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgvXiAqOi0rICokLy50ZXN0KGl0ZW0uYWxpZ25baV0pKSB7XG4gICAgICAgICAgICAgIGl0ZW0uYWxpZ25baV0gPSAnbGVmdCc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpdGVtLmFsaWduW2ldID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsID0gaXRlbS5yb3dzLmxlbmd0aDtcblxuICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICAgIGl0ZW0ucm93c1tpXSA9IHNwbGl0Q2VsbHMoaXRlbS5yb3dzW2ldLCBpdGVtLmhlYWRlci5sZW5ndGgpLm1hcChmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRleHQ6IGNcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gLy8gcGFyc2UgY2hpbGQgdG9rZW5zIGluc2lkZSBoZWFkZXJzIGFuZCBjZWxsc1xuICAgICAgICAgIC8vIGhlYWRlciBjaGlsZCB0b2tlbnNcblxuXG4gICAgICAgICAgbCA9IGl0ZW0uaGVhZGVyLmxlbmd0aDtcblxuICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBsOyBqKyspIHtcbiAgICAgICAgICAgIGl0ZW0uaGVhZGVyW2pdLnRva2VucyA9IFtdO1xuICAgICAgICAgICAgdGhpcy5sZXhlci5pbmxpbmVUb2tlbnMoaXRlbS5oZWFkZXJbal0udGV4dCwgaXRlbS5oZWFkZXJbal0udG9rZW5zKTtcbiAgICAgICAgICB9IC8vIGNlbGwgY2hpbGQgdG9rZW5zXG5cblxuICAgICAgICAgIGwgPSBpdGVtLnJvd3MubGVuZ3RoO1xuXG4gICAgICAgICAgZm9yIChqID0gMDsgaiA8IGw7IGorKykge1xuICAgICAgICAgICAgcm93ID0gaXRlbS5yb3dzW2pdO1xuXG4gICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgcm93Lmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICAgIHJvd1trXS50b2tlbnMgPSBbXTtcbiAgICAgICAgICAgICAgdGhpcy5sZXhlci5pbmxpbmVUb2tlbnMocm93W2tdLnRleHQsIHJvd1trXS50b2tlbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBpdGVtO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5saGVhZGluZyA9IGZ1bmN0aW9uIGxoZWFkaW5nKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuYmxvY2subGhlYWRpbmcuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHZhciB0b2tlbiA9IHtcbiAgICAgICAgICB0eXBlOiAnaGVhZGluZycsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgZGVwdGg6IGNhcFsyXS5jaGFyQXQoMCkgPT09ICc9JyA/IDEgOiAyLFxuICAgICAgICAgIHRleHQ6IGNhcFsxXSxcbiAgICAgICAgICB0b2tlbnM6IFtdXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMubGV4ZXIuaW5saW5lKHRva2VuLnRleHQsIHRva2VuLnRva2Vucyk7XG4gICAgICAgIHJldHVybiB0b2tlbjtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLnBhcmFncmFwaCA9IGZ1bmN0aW9uIHBhcmFncmFwaChzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLnBhcmFncmFwaC5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIHRva2VuID0ge1xuICAgICAgICAgIHR5cGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgIHRleHQ6IGNhcFsxXS5jaGFyQXQoY2FwWzFdLmxlbmd0aCAtIDEpID09PSAnXFxuJyA/IGNhcFsxXS5zbGljZSgwLCAtMSkgOiBjYXBbMV0sXG4gICAgICAgICAgdG9rZW5zOiBbXVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmxleGVyLmlubGluZSh0b2tlbi50ZXh0LCB0b2tlbi50b2tlbnMpO1xuICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by50ZXh0ID0gZnVuY3Rpb24gdGV4dChzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmJsb2NrLnRleHQuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHZhciB0b2tlbiA9IHtcbiAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgdGV4dDogY2FwWzBdLFxuICAgICAgICAgIHRva2VuczogW11cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5sZXhlci5pbmxpbmUodG9rZW4udGV4dCwgdG9rZW4udG9rZW5zKTtcbiAgICAgICAgcmV0dXJuIHRva2VuO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8uZXNjYXBlID0gZnVuY3Rpb24gZXNjYXBlKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLmVzY2FwZS5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAnZXNjYXBlJyxcbiAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICB0ZXh0OiBfZXNjYXBlKGNhcFsxXSlcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLnRhZyA9IGZ1bmN0aW9uIHRhZyhzcmMpIHtcbiAgICAgIHZhciBjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS50YWcuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIGlmICghdGhpcy5sZXhlci5zdGF0ZS5pbkxpbmsgJiYgL148YSAvaS50ZXN0KGNhcFswXSkpIHtcbiAgICAgICAgICB0aGlzLmxleGVyLnN0YXRlLmluTGluayA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5sZXhlci5zdGF0ZS5pbkxpbmsgJiYgL148XFwvYT4vaS50ZXN0KGNhcFswXSkpIHtcbiAgICAgICAgICB0aGlzLmxleGVyLnN0YXRlLmluTGluayA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmxleGVyLnN0YXRlLmluUmF3QmxvY2sgJiYgL148KHByZXxjb2RlfGtiZHxzY3JpcHQpKFxcc3w+KS9pLnRlc3QoY2FwWzBdKSkge1xuICAgICAgICAgIHRoaXMubGV4ZXIuc3RhdGUuaW5SYXdCbG9jayA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5sZXhlci5zdGF0ZS5pblJhd0Jsb2NrICYmIC9ePFxcLyhwcmV8Y29kZXxrYmR8c2NyaXB0KShcXHN8PikvaS50ZXN0KGNhcFswXSkpIHtcbiAgICAgICAgICB0aGlzLmxleGVyLnN0YXRlLmluUmF3QmxvY2sgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogdGhpcy5vcHRpb25zLnNhbml0aXplID8gJ3RleHQnIDogJ2h0bWwnLFxuICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgIGluTGluazogdGhpcy5sZXhlci5zdGF0ZS5pbkxpbmssXG4gICAgICAgICAgaW5SYXdCbG9jazogdGhpcy5sZXhlci5zdGF0ZS5pblJhd0Jsb2NrLFxuICAgICAgICAgIHRleHQ6IHRoaXMub3B0aW9ucy5zYW5pdGl6ZSA/IHRoaXMub3B0aW9ucy5zYW5pdGl6ZXIgPyB0aGlzLm9wdGlvbnMuc2FuaXRpemVyKGNhcFswXSkgOiBfZXNjYXBlKGNhcFswXSkgOiBjYXBbMF1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmxpbmsgPSBmdW5jdGlvbiBsaW5rKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLmxpbmsuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHZhciB0cmltbWVkVXJsID0gY2FwWzJdLnRyaW0oKTtcblxuICAgICAgICBpZiAoIXRoaXMub3B0aW9ucy5wZWRhbnRpYyAmJiAvXjwvLnRlc3QodHJpbW1lZFVybCkpIHtcbiAgICAgICAgICAvLyBjb21tb25tYXJrIHJlcXVpcmVzIG1hdGNoaW5nIGFuZ2xlIGJyYWNrZXRzXG4gICAgICAgICAgaWYgKCEvPiQvLnRlc3QodHJpbW1lZFVybCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IC8vIGVuZGluZyBhbmdsZSBicmFja2V0IGNhbm5vdCBiZSBlc2NhcGVkXG5cblxuICAgICAgICAgIHZhciBydHJpbVNsYXNoID0gcnRyaW0odHJpbW1lZFVybC5zbGljZSgwLCAtMSksICdcXFxcJyk7XG5cbiAgICAgICAgICBpZiAoKHRyaW1tZWRVcmwubGVuZ3RoIC0gcnRyaW1TbGFzaC5sZW5ndGgpICUgMiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmaW5kIGNsb3NpbmcgcGFyZW50aGVzaXNcbiAgICAgICAgICB2YXIgbGFzdFBhcmVuSW5kZXggPSBmaW5kQ2xvc2luZ0JyYWNrZXQoY2FwWzJdLCAnKCknKTtcblxuICAgICAgICAgIGlmIChsYXN0UGFyZW5JbmRleCA+IC0xKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnQgPSBjYXBbMF0uaW5kZXhPZignIScpID09PSAwID8gNSA6IDQ7XG4gICAgICAgICAgICB2YXIgbGlua0xlbiA9IHN0YXJ0ICsgY2FwWzFdLmxlbmd0aCArIGxhc3RQYXJlbkluZGV4O1xuICAgICAgICAgICAgY2FwWzJdID0gY2FwWzJdLnN1YnN0cmluZygwLCBsYXN0UGFyZW5JbmRleCk7XG4gICAgICAgICAgICBjYXBbMF0gPSBjYXBbMF0uc3Vic3RyaW5nKDAsIGxpbmtMZW4pLnRyaW0oKTtcbiAgICAgICAgICAgIGNhcFszXSA9ICcnO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBocmVmID0gY2FwWzJdO1xuICAgICAgICB2YXIgdGl0bGUgPSAnJztcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICAgICAgLy8gc3BsaXQgcGVkYW50aWMgaHJlZiBhbmQgdGl0bGVcbiAgICAgICAgICB2YXIgbGluayA9IC9eKFteJ1wiXSpbXlxcc10pXFxzKyhbJ1wiXSkoLiopXFwyLy5leGVjKGhyZWYpO1xuXG4gICAgICAgICAgaWYgKGxpbmspIHtcbiAgICAgICAgICAgIGhyZWYgPSBsaW5rWzFdO1xuICAgICAgICAgICAgdGl0bGUgPSBsaW5rWzNdO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aXRsZSA9IGNhcFszXSA/IGNhcFszXS5zbGljZSgxLCAtMSkgOiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIGhyZWYgPSBocmVmLnRyaW0oKTtcblxuICAgICAgICBpZiAoL148Ly50ZXN0KGhyZWYpKSB7XG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5wZWRhbnRpYyAmJiAhLz4kLy50ZXN0KHRyaW1tZWRVcmwpKSB7XG4gICAgICAgICAgICAvLyBwZWRhbnRpYyBhbGxvd3Mgc3RhcnRpbmcgYW5nbGUgYnJhY2tldCB3aXRob3V0IGVuZGluZyBhbmdsZSBicmFja2V0XG4gICAgICAgICAgICBocmVmID0gaHJlZi5zbGljZSgxKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaHJlZiA9IGhyZWYuc2xpY2UoMSwgLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXRwdXRMaW5rKGNhcCwge1xuICAgICAgICAgIGhyZWY6IGhyZWYgPyBocmVmLnJlcGxhY2UodGhpcy5ydWxlcy5pbmxpbmUuX2VzY2FwZXMsICckMScpIDogaHJlZixcbiAgICAgICAgICB0aXRsZTogdGl0bGUgPyB0aXRsZS5yZXBsYWNlKHRoaXMucnVsZXMuaW5saW5lLl9lc2NhcGVzLCAnJDEnKSA6IHRpdGxlXG4gICAgICAgIH0sIGNhcFswXSwgdGhpcy5sZXhlcik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5yZWZsaW5rID0gZnVuY3Rpb24gcmVmbGluayhzcmMsIGxpbmtzKSB7XG4gICAgICB2YXIgY2FwO1xuXG4gICAgICBpZiAoKGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLnJlZmxpbmsuZXhlYyhzcmMpKSB8fCAoY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUubm9saW5rLmV4ZWMoc3JjKSkpIHtcbiAgICAgICAgdmFyIGxpbmsgPSAoY2FwWzJdIHx8IGNhcFsxXSkucmVwbGFjZSgvXFxzKy9nLCAnICcpO1xuICAgICAgICBsaW5rID0gbGlua3NbbGluay50b0xvd2VyQ2FzZSgpXTtcblxuICAgICAgICBpZiAoIWxpbmsgfHwgIWxpbmsuaHJlZikge1xuICAgICAgICAgIHZhciB0ZXh0ID0gY2FwWzBdLmNoYXJBdCgwKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgcmF3OiB0ZXh0LFxuICAgICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3V0cHV0TGluayhjYXAsIGxpbmssIGNhcFswXSwgdGhpcy5sZXhlcik7XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5lbVN0cm9uZyA9IGZ1bmN0aW9uIGVtU3Ryb25nKHNyYywgbWFza2VkU3JjLCBwcmV2Q2hhcikge1xuICAgICAgaWYgKHByZXZDaGFyID09PSB2b2lkIDApIHtcbiAgICAgICAgcHJldkNoYXIgPSAnJztcbiAgICAgIH1cblxuICAgICAgdmFyIG1hdGNoID0gdGhpcy5ydWxlcy5pbmxpbmUuZW1TdHJvbmcubERlbGltLmV4ZWMoc3JjKTtcbiAgICAgIGlmICghbWF0Y2gpIHJldHVybjsgLy8gXyBjYW4ndCBiZSBiZXR3ZWVuIHR3byBhbHBoYW51bWVyaWNzLiBcXHB7TH1cXHB7Tn0gaW5jbHVkZXMgbm9uLWVuZ2xpc2ggYWxwaGFiZXQvbnVtYmVycyBhcyB3ZWxsXG5cbiAgICAgIGlmIChtYXRjaFszXSAmJiBwcmV2Q2hhci5tYXRjaCgvKD86WzAtOUEtWmEtelxceEFBXFx4QjJcXHhCM1xceEI1XFx4QjlcXHhCQVxceEJDLVxceEJFXFx4QzAtXFx4RDZcXHhEOC1cXHhGNlxceEY4LVxcdTAyQzFcXHUwMkM2LVxcdTAyRDFcXHUwMkUwLVxcdTAyRTRcXHUwMkVDXFx1MDJFRVxcdTAzNzAtXFx1MDM3NFxcdTAzNzZcXHUwMzc3XFx1MDM3QS1cXHUwMzdEXFx1MDM3RlxcdTAzODZcXHUwMzg4LVxcdTAzOEFcXHUwMzhDXFx1MDM4RS1cXHUwM0ExXFx1MDNBMy1cXHUwM0Y1XFx1MDNGNy1cXHUwNDgxXFx1MDQ4QS1cXHUwNTJGXFx1MDUzMS1cXHUwNTU2XFx1MDU1OVxcdTA1NjAtXFx1MDU4OFxcdTA1RDAtXFx1MDVFQVxcdTA1RUYtXFx1MDVGMlxcdTA2MjAtXFx1MDY0QVxcdTA2NjAtXFx1MDY2OVxcdTA2NkVcXHUwNjZGXFx1MDY3MS1cXHUwNkQzXFx1MDZENVxcdTA2RTVcXHUwNkU2XFx1MDZFRS1cXHUwNkZDXFx1MDZGRlxcdTA3MTBcXHUwNzEyLVxcdTA3MkZcXHUwNzRELVxcdTA3QTVcXHUwN0IxXFx1MDdDMC1cXHUwN0VBXFx1MDdGNFxcdTA3RjVcXHUwN0ZBXFx1MDgwMC1cXHUwODE1XFx1MDgxQVxcdTA4MjRcXHUwODI4XFx1MDg0MC1cXHUwODU4XFx1MDg2MC1cXHUwODZBXFx1MDhBMC1cXHUwOEI0XFx1MDhCNi1cXHUwOEM3XFx1MDkwNC1cXHUwOTM5XFx1MDkzRFxcdTA5NTBcXHUwOTU4LVxcdTA5NjFcXHUwOTY2LVxcdTA5NkZcXHUwOTcxLVxcdTA5ODBcXHUwOTg1LVxcdTA5OENcXHUwOThGXFx1MDk5MFxcdTA5OTMtXFx1MDlBOFxcdTA5QUEtXFx1MDlCMFxcdTA5QjJcXHUwOUI2LVxcdTA5QjlcXHUwOUJEXFx1MDlDRVxcdTA5RENcXHUwOUREXFx1MDlERi1cXHUwOUUxXFx1MDlFNi1cXHUwOUYxXFx1MDlGNC1cXHUwOUY5XFx1MDlGQ1xcdTBBMDUtXFx1MEEwQVxcdTBBMEZcXHUwQTEwXFx1MEExMy1cXHUwQTI4XFx1MEEyQS1cXHUwQTMwXFx1MEEzMlxcdTBBMzNcXHUwQTM1XFx1MEEzNlxcdTBBMzhcXHUwQTM5XFx1MEE1OS1cXHUwQTVDXFx1MEE1RVxcdTBBNjYtXFx1MEE2RlxcdTBBNzItXFx1MEE3NFxcdTBBODUtXFx1MEE4RFxcdTBBOEYtXFx1MEE5MVxcdTBBOTMtXFx1MEFBOFxcdTBBQUEtXFx1MEFCMFxcdTBBQjJcXHUwQUIzXFx1MEFCNS1cXHUwQUI5XFx1MEFCRFxcdTBBRDBcXHUwQUUwXFx1MEFFMVxcdTBBRTYtXFx1MEFFRlxcdTBBRjlcXHUwQjA1LVxcdTBCMENcXHUwQjBGXFx1MEIxMFxcdTBCMTMtXFx1MEIyOFxcdTBCMkEtXFx1MEIzMFxcdTBCMzJcXHUwQjMzXFx1MEIzNS1cXHUwQjM5XFx1MEIzRFxcdTBCNUNcXHUwQjVEXFx1MEI1Ri1cXHUwQjYxXFx1MEI2Ni1cXHUwQjZGXFx1MEI3MS1cXHUwQjc3XFx1MEI4M1xcdTBCODUtXFx1MEI4QVxcdTBCOEUtXFx1MEI5MFxcdTBCOTItXFx1MEI5NVxcdTBCOTlcXHUwQjlBXFx1MEI5Q1xcdTBCOUVcXHUwQjlGXFx1MEJBM1xcdTBCQTRcXHUwQkE4LVxcdTBCQUFcXHUwQkFFLVxcdTBCQjlcXHUwQkQwXFx1MEJFNi1cXHUwQkYyXFx1MEMwNS1cXHUwQzBDXFx1MEMwRS1cXHUwQzEwXFx1MEMxMi1cXHUwQzI4XFx1MEMyQS1cXHUwQzM5XFx1MEMzRFxcdTBDNTgtXFx1MEM1QVxcdTBDNjBcXHUwQzYxXFx1MEM2Ni1cXHUwQzZGXFx1MEM3OC1cXHUwQzdFXFx1MEM4MFxcdTBDODUtXFx1MEM4Q1xcdTBDOEUtXFx1MEM5MFxcdTBDOTItXFx1MENBOFxcdTBDQUEtXFx1MENCM1xcdTBDQjUtXFx1MENCOVxcdTBDQkRcXHUwQ0RFXFx1MENFMFxcdTBDRTFcXHUwQ0U2LVxcdTBDRUZcXHUwQ0YxXFx1MENGMlxcdTBEMDQtXFx1MEQwQ1xcdTBEMEUtXFx1MEQxMFxcdTBEMTItXFx1MEQzQVxcdTBEM0RcXHUwRDRFXFx1MEQ1NC1cXHUwRDU2XFx1MEQ1OC1cXHUwRDYxXFx1MEQ2Ni1cXHUwRDc4XFx1MEQ3QS1cXHUwRDdGXFx1MEQ4NS1cXHUwRDk2XFx1MEQ5QS1cXHUwREIxXFx1MERCMy1cXHUwREJCXFx1MERCRFxcdTBEQzAtXFx1MERDNlxcdTBERTYtXFx1MERFRlxcdTBFMDEtXFx1MEUzMFxcdTBFMzJcXHUwRTMzXFx1MEU0MC1cXHUwRTQ2XFx1MEU1MC1cXHUwRTU5XFx1MEU4MVxcdTBFODJcXHUwRTg0XFx1MEU4Ni1cXHUwRThBXFx1MEU4Qy1cXHUwRUEzXFx1MEVBNVxcdTBFQTctXFx1MEVCMFxcdTBFQjJcXHUwRUIzXFx1MEVCRFxcdTBFQzAtXFx1MEVDNFxcdTBFQzZcXHUwRUQwLVxcdTBFRDlcXHUwRURDLVxcdTBFREZcXHUwRjAwXFx1MEYyMC1cXHUwRjMzXFx1MEY0MC1cXHUwRjQ3XFx1MEY0OS1cXHUwRjZDXFx1MEY4OC1cXHUwRjhDXFx1MTAwMC1cXHUxMDJBXFx1MTAzRi1cXHUxMDQ5XFx1MTA1MC1cXHUxMDU1XFx1MTA1QS1cXHUxMDVEXFx1MTA2MVxcdTEwNjVcXHUxMDY2XFx1MTA2RS1cXHUxMDcwXFx1MTA3NS1cXHUxMDgxXFx1MTA4RVxcdTEwOTAtXFx1MTA5OVxcdTEwQTAtXFx1MTBDNVxcdTEwQzdcXHUxMENEXFx1MTBEMC1cXHUxMEZBXFx1MTBGQy1cXHUxMjQ4XFx1MTI0QS1cXHUxMjREXFx1MTI1MC1cXHUxMjU2XFx1MTI1OFxcdTEyNUEtXFx1MTI1RFxcdTEyNjAtXFx1MTI4OFxcdTEyOEEtXFx1MTI4RFxcdTEyOTAtXFx1MTJCMFxcdTEyQjItXFx1MTJCNVxcdTEyQjgtXFx1MTJCRVxcdTEyQzBcXHUxMkMyLVxcdTEyQzVcXHUxMkM4LVxcdTEyRDZcXHUxMkQ4LVxcdTEzMTBcXHUxMzEyLVxcdTEzMTVcXHUxMzE4LVxcdTEzNUFcXHUxMzY5LVxcdTEzN0NcXHUxMzgwLVxcdTEzOEZcXHUxM0EwLVxcdTEzRjVcXHUxM0Y4LVxcdTEzRkRcXHUxNDAxLVxcdTE2NkNcXHUxNjZGLVxcdTE2N0ZcXHUxNjgxLVxcdTE2OUFcXHUxNkEwLVxcdTE2RUFcXHUxNkVFLVxcdTE2RjhcXHUxNzAwLVxcdTE3MENcXHUxNzBFLVxcdTE3MTFcXHUxNzIwLVxcdTE3MzFcXHUxNzQwLVxcdTE3NTFcXHUxNzYwLVxcdTE3NkNcXHUxNzZFLVxcdTE3NzBcXHUxNzgwLVxcdTE3QjNcXHUxN0Q3XFx1MTdEQ1xcdTE3RTAtXFx1MTdFOVxcdTE3RjAtXFx1MTdGOVxcdTE4MTAtXFx1MTgxOVxcdTE4MjAtXFx1MTg3OFxcdTE4ODAtXFx1MTg4NFxcdTE4ODctXFx1MThBOFxcdTE4QUFcXHUxOEIwLVxcdTE4RjVcXHUxOTAwLVxcdTE5MUVcXHUxOTQ2LVxcdTE5NkRcXHUxOTcwLVxcdTE5NzRcXHUxOTgwLVxcdTE5QUJcXHUxOUIwLVxcdTE5QzlcXHUxOUQwLVxcdTE5REFcXHUxQTAwLVxcdTFBMTZcXHUxQTIwLVxcdTFBNTRcXHUxQTgwLVxcdTFBODlcXHUxQTkwLVxcdTFBOTlcXHUxQUE3XFx1MUIwNS1cXHUxQjMzXFx1MUI0NS1cXHUxQjRCXFx1MUI1MC1cXHUxQjU5XFx1MUI4My1cXHUxQkEwXFx1MUJBRS1cXHUxQkU1XFx1MUMwMC1cXHUxQzIzXFx1MUM0MC1cXHUxQzQ5XFx1MUM0RC1cXHUxQzdEXFx1MUM4MC1cXHUxQzg4XFx1MUM5MC1cXHUxQ0JBXFx1MUNCRC1cXHUxQ0JGXFx1MUNFOS1cXHUxQ0VDXFx1MUNFRS1cXHUxQ0YzXFx1MUNGNVxcdTFDRjZcXHUxQ0ZBXFx1MUQwMC1cXHUxREJGXFx1MUUwMC1cXHUxRjE1XFx1MUYxOC1cXHUxRjFEXFx1MUYyMC1cXHUxRjQ1XFx1MUY0OC1cXHUxRjREXFx1MUY1MC1cXHUxRjU3XFx1MUY1OVxcdTFGNUJcXHUxRjVEXFx1MUY1Ri1cXHUxRjdEXFx1MUY4MC1cXHUxRkI0XFx1MUZCNi1cXHUxRkJDXFx1MUZCRVxcdTFGQzItXFx1MUZDNFxcdTFGQzYtXFx1MUZDQ1xcdTFGRDAtXFx1MUZEM1xcdTFGRDYtXFx1MUZEQlxcdTFGRTAtXFx1MUZFQ1xcdTFGRjItXFx1MUZGNFxcdTFGRjYtXFx1MUZGQ1xcdTIwNzBcXHUyMDcxXFx1MjA3NC1cXHUyMDc5XFx1MjA3Ri1cXHUyMDg5XFx1MjA5MC1cXHUyMDlDXFx1MjEwMlxcdTIxMDdcXHUyMTBBLVxcdTIxMTNcXHUyMTE1XFx1MjExOS1cXHUyMTFEXFx1MjEyNFxcdTIxMjZcXHUyMTI4XFx1MjEyQS1cXHUyMTJEXFx1MjEyRi1cXHUyMTM5XFx1MjEzQy1cXHUyMTNGXFx1MjE0NS1cXHUyMTQ5XFx1MjE0RVxcdTIxNTAtXFx1MjE4OVxcdTI0NjAtXFx1MjQ5QlxcdTI0RUEtXFx1MjRGRlxcdTI3NzYtXFx1Mjc5M1xcdTJDMDAtXFx1MkMyRVxcdTJDMzAtXFx1MkM1RVxcdTJDNjAtXFx1MkNFNFxcdTJDRUItXFx1MkNFRVxcdTJDRjJcXHUyQ0YzXFx1MkNGRFxcdTJEMDAtXFx1MkQyNVxcdTJEMjdcXHUyRDJEXFx1MkQzMC1cXHUyRDY3XFx1MkQ2RlxcdTJEODAtXFx1MkQ5NlxcdTJEQTAtXFx1MkRBNlxcdTJEQTgtXFx1MkRBRVxcdTJEQjAtXFx1MkRCNlxcdTJEQjgtXFx1MkRCRVxcdTJEQzAtXFx1MkRDNlxcdTJEQzgtXFx1MkRDRVxcdTJERDAtXFx1MkRENlxcdTJERDgtXFx1MkRERVxcdTJFMkZcXHUzMDA1LVxcdTMwMDdcXHUzMDIxLVxcdTMwMjlcXHUzMDMxLVxcdTMwMzVcXHUzMDM4LVxcdTMwM0NcXHUzMDQxLVxcdTMwOTZcXHUzMDlELVxcdTMwOUZcXHUzMEExLVxcdTMwRkFcXHUzMEZDLVxcdTMwRkZcXHUzMTA1LVxcdTMxMkZcXHUzMTMxLVxcdTMxOEVcXHUzMTkyLVxcdTMxOTVcXHUzMUEwLVxcdTMxQkZcXHUzMUYwLVxcdTMxRkZcXHUzMjIwLVxcdTMyMjlcXHUzMjQ4LVxcdTMyNEZcXHUzMjUxLVxcdTMyNUZcXHUzMjgwLVxcdTMyODlcXHUzMkIxLVxcdTMyQkZcXHUzNDAwLVxcdTREQkZcXHU0RTAwLVxcdTlGRkNcXHVBMDAwLVxcdUE0OENcXHVBNEQwLVxcdUE0RkRcXHVBNTAwLVxcdUE2MENcXHVBNjEwLVxcdUE2MkJcXHVBNjQwLVxcdUE2NkVcXHVBNjdGLVxcdUE2OURcXHVBNkEwLVxcdUE2RUZcXHVBNzE3LVxcdUE3MUZcXHVBNzIyLVxcdUE3ODhcXHVBNzhCLVxcdUE3QkZcXHVBN0MyLVxcdUE3Q0FcXHVBN0Y1LVxcdUE4MDFcXHVBODAzLVxcdUE4MDVcXHVBODA3LVxcdUE4MEFcXHVBODBDLVxcdUE4MjJcXHVBODMwLVxcdUE4MzVcXHVBODQwLVxcdUE4NzNcXHVBODgyLVxcdUE4QjNcXHVBOEQwLVxcdUE4RDlcXHVBOEYyLVxcdUE4RjdcXHVBOEZCXFx1QThGRFxcdUE4RkVcXHVBOTAwLVxcdUE5MjVcXHVBOTMwLVxcdUE5NDZcXHVBOTYwLVxcdUE5N0NcXHVBOTg0LVxcdUE5QjJcXHVBOUNGLVxcdUE5RDlcXHVBOUUwLVxcdUE5RTRcXHVBOUU2LVxcdUE5RkVcXHVBQTAwLVxcdUFBMjhcXHVBQTQwLVxcdUFBNDJcXHVBQTQ0LVxcdUFBNEJcXHVBQTUwLVxcdUFBNTlcXHVBQTYwLVxcdUFBNzZcXHVBQTdBXFx1QUE3RS1cXHVBQUFGXFx1QUFCMVxcdUFBQjVcXHVBQUI2XFx1QUFCOS1cXHVBQUJEXFx1QUFDMFxcdUFBQzJcXHVBQURCLVxcdUFBRERcXHVBQUUwLVxcdUFBRUFcXHVBQUYyLVxcdUFBRjRcXHVBQjAxLVxcdUFCMDZcXHVBQjA5LVxcdUFCMEVcXHVBQjExLVxcdUFCMTZcXHVBQjIwLVxcdUFCMjZcXHVBQjI4LVxcdUFCMkVcXHVBQjMwLVxcdUFCNUFcXHVBQjVDLVxcdUFCNjlcXHVBQjcwLVxcdUFCRTJcXHVBQkYwLVxcdUFCRjlcXHVBQzAwLVxcdUQ3QTNcXHVEN0IwLVxcdUQ3QzZcXHVEN0NCLVxcdUQ3RkJcXHVGOTAwLVxcdUZBNkRcXHVGQTcwLVxcdUZBRDlcXHVGQjAwLVxcdUZCMDZcXHVGQjEzLVxcdUZCMTdcXHVGQjFEXFx1RkIxRi1cXHVGQjI4XFx1RkIyQS1cXHVGQjM2XFx1RkIzOC1cXHVGQjNDXFx1RkIzRVxcdUZCNDBcXHVGQjQxXFx1RkI0M1xcdUZCNDRcXHVGQjQ2LVxcdUZCQjFcXHVGQkQzLVxcdUZEM0RcXHVGRDUwLVxcdUZEOEZcXHVGRDkyLVxcdUZEQzdcXHVGREYwLVxcdUZERkJcXHVGRTcwLVxcdUZFNzRcXHVGRTc2LVxcdUZFRkNcXHVGRjEwLVxcdUZGMTlcXHVGRjIxLVxcdUZGM0FcXHVGRjQxLVxcdUZGNUFcXHVGRjY2LVxcdUZGQkVcXHVGRkMyLVxcdUZGQzdcXHVGRkNBLVxcdUZGQ0ZcXHVGRkQyLVxcdUZGRDdcXHVGRkRBLVxcdUZGRENdfFxcdUQ4MDBbXFx1REMwMC1cXHVEQzBCXFx1REMwRC1cXHVEQzI2XFx1REMyOC1cXHVEQzNBXFx1REMzQ1xcdURDM0RcXHVEQzNGLVxcdURDNERcXHVEQzUwLVxcdURDNURcXHVEQzgwLVxcdURDRkFcXHVERDA3LVxcdUREMzNcXHVERDQwLVxcdURENzhcXHVERDhBXFx1REQ4QlxcdURFODAtXFx1REU5Q1xcdURFQTAtXFx1REVEMFxcdURFRTEtXFx1REVGQlxcdURGMDAtXFx1REYyM1xcdURGMkQtXFx1REY0QVxcdURGNTAtXFx1REY3NVxcdURGODAtXFx1REY5RFxcdURGQTAtXFx1REZDM1xcdURGQzgtXFx1REZDRlxcdURGRDEtXFx1REZENV18XFx1RDgwMVtcXHVEQzAwLVxcdURDOURcXHVEQ0EwLVxcdURDQTlcXHVEQ0IwLVxcdURDRDNcXHVEQ0Q4LVxcdURDRkJcXHVERDAwLVxcdUREMjdcXHVERDMwLVxcdURENjNcXHVERTAwLVxcdURGMzZcXHVERjQwLVxcdURGNTVcXHVERjYwLVxcdURGNjddfFxcdUQ4MDJbXFx1REMwMC1cXHVEQzA1XFx1REMwOFxcdURDMEEtXFx1REMzNVxcdURDMzdcXHVEQzM4XFx1REMzQ1xcdURDM0YtXFx1REM1NVxcdURDNTgtXFx1REM3NlxcdURDNzktXFx1REM5RVxcdURDQTctXFx1RENBRlxcdURDRTAtXFx1RENGMlxcdURDRjRcXHVEQ0Y1XFx1RENGQi1cXHVERDFCXFx1REQyMC1cXHVERDM5XFx1REQ4MC1cXHVEREI3XFx1RERCQy1cXHVERENGXFx1REREMi1cXHVERTAwXFx1REUxMC1cXHVERTEzXFx1REUxNS1cXHVERTE3XFx1REUxOS1cXHVERTM1XFx1REU0MC1cXHVERTQ4XFx1REU2MC1cXHVERTdFXFx1REU4MC1cXHVERTlGXFx1REVDMC1cXHVERUM3XFx1REVDOS1cXHVERUU0XFx1REVFQi1cXHVERUVGXFx1REYwMC1cXHVERjM1XFx1REY0MC1cXHVERjU1XFx1REY1OC1cXHVERjcyXFx1REY3OC1cXHVERjkxXFx1REZBOS1cXHVERkFGXXxcXHVEODAzW1xcdURDMDAtXFx1REM0OFxcdURDODAtXFx1RENCMlxcdURDQzAtXFx1RENGMlxcdURDRkEtXFx1REQyM1xcdUREMzAtXFx1REQzOVxcdURFNjAtXFx1REU3RVxcdURFODAtXFx1REVBOVxcdURFQjBcXHVERUIxXFx1REYwMC1cXHVERjI3XFx1REYzMC1cXHVERjQ1XFx1REY1MS1cXHVERjU0XFx1REZCMC1cXHVERkNCXFx1REZFMC1cXHVERkY2XXxcXHVEODA0W1xcdURDMDMtXFx1REMzN1xcdURDNTItXFx1REM2RlxcdURDODMtXFx1RENBRlxcdURDRDAtXFx1RENFOFxcdURDRjAtXFx1RENGOVxcdUREMDMtXFx1REQyNlxcdUREMzYtXFx1REQzRlxcdURENDRcXHVERDQ3XFx1REQ1MC1cXHVERDcyXFx1REQ3NlxcdUREODMtXFx1RERCMlxcdUREQzEtXFx1RERDNFxcdURERDAtXFx1REREQVxcdURERENcXHVEREUxLVxcdURERjRcXHVERTAwLVxcdURFMTFcXHVERTEzLVxcdURFMkJcXHVERTgwLVxcdURFODZcXHVERTg4XFx1REU4QS1cXHVERThEXFx1REU4Ri1cXHVERTlEXFx1REU5Ri1cXHVERUE4XFx1REVCMC1cXHVERURFXFx1REVGMC1cXHVERUY5XFx1REYwNS1cXHVERjBDXFx1REYwRlxcdURGMTBcXHVERjEzLVxcdURGMjhcXHVERjJBLVxcdURGMzBcXHVERjMyXFx1REYzM1xcdURGMzUtXFx1REYzOVxcdURGM0RcXHVERjUwXFx1REY1RC1cXHVERjYxXXxcXHVEODA1W1xcdURDMDAtXFx1REMzNFxcdURDNDctXFx1REM0QVxcdURDNTAtXFx1REM1OVxcdURDNUYtXFx1REM2MVxcdURDODAtXFx1RENBRlxcdURDQzRcXHVEQ0M1XFx1RENDN1xcdURDRDAtXFx1RENEOVxcdUREODAtXFx1RERBRVxcdURERDgtXFx1REREQlxcdURFMDAtXFx1REUyRlxcdURFNDRcXHVERTUwLVxcdURFNTlcXHVERTgwLVxcdURFQUFcXHVERUI4XFx1REVDMC1cXHVERUM5XFx1REYwMC1cXHVERjFBXFx1REYzMC1cXHVERjNCXXxcXHVEODA2W1xcdURDMDAtXFx1REMyQlxcdURDQTAtXFx1RENGMlxcdURDRkYtXFx1REQwNlxcdUREMDlcXHVERDBDLVxcdUREMTNcXHVERDE1XFx1REQxNlxcdUREMTgtXFx1REQyRlxcdUREM0ZcXHVERDQxXFx1REQ1MC1cXHVERDU5XFx1RERBMC1cXHVEREE3XFx1RERBQS1cXHVEREQwXFx1RERFMVxcdURERTNcXHVERTAwXFx1REUwQi1cXHVERTMyXFx1REUzQVxcdURFNTBcXHVERTVDLVxcdURFODlcXHVERTlEXFx1REVDMC1cXHVERUY4XXxcXHVEODA3W1xcdURDMDAtXFx1REMwOFxcdURDMEEtXFx1REMyRVxcdURDNDBcXHVEQzUwLVxcdURDNkNcXHVEQzcyLVxcdURDOEZcXHVERDAwLVxcdUREMDZcXHVERDA4XFx1REQwOVxcdUREMEItXFx1REQzMFxcdURENDZcXHVERDUwLVxcdURENTlcXHVERDYwLVxcdURENjVcXHVERDY3XFx1REQ2OFxcdURENkEtXFx1REQ4OVxcdUREOThcXHVEREEwLVxcdUREQTlcXHVERUUwLVxcdURFRjJcXHVERkIwXFx1REZDMC1cXHVERkQ0XXxcXHVEODA4W1xcdURDMDAtXFx1REY5OV18XFx1RDgwOVtcXHVEQzAwLVxcdURDNkVcXHVEQzgwLVxcdURENDNdfFtcXHVEODBDXFx1RDgxQy1cXHVEODIwXFx1RDgyMlxcdUQ4NDAtXFx1RDg2OFxcdUQ4NkEtXFx1RDg2Q1xcdUQ4NkYtXFx1RDg3MlxcdUQ4NzQtXFx1RDg3OVxcdUQ4ODAtXFx1RDg4M11bXFx1REMwMC1cXHVERkZGXXxcXHVEODBEW1xcdURDMDAtXFx1REMyRV18XFx1RDgxMVtcXHVEQzAwLVxcdURFNDZdfFxcdUQ4MUFbXFx1REMwMC1cXHVERTM4XFx1REU0MC1cXHVERTVFXFx1REU2MC1cXHVERTY5XFx1REVEMC1cXHVERUVEXFx1REYwMC1cXHVERjJGXFx1REY0MC1cXHVERjQzXFx1REY1MC1cXHVERjU5XFx1REY1Qi1cXHVERjYxXFx1REY2My1cXHVERjc3XFx1REY3RC1cXHVERjhGXXxcXHVEODFCW1xcdURFNDAtXFx1REU5NlxcdURGMDAtXFx1REY0QVxcdURGNTBcXHVERjkzLVxcdURGOUZcXHVERkUwXFx1REZFMVxcdURGRTNdfFxcdUQ4MjFbXFx1REMwMC1cXHVERkY3XXxcXHVEODIzW1xcdURDMDAtXFx1RENENVxcdUREMDAtXFx1REQwOF18XFx1RDgyQ1tcXHVEQzAwLVxcdUREMUVcXHVERDUwLVxcdURENTJcXHVERDY0LVxcdURENjdcXHVERDcwLVxcdURFRkJdfFxcdUQ4MkZbXFx1REMwMC1cXHVEQzZBXFx1REM3MC1cXHVEQzdDXFx1REM4MC1cXHVEQzg4XFx1REM5MC1cXHVEQzk5XXxcXHVEODM0W1xcdURFRTAtXFx1REVGM1xcdURGNjAtXFx1REY3OF18XFx1RDgzNVtcXHVEQzAwLVxcdURDNTRcXHVEQzU2LVxcdURDOUNcXHVEQzlFXFx1REM5RlxcdURDQTJcXHVEQ0E1XFx1RENBNlxcdURDQTktXFx1RENBQ1xcdURDQUUtXFx1RENCOVxcdURDQkJcXHVEQ0JELVxcdURDQzNcXHVEQ0M1LVxcdUREMDVcXHVERDA3LVxcdUREMEFcXHVERDBELVxcdUREMTRcXHVERDE2LVxcdUREMUNcXHVERDFFLVxcdUREMzlcXHVERDNCLVxcdUREM0VcXHVERDQwLVxcdURENDRcXHVERDQ2XFx1REQ0QS1cXHVERDUwXFx1REQ1Mi1cXHVERUE1XFx1REVBOC1cXHVERUMwXFx1REVDMi1cXHVERURBXFx1REVEQy1cXHVERUZBXFx1REVGQy1cXHVERjE0XFx1REYxNi1cXHVERjM0XFx1REYzNi1cXHVERjRFXFx1REY1MC1cXHVERjZFXFx1REY3MC1cXHVERjg4XFx1REY4QS1cXHVERkE4XFx1REZBQS1cXHVERkMyXFx1REZDNC1cXHVERkNCXFx1REZDRS1cXHVERkZGXXxcXHVEODM4W1xcdUREMDAtXFx1REQyQ1xcdUREMzctXFx1REQzRFxcdURENDAtXFx1REQ0OVxcdURENEVcXHVERUMwLVxcdURFRUJcXHVERUYwLVxcdURFRjldfFxcdUQ4M0FbXFx1REMwMC1cXHVEQ0M0XFx1RENDNy1cXHVEQ0NGXFx1REQwMC1cXHVERDQzXFx1REQ0QlxcdURENTAtXFx1REQ1OV18XFx1RDgzQltcXHVEQzcxLVxcdURDQUJcXHVEQ0FELVxcdURDQUZcXHVEQ0IxLVxcdURDQjRcXHVERDAxLVxcdUREMkRcXHVERDJGLVxcdUREM0RcXHVERTAwLVxcdURFMDNcXHVERTA1LVxcdURFMUZcXHVERTIxXFx1REUyMlxcdURFMjRcXHVERTI3XFx1REUyOS1cXHVERTMyXFx1REUzNC1cXHVERTM3XFx1REUzOVxcdURFM0JcXHVERTQyXFx1REU0N1xcdURFNDlcXHVERTRCXFx1REU0RC1cXHVERTRGXFx1REU1MVxcdURFNTJcXHVERTU0XFx1REU1N1xcdURFNTlcXHVERTVCXFx1REU1RFxcdURFNUZcXHVERTYxXFx1REU2MlxcdURFNjRcXHVERTY3LVxcdURFNkFcXHVERTZDLVxcdURFNzJcXHVERTc0LVxcdURFNzdcXHVERTc5LVxcdURFN0NcXHVERTdFXFx1REU4MC1cXHVERTg5XFx1REU4Qi1cXHVERTlCXFx1REVBMS1cXHVERUEzXFx1REVBNS1cXHVERUE5XFx1REVBQi1cXHVERUJCXXxcXHVEODNDW1xcdUREMDAtXFx1REQwQ118XFx1RDgzRVtcXHVERkYwLVxcdURGRjldfFxcdUQ4NjlbXFx1REMwMC1cXHVERUREXFx1REYwMC1cXHVERkZGXXxcXHVEODZEW1xcdURDMDAtXFx1REYzNFxcdURGNDAtXFx1REZGRl18XFx1RDg2RVtcXHVEQzAwLVxcdURDMURcXHVEQzIwLVxcdURGRkZdfFxcdUQ4NzNbXFx1REMwMC1cXHVERUExXFx1REVCMC1cXHVERkZGXXxcXHVEODdBW1xcdURDMDAtXFx1REZFMF18XFx1RDg3RVtcXHVEQzAwLVxcdURFMURdfFxcdUQ4ODRbXFx1REMwMC1cXHVERjRBXSkvKSkgcmV0dXJuO1xuICAgICAgdmFyIG5leHRDaGFyID0gbWF0Y2hbMV0gfHwgbWF0Y2hbMl0gfHwgJyc7XG5cbiAgICAgIGlmICghbmV4dENoYXIgfHwgbmV4dENoYXIgJiYgKHByZXZDaGFyID09PSAnJyB8fCB0aGlzLnJ1bGVzLmlubGluZS5wdW5jdHVhdGlvbi5leGVjKHByZXZDaGFyKSkpIHtcbiAgICAgICAgdmFyIGxMZW5ndGggPSBtYXRjaFswXS5sZW5ndGggLSAxO1xuICAgICAgICB2YXIgckRlbGltLFxuICAgICAgICAgICAgckxlbmd0aCxcbiAgICAgICAgICAgIGRlbGltVG90YWwgPSBsTGVuZ3RoLFxuICAgICAgICAgICAgbWlkRGVsaW1Ub3RhbCA9IDA7XG4gICAgICAgIHZhciBlbmRSZWcgPSBtYXRjaFswXVswXSA9PT0gJyonID8gdGhpcy5ydWxlcy5pbmxpbmUuZW1TdHJvbmcuckRlbGltQXN0IDogdGhpcy5ydWxlcy5pbmxpbmUuZW1TdHJvbmcuckRlbGltVW5kO1xuICAgICAgICBlbmRSZWcubGFzdEluZGV4ID0gMDsgLy8gQ2xpcCBtYXNrZWRTcmMgdG8gc2FtZSBzZWN0aW9uIG9mIHN0cmluZyBhcyBzcmMgKG1vdmUgdG8gbGV4ZXI/KVxuXG4gICAgICAgIG1hc2tlZFNyYyA9IG1hc2tlZFNyYy5zbGljZSgtMSAqIHNyYy5sZW5ndGggKyBsTGVuZ3RoKTtcblxuICAgICAgICB3aGlsZSAoKG1hdGNoID0gZW5kUmVnLmV4ZWMobWFza2VkU3JjKSkgIT0gbnVsbCkge1xuICAgICAgICAgIHJEZWxpbSA9IG1hdGNoWzFdIHx8IG1hdGNoWzJdIHx8IG1hdGNoWzNdIHx8IG1hdGNoWzRdIHx8IG1hdGNoWzVdIHx8IG1hdGNoWzZdO1xuICAgICAgICAgIGlmICghckRlbGltKSBjb250aW51ZTsgLy8gc2tpcCBzaW5nbGUgKiBpbiBfX2FiYyphYmNfX1xuXG4gICAgICAgICAgckxlbmd0aCA9IHJEZWxpbS5sZW5ndGg7XG5cbiAgICAgICAgICBpZiAobWF0Y2hbM10gfHwgbWF0Y2hbNF0pIHtcbiAgICAgICAgICAgIC8vIGZvdW5kIGFub3RoZXIgTGVmdCBEZWxpbVxuICAgICAgICAgICAgZGVsaW1Ub3RhbCArPSByTGVuZ3RoO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfSBlbHNlIGlmIChtYXRjaFs1XSB8fCBtYXRjaFs2XSkge1xuICAgICAgICAgICAgLy8gZWl0aGVyIExlZnQgb3IgUmlnaHQgRGVsaW1cbiAgICAgICAgICAgIGlmIChsTGVuZ3RoICUgMyAmJiAhKChsTGVuZ3RoICsgckxlbmd0aCkgJSAzKSkge1xuICAgICAgICAgICAgICBtaWREZWxpbVRvdGFsICs9IHJMZW5ndGg7XG4gICAgICAgICAgICAgIGNvbnRpbnVlOyAvLyBDb21tb25NYXJrIEVtcGhhc2lzIFJ1bGVzIDktMTBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBkZWxpbVRvdGFsIC09IHJMZW5ndGg7XG4gICAgICAgICAgaWYgKGRlbGltVG90YWwgPiAwKSBjb250aW51ZTsgLy8gSGF2ZW4ndCBmb3VuZCBlbm91Z2ggY2xvc2luZyBkZWxpbWl0ZXJzXG4gICAgICAgICAgLy8gUmVtb3ZlIGV4dHJhIGNoYXJhY3RlcnMuICphKioqIC0+ICphKlxuXG4gICAgICAgICAgckxlbmd0aCA9IE1hdGgubWluKHJMZW5ndGgsIHJMZW5ndGggKyBkZWxpbVRvdGFsICsgbWlkRGVsaW1Ub3RhbCk7IC8vIENyZWF0ZSBgZW1gIGlmIHNtYWxsZXN0IGRlbGltaXRlciBoYXMgb2RkIGNoYXIgY291bnQuICphKioqXG5cbiAgICAgICAgICBpZiAoTWF0aC5taW4obExlbmd0aCwgckxlbmd0aCkgJSAyKSB7XG4gICAgICAgICAgICB2YXIgX3RleHQgPSBzcmMuc2xpY2UoMSwgbExlbmd0aCArIG1hdGNoLmluZGV4ICsgckxlbmd0aCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHR5cGU6ICdlbScsXG4gICAgICAgICAgICAgIHJhdzogc3JjLnNsaWNlKDAsIGxMZW5ndGggKyBtYXRjaC5pbmRleCArIHJMZW5ndGggKyAxKSxcbiAgICAgICAgICAgICAgdGV4dDogX3RleHQsXG4gICAgICAgICAgICAgIHRva2VuczogdGhpcy5sZXhlci5pbmxpbmVUb2tlbnMoX3RleHQsIFtdKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9IC8vIENyZWF0ZSAnc3Ryb25nJyBpZiBzbWFsbGVzdCBkZWxpbWl0ZXIgaGFzIGV2ZW4gY2hhciBjb3VudC4gKiphKioqXG5cblxuICAgICAgICAgIHZhciB0ZXh0ID0gc3JjLnNsaWNlKDIsIGxMZW5ndGggKyBtYXRjaC5pbmRleCArIHJMZW5ndGggLSAxKTtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogJ3N0cm9uZycsXG4gICAgICAgICAgICByYXc6IHNyYy5zbGljZSgwLCBsTGVuZ3RoICsgbWF0Y2guaW5kZXggKyByTGVuZ3RoICsgMSksXG4gICAgICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICAgICAgdG9rZW5zOiB0aGlzLmxleGVyLmlubGluZVRva2Vucyh0ZXh0LCBbXSlcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5jb2Rlc3BhbiA9IGZ1bmN0aW9uIGNvZGVzcGFuKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLmNvZGUuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHZhciB0ZXh0ID0gY2FwWzJdLnJlcGxhY2UoL1xcbi9nLCAnICcpO1xuICAgICAgICB2YXIgaGFzTm9uU3BhY2VDaGFycyA9IC9bXiBdLy50ZXN0KHRleHQpO1xuICAgICAgICB2YXIgaGFzU3BhY2VDaGFyc09uQm90aEVuZHMgPSAvXiAvLnRlc3QodGV4dCkgJiYgLyAkLy50ZXN0KHRleHQpO1xuXG4gICAgICAgIGlmIChoYXNOb25TcGFjZUNoYXJzICYmIGhhc1NwYWNlQ2hhcnNPbkJvdGhFbmRzKSB7XG4gICAgICAgICAgdGV4dCA9IHRleHQuc3Vic3RyaW5nKDEsIHRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgIH1cblxuICAgICAgICB0ZXh0ID0gX2VzY2FwZSh0ZXh0LCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAnY29kZXNwYW4nLFxuICAgICAgICAgIHJhdzogY2FwWzBdLFxuICAgICAgICAgIHRleHQ6IHRleHRcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgX3Byb3RvLmJyID0gZnVuY3Rpb24gYnIoc3JjKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUuYnIuZXhlYyhzcmMpO1xuXG4gICAgICBpZiAoY2FwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdHlwZTogJ2JyJyxcbiAgICAgICAgICByYXc6IGNhcFswXVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8uZGVsID0gZnVuY3Rpb24gZGVsKHNyYykge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLmRlbC5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAnZGVsJyxcbiAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICB0ZXh0OiBjYXBbMl0sXG4gICAgICAgICAgdG9rZW5zOiB0aGlzLmxleGVyLmlubGluZVRva2VucyhjYXBbMl0sIFtdKVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJvdG8uYXV0b2xpbmsgPSBmdW5jdGlvbiBhdXRvbGluayhzcmMsIG1hbmdsZSkge1xuICAgICAgdmFyIGNhcCA9IHRoaXMucnVsZXMuaW5saW5lLmF1dG9saW5rLmV4ZWMoc3JjKTtcblxuICAgICAgaWYgKGNhcCkge1xuICAgICAgICB2YXIgdGV4dCwgaHJlZjtcblxuICAgICAgICBpZiAoY2FwWzJdID09PSAnQCcpIHtcbiAgICAgICAgICB0ZXh0ID0gX2VzY2FwZSh0aGlzLm9wdGlvbnMubWFuZ2xlID8gbWFuZ2xlKGNhcFsxXSkgOiBjYXBbMV0pO1xuICAgICAgICAgIGhyZWYgPSAnbWFpbHRvOicgKyB0ZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHQgPSBfZXNjYXBlKGNhcFsxXSk7XG4gICAgICAgICAgaHJlZiA9IHRleHQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICAgIGhyZWY6IGhyZWYsXG4gICAgICAgICAgdG9rZW5zOiBbe1xuICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgcmF3OiB0ZXh0LFxuICAgICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICAgIH1dXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by51cmwgPSBmdW5jdGlvbiB1cmwoc3JjLCBtYW5nbGUpIHtcbiAgICAgIHZhciBjYXA7XG5cbiAgICAgIGlmIChjYXAgPSB0aGlzLnJ1bGVzLmlubGluZS51cmwuZXhlYyhzcmMpKSB7XG4gICAgICAgIHZhciB0ZXh0LCBocmVmO1xuXG4gICAgICAgIGlmIChjYXBbMl0gPT09ICdAJykge1xuICAgICAgICAgIHRleHQgPSBfZXNjYXBlKHRoaXMub3B0aW9ucy5tYW5nbGUgPyBtYW5nbGUoY2FwWzBdKSA6IGNhcFswXSk7XG4gICAgICAgICAgaHJlZiA9ICdtYWlsdG86JyArIHRleHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZG8gZXh0ZW5kZWQgYXV0b2xpbmsgcGF0aCB2YWxpZGF0aW9uXG4gICAgICAgICAgdmFyIHByZXZDYXBaZXJvO1xuXG4gICAgICAgICAgZG8ge1xuICAgICAgICAgICAgcHJldkNhcFplcm8gPSBjYXBbMF07XG4gICAgICAgICAgICBjYXBbMF0gPSB0aGlzLnJ1bGVzLmlubGluZS5fYmFja3BlZGFsLmV4ZWMoY2FwWzBdKVswXTtcbiAgICAgICAgICB9IHdoaWxlIChwcmV2Q2FwWmVybyAhPT0gY2FwWzBdKTtcblxuICAgICAgICAgIHRleHQgPSBfZXNjYXBlKGNhcFswXSk7XG5cbiAgICAgICAgICBpZiAoY2FwWzFdID09PSAnd3d3LicpIHtcbiAgICAgICAgICAgIGhyZWYgPSAnaHR0cDovLycgKyB0ZXh0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBocmVmID0gdGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHR5cGU6ICdsaW5rJyxcbiAgICAgICAgICByYXc6IGNhcFswXSxcbiAgICAgICAgICB0ZXh0OiB0ZXh0LFxuICAgICAgICAgIGhyZWY6IGhyZWYsXG4gICAgICAgICAgdG9rZW5zOiBbe1xuICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgcmF3OiB0ZXh0LFxuICAgICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICAgIH1dXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIF9wcm90by5pbmxpbmVUZXh0ID0gZnVuY3Rpb24gaW5saW5lVGV4dChzcmMsIHNtYXJ0eXBhbnRzKSB7XG4gICAgICB2YXIgY2FwID0gdGhpcy5ydWxlcy5pbmxpbmUudGV4dC5leGVjKHNyYyk7XG5cbiAgICAgIGlmIChjYXApIHtcbiAgICAgICAgdmFyIHRleHQ7XG5cbiAgICAgICAgaWYgKHRoaXMubGV4ZXIuc3RhdGUuaW5SYXdCbG9jaykge1xuICAgICAgICAgIHRleHQgPSB0aGlzLm9wdGlvbnMuc2FuaXRpemUgPyB0aGlzLm9wdGlvbnMuc2FuaXRpemVyID8gdGhpcy5vcHRpb25zLnNhbml0aXplcihjYXBbMF0pIDogX2VzY2FwZShjYXBbMF0pIDogY2FwWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRleHQgPSBfZXNjYXBlKHRoaXMub3B0aW9ucy5zbWFydHlwYW50cyA/IHNtYXJ0eXBhbnRzKGNhcFswXSkgOiBjYXBbMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgICAgcmF3OiBjYXBbMF0sXG4gICAgICAgICAgdGV4dDogdGV4dFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gVG9rZW5pemVyO1xuICB9KCk7XG5cbiAgdmFyIG5vb3BUZXN0ID0gaGVscGVycy5ub29wVGVzdCxcbiAgICAgIGVkaXQgPSBoZWxwZXJzLmVkaXQsXG4gICAgICBtZXJnZSQxID0gaGVscGVycy5tZXJnZTtcbiAgLyoqXG4gICAqIEJsb2NrLUxldmVsIEdyYW1tYXJcbiAgICovXG5cbiAgdmFyIGJsb2NrJDEgPSB7XG4gICAgbmV3bGluZTogL14oPzogKig/OlxcbnwkKSkrLyxcbiAgICBjb2RlOiAvXiggezR9W15cXG5dKyg/Olxcbig/OiAqKD86XFxufCQpKSopPykrLyxcbiAgICBmZW5jZXM6IC9eIHswLDN9KGB7Myx9KD89W15gXFxuXSpcXG4pfH57Myx9KShbXlxcbl0qKVxcbig/OnwoW1xcc1xcU10qPylcXG4pKD86IHswLDN9XFwxW35gXSogKig/PVxcbnwkKXwkKS8sXG4gICAgaHI6IC9eIHswLDN9KCg/Oi0gKil7Myx9fCg/Ol8gKil7Myx9fCg/OlxcKiAqKXszLH0pKD86XFxuK3wkKS8sXG4gICAgaGVhZGluZzogL14gezAsM30oI3sxLDZ9KSg/PVxcc3wkKSguKikoPzpcXG4rfCQpLyxcbiAgICBibG9ja3F1b3RlOiAvXiggezAsM30+ID8ocGFyYWdyYXBofFteXFxuXSopKD86XFxufCQpKSsvLFxuICAgIGxpc3Q6IC9eKCB7MCwzfWJ1bGwpKCBbXlxcbl0rPyk/KD86XFxufCQpLyxcbiAgICBodG1sOiAnXiB7MCwzfSg/OicgLy8gb3B0aW9uYWwgaW5kZW50YXRpb25cbiAgICArICc8KHNjcmlwdHxwcmV8c3R5bGV8dGV4dGFyZWEpW1xcXFxzPl1bXFxcXHNcXFxcU10qPyg/OjwvXFxcXDE+W15cXFxcbl0qXFxcXG4rfCQpJyAvLyAoMSlcbiAgICArICd8Y29tbWVudFteXFxcXG5dKihcXFxcbit8JCknIC8vICgyKVxuICAgICsgJ3w8XFxcXD9bXFxcXHNcXFxcU10qPyg/OlxcXFw/PlxcXFxuKnwkKScgLy8gKDMpXG4gICAgKyAnfDwhW0EtWl1bXFxcXHNcXFxcU10qPyg/Oj5cXFxcbip8JCknIC8vICg0KVxuICAgICsgJ3w8IVxcXFxbQ0RBVEFcXFxcW1tcXFxcc1xcXFxTXSo/KD86XFxcXF1cXFxcXT5cXFxcbip8JCknIC8vICg1KVxuICAgICsgJ3w8Lz8odGFnKSg/OiArfFxcXFxufC8/PilbXFxcXHNcXFxcU10qPyg/Oig/OlxcXFxuICopK1xcXFxufCQpJyAvLyAoNilcbiAgICArICd8PCg/IXNjcmlwdHxwcmV8c3R5bGV8dGV4dGFyZWEpKFthLXpdW1xcXFx3LV0qKSg/OmF0dHJpYnV0ZSkqPyAqLz8+KD89WyBcXFxcdF0qKD86XFxcXG58JCkpW1xcXFxzXFxcXFNdKj8oPzooPzpcXFxcbiAqKStcXFxcbnwkKScgLy8gKDcpIG9wZW4gdGFnXG4gICAgKyAnfDwvKD8hc2NyaXB0fHByZXxzdHlsZXx0ZXh0YXJlYSlbYS16XVtcXFxcdy1dKlxcXFxzKj4oPz1bIFxcXFx0XSooPzpcXFxcbnwkKSlbXFxcXHNcXFxcU10qPyg/Oig/OlxcXFxuICopK1xcXFxufCQpJyAvLyAoNykgY2xvc2luZyB0YWdcbiAgICArICcpJyxcbiAgICBkZWY6IC9eIHswLDN9XFxbKGxhYmVsKVxcXTogKlxcbj8gKjw/KFteXFxzPl0rKT4/KD86KD86ICtcXG4/ICp8ICpcXG4gKikodGl0bGUpKT8gKig/Olxcbit8JCkvLFxuICAgIHRhYmxlOiBub29wVGVzdCxcbiAgICBsaGVhZGluZzogL14oW15cXG5dKylcXG4gezAsM30oPSt8LSspICooPzpcXG4rfCQpLyxcbiAgICAvLyByZWdleCB0ZW1wbGF0ZSwgcGxhY2Vob2xkZXJzIHdpbGwgYmUgcmVwbGFjZWQgYWNjb3JkaW5nIHRvIGRpZmZlcmVudCBwYXJhZ3JhcGhcbiAgICAvLyBpbnRlcnJ1cHRpb24gcnVsZXMgb2YgY29tbW9ubWFyayBhbmQgdGhlIG9yaWdpbmFsIG1hcmtkb3duIHNwZWM6XG4gICAgX3BhcmFncmFwaDogL14oW15cXG5dKyg/Olxcbig/IWhyfGhlYWRpbmd8bGhlYWRpbmd8YmxvY2txdW90ZXxmZW5jZXN8bGlzdHxodG1sfCArXFxuKVteXFxuXSspKikvLFxuICAgIHRleHQ6IC9eW15cXG5dKy9cbiAgfTtcbiAgYmxvY2skMS5fbGFiZWwgPSAvKD8hXFxzKlxcXSkoPzpcXFxcW1xcW1xcXV18W15cXFtcXF1dKSsvO1xuICBibG9jayQxLl90aXRsZSA9IC8oPzpcIig/OlxcXFxcIj98W15cIlxcXFxdKSpcInwnW14nXFxuXSooPzpcXG5bXidcXG5dKykqXFxuPyd8XFwoW14oKV0qXFwpKS87XG4gIGJsb2NrJDEuZGVmID0gZWRpdChibG9jayQxLmRlZikucmVwbGFjZSgnbGFiZWwnLCBibG9jayQxLl9sYWJlbCkucmVwbGFjZSgndGl0bGUnLCBibG9jayQxLl90aXRsZSkuZ2V0UmVnZXgoKTtcbiAgYmxvY2skMS5idWxsZXQgPSAvKD86WyorLV18XFxkezEsOX1bLildKS87XG4gIGJsb2NrJDEubGlzdEl0ZW1TdGFydCA9IGVkaXQoL14oICopKGJ1bGwpICovKS5yZXBsYWNlKCdidWxsJywgYmxvY2skMS5idWxsZXQpLmdldFJlZ2V4KCk7XG4gIGJsb2NrJDEubGlzdCA9IGVkaXQoYmxvY2skMS5saXN0KS5yZXBsYWNlKC9idWxsL2csIGJsb2NrJDEuYnVsbGV0KS5yZXBsYWNlKCdocicsICdcXFxcbisoPz1cXFxcMT8oPzooPzotICopezMsfXwoPzpfICopezMsfXwoPzpcXFxcKiAqKXszLH0pKD86XFxcXG4rfCQpKScpLnJlcGxhY2UoJ2RlZicsICdcXFxcbisoPz0nICsgYmxvY2skMS5kZWYuc291cmNlICsgJyknKS5nZXRSZWdleCgpO1xuICBibG9jayQxLl90YWcgPSAnYWRkcmVzc3xhcnRpY2xlfGFzaWRlfGJhc2V8YmFzZWZvbnR8YmxvY2txdW90ZXxib2R5fGNhcHRpb24nICsgJ3xjZW50ZXJ8Y29sfGNvbGdyb3VwfGRkfGRldGFpbHN8ZGlhbG9nfGRpcnxkaXZ8ZGx8ZHR8ZmllbGRzZXR8ZmlnY2FwdGlvbicgKyAnfGZpZ3VyZXxmb290ZXJ8Zm9ybXxmcmFtZXxmcmFtZXNldHxoWzEtNl18aGVhZHxoZWFkZXJ8aHJ8aHRtbHxpZnJhbWUnICsgJ3xsZWdlbmR8bGl8bGlua3xtYWlufG1lbnV8bWVudWl0ZW18bWV0YXxuYXZ8bm9mcmFtZXN8b2x8b3B0Z3JvdXB8b3B0aW9uJyArICd8cHxwYXJhbXxzZWN0aW9ufHNvdXJjZXxzdW1tYXJ5fHRhYmxlfHRib2R5fHRkfHRmb290fHRofHRoZWFkfHRpdGxlfHRyJyArICd8dHJhY2t8dWwnO1xuICBibG9jayQxLl9jb21tZW50ID0gLzwhLS0oPyEtPz4pW1xcc1xcU10qPyg/Oi0tPnwkKS87XG4gIGJsb2NrJDEuaHRtbCA9IGVkaXQoYmxvY2skMS5odG1sLCAnaScpLnJlcGxhY2UoJ2NvbW1lbnQnLCBibG9jayQxLl9jb21tZW50KS5yZXBsYWNlKCd0YWcnLCBibG9jayQxLl90YWcpLnJlcGxhY2UoJ2F0dHJpYnV0ZScsIC8gK1thLXpBLVo6X11bXFx3LjotXSooPzogKj0gKlwiW15cIlxcbl0qXCJ8ICo9IConW14nXFxuXSonfCAqPSAqW15cXHNcIic9PD5gXSspPy8pLmdldFJlZ2V4KCk7XG4gIGJsb2NrJDEucGFyYWdyYXBoID0gZWRpdChibG9jayQxLl9wYXJhZ3JhcGgpLnJlcGxhY2UoJ2hyJywgYmxvY2skMS5ocikucmVwbGFjZSgnaGVhZGluZycsICcgezAsM30jezEsNn0gJykucmVwbGFjZSgnfGxoZWFkaW5nJywgJycpIC8vIHNldGV4IGhlYWRpbmdzIGRvbid0IGludGVycnVwdCBjb21tb25tYXJrIHBhcmFncmFwaHNcbiAgLnJlcGxhY2UoJ2Jsb2NrcXVvdGUnLCAnIHswLDN9PicpLnJlcGxhY2UoJ2ZlbmNlcycsICcgezAsM30oPzpgezMsfSg/PVteYFxcXFxuXSpcXFxcbil8fnszLH0pW15cXFxcbl0qXFxcXG4nKS5yZXBsYWNlKCdsaXN0JywgJyB7MCwzfSg/OlsqKy1dfDFbLildKSAnKSAvLyBvbmx5IGxpc3RzIHN0YXJ0aW5nIGZyb20gMSBjYW4gaW50ZXJydXB0XG4gIC5yZXBsYWNlKCdodG1sJywgJzwvPyg/OnRhZykoPzogK3xcXFxcbnwvPz4pfDwoPzpzY3JpcHR8cHJlfHN0eWxlfHRleHRhcmVhfCEtLSknKS5yZXBsYWNlKCd0YWcnLCBibG9jayQxLl90YWcpIC8vIHBhcnMgY2FuIGJlIGludGVycnVwdGVkIGJ5IHR5cGUgKDYpIGh0bWwgYmxvY2tzXG4gIC5nZXRSZWdleCgpO1xuICBibG9jayQxLmJsb2NrcXVvdGUgPSBlZGl0KGJsb2NrJDEuYmxvY2txdW90ZSkucmVwbGFjZSgncGFyYWdyYXBoJywgYmxvY2skMS5wYXJhZ3JhcGgpLmdldFJlZ2V4KCk7XG4gIC8qKlxuICAgKiBOb3JtYWwgQmxvY2sgR3JhbW1hclxuICAgKi9cblxuICBibG9jayQxLm5vcm1hbCA9IG1lcmdlJDEoe30sIGJsb2NrJDEpO1xuICAvKipcbiAgICogR0ZNIEJsb2NrIEdyYW1tYXJcbiAgICovXG5cbiAgYmxvY2skMS5nZm0gPSBtZXJnZSQxKHt9LCBibG9jayQxLm5vcm1hbCwge1xuICAgIHRhYmxlOiAnXiAqKFteXFxcXG4gXS4qXFxcXHwuKilcXFxcbicgLy8gSGVhZGVyXG4gICAgKyAnIHswLDN9KD86XFxcXHwgKik/KDo/LSs6PyAqKD86XFxcXHwgKjo/LSs6PyAqKSopXFxcXHw/JyAvLyBBbGlnblxuICAgICsgJyg/OlxcXFxuKCg/Oig/ISAqXFxcXG58aHJ8aGVhZGluZ3xibG9ja3F1b3RlfGNvZGV8ZmVuY2VzfGxpc3R8aHRtbCkuKig/OlxcXFxufCQpKSopXFxcXG4qfCQpJyAvLyBDZWxsc1xuXG4gIH0pO1xuICBibG9jayQxLmdmbS50YWJsZSA9IGVkaXQoYmxvY2skMS5nZm0udGFibGUpLnJlcGxhY2UoJ2hyJywgYmxvY2skMS5ocikucmVwbGFjZSgnaGVhZGluZycsICcgezAsM30jezEsNn0gJykucmVwbGFjZSgnYmxvY2txdW90ZScsICcgezAsM30+JykucmVwbGFjZSgnY29kZScsICcgezR9W15cXFxcbl0nKS5yZXBsYWNlKCdmZW5jZXMnLCAnIHswLDN9KD86YHszLH0oPz1bXmBcXFxcbl0qXFxcXG4pfH57Myx9KVteXFxcXG5dKlxcXFxuJykucmVwbGFjZSgnbGlzdCcsICcgezAsM30oPzpbKistXXwxWy4pXSkgJykgLy8gb25seSBsaXN0cyBzdGFydGluZyBmcm9tIDEgY2FuIGludGVycnVwdFxuICAucmVwbGFjZSgnaHRtbCcsICc8Lz8oPzp0YWcpKD86ICt8XFxcXG58Lz8+KXw8KD86c2NyaXB0fHByZXxzdHlsZXx0ZXh0YXJlYXwhLS0pJykucmVwbGFjZSgndGFnJywgYmxvY2skMS5fdGFnKSAvLyB0YWJsZXMgY2FuIGJlIGludGVycnVwdGVkIGJ5IHR5cGUgKDYpIGh0bWwgYmxvY2tzXG4gIC5nZXRSZWdleCgpO1xuICAvKipcbiAgICogUGVkYW50aWMgZ3JhbW1hciAob3JpZ2luYWwgSm9obiBHcnViZXIncyBsb29zZSBtYXJrZG93biBzcGVjaWZpY2F0aW9uKVxuICAgKi9cblxuICBibG9jayQxLnBlZGFudGljID0gbWVyZ2UkMSh7fSwgYmxvY2skMS5ub3JtYWwsIHtcbiAgICBodG1sOiBlZGl0KCdeICooPzpjb21tZW50ICooPzpcXFxcbnxcXFxccyokKScgKyAnfDwodGFnKVtcXFxcc1xcXFxTXSs/PC9cXFxcMT4gKig/OlxcXFxuezIsfXxcXFxccyokKScgLy8gY2xvc2VkIHRhZ1xuICAgICsgJ3w8dGFnKD86XCJbXlwiXSpcInxcXCdbXlxcJ10qXFwnfFxcXFxzW15cXCdcIi8+XFxcXHNdKikqPy8/PiAqKD86XFxcXG57Mix9fFxcXFxzKiQpKScpLnJlcGxhY2UoJ2NvbW1lbnQnLCBibG9jayQxLl9jb21tZW50KS5yZXBsYWNlKC90YWcvZywgJyg/ISg/OicgKyAnYXxlbXxzdHJvbmd8c21hbGx8c3xjaXRlfHF8ZGZufGFiYnJ8ZGF0YXx0aW1lfGNvZGV8dmFyfHNhbXB8a2JkfHN1YicgKyAnfHN1cHxpfGJ8dXxtYXJrfHJ1Ynl8cnR8cnB8YmRpfGJkb3xzcGFufGJyfHdicnxpbnN8ZGVsfGltZyknICsgJ1xcXFxiKVxcXFx3Kyg/ITp8W15cXFxcd1xcXFxzQF0qQClcXFxcYicpLmdldFJlZ2V4KCksXG4gICAgZGVmOiAvXiAqXFxbKFteXFxdXSspXFxdOiAqPD8oW15cXHM+XSspPj8oPzogKyhbXCIoXVteXFxuXStbXCIpXSkpPyAqKD86XFxuK3wkKS8sXG4gICAgaGVhZGluZzogL14oI3sxLDZ9KSguKikoPzpcXG4rfCQpLyxcbiAgICBmZW5jZXM6IG5vb3BUZXN0LFxuICAgIC8vIGZlbmNlcyBub3Qgc3VwcG9ydGVkXG4gICAgcGFyYWdyYXBoOiBlZGl0KGJsb2NrJDEubm9ybWFsLl9wYXJhZ3JhcGgpLnJlcGxhY2UoJ2hyJywgYmxvY2skMS5ocikucmVwbGFjZSgnaGVhZGluZycsICcgKiN7MSw2fSAqW15cXG5dJykucmVwbGFjZSgnbGhlYWRpbmcnLCBibG9jayQxLmxoZWFkaW5nKS5yZXBsYWNlKCdibG9ja3F1b3RlJywgJyB7MCwzfT4nKS5yZXBsYWNlKCd8ZmVuY2VzJywgJycpLnJlcGxhY2UoJ3xsaXN0JywgJycpLnJlcGxhY2UoJ3xodG1sJywgJycpLmdldFJlZ2V4KClcbiAgfSk7XG4gIC8qKlxuICAgKiBJbmxpbmUtTGV2ZWwgR3JhbW1hclxuICAgKi9cblxuICB2YXIgaW5saW5lJDEgPSB7XG4gICAgZXNjYXBlOiAvXlxcXFwoWyFcIiMkJSYnKCkqKyxcXC0uLzo7PD0+P0BcXFtcXF1cXFxcXl9ge3x9fl0pLyxcbiAgICBhdXRvbGluazogL148KHNjaGVtZTpbXlxcc1xceDAwLVxceDFmPD5dKnxlbWFpbCk+LyxcbiAgICB1cmw6IG5vb3BUZXN0LFxuICAgIHRhZzogJ15jb21tZW50JyArICd8XjwvW2EtekEtWl1bXFxcXHc6LV0qXFxcXHMqPicgLy8gc2VsZi1jbG9zaW5nIHRhZ1xuICAgICsgJ3xePFthLXpBLVpdW1xcXFx3LV0qKD86YXR0cmlidXRlKSo/XFxcXHMqLz8+JyAvLyBvcGVuIHRhZ1xuICAgICsgJ3xePFxcXFw/W1xcXFxzXFxcXFNdKj9cXFxcPz4nIC8vIHByb2Nlc3NpbmcgaW5zdHJ1Y3Rpb24sIGUuZy4gPD9waHAgPz5cbiAgICArICd8XjwhW2EtekEtWl0rXFxcXHNbXFxcXHNcXFxcU10qPz4nIC8vIGRlY2xhcmF0aW9uLCBlLmcuIDwhRE9DVFlQRSBodG1sPlxuICAgICsgJ3xePCFcXFxcW0NEQVRBXFxcXFtbXFxcXHNcXFxcU10qP1xcXFxdXFxcXF0+JyxcbiAgICAvLyBDREFUQSBzZWN0aW9uXG4gICAgbGluazogL14hP1xcWyhsYWJlbClcXF1cXChcXHMqKGhyZWYpKD86XFxzKyh0aXRsZSkpP1xccypcXCkvLFxuICAgIHJlZmxpbms6IC9eIT9cXFsobGFiZWwpXFxdXFxbKD8hXFxzKlxcXSkoKD86XFxcXFtcXFtcXF1dP3xbXlxcW1xcXVxcXFxdKSspXFxdLyxcbiAgICBub2xpbms6IC9eIT9cXFsoPyFcXHMqXFxdKSgoPzpcXFtbXlxcW1xcXV0qXFxdfFxcXFxbXFxbXFxdXXxbXlxcW1xcXV0pKilcXF0oPzpcXFtcXF0pPy8sXG4gICAgcmVmbGlua1NlYXJjaDogJ3JlZmxpbmt8bm9saW5rKD8hXFxcXCgpJyxcbiAgICBlbVN0cm9uZzoge1xuICAgICAgbERlbGltOiAvXig/OlxcKisoPzooW3B1bmN0X10pfFteXFxzKl0pKXxeXysoPzooW3B1bmN0Kl0pfChbXlxcc19dKSkvLFxuICAgICAgLy8gICAgICAgICgxKSBhbmQgKDIpIGNhbiBvbmx5IGJlIGEgUmlnaHQgRGVsaW1pdGVyLiAoMykgYW5kICg0KSBjYW4gb25seSBiZSBMZWZ0LiAgKDUpIGFuZCAoNikgY2FuIGJlIGVpdGhlciBMZWZ0IG9yIFJpZ2h0LlxuICAgICAgLy8gICAgICAgICgpIFNraXAgb3RoZXIgZGVsaW1pdGVyICgxKSAjKioqICAgICAgICAgICAgICAgICAgICgyKSBhKioqIywgYSoqKiAgICAgICAgICAgICAgICAgICAoMykgIyoqKmEsICoqKmEgICAgICAgICAgICAgICAgICg0KSAqKiojICAgICAgICAgICAgICAoNSkgIyoqKiMgICAgICAgICAgICAgICAgICg2KSBhKioqYVxuICAgICAgckRlbGltQXN0OiAvXFxfXFxfW15fKl0qP1xcKlteXypdKj9cXF9cXF98W3B1bmN0X10oXFwqKykoPz1bXFxzXXwkKXxbXnB1bmN0Kl9cXHNdKFxcKispKD89W3B1bmN0X1xcc118JCl8W3B1bmN0X1xcc10oXFwqKykoPz1bXnB1bmN0Kl9cXHNdKXxbXFxzXShcXCorKSg/PVtwdW5jdF9dKXxbcHVuY3RfXShcXCorKSg/PVtwdW5jdF9dKXxbXnB1bmN0Kl9cXHNdKFxcKispKD89W15wdW5jdCpfXFxzXSkvLFxuICAgICAgckRlbGltVW5kOiAvXFwqXFwqW15fKl0qP1xcX1teXypdKj9cXCpcXCp8W3B1bmN0Kl0oXFxfKykoPz1bXFxzXXwkKXxbXnB1bmN0Kl9cXHNdKFxcXyspKD89W3B1bmN0Klxcc118JCl8W3B1bmN0Klxcc10oXFxfKykoPz1bXnB1bmN0Kl9cXHNdKXxbXFxzXShcXF8rKSg/PVtwdW5jdCpdKXxbcHVuY3QqXShcXF8rKSg/PVtwdW5jdCpdKS8gLy8gXi0gTm90IGFsbG93ZWQgZm9yIF9cblxuICAgIH0sXG4gICAgY29kZTogL14oYCspKFteYF18W15gXVtcXHNcXFNdKj9bXmBdKVxcMSg/IWApLyxcbiAgICBicjogL14oIHsyLH18XFxcXClcXG4oPyFcXHMqJCkvLFxuICAgIGRlbDogbm9vcFRlc3QsXG4gICAgdGV4dDogL14oYCt8W15gXSkoPzooPz0gezIsfVxcbil8W1xcc1xcU10qPyg/Oig/PVtcXFxcPCFcXFtgKl9dfFxcYl98JCl8W14gXSg/PSB7Mix9XFxuKSkpLyxcbiAgICBwdW5jdHVhdGlvbjogL14oW1xcc3B1bmN0dWF0aW9uXSkvXG4gIH07IC8vIGxpc3Qgb2YgcHVuY3R1YXRpb24gbWFya3MgZnJvbSBDb21tb25NYXJrIHNwZWNcbiAgLy8gd2l0aG91dCAqIGFuZCBfIHRvIGhhbmRsZSB0aGUgZGlmZmVyZW50IGVtcGhhc2lzIG1hcmtlcnMgKiBhbmQgX1xuXG4gIGlubGluZSQxLl9wdW5jdHVhdGlvbiA9ICchXCIjJCUmXFwnKCkrXFxcXC0uLC86Ozw9Pj9AXFxcXFtcXFxcXWBee3x9fic7XG4gIGlubGluZSQxLnB1bmN0dWF0aW9uID0gZWRpdChpbmxpbmUkMS5wdW5jdHVhdGlvbikucmVwbGFjZSgvcHVuY3R1YXRpb24vZywgaW5saW5lJDEuX3B1bmN0dWF0aW9uKS5nZXRSZWdleCgpOyAvLyBzZXF1ZW5jZXMgZW0gc2hvdWxkIHNraXAgb3ZlciBbdGl0bGVdKGxpbmspLCBgY29kZWAsIDxodG1sPlxuXG4gIGlubGluZSQxLmJsb2NrU2tpcCA9IC9cXFtbXlxcXV0qP1xcXVxcKFteXFwpXSo/XFwpfGBbXmBdKj9gfDxbXj5dKj8+L2c7XG4gIGlubGluZSQxLmVzY2FwZWRFbVN0ID0gL1xcXFxcXCp8XFxcXF8vZztcbiAgaW5saW5lJDEuX2NvbW1lbnQgPSBlZGl0KGJsb2NrJDEuX2NvbW1lbnQpLnJlcGxhY2UoJyg/Oi0tPnwkKScsICctLT4nKS5nZXRSZWdleCgpO1xuICBpbmxpbmUkMS5lbVN0cm9uZy5sRGVsaW0gPSBlZGl0KGlubGluZSQxLmVtU3Ryb25nLmxEZWxpbSkucmVwbGFjZSgvcHVuY3QvZywgaW5saW5lJDEuX3B1bmN0dWF0aW9uKS5nZXRSZWdleCgpO1xuICBpbmxpbmUkMS5lbVN0cm9uZy5yRGVsaW1Bc3QgPSBlZGl0KGlubGluZSQxLmVtU3Ryb25nLnJEZWxpbUFzdCwgJ2cnKS5yZXBsYWNlKC9wdW5jdC9nLCBpbmxpbmUkMS5fcHVuY3R1YXRpb24pLmdldFJlZ2V4KCk7XG4gIGlubGluZSQxLmVtU3Ryb25nLnJEZWxpbVVuZCA9IGVkaXQoaW5saW5lJDEuZW1TdHJvbmcuckRlbGltVW5kLCAnZycpLnJlcGxhY2UoL3B1bmN0L2csIGlubGluZSQxLl9wdW5jdHVhdGlvbikuZ2V0UmVnZXgoKTtcbiAgaW5saW5lJDEuX2VzY2FwZXMgPSAvXFxcXChbIVwiIyQlJicoKSorLFxcLS4vOjs8PT4/QFxcW1xcXVxcXFxeX2B7fH1+XSkvZztcbiAgaW5saW5lJDEuX3NjaGVtZSA9IC9bYS16QS1aXVthLXpBLVowLTkrLi1dezEsMzF9LztcbiAgaW5saW5lJDEuX2VtYWlsID0gL1thLXpBLVowLTkuISMkJSYnKisvPT9eX2B7fH1+LV0rKEApW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSsoPyFbLV9dKS87XG4gIGlubGluZSQxLmF1dG9saW5rID0gZWRpdChpbmxpbmUkMS5hdXRvbGluaykucmVwbGFjZSgnc2NoZW1lJywgaW5saW5lJDEuX3NjaGVtZSkucmVwbGFjZSgnZW1haWwnLCBpbmxpbmUkMS5fZW1haWwpLmdldFJlZ2V4KCk7XG4gIGlubGluZSQxLl9hdHRyaWJ1dGUgPSAvXFxzK1thLXpBLVo6X11bXFx3LjotXSooPzpcXHMqPVxccypcIlteXCJdKlwifFxccyo9XFxzKidbXiddKid8XFxzKj1cXHMqW15cXHNcIic9PD5gXSspPy87XG4gIGlubGluZSQxLnRhZyA9IGVkaXQoaW5saW5lJDEudGFnKS5yZXBsYWNlKCdjb21tZW50JywgaW5saW5lJDEuX2NvbW1lbnQpLnJlcGxhY2UoJ2F0dHJpYnV0ZScsIGlubGluZSQxLl9hdHRyaWJ1dGUpLmdldFJlZ2V4KCk7XG4gIGlubGluZSQxLl9sYWJlbCA9IC8oPzpcXFsoPzpcXFxcLnxbXlxcW1xcXVxcXFxdKSpcXF18XFxcXC58YFteYF0qYHxbXlxcW1xcXVxcXFxgXSkqPy87XG4gIGlubGluZSQxLl9ocmVmID0gLzwoPzpcXFxcLnxbXlxcbjw+XFxcXF0pKz58W15cXHNcXHgwMC1cXHgxZl0qLztcbiAgaW5saW5lJDEuX3RpdGxlID0gL1wiKD86XFxcXFwiP3xbXlwiXFxcXF0pKlwifCcoPzpcXFxcJz98W14nXFxcXF0pKid8XFwoKD86XFxcXFxcKT98W14pXFxcXF0pKlxcKS87XG4gIGlubGluZSQxLmxpbmsgPSBlZGl0KGlubGluZSQxLmxpbmspLnJlcGxhY2UoJ2xhYmVsJywgaW5saW5lJDEuX2xhYmVsKS5yZXBsYWNlKCdocmVmJywgaW5saW5lJDEuX2hyZWYpLnJlcGxhY2UoJ3RpdGxlJywgaW5saW5lJDEuX3RpdGxlKS5nZXRSZWdleCgpO1xuICBpbmxpbmUkMS5yZWZsaW5rID0gZWRpdChpbmxpbmUkMS5yZWZsaW5rKS5yZXBsYWNlKCdsYWJlbCcsIGlubGluZSQxLl9sYWJlbCkuZ2V0UmVnZXgoKTtcbiAgaW5saW5lJDEucmVmbGlua1NlYXJjaCA9IGVkaXQoaW5saW5lJDEucmVmbGlua1NlYXJjaCwgJ2cnKS5yZXBsYWNlKCdyZWZsaW5rJywgaW5saW5lJDEucmVmbGluaykucmVwbGFjZSgnbm9saW5rJywgaW5saW5lJDEubm9saW5rKS5nZXRSZWdleCgpO1xuICAvKipcbiAgICogTm9ybWFsIElubGluZSBHcmFtbWFyXG4gICAqL1xuXG4gIGlubGluZSQxLm5vcm1hbCA9IG1lcmdlJDEoe30sIGlubGluZSQxKTtcbiAgLyoqXG4gICAqIFBlZGFudGljIElubGluZSBHcmFtbWFyXG4gICAqL1xuXG4gIGlubGluZSQxLnBlZGFudGljID0gbWVyZ2UkMSh7fSwgaW5saW5lJDEubm9ybWFsLCB7XG4gICAgc3Ryb25nOiB7XG4gICAgICBzdGFydDogL15fX3xcXCpcXCovLFxuICAgICAgbWlkZGxlOiAvXl9fKD89XFxTKShbXFxzXFxTXSo/XFxTKV9fKD8hXyl8XlxcKlxcKig/PVxcUykoW1xcc1xcU10qP1xcUylcXCpcXCooPyFcXCopLyxcbiAgICAgIGVuZEFzdDogL1xcKlxcKig/IVxcKikvZyxcbiAgICAgIGVuZFVuZDogL19fKD8hXykvZ1xuICAgIH0sXG4gICAgZW06IHtcbiAgICAgIHN0YXJ0OiAvXl98XFwqLyxcbiAgICAgIG1pZGRsZTogL14oKVxcKig/PVxcUykoW1xcc1xcU10qP1xcUylcXCooPyFcXCopfF5fKD89XFxTKShbXFxzXFxTXSo/XFxTKV8oPyFfKS8sXG4gICAgICBlbmRBc3Q6IC9cXCooPyFcXCopL2csXG4gICAgICBlbmRVbmQ6IC9fKD8hXykvZ1xuICAgIH0sXG4gICAgbGluazogZWRpdCgvXiE/XFxbKGxhYmVsKVxcXVxcKCguKj8pXFwpLykucmVwbGFjZSgnbGFiZWwnLCBpbmxpbmUkMS5fbGFiZWwpLmdldFJlZ2V4KCksXG4gICAgcmVmbGluazogZWRpdCgvXiE/XFxbKGxhYmVsKVxcXVxccypcXFsoW15cXF1dKilcXF0vKS5yZXBsYWNlKCdsYWJlbCcsIGlubGluZSQxLl9sYWJlbCkuZ2V0UmVnZXgoKVxuICB9KTtcbiAgLyoqXG4gICAqIEdGTSBJbmxpbmUgR3JhbW1hclxuICAgKi9cblxuICBpbmxpbmUkMS5nZm0gPSBtZXJnZSQxKHt9LCBpbmxpbmUkMS5ub3JtYWwsIHtcbiAgICBlc2NhcGU6IGVkaXQoaW5saW5lJDEuZXNjYXBlKS5yZXBsYWNlKCddKScsICd+fF0pJykuZ2V0UmVnZXgoKSxcbiAgICBfZXh0ZW5kZWRfZW1haWw6IC9bQS1aYS16MC05Ll8rLV0rKEApW2EtekEtWjAtOS1fXSsoPzpcXC5bYS16QS1aMC05LV9dKlthLXpBLVowLTldKSsoPyFbLV9dKS8sXG4gICAgdXJsOiAvXigoPzpmdHB8aHR0cHM/KTpcXC9cXC98d3d3XFwuKSg/OlthLXpBLVowLTlcXC1dK1xcLj8pK1teXFxzPF0qfF5lbWFpbC8sXG4gICAgX2JhY2twZWRhbDogLyg/OltePyEuLDo7Kl9+KCkmXSt8XFwoW14pXSpcXCl8Jig/IVthLXpBLVowLTldKzskKXxbPyEuLDo7Kl9+KV0rKD8hJCkpKy8sXG4gICAgZGVsOiAvXih+fj8pKD89W15cXHN+XSkoW1xcc1xcU10qP1teXFxzfl0pXFwxKD89W15+XXwkKS8sXG4gICAgdGV4dDogL14oW2B+XSt8W15gfl0pKD86KD89IHsyLH1cXG4pfCg/PVthLXpBLVowLTkuISMkJSYnKitcXC89P19ge1xcfH1+LV0rQCl8W1xcc1xcU10qPyg/Oig/PVtcXFxcPCFcXFtgKn5fXXxcXGJffGh0dHBzPzpcXC9cXC98ZnRwOlxcL1xcL3x3d3dcXC58JCl8W14gXSg/PSB7Mix9XFxuKXxbXmEtekEtWjAtOS4hIyQlJicqK1xcLz0/X2B7XFx8fX4tXSg/PVthLXpBLVowLTkuISMkJSYnKitcXC89P19ge1xcfH1+LV0rQCkpKS9cbiAgfSk7XG4gIGlubGluZSQxLmdmbS51cmwgPSBlZGl0KGlubGluZSQxLmdmbS51cmwsICdpJykucmVwbGFjZSgnZW1haWwnLCBpbmxpbmUkMS5nZm0uX2V4dGVuZGVkX2VtYWlsKS5nZXRSZWdleCgpO1xuICAvKipcbiAgICogR0ZNICsgTGluZSBCcmVha3MgSW5saW5lIEdyYW1tYXJcbiAgICovXG5cbiAgaW5saW5lJDEuYnJlYWtzID0gbWVyZ2UkMSh7fSwgaW5saW5lJDEuZ2ZtLCB7XG4gICAgYnI6IGVkaXQoaW5saW5lJDEuYnIpLnJlcGxhY2UoJ3syLH0nLCAnKicpLmdldFJlZ2V4KCksXG4gICAgdGV4dDogZWRpdChpbmxpbmUkMS5nZm0udGV4dCkucmVwbGFjZSgnXFxcXGJfJywgJ1xcXFxiX3wgezIsfVxcXFxuJykucmVwbGFjZSgvXFx7MixcXH0vZywgJyonKS5nZXRSZWdleCgpXG4gIH0pO1xuICB2YXIgcnVsZXMgPSB7XG4gICAgYmxvY2s6IGJsb2NrJDEsXG4gICAgaW5saW5lOiBpbmxpbmUkMVxuICB9O1xuXG4gIHZhciBUb2tlbml6ZXIkMSA9IFRva2VuaXplcl8xO1xuICB2YXIgZGVmYXVsdHMkMyA9IGRlZmF1bHRzJDUuZXhwb3J0cy5kZWZhdWx0cztcbiAgdmFyIGJsb2NrID0gcnVsZXMuYmxvY2ssXG4gICAgICBpbmxpbmUgPSBydWxlcy5pbmxpbmU7XG4gIHZhciByZXBlYXRTdHJpbmcgPSBoZWxwZXJzLnJlcGVhdFN0cmluZztcbiAgLyoqXG4gICAqIHNtYXJ0eXBhbnRzIHRleHQgcmVwbGFjZW1lbnRcbiAgICovXG5cbiAgZnVuY3Rpb24gc21hcnR5cGFudHModGV4dCkge1xuICAgIHJldHVybiB0ZXh0IC8vIGVtLWRhc2hlc1xuICAgIC5yZXBsYWNlKC8tLS0vZywgXCJcXHUyMDE0XCIpIC8vIGVuLWRhc2hlc1xuICAgIC5yZXBsYWNlKC8tLS9nLCBcIlxcdTIwMTNcIikgLy8gb3BlbmluZyBzaW5nbGVzXG4gICAgLnJlcGxhY2UoLyhefFstXFx1MjAxNC8oXFxbe1wiXFxzXSknL2csIFwiJDFcXHUyMDE4XCIpIC8vIGNsb3Npbmcgc2luZ2xlcyAmIGFwb3N0cm9waGVzXG4gICAgLnJlcGxhY2UoLycvZywgXCJcXHUyMDE5XCIpIC8vIG9wZW5pbmcgZG91Ymxlc1xuICAgIC5yZXBsYWNlKC8oXnxbLVxcdTIwMTQvKFxcW3tcXHUyMDE4XFxzXSlcIi9nLCBcIiQxXFx1MjAxQ1wiKSAvLyBjbG9zaW5nIGRvdWJsZXNcbiAgICAucmVwbGFjZSgvXCIvZywgXCJcXHUyMDFEXCIpIC8vIGVsbGlwc2VzXG4gICAgLnJlcGxhY2UoL1xcLnszfS9nLCBcIlxcdTIwMjZcIik7XG4gIH1cbiAgLyoqXG4gICAqIG1hbmdsZSBlbWFpbCBhZGRyZXNzZXNcbiAgICovXG5cblxuICBmdW5jdGlvbiBtYW5nbGUodGV4dCkge1xuICAgIHZhciBvdXQgPSAnJyxcbiAgICAgICAgaSxcbiAgICAgICAgY2g7XG4gICAgdmFyIGwgPSB0ZXh0Lmxlbmd0aDtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNoID0gdGV4dC5jaGFyQ29kZUF0KGkpO1xuXG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuNSkge1xuICAgICAgICBjaCA9ICd4JyArIGNoLnRvU3RyaW5nKDE2KTtcbiAgICAgIH1cblxuICAgICAgb3V0ICs9ICcmIycgKyBjaCArICc7JztcbiAgICB9XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIC8qKlxuICAgKiBCbG9jayBMZXhlclxuICAgKi9cblxuXG4gIHZhciBMZXhlcl8xID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBMZXhlcihvcHRpb25zKSB7XG4gICAgICB0aGlzLnRva2VucyA9IFtdO1xuICAgICAgdGhpcy50b2tlbnMubGlua3MgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBkZWZhdWx0cyQzO1xuICAgICAgdGhpcy5vcHRpb25zLnRva2VuaXplciA9IHRoaXMub3B0aW9ucy50b2tlbml6ZXIgfHwgbmV3IFRva2VuaXplciQxKCk7XG4gICAgICB0aGlzLnRva2VuaXplciA9IHRoaXMub3B0aW9ucy50b2tlbml6ZXI7XG4gICAgICB0aGlzLnRva2VuaXplci5vcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgdGhpcy50b2tlbml6ZXIubGV4ZXIgPSB0aGlzO1xuICAgICAgdGhpcy5pbmxpbmVRdWV1ZSA9IFtdO1xuICAgICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgICAgaW5MaW5rOiBmYWxzZSxcbiAgICAgICAgaW5SYXdCbG9jazogZmFsc2UsXG4gICAgICAgIHRvcDogdHJ1ZVxuICAgICAgfTtcbiAgICAgIHZhciBydWxlcyA9IHtcbiAgICAgICAgYmxvY2s6IGJsb2NrLm5vcm1hbCxcbiAgICAgICAgaW5saW5lOiBpbmxpbmUubm9ybWFsXG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnBlZGFudGljKSB7XG4gICAgICAgIHJ1bGVzLmJsb2NrID0gYmxvY2sucGVkYW50aWM7XG4gICAgICAgIHJ1bGVzLmlubGluZSA9IGlubGluZS5wZWRhbnRpYztcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmdmbSkge1xuICAgICAgICBydWxlcy5ibG9jayA9IGJsb2NrLmdmbTtcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmJyZWFrcykge1xuICAgICAgICAgIHJ1bGVzLmlubGluZSA9IGlubGluZS5icmVha3M7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcnVsZXMuaW5saW5lID0gaW5saW5lLmdmbTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnRva2VuaXplci5ydWxlcyA9IHJ1bGVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgUnVsZXNcbiAgICAgKi9cblxuXG4gICAgLyoqXG4gICAgICogU3RhdGljIExleCBNZXRob2RcbiAgICAgKi9cbiAgICBMZXhlci5sZXggPSBmdW5jdGlvbiBsZXgoc3JjLCBvcHRpb25zKSB7XG4gICAgICB2YXIgbGV4ZXIgPSBuZXcgTGV4ZXIob3B0aW9ucyk7XG4gICAgICByZXR1cm4gbGV4ZXIubGV4KHNyYyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN0YXRpYyBMZXggSW5saW5lIE1ldGhvZFxuICAgICAqL1xuICAgIDtcblxuICAgIExleGVyLmxleElubGluZSA9IGZ1bmN0aW9uIGxleElubGluZShzcmMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBsZXhlciA9IG5ldyBMZXhlcihvcHRpb25zKTtcbiAgICAgIHJldHVybiBsZXhlci5pbmxpbmVUb2tlbnMoc3JjKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUHJlcHJvY2Vzc2luZ1xuICAgICAqL1xuICAgIDtcblxuICAgIHZhciBfcHJvdG8gPSBMZXhlci5wcm90b3R5cGU7XG5cbiAgICBfcHJvdG8ubGV4ID0gZnVuY3Rpb24gbGV4KHNyYykge1xuICAgICAgc3JjID0gc3JjLnJlcGxhY2UoL1xcclxcbnxcXHIvZywgJ1xcbicpLnJlcGxhY2UoL1xcdC9nLCAnICAgICcpO1xuICAgICAgdGhpcy5ibG9ja1Rva2VucyhzcmMsIHRoaXMudG9rZW5zKTtcbiAgICAgIHZhciBuZXh0O1xuXG4gICAgICB3aGlsZSAobmV4dCA9IHRoaXMuaW5saW5lUXVldWUuc2hpZnQoKSkge1xuICAgICAgICB0aGlzLmlubGluZVRva2VucyhuZXh0LnNyYywgbmV4dC50b2tlbnMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy50b2tlbnM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExleGluZ1xuICAgICAqL1xuICAgIDtcblxuICAgIF9wcm90by5ibG9ja1Rva2VucyA9IGZ1bmN0aW9uIGJsb2NrVG9rZW5zKHNyYywgdG9rZW5zKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICBpZiAodG9rZW5zID09PSB2b2lkIDApIHtcbiAgICAgICAgdG9rZW5zID0gW107XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucGVkYW50aWMpIHtcbiAgICAgICAgc3JjID0gc3JjLnJlcGxhY2UoL14gKyQvZ20sICcnKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRva2VuLCBsYXN0VG9rZW4sIGN1dFNyYywgbGFzdFBhcmFncmFwaENsaXBwZWQ7XG5cbiAgICAgIHdoaWxlIChzcmMpIHtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5leHRlbnNpb25zICYmIHRoaXMub3B0aW9ucy5leHRlbnNpb25zLmJsb2NrICYmIHRoaXMub3B0aW9ucy5leHRlbnNpb25zLmJsb2NrLnNvbWUoZnVuY3Rpb24gKGV4dFRva2VuaXplcikge1xuICAgICAgICAgIGlmICh0b2tlbiA9IGV4dFRva2VuaXplci5jYWxsKHtcbiAgICAgICAgICAgIGxleGVyOiBfdGhpc1xuICAgICAgICAgIH0sIHNyYywgdG9rZW5zKSkge1xuICAgICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBuZXdsaW5lXG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5zcGFjZShzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcblxuICAgICAgICAgIGlmICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gY29kZVxuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuY29kZShzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdOyAvLyBBbiBpbmRlbnRlZCBjb2RlIGJsb2NrIGNhbm5vdCBpbnRlcnJ1cHQgYSBwYXJhZ3JhcGguXG5cbiAgICAgICAgICBpZiAobGFzdFRva2VuICYmIChsYXN0VG9rZW4udHlwZSA9PT0gJ3BhcmFncmFwaCcgfHwgbGFzdFRva2VuLnR5cGUgPT09ICd0ZXh0JykpIHtcbiAgICAgICAgICAgIGxhc3RUb2tlbi5yYXcgKz0gJ1xcbicgKyB0b2tlbi5yYXc7XG4gICAgICAgICAgICBsYXN0VG9rZW4udGV4dCArPSAnXFxuJyArIHRva2VuLnRleHQ7XG4gICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlW3RoaXMuaW5saW5lUXVldWUubGVuZ3RoIC0gMV0uc3JjID0gbGFzdFRva2VuLnRleHQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBmZW5jZXNcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmZlbmNlcyhzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gaGVhZGluZ1xuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuaGVhZGluZyhzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gaHJcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmhyKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBibG9ja3F1b3RlXG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5ibG9ja3F1b3RlKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBsaXN0XG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5saXN0KHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBodG1sXG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5odG1sKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBkZWZcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmRlZihzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgaWYgKGxhc3RUb2tlbiAmJiAobGFzdFRva2VuLnR5cGUgPT09ICdwYXJhZ3JhcGgnIHx8IGxhc3RUb2tlbi50eXBlID09PSAndGV4dCcpKSB7XG4gICAgICAgICAgICBsYXN0VG9rZW4ucmF3ICs9ICdcXG4nICsgdG9rZW4ucmF3O1xuICAgICAgICAgICAgbGFzdFRva2VuLnRleHQgKz0gJ1xcbicgKyB0b2tlbi5yYXc7XG4gICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlW3RoaXMuaW5saW5lUXVldWUubGVuZ3RoIC0gMV0uc3JjID0gbGFzdFRva2VuLnRleHQ7XG4gICAgICAgICAgfSBlbHNlIGlmICghdGhpcy50b2tlbnMubGlua3NbdG9rZW4udGFnXSkge1xuICAgICAgICAgICAgdGhpcy50b2tlbnMubGlua3NbdG9rZW4udGFnXSA9IHtcbiAgICAgICAgICAgICAgaHJlZjogdG9rZW4uaHJlZixcbiAgICAgICAgICAgICAgdGl0bGU6IHRva2VuLnRpdGxlXG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIHRhYmxlIChnZm0pXG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci50YWJsZShzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gbGhlYWRpbmdcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmxoZWFkaW5nKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyB0b3AtbGV2ZWwgcGFyYWdyYXBoXG4gICAgICAgIC8vIHByZXZlbnQgcGFyYWdyYXBoIGNvbnN1bWluZyBleHRlbnNpb25zIGJ5IGNsaXBwaW5nICdzcmMnIHRvIGV4dGVuc2lvbiBzdGFydFxuXG5cbiAgICAgICAgY3V0U3JjID0gc3JjO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucyAmJiB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucy5zdGFydEJsb2NrKSB7XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBzdGFydEluZGV4ID0gSW5maW5pdHk7XG4gICAgICAgICAgICB2YXIgdGVtcFNyYyA9IHNyYy5zbGljZSgxKTtcbiAgICAgICAgICAgIHZhciB0ZW1wU3RhcnQgPSB2b2lkIDA7XG5cbiAgICAgICAgICAgIF90aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucy5zdGFydEJsb2NrLmZvckVhY2goZnVuY3Rpb24gKGdldFN0YXJ0SW5kZXgpIHtcbiAgICAgICAgICAgICAgdGVtcFN0YXJ0ID0gZ2V0U3RhcnRJbmRleC5jYWxsKHtcbiAgICAgICAgICAgICAgICBsZXhlcjogdGhpc1xuICAgICAgICAgICAgICB9LCB0ZW1wU3JjKTtcblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBTdGFydCA9PT0gJ251bWJlcicgJiYgdGVtcFN0YXJ0ID49IDApIHtcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gTWF0aC5taW4oc3RhcnRJbmRleCwgdGVtcFN0YXJ0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzdGFydEluZGV4IDwgSW5maW5pdHkgJiYgc3RhcnRJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgIGN1dFNyYyA9IHNyYy5zdWJzdHJpbmcoMCwgc3RhcnRJbmRleCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zdGF0ZS50b3AgJiYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIucGFyYWdyYXBoKGN1dFNyYykpKSB7XG4gICAgICAgICAgbGFzdFRva2VuID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXTtcblxuICAgICAgICAgIGlmIChsYXN0UGFyYWdyYXBoQ2xpcHBlZCAmJiBsYXN0VG9rZW4udHlwZSA9PT0gJ3BhcmFncmFwaCcpIHtcbiAgICAgICAgICAgIGxhc3RUb2tlbi5yYXcgKz0gJ1xcbicgKyB0b2tlbi5yYXc7XG4gICAgICAgICAgICBsYXN0VG9rZW4udGV4dCArPSAnXFxuJyArIHRva2VuLnRleHQ7XG4gICAgICAgICAgICB0aGlzLmlubGluZVF1ZXVlLnBvcCgpO1xuICAgICAgICAgICAgdGhpcy5pbmxpbmVRdWV1ZVt0aGlzLmlubGluZVF1ZXVlLmxlbmd0aCAtIDFdLnNyYyA9IGxhc3RUb2tlbi50ZXh0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGFzdFBhcmFncmFwaENsaXBwZWQgPSBjdXRTcmMubGVuZ3RoICE9PSBzcmMubGVuZ3RoO1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gdGV4dFxuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIudGV4dChzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgaWYgKGxhc3RUb2tlbiAmJiBsYXN0VG9rZW4udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBsYXN0VG9rZW4ucmF3ICs9ICdcXG4nICsgdG9rZW4ucmF3O1xuICAgICAgICAgICAgbGFzdFRva2VuLnRleHQgKz0gJ1xcbicgKyB0b2tlbi50ZXh0O1xuICAgICAgICAgICAgdGhpcy5pbmxpbmVRdWV1ZS5wb3AoKTtcbiAgICAgICAgICAgIHRoaXMuaW5saW5lUXVldWVbdGhpcy5pbmxpbmVRdWV1ZS5sZW5ndGggLSAxXS5zcmMgPSBsYXN0VG9rZW4udGV4dDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNyYykge1xuICAgICAgICAgIHZhciBlcnJNc2cgPSAnSW5maW5pdGUgbG9vcCBvbiBieXRlOiAnICsgc3JjLmNoYXJDb2RlQXQoMCk7XG5cbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJNc2cpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnJNc2cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YXRlLnRvcCA9IHRydWU7XG4gICAgICByZXR1cm4gdG9rZW5zO1xuICAgIH07XG5cbiAgICBfcHJvdG8uaW5saW5lID0gZnVuY3Rpb24gaW5saW5lKHNyYywgdG9rZW5zKSB7XG4gICAgICB0aGlzLmlubGluZVF1ZXVlLnB1c2goe1xuICAgICAgICBzcmM6IHNyYyxcbiAgICAgICAgdG9rZW5zOiB0b2tlbnNcbiAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBMZXhpbmcvQ29tcGlsaW5nXG4gICAgICovXG4gICAgO1xuXG4gICAgX3Byb3RvLmlubGluZVRva2VucyA9IGZ1bmN0aW9uIGlubGluZVRva2VucyhzcmMsIHRva2Vucykge1xuICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgIGlmICh0b2tlbnMgPT09IHZvaWQgMCkge1xuICAgICAgICB0b2tlbnMgPSBbXTtcbiAgICAgIH1cblxuICAgICAgdmFyIHRva2VuLCBsYXN0VG9rZW4sIGN1dFNyYzsgLy8gU3RyaW5nIHdpdGggbGlua3MgbWFza2VkIHRvIGF2b2lkIGludGVyZmVyZW5jZSB3aXRoIGVtIGFuZCBzdHJvbmdcblxuICAgICAgdmFyIG1hc2tlZFNyYyA9IHNyYztcbiAgICAgIHZhciBtYXRjaDtcbiAgICAgIHZhciBrZWVwUHJldkNoYXIsIHByZXZDaGFyOyAvLyBNYXNrIG91dCByZWZsaW5rc1xuXG4gICAgICBpZiAodGhpcy50b2tlbnMubGlua3MpIHtcbiAgICAgICAgdmFyIGxpbmtzID0gT2JqZWN0LmtleXModGhpcy50b2tlbnMubGlua3MpO1xuXG4gICAgICAgIGlmIChsaW5rcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgd2hpbGUgKChtYXRjaCA9IHRoaXMudG9rZW5pemVyLnJ1bGVzLmlubGluZS5yZWZsaW5rU2VhcmNoLmV4ZWMobWFza2VkU3JjKSkgIT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKGxpbmtzLmluY2x1ZGVzKG1hdGNoWzBdLnNsaWNlKG1hdGNoWzBdLmxhc3RJbmRleE9mKCdbJykgKyAxLCAtMSkpKSB7XG4gICAgICAgICAgICAgIG1hc2tlZFNyYyA9IG1hc2tlZFNyYy5zbGljZSgwLCBtYXRjaC5pbmRleCkgKyAnWycgKyByZXBlYXRTdHJpbmcoJ2EnLCBtYXRjaFswXS5sZW5ndGggLSAyKSArICddJyArIG1hc2tlZFNyYy5zbGljZSh0aGlzLnRva2VuaXplci5ydWxlcy5pbmxpbmUucmVmbGlua1NlYXJjaC5sYXN0SW5kZXgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSAvLyBNYXNrIG91dCBvdGhlciBibG9ja3NcblxuXG4gICAgICB3aGlsZSAoKG1hdGNoID0gdGhpcy50b2tlbml6ZXIucnVsZXMuaW5saW5lLmJsb2NrU2tpcC5leGVjKG1hc2tlZFNyYykpICE9IG51bGwpIHtcbiAgICAgICAgbWFza2VkU3JjID0gbWFza2VkU3JjLnNsaWNlKDAsIG1hdGNoLmluZGV4KSArICdbJyArIHJlcGVhdFN0cmluZygnYScsIG1hdGNoWzBdLmxlbmd0aCAtIDIpICsgJ10nICsgbWFza2VkU3JjLnNsaWNlKHRoaXMudG9rZW5pemVyLnJ1bGVzLmlubGluZS5ibG9ja1NraXAubGFzdEluZGV4KTtcbiAgICAgIH0gLy8gTWFzayBvdXQgZXNjYXBlZCBlbSAmIHN0cm9uZyBkZWxpbWl0ZXJzXG5cblxuICAgICAgd2hpbGUgKChtYXRjaCA9IHRoaXMudG9rZW5pemVyLnJ1bGVzLmlubGluZS5lc2NhcGVkRW1TdC5leGVjKG1hc2tlZFNyYykpICE9IG51bGwpIHtcbiAgICAgICAgbWFza2VkU3JjID0gbWFza2VkU3JjLnNsaWNlKDAsIG1hdGNoLmluZGV4KSArICcrKycgKyBtYXNrZWRTcmMuc2xpY2UodGhpcy50b2tlbml6ZXIucnVsZXMuaW5saW5lLmVzY2FwZWRFbVN0Lmxhc3RJbmRleCk7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChzcmMpIHtcbiAgICAgICAgaWYgKCFrZWVwUHJldkNoYXIpIHtcbiAgICAgICAgICBwcmV2Q2hhciA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAga2VlcFByZXZDaGFyID0gZmFsc2U7IC8vIGV4dGVuc2lvbnNcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmV4dGVuc2lvbnMgJiYgdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMuaW5saW5lICYmIHRoaXMub3B0aW9ucy5leHRlbnNpb25zLmlubGluZS5zb21lKGZ1bmN0aW9uIChleHRUb2tlbml6ZXIpIHtcbiAgICAgICAgICBpZiAodG9rZW4gPSBleHRUb2tlbml6ZXIuY2FsbCh7XG4gICAgICAgICAgICBsZXhlcjogX3RoaXMyXG4gICAgICAgICAgfSwgc3JjLCB0b2tlbnMpKSB7XG4gICAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIGVzY2FwZVxuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIuZXNjYXBlKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyB0YWdcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLnRhZyhzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgaWYgKGxhc3RUb2tlbiAmJiB0b2tlbi50eXBlID09PSAndGV4dCcgJiYgbGFzdFRva2VuLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbGFzdFRva2VuLnJhdyArPSB0b2tlbi5yYXc7XG4gICAgICAgICAgICBsYXN0VG9rZW4udGV4dCArPSB0b2tlbi50ZXh0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gbGlua1xuXG5cbiAgICAgICAgaWYgKHRva2VuID0gdGhpcy50b2tlbml6ZXIubGluayhzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gcmVmbGluaywgbm9saW5rXG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5yZWZsaW5rKHNyYywgdGhpcy50b2tlbnMubGlua3MpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgaWYgKGxhc3RUb2tlbiAmJiB0b2tlbi50eXBlID09PSAndGV4dCcgJiYgbGFzdFRva2VuLnR5cGUgPT09ICd0ZXh0Jykge1xuICAgICAgICAgICAgbGFzdFRva2VuLnJhdyArPSB0b2tlbi5yYXc7XG4gICAgICAgICAgICBsYXN0VG9rZW4udGV4dCArPSB0b2tlbi50ZXh0O1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gZW0gJiBzdHJvbmdcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmVtU3Ryb25nKHNyYywgbWFza2VkU3JjLCBwcmV2Q2hhcikpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBjb2RlXG5cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5jb2Rlc3BhbihzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gYnJcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmJyKHNyYykpIHtcbiAgICAgICAgICBzcmMgPSBzcmMuc3Vic3RyaW5nKHRva2VuLnJhdy5sZW5ndGgpO1xuICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBkZWwgKGdmbSlcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmRlbChzcmMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcbiAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH0gLy8gYXV0b2xpbmtcblxuXG4gICAgICAgIGlmICh0b2tlbiA9IHRoaXMudG9rZW5pemVyLmF1dG9saW5rKHNyYywgbWFuZ2xlKSkge1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIHVybCAoZ2ZtKVxuXG5cbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLmluTGluayAmJiAodG9rZW4gPSB0aGlzLnRva2VuaXplci51cmwoc3JjLCBtYW5nbGUpKSkge1xuICAgICAgICAgIHNyYyA9IHNyYy5zdWJzdHJpbmcodG9rZW4ucmF3Lmxlbmd0aCk7XG4gICAgICAgICAgdG9rZW5zLnB1c2godG9rZW4pO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IC8vIHRleHRcbiAgICAgICAgLy8gcHJldmVudCBpbmxpbmVUZXh0IGNvbnN1bWluZyBleHRlbnNpb25zIGJ5IGNsaXBwaW5nICdzcmMnIHRvIGV4dGVuc2lvbiBzdGFydFxuXG5cbiAgICAgICAgY3V0U3JjID0gc3JjO1xuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucyAmJiB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9ucy5zdGFydElubGluZSkge1xuICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc3RhcnRJbmRleCA9IEluZmluaXR5O1xuICAgICAgICAgICAgdmFyIHRlbXBTcmMgPSBzcmMuc2xpY2UoMSk7XG4gICAgICAgICAgICB2YXIgdGVtcFN0YXJ0ID0gdm9pZCAwO1xuXG4gICAgICAgICAgICBfdGhpczIub3B0aW9ucy5leHRlbnNpb25zLnN0YXJ0SW5saW5lLmZvckVhY2goZnVuY3Rpb24gKGdldFN0YXJ0SW5kZXgpIHtcbiAgICAgICAgICAgICAgdGVtcFN0YXJ0ID0gZ2V0U3RhcnRJbmRleC5jYWxsKHtcbiAgICAgICAgICAgICAgICBsZXhlcjogdGhpc1xuICAgICAgICAgICAgICB9LCB0ZW1wU3JjKTtcblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBTdGFydCA9PT0gJ251bWJlcicgJiYgdGVtcFN0YXJ0ID49IDApIHtcbiAgICAgICAgICAgICAgICBzdGFydEluZGV4ID0gTWF0aC5taW4oc3RhcnRJbmRleCwgdGVtcFN0YXJ0KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmIChzdGFydEluZGV4IDwgSW5maW5pdHkgJiYgc3RhcnRJbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgIGN1dFNyYyA9IHNyYy5zdWJzdHJpbmcoMCwgc3RhcnRJbmRleCArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodG9rZW4gPSB0aGlzLnRva2VuaXplci5pbmxpbmVUZXh0KGN1dFNyYywgc21hcnR5cGFudHMpKSB7XG4gICAgICAgICAgc3JjID0gc3JjLnN1YnN0cmluZyh0b2tlbi5yYXcubGVuZ3RoKTtcblxuICAgICAgICAgIGlmICh0b2tlbi5yYXcuc2xpY2UoLTEpICE9PSAnXycpIHtcbiAgICAgICAgICAgIC8vIFRyYWNrIHByZXZDaGFyIGJlZm9yZSBzdHJpbmcgb2YgX19fXyBzdGFydGVkXG4gICAgICAgICAgICBwcmV2Q2hhciA9IHRva2VuLnJhdy5zbGljZSgtMSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAga2VlcFByZXZDaGFyID0gdHJ1ZTtcbiAgICAgICAgICBsYXN0VG9rZW4gPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgICAgaWYgKGxhc3RUb2tlbiAmJiBsYXN0VG9rZW4udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICBsYXN0VG9rZW4ucmF3ICs9IHRva2VuLnJhdztcbiAgICAgICAgICAgIGxhc3RUb2tlbi50ZXh0ICs9IHRva2VuLnRleHQ7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRva2Vucy5wdXNoKHRva2VuKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzcmMpIHtcbiAgICAgICAgICB2YXIgZXJyTXNnID0gJ0luZmluaXRlIGxvb3Agb24gYnl0ZTogJyArIHNyYy5jaGFyQ29kZUF0KDApO1xuXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaWxlbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRva2VucztcbiAgICB9O1xuXG4gICAgX2NyZWF0ZUNsYXNzKExleGVyLCBudWxsLCBbe1xuICAgICAga2V5OiBcInJ1bGVzXCIsXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBibG9jazogYmxvY2ssXG4gICAgICAgICAgaW5saW5lOiBpbmxpbmVcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gTGV4ZXI7XG4gIH0oKTtcblxuICB2YXIgZGVmYXVsdHMkMiA9IGRlZmF1bHRzJDUuZXhwb3J0cy5kZWZhdWx0cztcbiAgdmFyIGNsZWFuVXJsID0gaGVscGVycy5jbGVhblVybCxcbiAgICAgIGVzY2FwZSQxID0gaGVscGVycy5lc2NhcGU7XG4gIC8qKlxuICAgKiBSZW5kZXJlclxuICAgKi9cblxuICB2YXIgUmVuZGVyZXJfMSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUmVuZGVyZXIob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBkZWZhdWx0cyQyO1xuICAgIH1cblxuICAgIHZhciBfcHJvdG8gPSBSZW5kZXJlci5wcm90b3R5cGU7XG5cbiAgICBfcHJvdG8uY29kZSA9IGZ1bmN0aW9uIGNvZGUoX2NvZGUsIGluZm9zdHJpbmcsIGVzY2FwZWQpIHtcbiAgICAgIHZhciBsYW5nID0gKGluZm9zdHJpbmcgfHwgJycpLm1hdGNoKC9cXFMqLylbMF07XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KSB7XG4gICAgICAgIHZhciBvdXQgPSB0aGlzLm9wdGlvbnMuaGlnaGxpZ2h0KF9jb2RlLCBsYW5nKTtcblxuICAgICAgICBpZiAob3V0ICE9IG51bGwgJiYgb3V0ICE9PSBfY29kZSkge1xuICAgICAgICAgIGVzY2FwZWQgPSB0cnVlO1xuICAgICAgICAgIF9jb2RlID0gb3V0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9jb2RlID0gX2NvZGUucmVwbGFjZSgvXFxuJC8sICcnKSArICdcXG4nO1xuXG4gICAgICBpZiAoIWxhbmcpIHtcbiAgICAgICAgcmV0dXJuICc8cHJlPjxjb2RlPicgKyAoZXNjYXBlZCA/IF9jb2RlIDogZXNjYXBlJDEoX2NvZGUsIHRydWUpKSArICc8L2NvZGU+PC9wcmU+XFxuJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8cHJlPjxjb2RlIGNsYXNzPVwiJyArIHRoaXMub3B0aW9ucy5sYW5nUHJlZml4ICsgZXNjYXBlJDEobGFuZywgdHJ1ZSkgKyAnXCI+JyArIChlc2NhcGVkID8gX2NvZGUgOiBlc2NhcGUkMShfY29kZSwgdHJ1ZSkpICsgJzwvY29kZT48L3ByZT5cXG4nO1xuICAgIH07XG5cbiAgICBfcHJvdG8uYmxvY2txdW90ZSA9IGZ1bmN0aW9uIGJsb2NrcXVvdGUocXVvdGUpIHtcbiAgICAgIHJldHVybiAnPGJsb2NrcXVvdGU+XFxuJyArIHF1b3RlICsgJzwvYmxvY2txdW90ZT5cXG4nO1xuICAgIH07XG5cbiAgICBfcHJvdG8uaHRtbCA9IGZ1bmN0aW9uIGh0bWwoX2h0bWwpIHtcbiAgICAgIHJldHVybiBfaHRtbDtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmhlYWRpbmcgPSBmdW5jdGlvbiBoZWFkaW5nKHRleHQsIGxldmVsLCByYXcsIHNsdWdnZXIpIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaGVhZGVySWRzKSB7XG4gICAgICAgIHJldHVybiAnPGgnICsgbGV2ZWwgKyAnIGlkPVwiJyArIHRoaXMub3B0aW9ucy5oZWFkZXJQcmVmaXggKyBzbHVnZ2VyLnNsdWcocmF3KSArICdcIj4nICsgdGV4dCArICc8L2gnICsgbGV2ZWwgKyAnPlxcbic7XG4gICAgICB9IC8vIGlnbm9yZSBJRHNcblxuXG4gICAgICByZXR1cm4gJzxoJyArIGxldmVsICsgJz4nICsgdGV4dCArICc8L2gnICsgbGV2ZWwgKyAnPlxcbic7XG4gICAgfTtcblxuICAgIF9wcm90by5ociA9IGZ1bmN0aW9uIGhyKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy54aHRtbCA/ICc8aHIvPlxcbicgOiAnPGhyPlxcbic7XG4gICAgfTtcblxuICAgIF9wcm90by5saXN0ID0gZnVuY3Rpb24gbGlzdChib2R5LCBvcmRlcmVkLCBzdGFydCkge1xuICAgICAgdmFyIHR5cGUgPSBvcmRlcmVkID8gJ29sJyA6ICd1bCcsXG4gICAgICAgICAgc3RhcnRhdHQgPSBvcmRlcmVkICYmIHN0YXJ0ICE9PSAxID8gJyBzdGFydD1cIicgKyBzdGFydCArICdcIicgOiAnJztcbiAgICAgIHJldHVybiAnPCcgKyB0eXBlICsgc3RhcnRhdHQgKyAnPlxcbicgKyBib2R5ICsgJzwvJyArIHR5cGUgKyAnPlxcbic7XG4gICAgfTtcblxuICAgIF9wcm90by5saXN0aXRlbSA9IGZ1bmN0aW9uIGxpc3RpdGVtKHRleHQpIHtcbiAgICAgIHJldHVybiAnPGxpPicgKyB0ZXh0ICsgJzwvbGk+XFxuJztcbiAgICB9O1xuXG4gICAgX3Byb3RvLmNoZWNrYm94ID0gZnVuY3Rpb24gY2hlY2tib3goY2hlY2tlZCkge1xuICAgICAgcmV0dXJuICc8aW5wdXQgJyArIChjaGVja2VkID8gJ2NoZWNrZWQ9XCJcIiAnIDogJycpICsgJ2Rpc2FibGVkPVwiXCIgdHlwZT1cImNoZWNrYm94XCInICsgKHRoaXMub3B0aW9ucy54aHRtbCA/ICcgLycgOiAnJykgKyAnPiAnO1xuICAgIH07XG5cbiAgICBfcHJvdG8ucGFyYWdyYXBoID0gZnVuY3Rpb24gcGFyYWdyYXBoKHRleHQpIHtcbiAgICAgIHJldHVybiAnPHA+JyArIHRleHQgKyAnPC9wPlxcbic7XG4gICAgfTtcblxuICAgIF9wcm90by50YWJsZSA9IGZ1bmN0aW9uIHRhYmxlKGhlYWRlciwgYm9keSkge1xuICAgICAgaWYgKGJvZHkpIGJvZHkgPSAnPHRib2R5PicgKyBib2R5ICsgJzwvdGJvZHk+JztcbiAgICAgIHJldHVybiAnPHRhYmxlPlxcbicgKyAnPHRoZWFkPlxcbicgKyBoZWFkZXIgKyAnPC90aGVhZD5cXG4nICsgYm9keSArICc8L3RhYmxlPlxcbic7XG4gICAgfTtcblxuICAgIF9wcm90by50YWJsZXJvdyA9IGZ1bmN0aW9uIHRhYmxlcm93KGNvbnRlbnQpIHtcbiAgICAgIHJldHVybiAnPHRyPlxcbicgKyBjb250ZW50ICsgJzwvdHI+XFxuJztcbiAgICB9O1xuXG4gICAgX3Byb3RvLnRhYmxlY2VsbCA9IGZ1bmN0aW9uIHRhYmxlY2VsbChjb250ZW50LCBmbGFncykge1xuICAgICAgdmFyIHR5cGUgPSBmbGFncy5oZWFkZXIgPyAndGgnIDogJ3RkJztcbiAgICAgIHZhciB0YWcgPSBmbGFncy5hbGlnbiA/ICc8JyArIHR5cGUgKyAnIGFsaWduPVwiJyArIGZsYWdzLmFsaWduICsgJ1wiPicgOiAnPCcgKyB0eXBlICsgJz4nO1xuICAgICAgcmV0dXJuIHRhZyArIGNvbnRlbnQgKyAnPC8nICsgdHlwZSArICc+XFxuJztcbiAgICB9IC8vIHNwYW4gbGV2ZWwgcmVuZGVyZXJcbiAgICA7XG5cbiAgICBfcHJvdG8uc3Ryb25nID0gZnVuY3Rpb24gc3Ryb25nKHRleHQpIHtcbiAgICAgIHJldHVybiAnPHN0cm9uZz4nICsgdGV4dCArICc8L3N0cm9uZz4nO1xuICAgIH07XG5cbiAgICBfcHJvdG8uZW0gPSBmdW5jdGlvbiBlbSh0ZXh0KSB7XG4gICAgICByZXR1cm4gJzxlbT4nICsgdGV4dCArICc8L2VtPic7XG4gICAgfTtcblxuICAgIF9wcm90by5jb2Rlc3BhbiA9IGZ1bmN0aW9uIGNvZGVzcGFuKHRleHQpIHtcbiAgICAgIHJldHVybiAnPGNvZGU+JyArIHRleHQgKyAnPC9jb2RlPic7XG4gICAgfTtcblxuICAgIF9wcm90by5iciA9IGZ1bmN0aW9uIGJyKCkge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy54aHRtbCA/ICc8YnIvPicgOiAnPGJyPic7XG4gICAgfTtcblxuICAgIF9wcm90by5kZWwgPSBmdW5jdGlvbiBkZWwodGV4dCkge1xuICAgICAgcmV0dXJuICc8ZGVsPicgKyB0ZXh0ICsgJzwvZGVsPic7XG4gICAgfTtcblxuICAgIF9wcm90by5saW5rID0gZnVuY3Rpb24gbGluayhocmVmLCB0aXRsZSwgdGV4dCkge1xuICAgICAgaHJlZiA9IGNsZWFuVXJsKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSwgdGhpcy5vcHRpb25zLmJhc2VVcmwsIGhyZWYpO1xuXG4gICAgICBpZiAoaHJlZiA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH1cblxuICAgICAgdmFyIG91dCA9ICc8YSBocmVmPVwiJyArIGVzY2FwZSQxKGhyZWYpICsgJ1wiJztcblxuICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgICAgIH1cblxuICAgICAgb3V0ICs9ICc+JyArIHRleHQgKyAnPC9hPic7XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH07XG5cbiAgICBfcHJvdG8uaW1hZ2UgPSBmdW5jdGlvbiBpbWFnZShocmVmLCB0aXRsZSwgdGV4dCkge1xuICAgICAgaHJlZiA9IGNsZWFuVXJsKHRoaXMub3B0aW9ucy5zYW5pdGl6ZSwgdGhpcy5vcHRpb25zLmJhc2VVcmwsIGhyZWYpO1xuXG4gICAgICBpZiAoaHJlZiA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgIH1cblxuICAgICAgdmFyIG91dCA9ICc8aW1nIHNyYz1cIicgKyBocmVmICsgJ1wiIGFsdD1cIicgKyB0ZXh0ICsgJ1wiJztcblxuICAgICAgaWYgKHRpdGxlKSB7XG4gICAgICAgIG91dCArPSAnIHRpdGxlPVwiJyArIHRpdGxlICsgJ1wiJztcbiAgICAgIH1cblxuICAgICAgb3V0ICs9IHRoaXMub3B0aW9ucy54aHRtbCA/ICcvPicgOiAnPic7XG4gICAgICByZXR1cm4gb3V0O1xuICAgIH07XG5cbiAgICBfcHJvdG8udGV4dCA9IGZ1bmN0aW9uIHRleHQoX3RleHQpIHtcbiAgICAgIHJldHVybiBfdGV4dDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFJlbmRlcmVyO1xuICB9KCk7XG5cbiAgLyoqXG4gICAqIFRleHRSZW5kZXJlclxuICAgKiByZXR1cm5zIG9ubHkgdGhlIHRleHR1YWwgcGFydCBvZiB0aGUgdG9rZW5cbiAgICovXG5cbiAgdmFyIFRleHRSZW5kZXJlcl8xID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBUZXh0UmVuZGVyZXIoKSB7fVxuXG4gICAgdmFyIF9wcm90byA9IFRleHRSZW5kZXJlci5wcm90b3R5cGU7XG5cbiAgICAvLyBubyBuZWVkIGZvciBibG9jayBsZXZlbCByZW5kZXJlcnNcbiAgICBfcHJvdG8uc3Ryb25nID0gZnVuY3Rpb24gc3Ryb25nKHRleHQpIHtcbiAgICAgIHJldHVybiB0ZXh0O1xuICAgIH07XG5cbiAgICBfcHJvdG8uZW0gPSBmdW5jdGlvbiBlbSh0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmNvZGVzcGFuID0gZnVuY3Rpb24gY29kZXNwYW4odGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfTtcblxuICAgIF9wcm90by5kZWwgPSBmdW5jdGlvbiBkZWwodGV4dCkge1xuICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfTtcblxuICAgIF9wcm90by5odG1sID0gZnVuY3Rpb24gaHRtbCh0ZXh0KSB7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9O1xuXG4gICAgX3Byb3RvLnRleHQgPSBmdW5jdGlvbiB0ZXh0KF90ZXh0KSB7XG4gICAgICByZXR1cm4gX3RleHQ7XG4gICAgfTtcblxuICAgIF9wcm90by5saW5rID0gZnVuY3Rpb24gbGluayhocmVmLCB0aXRsZSwgdGV4dCkge1xuICAgICAgcmV0dXJuICcnICsgdGV4dDtcbiAgICB9O1xuXG4gICAgX3Byb3RvLmltYWdlID0gZnVuY3Rpb24gaW1hZ2UoaHJlZiwgdGl0bGUsIHRleHQpIHtcbiAgICAgIHJldHVybiAnJyArIHRleHQ7XG4gICAgfTtcblxuICAgIF9wcm90by5iciA9IGZ1bmN0aW9uIGJyKCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH07XG5cbiAgICByZXR1cm4gVGV4dFJlbmRlcmVyO1xuICB9KCk7XG5cbiAgLyoqXG4gICAqIFNsdWdnZXIgZ2VuZXJhdGVzIGhlYWRlciBpZFxuICAgKi9cblxuICB2YXIgU2x1Z2dlcl8xID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTbHVnZ2VyKCkge1xuICAgICAgdGhpcy5zZWVuID0ge307XG4gICAgfVxuXG4gICAgdmFyIF9wcm90byA9IFNsdWdnZXIucHJvdG90eXBlO1xuXG4gICAgX3Byb3RvLnNlcmlhbGl6ZSA9IGZ1bmN0aW9uIHNlcmlhbGl6ZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIHZhbHVlLnRvTG93ZXJDYXNlKCkudHJpbSgpIC8vIHJlbW92ZSBodG1sIHRhZ3NcbiAgICAgIC5yZXBsYWNlKC88WyFcXC9hLXpdLio/Pi9pZywgJycpIC8vIHJlbW92ZSB1bndhbnRlZCBjaGFyc1xuICAgICAgLnJlcGxhY2UoL1tcXHUyMDAwLVxcdTIwNkZcXHUyRTAwLVxcdTJFN0ZcXFxcJyFcIiMkJSYoKSorLC4vOjs8PT4/QFtcXF1eYHt8fX5dL2csICcnKS5yZXBsYWNlKC9cXHMvZywgJy0nKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRmluZHMgdGhlIG5leHQgc2FmZSAodW5pcXVlKSBzbHVnIHRvIHVzZVxuICAgICAqL1xuICAgIDtcblxuICAgIF9wcm90by5nZXROZXh0U2FmZVNsdWcgPSBmdW5jdGlvbiBnZXROZXh0U2FmZVNsdWcob3JpZ2luYWxTbHVnLCBpc0RyeVJ1bikge1xuICAgICAgdmFyIHNsdWcgPSBvcmlnaW5hbFNsdWc7XG4gICAgICB2YXIgb2NjdXJlbmNlQWNjdW11bGF0b3IgPSAwO1xuXG4gICAgICBpZiAodGhpcy5zZWVuLmhhc093blByb3BlcnR5KHNsdWcpKSB7XG4gICAgICAgIG9jY3VyZW5jZUFjY3VtdWxhdG9yID0gdGhpcy5zZWVuW29yaWdpbmFsU2x1Z107XG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgIG9jY3VyZW5jZUFjY3VtdWxhdG9yKys7XG4gICAgICAgICAgc2x1ZyA9IG9yaWdpbmFsU2x1ZyArICctJyArIG9jY3VyZW5jZUFjY3VtdWxhdG9yO1xuICAgICAgICB9IHdoaWxlICh0aGlzLnNlZW4uaGFzT3duUHJvcGVydHkoc2x1ZykpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzRHJ5UnVuKSB7XG4gICAgICAgIHRoaXMuc2VlbltvcmlnaW5hbFNsdWddID0gb2NjdXJlbmNlQWNjdW11bGF0b3I7XG4gICAgICAgIHRoaXMuc2VlbltzbHVnXSA9IDA7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzbHVnO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IHN0cmluZyB0byB1bmlxdWUgaWRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gb3B0aW9ucy5kcnlydW4gR2VuZXJhdGVzIHRoZSBuZXh0IHVuaXF1ZSBzbHVnIHdpdGhvdXQgdXBkYXRpbmcgdGhlIGludGVybmFsIGFjY3VtdWxhdG9yLlxuICAgICAqL1xuICAgIDtcblxuICAgIF9wcm90by5zbHVnID0gZnVuY3Rpb24gc2x1Zyh2YWx1ZSwgb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgICAgICBvcHRpb25zID0ge307XG4gICAgICB9XG5cbiAgICAgIHZhciBzbHVnID0gdGhpcy5zZXJpYWxpemUodmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXMuZ2V0TmV4dFNhZmVTbHVnKHNsdWcsIG9wdGlvbnMuZHJ5cnVuKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIFNsdWdnZXI7XG4gIH0oKTtcblxuICB2YXIgUmVuZGVyZXIkMSA9IFJlbmRlcmVyXzE7XG4gIHZhciBUZXh0UmVuZGVyZXIkMSA9IFRleHRSZW5kZXJlcl8xO1xuICB2YXIgU2x1Z2dlciQxID0gU2x1Z2dlcl8xO1xuICB2YXIgZGVmYXVsdHMkMSA9IGRlZmF1bHRzJDUuZXhwb3J0cy5kZWZhdWx0cztcbiAgdmFyIHVuZXNjYXBlID0gaGVscGVycy51bmVzY2FwZTtcbiAgLyoqXG4gICAqIFBhcnNpbmcgJiBDb21waWxpbmdcbiAgICovXG5cbiAgdmFyIFBhcnNlcl8xID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJzZXIob3B0aW9ucykge1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucyB8fCBkZWZhdWx0cyQxO1xuICAgICAgdGhpcy5vcHRpb25zLnJlbmRlcmVyID0gdGhpcy5vcHRpb25zLnJlbmRlcmVyIHx8IG5ldyBSZW5kZXJlciQxKCk7XG4gICAgICB0aGlzLnJlbmRlcmVyID0gdGhpcy5vcHRpb25zLnJlbmRlcmVyO1xuICAgICAgdGhpcy5yZW5kZXJlci5vcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgICAgdGhpcy50ZXh0UmVuZGVyZXIgPSBuZXcgVGV4dFJlbmRlcmVyJDEoKTtcbiAgICAgIHRoaXMuc2x1Z2dlciA9IG5ldyBTbHVnZ2VyJDEoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU3RhdGljIFBhcnNlIE1ldGhvZFxuICAgICAqL1xuXG5cbiAgICBQYXJzZXIucGFyc2UgPSBmdW5jdGlvbiBwYXJzZSh0b2tlbnMsIG9wdGlvbnMpIHtcbiAgICAgIHZhciBwYXJzZXIgPSBuZXcgUGFyc2VyKG9wdGlvbnMpO1xuICAgICAgcmV0dXJuIHBhcnNlci5wYXJzZSh0b2tlbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGF0aWMgUGFyc2UgSW5saW5lIE1ldGhvZFxuICAgICAqL1xuICAgIDtcblxuICAgIFBhcnNlci5wYXJzZUlubGluZSA9IGZ1bmN0aW9uIHBhcnNlSW5saW5lKHRva2Vucywgb3B0aW9ucykge1xuICAgICAgdmFyIHBhcnNlciA9IG5ldyBQYXJzZXIob3B0aW9ucyk7XG4gICAgICByZXR1cm4gcGFyc2VyLnBhcnNlSW5saW5lKHRva2Vucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFBhcnNlIExvb3BcbiAgICAgKi9cbiAgICA7XG5cbiAgICB2YXIgX3Byb3RvID0gUGFyc2VyLnByb3RvdHlwZTtcblxuICAgIF9wcm90by5wYXJzZSA9IGZ1bmN0aW9uIHBhcnNlKHRva2VucywgdG9wKSB7XG4gICAgICBpZiAodG9wID09PSB2b2lkIDApIHtcbiAgICAgICAgdG9wID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIG91dCA9ICcnLFxuICAgICAgICAgIGksXG4gICAgICAgICAgaixcbiAgICAgICAgICBrLFxuICAgICAgICAgIGwyLFxuICAgICAgICAgIGwzLFxuICAgICAgICAgIHJvdyxcbiAgICAgICAgICBjZWxsLFxuICAgICAgICAgIGhlYWRlcixcbiAgICAgICAgICBib2R5LFxuICAgICAgICAgIHRva2VuLFxuICAgICAgICAgIG9yZGVyZWQsXG4gICAgICAgICAgc3RhcnQsXG4gICAgICAgICAgbG9vc2UsXG4gICAgICAgICAgaXRlbUJvZHksXG4gICAgICAgICAgaXRlbSxcbiAgICAgICAgICBjaGVja2VkLFxuICAgICAgICAgIHRhc2ssXG4gICAgICAgICAgY2hlY2tib3gsXG4gICAgICAgICAgcmV0O1xuICAgICAgdmFyIGwgPSB0b2tlbnMubGVuZ3RoO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRva2VuID0gdG9rZW5zW2ldOyAvLyBSdW4gYW55IHJlbmRlcmVyIGV4dGVuc2lvbnNcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmV4dGVuc2lvbnMgJiYgdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMucmVuZGVyZXJzICYmIHRoaXMub3B0aW9ucy5leHRlbnNpb25zLnJlbmRlcmVyc1t0b2tlbi50eXBlXSkge1xuICAgICAgICAgIHJldCA9IHRoaXMub3B0aW9ucy5leHRlbnNpb25zLnJlbmRlcmVyc1t0b2tlbi50eXBlXS5jYWxsKHtcbiAgICAgICAgICAgIHBhcnNlcjogdGhpc1xuICAgICAgICAgIH0sIHRva2VuKTtcblxuICAgICAgICAgIGlmIChyZXQgIT09IGZhbHNlIHx8ICFbJ3NwYWNlJywgJ2hyJywgJ2hlYWRpbmcnLCAnY29kZScsICd0YWJsZScsICdibG9ja3F1b3RlJywgJ2xpc3QnLCAnaHRtbCcsICdwYXJhZ3JhcGgnLCAndGV4dCddLmluY2x1ZGVzKHRva2VuLnR5cGUpKSB7XG4gICAgICAgICAgICBvdXQgKz0gcmV0IHx8ICcnO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgY2FzZSAnc3BhY2UnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2hyJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuaHIoKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdoZWFkaW5nJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuaGVhZGluZyh0aGlzLnBhcnNlSW5saW5lKHRva2VuLnRva2VucyksIHRva2VuLmRlcHRoLCB1bmVzY2FwZSh0aGlzLnBhcnNlSW5saW5lKHRva2VuLnRva2VucywgdGhpcy50ZXh0UmVuZGVyZXIpKSwgdGhpcy5zbHVnZ2VyKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdjb2RlJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHRoaXMucmVuZGVyZXIuY29kZSh0b2tlbi50ZXh0LCB0b2tlbi5sYW5nLCB0b2tlbi5lc2NhcGVkKTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICd0YWJsZSc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGhlYWRlciA9ICcnOyAvLyBoZWFkZXJcblxuICAgICAgICAgICAgICBjZWxsID0gJyc7XG4gICAgICAgICAgICAgIGwyID0gdG9rZW4uaGVhZGVyLmxlbmd0aDtcblxuICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgbDI7IGorKykge1xuICAgICAgICAgICAgICAgIGNlbGwgKz0gdGhpcy5yZW5kZXJlci50YWJsZWNlbGwodGhpcy5wYXJzZUlubGluZSh0b2tlbi5oZWFkZXJbal0udG9rZW5zKSwge1xuICAgICAgICAgICAgICAgICAgaGVhZGVyOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgYWxpZ246IHRva2VuLmFsaWduW2pdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBoZWFkZXIgKz0gdGhpcy5yZW5kZXJlci50YWJsZXJvdyhjZWxsKTtcbiAgICAgICAgICAgICAgYm9keSA9ICcnO1xuICAgICAgICAgICAgICBsMiA9IHRva2VuLnJvd3MubGVuZ3RoO1xuXG4gICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBsMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgcm93ID0gdG9rZW4ucm93c1tqXTtcbiAgICAgICAgICAgICAgICBjZWxsID0gJyc7XG4gICAgICAgICAgICAgICAgbDMgPSByb3cubGVuZ3RoO1xuXG4gICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IGwzOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgIGNlbGwgKz0gdGhpcy5yZW5kZXJlci50YWJsZWNlbGwodGhpcy5wYXJzZUlubGluZShyb3dba10udG9rZW5zKSwge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBhbGlnbjogdG9rZW4uYWxpZ25ba11cbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGJvZHkgKz0gdGhpcy5yZW5kZXJlci50YWJsZXJvdyhjZWxsKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLnRhYmxlKGhlYWRlciwgYm9keSk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAnYmxvY2txdW90ZSc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGJvZHkgPSB0aGlzLnBhcnNlKHRva2VuLnRva2Vucyk7XG4gICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLmJsb2NrcXVvdGUoYm9keSk7XG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAnbGlzdCc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG9yZGVyZWQgPSB0b2tlbi5vcmRlcmVkO1xuICAgICAgICAgICAgICBzdGFydCA9IHRva2VuLnN0YXJ0O1xuICAgICAgICAgICAgICBsb29zZSA9IHRva2VuLmxvb3NlO1xuICAgICAgICAgICAgICBsMiA9IHRva2VuLml0ZW1zLmxlbmd0aDtcbiAgICAgICAgICAgICAgYm9keSA9ICcnO1xuXG4gICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBsMjsgaisrKSB7XG4gICAgICAgICAgICAgICAgaXRlbSA9IHRva2VuLml0ZW1zW2pdO1xuICAgICAgICAgICAgICAgIGNoZWNrZWQgPSBpdGVtLmNoZWNrZWQ7XG4gICAgICAgICAgICAgICAgdGFzayA9IGl0ZW0udGFzaztcbiAgICAgICAgICAgICAgICBpdGVtQm9keSA9ICcnO1xuXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udGFzaykge1xuICAgICAgICAgICAgICAgICAgY2hlY2tib3ggPSB0aGlzLnJlbmRlcmVyLmNoZWNrYm94KGNoZWNrZWQpO1xuXG4gICAgICAgICAgICAgICAgICBpZiAobG9vc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0udG9rZW5zLmxlbmd0aCA+IDAgJiYgaXRlbS50b2tlbnNbMF0udHlwZSA9PT0gJ3BhcmFncmFwaCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRva2Vuc1swXS50ZXh0ID0gY2hlY2tib3ggKyAnICcgKyBpdGVtLnRva2Vuc1swXS50ZXh0O1xuXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0udG9rZW5zWzBdLnRva2VucyAmJiBpdGVtLnRva2Vuc1swXS50b2tlbnMubGVuZ3RoID4gMCAmJiBpdGVtLnRva2Vuc1swXS50b2tlbnNbMF0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLnRva2Vuc1swXS50b2tlbnNbMF0udGV4dCA9IGNoZWNrYm94ICsgJyAnICsgaXRlbS50b2tlbnNbMF0udG9rZW5zWzBdLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgIGl0ZW0udG9rZW5zLnVuc2hpZnQoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogY2hlY2tib3hcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbUJvZHkgKz0gY2hlY2tib3g7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaXRlbUJvZHkgKz0gdGhpcy5wYXJzZShpdGVtLnRva2VucywgbG9vc2UpO1xuICAgICAgICAgICAgICAgIGJvZHkgKz0gdGhpcy5yZW5kZXJlci5saXN0aXRlbShpdGVtQm9keSwgdGFzaywgY2hlY2tlZCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5saXN0KGJvZHksIG9yZGVyZWQsIHN0YXJ0KTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgLy8gVE9ETyBwYXJzZSBpbmxpbmUgY29udGVudCBpZiBwYXJhbWV0ZXIgbWFya2Rvd249MVxuICAgICAgICAgICAgICBvdXQgKz0gdGhpcy5yZW5kZXJlci5odG1sKHRva2VuLnRleHQpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ3BhcmFncmFwaCc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG91dCArPSB0aGlzLnJlbmRlcmVyLnBhcmFncmFwaCh0aGlzLnBhcnNlSW5saW5lKHRva2VuLnRva2VucykpO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBib2R5ID0gdG9rZW4udG9rZW5zID8gdGhpcy5wYXJzZUlubGluZSh0b2tlbi50b2tlbnMpIDogdG9rZW4udGV4dDtcblxuICAgICAgICAgICAgICB3aGlsZSAoaSArIDEgPCBsICYmIHRva2Vuc1tpICsgMV0udHlwZSA9PT0gJ3RleHQnKSB7XG4gICAgICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbKytpXTtcbiAgICAgICAgICAgICAgICBib2R5ICs9ICdcXG4nICsgKHRva2VuLnRva2VucyA/IHRoaXMucGFyc2VJbmxpbmUodG9rZW4udG9rZW5zKSA6IHRva2VuLnRleHQpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgb3V0ICs9IHRvcCA/IHRoaXMucmVuZGVyZXIucGFyYWdyYXBoKGJvZHkpIDogYm9keTtcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB2YXIgZXJyTXNnID0gJ1Rva2VuIHdpdGggXCInICsgdG9rZW4udHlwZSArICdcIiB0eXBlIHdhcyBub3QgZm91bmQuJztcblxuICAgICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbGVudCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVyck1zZyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gb3V0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBQYXJzZSBJbmxpbmUgVG9rZW5zXG4gICAgICovXG4gICAgO1xuXG4gICAgX3Byb3RvLnBhcnNlSW5saW5lID0gZnVuY3Rpb24gcGFyc2VJbmxpbmUodG9rZW5zLCByZW5kZXJlcikge1xuICAgICAgcmVuZGVyZXIgPSByZW5kZXJlciB8fCB0aGlzLnJlbmRlcmVyO1xuICAgICAgdmFyIG91dCA9ICcnLFxuICAgICAgICAgIGksXG4gICAgICAgICAgdG9rZW4sXG4gICAgICAgICAgcmV0O1xuICAgICAgdmFyIGwgPSB0b2tlbnMubGVuZ3RoO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgIHRva2VuID0gdG9rZW5zW2ldOyAvLyBSdW4gYW55IHJlbmRlcmVyIGV4dGVuc2lvbnNcblxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmV4dGVuc2lvbnMgJiYgdGhpcy5vcHRpb25zLmV4dGVuc2lvbnMucmVuZGVyZXJzICYmIHRoaXMub3B0aW9ucy5leHRlbnNpb25zLnJlbmRlcmVyc1t0b2tlbi50eXBlXSkge1xuICAgICAgICAgIHJldCA9IHRoaXMub3B0aW9ucy5leHRlbnNpb25zLnJlbmRlcmVyc1t0b2tlbi50eXBlXS5jYWxsKHtcbiAgICAgICAgICAgIHBhcnNlcjogdGhpc1xuICAgICAgICAgIH0sIHRva2VuKTtcblxuICAgICAgICAgIGlmIChyZXQgIT09IGZhbHNlIHx8ICFbJ2VzY2FwZScsICdodG1sJywgJ2xpbmsnLCAnaW1hZ2UnLCAnc3Ryb25nJywgJ2VtJywgJ2NvZGVzcGFuJywgJ2JyJywgJ2RlbCcsICd0ZXh0J10uaW5jbHVkZXModG9rZW4udHlwZSkpIHtcbiAgICAgICAgICAgIG91dCArPSByZXQgfHwgJyc7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdlc2NhcGUnOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBvdXQgKz0gcmVuZGVyZXIudGV4dCh0b2tlbi50ZXh0KTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdodG1sJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLmh0bWwodG9rZW4udGV4dCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAnbGluayc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5saW5rKHRva2VuLmhyZWYsIHRva2VuLnRpdGxlLCB0aGlzLnBhcnNlSW5saW5lKHRva2VuLnRva2VucywgcmVuZGVyZXIpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdpbWFnZSc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5pbWFnZSh0b2tlbi5ocmVmLCB0b2tlbi50aXRsZSwgdG9rZW4udGV4dCk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAnc3Ryb25nJzpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgb3V0ICs9IHJlbmRlcmVyLnN0cm9uZyh0aGlzLnBhcnNlSW5saW5lKHRva2VuLnRva2VucywgcmVuZGVyZXIpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdlbSc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5lbSh0aGlzLnBhcnNlSW5saW5lKHRva2VuLnRva2VucywgcmVuZGVyZXIpKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdjb2Rlc3Bhbic6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5jb2Rlc3Bhbih0b2tlbi50ZXh0KTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlICdicic6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5icigpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgJ2RlbCc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci5kZWwodGhpcy5wYXJzZUlubGluZSh0b2tlbi50b2tlbnMsIHJlbmRlcmVyKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG91dCArPSByZW5kZXJlci50ZXh0KHRva2VuLnRleHQpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHZhciBlcnJNc2cgPSAnVG9rZW4gd2l0aCBcIicgKyB0b2tlbi50eXBlICsgJ1wiIHR5cGUgd2FzIG5vdCBmb3VuZC4nO1xuXG4gICAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJNc2cpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyTXNnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcblxuICAgIHJldHVybiBQYXJzZXI7XG4gIH0oKTtcblxuICB2YXIgTGV4ZXIgPSBMZXhlcl8xO1xuICB2YXIgUGFyc2VyID0gUGFyc2VyXzE7XG4gIHZhciBUb2tlbml6ZXIgPSBUb2tlbml6ZXJfMTtcbiAgdmFyIFJlbmRlcmVyID0gUmVuZGVyZXJfMTtcbiAgdmFyIFRleHRSZW5kZXJlciA9IFRleHRSZW5kZXJlcl8xO1xuICB2YXIgU2x1Z2dlciA9IFNsdWdnZXJfMTtcbiAgdmFyIG1lcmdlID0gaGVscGVycy5tZXJnZSxcbiAgICAgIGNoZWNrU2FuaXRpemVEZXByZWNhdGlvbiA9IGhlbHBlcnMuY2hlY2tTYW5pdGl6ZURlcHJlY2F0aW9uLFxuICAgICAgZXNjYXBlID0gaGVscGVycy5lc2NhcGU7XG4gIHZhciBnZXREZWZhdWx0cyA9IGRlZmF1bHRzJDUuZXhwb3J0cy5nZXREZWZhdWx0cyxcbiAgICAgIGNoYW5nZURlZmF1bHRzID0gZGVmYXVsdHMkNS5leHBvcnRzLmNoYW5nZURlZmF1bHRzLFxuICAgICAgZGVmYXVsdHMgPSBkZWZhdWx0cyQ1LmV4cG9ydHMuZGVmYXVsdHM7XG4gIC8qKlxuICAgKiBNYXJrZWRcbiAgICovXG5cbiAgZnVuY3Rpb24gbWFya2VkKHNyYywgb3B0LCBjYWxsYmFjaykge1xuICAgIC8vIHRocm93IGVycm9yIGluIGNhc2Ugb2Ygbm9uIHN0cmluZyBpbnB1dFxuICAgIGlmICh0eXBlb2Ygc3JjID09PSAndW5kZWZpbmVkJyB8fCBzcmMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWFya2VkKCk6IGlucHV0IHBhcmFtZXRlciBpcyB1bmRlZmluZWQgb3IgbnVsbCcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc3JjICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXJrZWQoKTogaW5wdXQgcGFyYW1ldGVyIGlzIG9mIHR5cGUgJyArIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzcmMpICsgJywgc3RyaW5nIGV4cGVjdGVkJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0O1xuICAgICAgb3B0ID0gbnVsbDtcbiAgICB9XG5cbiAgICBvcHQgPSBtZXJnZSh7fSwgbWFya2VkLmRlZmF1bHRzLCBvcHQgfHwge30pO1xuICAgIGNoZWNrU2FuaXRpemVEZXByZWNhdGlvbihvcHQpO1xuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgaGlnaGxpZ2h0ID0gb3B0LmhpZ2hsaWdodDtcbiAgICAgIHZhciB0b2tlbnM7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIHRva2VucyA9IExleGVyLmxleChzcmMsIG9wdCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGRvbmUgPSBmdW5jdGlvbiBkb25lKGVycikge1xuICAgICAgICB2YXIgb3V0O1xuXG4gICAgICAgIGlmICghZXJyKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChvcHQud2Fsa1Rva2Vucykge1xuICAgICAgICAgICAgICBtYXJrZWQud2Fsa1Rva2Vucyh0b2tlbnMsIG9wdC53YWxrVG9rZW5zKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3V0ID0gUGFyc2VyLnBhcnNlKHRva2Vucywgb3B0KTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBlcnIgPSBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG9wdC5oaWdobGlnaHQgPSBoaWdobGlnaHQ7XG4gICAgICAgIHJldHVybiBlcnIgPyBjYWxsYmFjayhlcnIpIDogY2FsbGJhY2sobnVsbCwgb3V0KTtcbiAgICAgIH07XG5cbiAgICAgIGlmICghaGlnaGxpZ2h0IHx8IGhpZ2hsaWdodC5sZW5ndGggPCAzKSB7XG4gICAgICAgIHJldHVybiBkb25lKCk7XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSBvcHQuaGlnaGxpZ2h0O1xuICAgICAgaWYgKCF0b2tlbnMubGVuZ3RoKSByZXR1cm4gZG9uZSgpO1xuICAgICAgdmFyIHBlbmRpbmcgPSAwO1xuICAgICAgbWFya2VkLndhbGtUb2tlbnModG9rZW5zLCBmdW5jdGlvbiAodG9rZW4pIHtcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09ICdjb2RlJykge1xuICAgICAgICAgIHBlbmRpbmcrKztcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGhpZ2hsaWdodCh0b2tlbi50ZXh0LCB0b2tlbi5sYW5nLCBmdW5jdGlvbiAoZXJyLCBjb2RlKSB7XG4gICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9uZShlcnIpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKGNvZGUgIT0gbnVsbCAmJiBjb2RlICE9PSB0b2tlbi50ZXh0KSB7XG4gICAgICAgICAgICAgICAgdG9rZW4udGV4dCA9IGNvZGU7XG4gICAgICAgICAgICAgICAgdG9rZW4uZXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBwZW5kaW5nLS07XG5cbiAgICAgICAgICAgICAgaWYgKHBlbmRpbmcgPT09IDApIHtcbiAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKHBlbmRpbmcgPT09IDApIHtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHZhciBfdG9rZW5zID0gTGV4ZXIubGV4KHNyYywgb3B0KTtcblxuICAgICAgaWYgKG9wdC53YWxrVG9rZW5zKSB7XG4gICAgICAgIG1hcmtlZC53YWxrVG9rZW5zKF90b2tlbnMsIG9wdC53YWxrVG9rZW5zKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFBhcnNlci5wYXJzZShfdG9rZW5zLCBvcHQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGUubWVzc2FnZSArPSAnXFxuUGxlYXNlIHJlcG9ydCB0aGlzIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrZWRqcy9tYXJrZWQuJztcblxuICAgICAgaWYgKG9wdC5zaWxlbnQpIHtcbiAgICAgICAgcmV0dXJuICc8cD5BbiBlcnJvciBvY2N1cnJlZDo8L3A+PHByZT4nICsgZXNjYXBlKGUubWVzc2FnZSArICcnLCB0cnVlKSArICc8L3ByZT4nO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlO1xuICAgIH1cbiAgfVxuICAvKipcbiAgICogT3B0aW9uc1xuICAgKi9cblxuXG4gIG1hcmtlZC5vcHRpb25zID0gbWFya2VkLnNldE9wdGlvbnMgPSBmdW5jdGlvbiAob3B0KSB7XG4gICAgbWVyZ2UobWFya2VkLmRlZmF1bHRzLCBvcHQpO1xuICAgIGNoYW5nZURlZmF1bHRzKG1hcmtlZC5kZWZhdWx0cyk7XG4gICAgcmV0dXJuIG1hcmtlZDtcbiAgfTtcblxuICBtYXJrZWQuZ2V0RGVmYXVsdHMgPSBnZXREZWZhdWx0cztcbiAgbWFya2VkLmRlZmF1bHRzID0gZGVmYXVsdHM7XG4gIC8qKlxuICAgKiBVc2UgRXh0ZW5zaW9uXG4gICAqL1xuXG4gIG1hcmtlZC51c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICB2YXIgb3B0cyA9IG1lcmdlLmFwcGx5KHZvaWQgMCwgW3t9XS5jb25jYXQoYXJncykpO1xuICAgIHZhciBleHRlbnNpb25zID0gbWFya2VkLmRlZmF1bHRzLmV4dGVuc2lvbnMgfHwge1xuICAgICAgcmVuZGVyZXJzOiB7fSxcbiAgICAgIGNoaWxkVG9rZW5zOiB7fVxuICAgIH07XG4gICAgdmFyIGhhc0V4dGVuc2lvbnM7XG4gICAgYXJncy5mb3JFYWNoKGZ1bmN0aW9uIChwYWNrKSB7XG4gICAgICAvLyA9PS0tIFBhcnNlIFwiYWRkb25cIiBleHRlbnNpb25zIC0tPT0gLy9cbiAgICAgIGlmIChwYWNrLmV4dGVuc2lvbnMpIHtcbiAgICAgICAgaGFzRXh0ZW5zaW9ucyA9IHRydWU7XG4gICAgICAgIHBhY2suZXh0ZW5zaW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChleHQpIHtcbiAgICAgICAgICBpZiAoIWV4dC5uYW1lKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4dGVuc2lvbiBuYW1lIHJlcXVpcmVkJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGV4dC5yZW5kZXJlcikge1xuICAgICAgICAgICAgLy8gUmVuZGVyZXIgZXh0ZW5zaW9uc1xuICAgICAgICAgICAgdmFyIHByZXZSZW5kZXJlciA9IGV4dGVuc2lvbnMucmVuZGVyZXJzID8gZXh0ZW5zaW9ucy5yZW5kZXJlcnNbZXh0Lm5hbWVdIDogbnVsbDtcblxuICAgICAgICAgICAgaWYgKHByZXZSZW5kZXJlcikge1xuICAgICAgICAgICAgICAvLyBSZXBsYWNlIGV4dGVuc2lvbiB3aXRoIGZ1bmMgdG8gcnVuIG5ldyBleHRlbnNpb24gYnV0IGZhbGwgYmFjayBpZiBmYWxzZVxuICAgICAgICAgICAgICBleHRlbnNpb25zLnJlbmRlcmVyc1tleHQubmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgICAgICAgICAgICBhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IGV4dC5yZW5kZXJlci5hcHBseSh0aGlzLCBhcmdzKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICByZXQgPSBwcmV2UmVuZGVyZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldDtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGV4dGVuc2lvbnMucmVuZGVyZXJzW2V4dC5uYW1lXSA9IGV4dC5yZW5kZXJlcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZXh0LnRva2VuaXplcikge1xuICAgICAgICAgICAgLy8gVG9rZW5pemVyIEV4dGVuc2lvbnNcbiAgICAgICAgICAgIGlmICghZXh0LmxldmVsIHx8IGV4dC5sZXZlbCAhPT0gJ2Jsb2NrJyAmJiBleHQubGV2ZWwgIT09ICdpbmxpbmUnKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImV4dGVuc2lvbiBsZXZlbCBtdXN0IGJlICdibG9jaycgb3IgJ2lubGluZSdcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleHRlbnNpb25zW2V4dC5sZXZlbF0pIHtcbiAgICAgICAgICAgICAgZXh0ZW5zaW9uc1tleHQubGV2ZWxdLnVuc2hpZnQoZXh0LnRva2VuaXplcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBleHRlbnNpb25zW2V4dC5sZXZlbF0gPSBbZXh0LnRva2VuaXplcl07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChleHQuc3RhcnQpIHtcbiAgICAgICAgICAgICAgLy8gRnVuY3Rpb24gdG8gY2hlY2sgZm9yIHN0YXJ0IG9mIHRva2VuXG4gICAgICAgICAgICAgIGlmIChleHQubGV2ZWwgPT09ICdibG9jaycpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXh0ZW5zaW9ucy5zdGFydEJsb2NrKSB7XG4gICAgICAgICAgICAgICAgICBleHRlbnNpb25zLnN0YXJ0QmxvY2sucHVzaChleHQuc3RhcnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBleHRlbnNpb25zLnN0YXJ0QmxvY2sgPSBbZXh0LnN0YXJ0XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoZXh0LmxldmVsID09PSAnaW5saW5lJykge1xuICAgICAgICAgICAgICAgIGlmIChleHRlbnNpb25zLnN0YXJ0SW5saW5lKSB7XG4gICAgICAgICAgICAgICAgICBleHRlbnNpb25zLnN0YXJ0SW5saW5lLnB1c2goZXh0LnN0YXJ0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgZXh0ZW5zaW9ucy5zdGFydElubGluZSA9IFtleHQuc3RhcnRdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChleHQuY2hpbGRUb2tlbnMpIHtcbiAgICAgICAgICAgIC8vIENoaWxkIHRva2VucyB0byBiZSB2aXNpdGVkIGJ5IHdhbGtUb2tlbnNcbiAgICAgICAgICAgIGV4dGVuc2lvbnMuY2hpbGRUb2tlbnNbZXh0Lm5hbWVdID0gZXh0LmNoaWxkVG9rZW5zO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IC8vID09LS0gUGFyc2UgXCJvdmVyd3JpdGVcIiBleHRlbnNpb25zIC0tPT0gLy9cblxuXG4gICAgICBpZiAocGFjay5yZW5kZXJlcikge1xuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciByZW5kZXJlciA9IG1hcmtlZC5kZWZhdWx0cy5yZW5kZXJlciB8fCBuZXcgUmVuZGVyZXIoKTtcblxuICAgICAgICAgIHZhciBfbG9vcCA9IGZ1bmN0aW9uIF9sb29wKHByb3ApIHtcbiAgICAgICAgICAgIHZhciBwcmV2UmVuZGVyZXIgPSByZW5kZXJlcltwcm9wXTsgLy8gUmVwbGFjZSByZW5kZXJlciB3aXRoIGZ1bmMgdG8gcnVuIGV4dGVuc2lvbiwgYnV0IGZhbGwgYmFjayBpZiBmYWxzZVxuXG4gICAgICAgICAgICByZW5kZXJlcltwcm9wXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICAgICAgICAgICAgYXJnc1tfa2V5M10gPSBhcmd1bWVudHNbX2tleTNdO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHJldCA9IHBhY2sucmVuZGVyZXJbcHJvcF0uYXBwbHkocmVuZGVyZXIsIGFyZ3MpO1xuXG4gICAgICAgICAgICAgIGlmIChyZXQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0ID0gcHJldlJlbmRlcmVyLmFwcGx5KHJlbmRlcmVyLCBhcmdzKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHBhY2sucmVuZGVyZXIpIHtcbiAgICAgICAgICAgIF9sb29wKHByb3ApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9wdHMucmVuZGVyZXIgPSByZW5kZXJlcjtcbiAgICAgICAgfSkoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHBhY2sudG9rZW5pemVyKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIHRva2VuaXplciA9IG1hcmtlZC5kZWZhdWx0cy50b2tlbml6ZXIgfHwgbmV3IFRva2VuaXplcigpO1xuXG4gICAgICAgICAgdmFyIF9sb29wMiA9IGZ1bmN0aW9uIF9sb29wMihwcm9wKSB7XG4gICAgICAgICAgICB2YXIgcHJldlRva2VuaXplciA9IHRva2VuaXplcltwcm9wXTsgLy8gUmVwbGFjZSB0b2tlbml6ZXIgd2l0aCBmdW5jIHRvIHJ1biBleHRlbnNpb24sIGJ1dCBmYWxsIGJhY2sgaWYgZmFsc2VcblxuICAgICAgICAgICAgdG9rZW5pemVyW3Byb3BdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjQpLCBfa2V5NCA9IDA7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICAgICAgICAgICAgICBhcmdzW19rZXk0XSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgcmV0ID0gcGFjay50b2tlbml6ZXJbcHJvcF0uYXBwbHkodG9rZW5pemVyLCBhcmdzKTtcblxuICAgICAgICAgICAgICBpZiAocmV0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJldCA9IHByZXZUb2tlbml6ZXIuYXBwbHkodG9rZW5pemVyLCBhcmdzKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIHBhY2sudG9rZW5pemVyKSB7XG4gICAgICAgICAgICBfbG9vcDIocHJvcCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb3B0cy50b2tlbml6ZXIgPSB0b2tlbml6ZXI7XG4gICAgICAgIH0pKCk7XG4gICAgICB9IC8vID09LS0gUGFyc2UgV2Fsa1Rva2VucyBleHRlbnNpb25zIC0tPT0gLy9cblxuXG4gICAgICBpZiAocGFjay53YWxrVG9rZW5zKSB7XG4gICAgICAgIHZhciB3YWxrVG9rZW5zID0gbWFya2VkLmRlZmF1bHRzLndhbGtUb2tlbnM7XG5cbiAgICAgICAgb3B0cy53YWxrVG9rZW5zID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgICAgICAgcGFjay53YWxrVG9rZW5zLmNhbGwoX3RoaXMsIHRva2VuKTtcblxuICAgICAgICAgIGlmICh3YWxrVG9rZW5zKSB7XG4gICAgICAgICAgICB3YWxrVG9rZW5zKHRva2VuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIGlmIChoYXNFeHRlbnNpb25zKSB7XG4gICAgICAgIG9wdHMuZXh0ZW5zaW9ucyA9IGV4dGVuc2lvbnM7XG4gICAgICB9XG5cbiAgICAgIG1hcmtlZC5zZXRPcHRpb25zKG9wdHMpO1xuICAgIH0pO1xuICB9O1xuICAvKipcbiAgICogUnVuIGNhbGxiYWNrIGZvciBldmVyeSB0b2tlblxuICAgKi9cblxuXG4gIG1hcmtlZC53YWxrVG9rZW5zID0gZnVuY3Rpb24gKHRva2VucywgY2FsbGJhY2spIHtcbiAgICB2YXIgX2xvb3AzID0gZnVuY3Rpb24gX2xvb3AzKCkge1xuICAgICAgdmFyIHRva2VuID0gX3N0ZXAudmFsdWU7XG4gICAgICBjYWxsYmFjayh0b2tlbik7XG5cbiAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xuICAgICAgICBjYXNlICd0YWJsZSc6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZm9yICh2YXIgX2l0ZXJhdG9yMiA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyTG9vc2UodG9rZW4uaGVhZGVyKSwgX3N0ZXAyOyAhKF9zdGVwMiA9IF9pdGVyYXRvcjIoKSkuZG9uZTspIHtcbiAgICAgICAgICAgICAgdmFyIGNlbGwgPSBfc3RlcDIudmFsdWU7XG4gICAgICAgICAgICAgIG1hcmtlZC53YWxrVG9rZW5zKGNlbGwudG9rZW5zLCBjYWxsYmFjayk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjMgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlckxvb3NlKHRva2VuLnJvd3MpLCBfc3RlcDM7ICEoX3N0ZXAzID0gX2l0ZXJhdG9yMygpKS5kb25lOykge1xuICAgICAgICAgICAgICB2YXIgcm93ID0gX3N0ZXAzLnZhbHVlO1xuXG4gICAgICAgICAgICAgIGZvciAodmFyIF9pdGVyYXRvcjQgPSBfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlckxvb3NlKHJvdyksIF9zdGVwNDsgIShfc3RlcDQgPSBfaXRlcmF0b3I0KCkpLmRvbmU7KSB7XG4gICAgICAgICAgICAgICAgdmFyIF9jZWxsID0gX3N0ZXA0LnZhbHVlO1xuICAgICAgICAgICAgICAgIG1hcmtlZC53YWxrVG9rZW5zKF9jZWxsLnRva2VucywgY2FsbGJhY2spO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cblxuICAgICAgICBjYXNlICdsaXN0JzpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtYXJrZWQud2Fsa1Rva2Vucyh0b2tlbi5pdGVtcywgY2FsbGJhY2spO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAge1xuICAgICAgICAgICAgaWYgKG1hcmtlZC5kZWZhdWx0cy5leHRlbnNpb25zICYmIG1hcmtlZC5kZWZhdWx0cy5leHRlbnNpb25zLmNoaWxkVG9rZW5zICYmIG1hcmtlZC5kZWZhdWx0cy5leHRlbnNpb25zLmNoaWxkVG9rZW5zW3Rva2VuLnR5cGVdKSB7XG4gICAgICAgICAgICAgIC8vIFdhbGsgYW55IGV4dGVuc2lvbnNcbiAgICAgICAgICAgICAgbWFya2VkLmRlZmF1bHRzLmV4dGVuc2lvbnMuY2hpbGRUb2tlbnNbdG9rZW4udHlwZV0uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGRUb2tlbnMpIHtcbiAgICAgICAgICAgICAgICBtYXJrZWQud2Fsa1Rva2Vucyh0b2tlbltjaGlsZFRva2Vuc10sIGNhbGxiYWNrKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRva2VuLnRva2Vucykge1xuICAgICAgICAgICAgICBtYXJrZWQud2Fsa1Rva2Vucyh0b2tlbi50b2tlbnMsIGNhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIGZvciAodmFyIF9pdGVyYXRvciA9IF9jcmVhdGVGb3JPZkl0ZXJhdG9ySGVscGVyTG9vc2UodG9rZW5zKSwgX3N0ZXA7ICEoX3N0ZXAgPSBfaXRlcmF0b3IoKSkuZG9uZTspIHtcbiAgICAgIF9sb29wMygpO1xuICAgIH1cbiAgfTtcbiAgLyoqXG4gICAqIFBhcnNlIElubGluZVxuICAgKi9cblxuXG4gIG1hcmtlZC5wYXJzZUlubGluZSA9IGZ1bmN0aW9uIChzcmMsIG9wdCkge1xuICAgIC8vIHRocm93IGVycm9yIGluIGNhc2Ugb2Ygbm9uIHN0cmluZyBpbnB1dFxuICAgIGlmICh0eXBlb2Ygc3JjID09PSAndW5kZWZpbmVkJyB8fCBzcmMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbWFya2VkLnBhcnNlSW5saW5lKCk6IGlucHV0IHBhcmFtZXRlciBpcyB1bmRlZmluZWQgb3IgbnVsbCcpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2Ygc3JjICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXJrZWQucGFyc2VJbmxpbmUoKTogaW5wdXQgcGFyYW1ldGVyIGlzIG9mIHR5cGUgJyArIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzcmMpICsgJywgc3RyaW5nIGV4cGVjdGVkJyk7XG4gICAgfVxuXG4gICAgb3B0ID0gbWVyZ2Uoe30sIG1hcmtlZC5kZWZhdWx0cywgb3B0IHx8IHt9KTtcbiAgICBjaGVja1Nhbml0aXplRGVwcmVjYXRpb24ob3B0KTtcblxuICAgIHRyeSB7XG4gICAgICB2YXIgdG9rZW5zID0gTGV4ZXIubGV4SW5saW5lKHNyYywgb3B0KTtcblxuICAgICAgaWYgKG9wdC53YWxrVG9rZW5zKSB7XG4gICAgICAgIG1hcmtlZC53YWxrVG9rZW5zKHRva2Vucywgb3B0LndhbGtUb2tlbnMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gUGFyc2VyLnBhcnNlSW5saW5lKHRva2Vucywgb3B0KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBlLm1lc3NhZ2UgKz0gJ1xcblBsZWFzZSByZXBvcnQgdGhpcyB0byBodHRwczovL2dpdGh1Yi5jb20vbWFya2VkanMvbWFya2VkLic7XG5cbiAgICAgIGlmIChvcHQuc2lsZW50KSB7XG4gICAgICAgIHJldHVybiAnPHA+QW4gZXJyb3Igb2NjdXJyZWQ6PC9wPjxwcmU+JyArIGVzY2FwZShlLm1lc3NhZ2UgKyAnJywgdHJ1ZSkgKyAnPC9wcmU+JztcbiAgICAgIH1cblxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH07XG4gIC8qKlxuICAgKiBFeHBvc2VcbiAgICovXG5cblxuICBtYXJrZWQuUGFyc2VyID0gUGFyc2VyO1xuICBtYXJrZWQucGFyc2VyID0gUGFyc2VyLnBhcnNlO1xuICBtYXJrZWQuUmVuZGVyZXIgPSBSZW5kZXJlcjtcbiAgbWFya2VkLlRleHRSZW5kZXJlciA9IFRleHRSZW5kZXJlcjtcbiAgbWFya2VkLkxleGVyID0gTGV4ZXI7XG4gIG1hcmtlZC5sZXhlciA9IExleGVyLmxleDtcbiAgbWFya2VkLlRva2VuaXplciA9IFRva2VuaXplcjtcbiAgbWFya2VkLlNsdWdnZXIgPSBTbHVnZ2VyO1xuICBtYXJrZWQucGFyc2UgPSBtYXJrZWQ7XG4gIHZhciBtYXJrZWRfMSA9IG1hcmtlZDtcblxuICByZXR1cm4gbWFya2VkXzE7XG5cbn0pKSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHVuZGVmaW5lZDsiLCIvKiAoaWdub3JlZCkgKi8iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBtYXJrZWQgPSByZXF1aXJlKCdtYXJrZWQnKTtcbnZhciBpcGNSZW5kZXJlciA9IHJlcXVpcmUoJ2VsZWN0cm9uJykuaXBjUmVuZGVyZXI7XG52YXIgcmVtb3RlID0gcmVxdWlyZSgnQGVsZWN0cm9uL3JlbW90ZScpO1xudmFyIGdldEZpbGVGcm9tVXNlciA9IHJlbW90ZS5yZXF1aXJlKCcuLi9zcmMvbGliL2RpYWxvZycpLmdldEZpbGVGcm9tVXNlcjtcbnZhciBtYXJrZG93blZpZXcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbWFya2Rvd24nKTtcbnZhciBodG1sVmlldyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNodG1sJyk7XG52YXIgbmV3RmlsZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNuZXctZmlsZScpO1xudmFyIG9wZW5GaWxlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI29wZW4tZmlsZScpO1xudmFyIHNhdmVNYXJrZG93bkJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzYXZlLW1hcmtkb3duJyk7XG52YXIgcmV2ZXJ0QnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JldmVydCcpO1xudmFyIHNhdmVIdG1sQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3NhdmUtaHRtbCcpO1xudmFyIHNob3dGaWxlQnV0dG9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3Nob3ctZmlsZScpO1xudmFyIG9wZW5JbkRlZmF1bHRCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjb3Blbi1pbi1kZWZhdWx0Jyk7XG52YXIgcmVuZGVyTWFya2Rvd25Ub0h0bWwgPSBmdW5jdGlvbiAobWFya2Rvd24pIHtcbiAgICBodG1sVmlldy5pbm5lckhUTUwgPSBtYXJrZWQobWFya2Rvd24sIHsgc2FuaXRpemU6IHRydWUgfSk7XG59O1xubWFya2Rvd25WaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICB2YXIgY3VycmVudENvbnRlbnQgPSAoX2EgPSBldmVudCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnRhcmdldC52YWx1ZTtcbiAgICByZW5kZXJNYXJrZG93blRvSHRtbChjdXJyZW50Q29udGVudCk7XG59KTtcbm9wZW5GaWxlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGdldEZpbGVGcm9tVXNlcigpO1xufSk7XG5pcGNSZW5kZXJlci5vbignZmlsZS1vcGVuZWQnLCBmdW5jdGlvbiAoZXZlbnQsIGZpbGUsIGNvbnRlbnQpIHtcbiAgICBjb25zb2xlLmxvZygncmVjZWl2ZTonLCBldmVudCwgZmlsZSk7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIG1hcmtkb3duVmlldyA9PT0gbnVsbCB8fCBtYXJrZG93blZpZXcgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG1hcmtkb3duVmlldy52YWx1ZSA9IGNvbnRlbnQ7XG4gICAgcmVuZGVyTWFya2Rvd25Ub0h0bWwoY29udGVudCk7XG59KTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==