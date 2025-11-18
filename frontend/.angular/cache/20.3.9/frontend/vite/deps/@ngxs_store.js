import {
  APP_BOOTSTRAP_LISTENER,
  ApplicationRef,
  DestroyRef,
  EnvironmentInjector,
  ErrorHandler,
  Injectable,
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  PendingTasks,
  RuntimeError,
  assertInInjectionContext,
  assertNotInReactiveContext,
  computed,
  createEnvironmentInjector,
  inject,
  isPromise,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  runInInjectionContext,
  setClassMetadata,
  signal,
  untracked,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-ZVDZKNJT.js";
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  buffer,
  catchError,
  config,
  debounceTime,
  defaultIfEmpty,
  distinctUntilChanged,
  filter,
  finalize,
  forkJoin,
  from,
  isObservable,
  map,
  mergeMap,
  of,
  shareReplay,
  skip,
  startWith,
  take,
  takeUntil
} from "./chunk-RSS3ODKE.js";
import {
  __async,
  __spreadProps,
  __spreadValues
} from "./chunk-WDMUDEB6.js";

// node_modules/@angular/core/fesm2022/rxjs-interop.mjs
function toSignal(source, options) {
  typeof ngDevMode !== "undefined" && ngDevMode && assertNotInReactiveContext(toSignal, "Invoking `toSignal` causes new subscriptions every time. Consider moving `toSignal` outside of the reactive context and read the signal value where needed.");
  const requiresCleanup = !options?.manualCleanup;
  if (ngDevMode && requiresCleanup && !options?.injector) {
    assertInInjectionContext(toSignal);
  }
  const cleanupRef = requiresCleanup ? options?.injector?.get(DestroyRef) ?? inject(DestroyRef) : null;
  const equal = makeToSignalEqual(options?.equal);
  let state;
  if (options?.requireSync) {
    state = signal({
      kind: 0
      /* StateKind.NoValue */
    }, { equal });
  } else {
    state = signal({ kind: 1, value: options?.initialValue }, { equal });
  }
  let destroyUnregisterFn;
  const sub = source.subscribe({
    next: (value) => state.set({ kind: 1, value }),
    error: (error) => {
      state.set({ kind: 2, error });
      destroyUnregisterFn?.();
    },
    complete: () => {
      destroyUnregisterFn?.();
    }
    // Completion of the Observable is meaningless to the signal. Signals don't have a concept of
    // "complete".
  });
  if (options?.requireSync && state().kind === 0) {
    throw new RuntimeError(601, (typeof ngDevMode === "undefined" || ngDevMode) && "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
  }
  destroyUnregisterFn = cleanupRef?.onDestroy(sub.unsubscribe.bind(sub));
  return computed(() => {
    const current = state();
    switch (current.kind) {
      case 1:
        return current.value;
      case 2:
        throw current.error;
      case 0:
        throw new RuntimeError(601, (typeof ngDevMode === "undefined" || ngDevMode) && "`toSignal()` called with `requireSync` but `Observable` did not emit synchronously.");
    }
  }, { equal: options?.equal });
}
function makeToSignalEqual(userEquality = Object.is) {
  return (a, b) => a.kind === 1 && b.kind === 1 && userEquality(a.value, b.value);
}

// node_modules/@ngxs/store/fesm2022/ngxs-store-internals.mjs
var ɵMETA_KEY = "NGXS_META";
var ɵMETA_OPTIONS_KEY = "NGXS_OPTIONS_META";
var ɵSELECTOR_META_KEY = "NGXS_SELECTOR_META";
var _hasOwnProperty = Object.prototype.hasOwnProperty;
var ɵhasOwnProperty = (target, key) => _hasOwnProperty.call(target, key);
var ɵdefineProperty = Object.defineProperty;
function ɵensureStoreMetadata(target) {
  if (!ɵhasOwnProperty(target, ɵMETA_KEY)) {
    const defaultMetadata = {
      name: null,
      actions: {},
      defaults: {},
      path: null,
      makeRootSelector(context) {
        return context.getStateGetter(defaultMetadata.name);
      },
      children: []
    };
    ɵdefineProperty(target, ɵMETA_KEY, {
      value: defaultMetadata
    });
  }
  return ɵgetStoreMetadata(target);
}
function ɵgetStoreMetadata(target) {
  return target[ɵMETA_KEY];
}
function ɵensureSelectorMetadata(target) {
  if (!ɵhasOwnProperty(target, ɵSELECTOR_META_KEY)) {
    const defaultMetadata = {
      makeRootSelector: null,
      originalFn: null,
      containerClass: null,
      selectorName: null,
      getSelectorOptions: () => ({})
    };
    ɵdefineProperty(target, ɵSELECTOR_META_KEY, {
      value: defaultMetadata
    });
  }
  return ɵgetSelectorMetadata(target);
}
function ɵgetSelectorMetadata(target) {
  return target[ɵSELECTOR_META_KEY];
}
function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false;
  }
  const length = prev.length;
  for (let i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false;
    }
  }
  return true;
}
function ɵmemoize(func, equalityCheck = Object.is) {
  let lastArgs = null;
  let lastResult = null;
  function memoized() {
    if (!areArgumentsShallowlyEqual(equalityCheck, lastArgs, arguments)) {
      lastResult = func.apply(null, arguments);
    }
    lastArgs = arguments;
    return lastResult;
  }
  memoized.reset = function() {
    lastArgs = null;
    lastResult = null;
  };
  return memoized;
}
var StateToken = class {
  _name;
  constructor(_name) {
    this._name = _name;
    const selectorMetadata = ɵensureSelectorMetadata(this);
    selectorMetadata.makeRootSelector = (runtimeContext) => {
      return runtimeContext.getStateGetter(this._name);
    };
  }
  getName() {
    return this._name;
  }
  toString() {
    return `StateToken[${this._name}]`;
  }
};
var ɵInitialState = class {
  static _value = {};
  static set(state) {
    this._value = state;
  }
  static pop() {
    const state = this._value;
    this._value = {};
    return state;
  }
};
var ɵINITIAL_STATE_TOKEN = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "INITIAL_STATE_TOKEN" : "", {
  providedIn: "root",
  factory: () => ɵInitialState.pop()
});
var ɵNgxsAppBootstrappedState = class _ɵNgxsAppBootstrappedState extends BehaviorSubject {
  constructor() {
    super(false);
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => this.complete());
  }
  bootstrap() {
    this.next(true);
  }
  /** @nocollapse */
  static ɵfac = function ɵNgxsAppBootstrappedState_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ɵNgxsAppBootstrappedState)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _ɵNgxsAppBootstrappedState,
    factory: _ɵNgxsAppBootstrappedState.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ɵNgxsAppBootstrappedState, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var ɵNGXS_STATE_FACTORY = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "ɵNGXS_STATE_FACTORY" : "");
var ɵNGXS_STATE_CONTEXT_FACTORY = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "ɵNGXS_STATE_CONTEXT_FACTORY" : "");
function orderedQueueOperation(operation) {
  const callsQueue = [];
  let busyPushingNext = false;
  return function callOperation(...args) {
    if (busyPushingNext) {
      callsQueue.unshift(args);
      return;
    }
    busyPushingNext = true;
    operation(...args);
    while (callsQueue.length > 0) {
      const nextCallArgs = callsQueue.pop();
      nextCallArgs && operation(...nextCallArgs);
    }
    busyPushingNext = false;
  };
}
var ɵOrderedSubject = class extends Subject {
  _orderedNext = orderedQueueOperation((value) => super.next(value));
  next(value) {
    this._orderedNext(value);
  }
};
var ɵOrderedBehaviorSubject = class extends BehaviorSubject {
  _orderedNext = orderedQueueOperation((value) => super.next(value));
  _currentValue;
  constructor(value) {
    super(value);
    this._currentValue = value;
  }
  getValue() {
    return this._currentValue;
  }
  next(value) {
    this._currentValue = value;
    this._orderedNext(value);
  }
};
function ɵwrapObserverCalls(invokeFn) {
  return (source) => {
    return new Observable((subscriber) => {
      return source.subscribe({
        next(value) {
          invokeFn(() => subscriber.next(value));
        },
        error(error) {
          invokeFn(() => subscriber.error(error));
        },
        complete() {
          invokeFn(() => subscriber.complete());
        }
      });
    });
  };
}
var ɵStateStream = class _ɵStateStream extends ɵOrderedBehaviorSubject {
  state = toSignal(this.pipe(ɵwrapObserverCalls(untracked)), {
    manualCleanup: true,
    requireSync: true
  });
  constructor() {
    super({});
    inject(DestroyRef).onDestroy(() => this.complete());
  }
  /** @nocollapse */
  static ɵfac = function ɵStateStream_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ɵStateStream)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _ɵStateStream,
    factory: _ɵStateStream.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ɵStateStream, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var ɵNgxsActionRegistry = class _ɵNgxsActionRegistry {
  // Instead of going over the states list every time an action is dispatched,
  // we are constructing a map of action types to lists of action metadata.
  // If the `@@Init` action is handled in two different states, the action
  // metadata list will contain two objects that have the state `instance` and
  // method names to be used as action handlers (decorated with `@Action(InitState)`).
  _actionTypeToHandlersMap = /* @__PURE__ */ new Map();
  constructor() {
    inject(DestroyRef).onDestroy(() => this._actionTypeToHandlersMap.clear());
  }
  get(type) {
    return this._actionTypeToHandlersMap.get(type);
  }
  register(type, handler) {
    const handlers = this._actionTypeToHandlersMap.get(type) ?? /* @__PURE__ */ new Set();
    handlers.add(handler);
    this._actionTypeToHandlersMap.set(type, handlers);
    return () => {
      const handlers2 = this._actionTypeToHandlersMap.get(type);
      handlers2.delete(handler);
    };
  }
  /** @nocollapse */
  static ɵfac = function ɵNgxsActionRegistry_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ɵNgxsActionRegistry)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _ɵNgxsActionRegistry,
    factory: _ɵNgxsActionRegistry.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ɵNgxsActionRegistry, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// node_modules/@ngxs/store/fesm2022/ngxs-store-plugins.mjs
var InitState = class {
  static type = "@@INIT";
};
var UpdateState = class {
  addedStates;
  static type = "@@UPDATE_STATE";
  constructor(addedStates) {
    this.addedStates = addedStates;
  }
};
var NGXS_PLUGINS = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "NGXS_PLUGINS" : "");
function ɵisPluginClass(plugin) {
  return !!plugin.prototype.handle;
}
function getActionTypeFromInstance(action) {
  return action.constructor?.type || action.type;
}
function actionMatcher(action1) {
  const type1 = getActionTypeFromInstance(action1);
  return function(action2) {
    return type1 === getActionTypeFromInstance(action2);
  };
}
var setValue = (obj, prop, val) => {
  obj = __spreadValues({}, obj);
  const split = prop.split(".");
  const lastIndex = split.length - 1;
  split.reduce((acc, part, index) => {
    if (index === lastIndex) {
      acc[part] = val;
    } else {
      acc[part] = Array.isArray(acc[part]) ? acc[part].slice() : __spreadValues({}, acc[part]);
    }
    return acc?.[part];
  }, obj);
  return obj;
};
var getValue = (obj, prop) => prop.split(".").reduce((acc, part) => acc?.[part], obj);

// node_modules/@ngxs/store/fesm2022/ngxs-store-operators.mjs
var isArray = Array.isArray;
var isFunction = (value) => typeof value == "function";
var isStateOperator = isFunction;

// node_modules/@ngxs/store/fesm2022/ngxs-store.mjs
var PluginManager = class _PluginManager {
  plugins = [];
  _parentManager = inject(_PluginManager, {
    optional: true,
    skipSelf: true
  });
  _pluginHandlers = inject(NGXS_PLUGINS, {
    optional: true
  });
  constructor() {
    this.registerHandlers();
  }
  get _rootPlugins() {
    return this._parentManager?.plugins || this.plugins;
  }
  registerHandlers() {
    const pluginHandlers = this.getPluginHandlers();
    this._rootPlugins.push(...pluginHandlers);
  }
  getPluginHandlers() {
    const handlers = this._pluginHandlers || [];
    return handlers.map((plugin) => plugin.handle ? plugin.handle.bind(plugin) : plugin);
  }
  /** @nocollapse */
  static ɵfac = function PluginManager_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PluginManager)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _PluginManager,
    factory: _PluginManager.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PluginManager, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function leaveNgxs(ngxsExecutionStrategy) {
  return ɵwrapObserverCalls((fn) => ngxsExecutionStrategy.leave(fn));
}
var ɵɵunhandledRxjsErrorCallbacks = /* @__PURE__ */ new WeakMap();
var installed = false;
function installOnUnhandhedErrorHandler() {
  if (installed) {
    return;
  }
  const existingHandler = config.onUnhandledError;
  config.onUnhandledError = function(error) {
    const unhandledErrorCallback = ɵɵunhandledRxjsErrorCallbacks.get(error);
    if (unhandledErrorCallback) {
      unhandledErrorCallback();
    } else if (existingHandler) {
      existingHandler.call(this, error);
    } else {
      throw error;
    }
  };
  installed = true;
}
function executeUnhandledCallback(error) {
  const unhandledErrorCallback = ɵɵunhandledRxjsErrorCallbacks.get(error);
  if (unhandledErrorCallback) {
    unhandledErrorCallback();
    return true;
  }
  return false;
}
function assignUnhandledCallback(error, callback) {
  if (error && typeof error === "object") {
    let hasBeenCalled = false;
    ɵɵunhandledRxjsErrorCallbacks.set(error, () => {
      if (!hasBeenCalled) {
        hasBeenCalled = true;
        callback();
      }
    });
  }
  return error;
}
function fallbackSubscriber(ngZone) {
  return (source) => {
    let subscription = source.subscribe({
      error: (error) => {
        ngZone.runOutsideAngular(() => {
          queueMicrotask(() => {
            if (subscription) {
              executeUnhandledCallback(error);
            }
          });
        });
      }
    });
    return new Observable((subscriber) => {
      subscription?.unsubscribe();
      subscription = null;
      return source.subscribe(subscriber);
    });
  };
}
var InternalDispatchedActionResults = class _InternalDispatchedActionResults extends Subject {
  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.complete());
  }
  /** @nocollapse */
  static ɵfac = function InternalDispatchedActionResults_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InternalDispatchedActionResults)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _InternalDispatchedActionResults,
    factory: _InternalDispatchedActionResults.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalDispatchedActionResults, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var InternalNgxsExecutionStrategy = class _InternalNgxsExecutionStrategy {
  _ngZone = inject(NgZone);
  enter(func) {
    if (false) {
      return this._runInsideAngular(func);
    }
    return this._runOutsideAngular(func);
  }
  leave(func) {
    return this._runInsideAngular(func);
  }
  _runInsideAngular(func) {
    if (NgZone.isInAngularZone()) {
      return func();
    }
    return this._ngZone.run(func);
  }
  _runOutsideAngular(func) {
    if (NgZone.isInAngularZone()) {
      return this._ngZone.runOutsideAngular(func);
    }
    return func();
  }
  /** @nocollapse */
  static ɵfac = function InternalNgxsExecutionStrategy_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InternalNgxsExecutionStrategy)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _InternalNgxsExecutionStrategy,
    factory: _InternalNgxsExecutionStrategy.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalNgxsExecutionStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var ActionStatus;
(function(ActionStatus2) {
  ActionStatus2["Dispatched"] = "DISPATCHED";
  ActionStatus2["Successful"] = "SUCCESSFUL";
  ActionStatus2["Canceled"] = "CANCELED";
  ActionStatus2["Errored"] = "ERRORED";
})(ActionStatus || (ActionStatus = {}));
var InternalActions = class _InternalActions extends ɵOrderedSubject {
  // This subject will be the first to know about the dispatched action, its purpose is for
  // any logic that must be executed before action handlers are invoked (i.e., cancelation).
  dispatched$ = new Subject();
  constructor() {
    super();
    this.subscribe((ctx) => {
      if (ctx.status === ActionStatus.Dispatched) {
        this.dispatched$.next(ctx);
      }
    });
    const destroyRef = inject(DestroyRef);
    destroyRef.onDestroy(() => {
      this.complete();
      this.dispatched$.complete();
    });
  }
  /** @nocollapse */
  static ɵfac = function InternalActions_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InternalActions)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _InternalActions,
    factory: _InternalActions.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalActions, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var Actions = class _Actions extends Observable {
  constructor() {
    const internalActions$ = inject(InternalActions);
    const internalExecutionStrategy = inject(InternalNgxsExecutionStrategy);
    const sharedInternalActions$ = new Subject();
    internalActions$.pipe(leaveNgxs(internalExecutionStrategy)).subscribe(sharedInternalActions$);
    super((observer) => {
      const childSubscription = sharedInternalActions$.subscribe({
        next: (ctx) => observer.next(ctx),
        error: (error) => observer.error(error),
        complete: () => observer.complete()
      });
      observer.add(childSubscription);
    });
  }
  /** @nocollapse */
  static ɵfac = function Actions_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Actions)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _Actions,
    factory: _Actions.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Actions, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var InternalDispatcher = class _InternalDispatcher {
  _ngZone = inject(NgZone);
  _actions = inject(InternalActions);
  _actionResults = inject(InternalDispatchedActionResults);
  _pluginManager = inject(PluginManager);
  _stateStream = inject(ɵStateStream);
  _ngxsExecutionStrategy = inject(InternalNgxsExecutionStrategy);
  _injector = inject(Injector);
  /**
   * Dispatches event(s).
   */
  dispatch(actionOrActions) {
    const result = this._ngxsExecutionStrategy.enter(() => this.dispatchByEvents(actionOrActions));
    return result.pipe(fallbackSubscriber(this._ngZone), leaveNgxs(this._ngxsExecutionStrategy));
  }
  dispatchByEvents(actionOrActions) {
    if (Array.isArray(actionOrActions)) {
      if (actionOrActions.length === 0) return of(void 0);
      return forkJoin(actionOrActions.map((action) => this.dispatchSingle(action))).pipe(map(() => void 0));
    } else {
      return this.dispatchSingle(actionOrActions);
    }
  }
  dispatchSingle(action) {
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      const type = getActionTypeFromInstance(action);
      if (!type) {
        const error = new Error(`This action doesn't have a type property: ${action.constructor.name}`);
        return new Observable((subscriber) => subscriber.error(error));
      }
    }
    const prevState = this._stateStream.getValue();
    const plugins = this._pluginManager.plugins;
    return compose(this._injector, [...plugins, (nextState, nextAction) => {
      if (nextState !== prevState) {
        this._stateStream.next(nextState);
      }
      const actionResult$ = this.getActionResultStream(nextAction);
      actionResult$.subscribe((ctx) => this._actions.next(ctx));
      this._actions.next({
        action: nextAction,
        status: ActionStatus.Dispatched
      });
      return this.createDispatchObservable(actionResult$);
    }])(prevState, action).pipe(shareReplay());
  }
  getActionResultStream(action) {
    return this._actionResults.pipe(filter((ctx) => ctx.action === action && ctx.status !== ActionStatus.Dispatched), take(1), shareReplay());
  }
  createDispatchObservable(actionResult$) {
    return actionResult$.pipe(mergeMap((ctx) => {
      switch (ctx.status) {
        case ActionStatus.Successful:
          return of(this._stateStream.getValue());
        case ActionStatus.Errored:
          throw ctx.error;
        default:
          return EMPTY;
      }
    }), shareReplay());
  }
  /** @nocollapse */
  static ɵfac = function InternalDispatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InternalDispatcher)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _InternalDispatcher,
    factory: _InternalDispatcher.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalDispatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var compose = (injector, funcs) => (...args) => {
  const curr = funcs.shift();
  return runInInjectionContext(injector, () => curr(...args, (...nextArgs) => compose(injector, funcs)(...nextArgs)));
};
var ROOT_STATE_TOKEN = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "ROOT_STATE_TOKEN" : "");
var FEATURE_STATE_TOKEN = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "FEATURE_STATE_TOKEN" : "");
var NGXS_OPTIONS = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "NGXS_OPTIONS" : "");
var NgxsConfig = class _NgxsConfig {
  /**
   * Run in development mode. This will add additional debugging features:
   * - Object.freeze on the state and actions to guarantee immutability
   * (default: false)
   *
   * Note: this property will be accounted only in development mode.
   * It makes sense to use it only during development to ensure there're no state mutations.
   * When building for production, the `Object.freeze` will be tree-shaken away.
   */
  developmentMode;
  compatibility = {
    strictContentSecurityPolicy: false
  };
  /**
   * Defining shared selector options
   */
  selectorOptions = {
    injectContainerState: false,
    suppressErrors: false
  };
  /** @nocollapse */
  static ɵfac = function NgxsConfig_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsConfig)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _NgxsConfig,
    factory: () => (() => {
      const defaultConfig = new _NgxsConfig();
      const config2 = inject(NGXS_OPTIONS);
      return __spreadProps(__spreadValues(__spreadValues({}, defaultConfig), config2), {
        selectorOptions: __spreadValues(__spreadValues({}, defaultConfig.selectorOptions), config2.selectorOptions)
      });
    })(),
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsConfig, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => {
        const defaultConfig = new NgxsConfig();
        const config2 = inject(NGXS_OPTIONS);
        return __spreadProps(__spreadValues(__spreadValues({}, defaultConfig), config2), {
          selectorOptions: __spreadValues(__spreadValues({}, defaultConfig.selectorOptions), config2.selectorOptions)
        });
      }
    }]
  }], null, null);
})();
var NgxsSimpleChange = class {
  previousValue;
  currentValue;
  firstChange;
  constructor(previousValue, currentValue, firstChange) {
    this.previousValue = previousValue;
    this.currentValue = currentValue;
    this.firstChange = firstChange;
  }
};
var deepFreeze = (o) => {
  Object.freeze(o);
  const oIsFunction = typeof o === "function";
  Object.getOwnPropertyNames(o).forEach(function(prop) {
    if (ɵhasOwnProperty(o, prop) && (oIsFunction ? prop !== "caller" && prop !== "callee" && prop !== "arguments" : true) && o[prop] !== null && (typeof o[prop] === "object" || typeof o[prop] === "function") && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });
  return o;
};
var InternalStateOperations = class _InternalStateOperations {
  _stateStream = inject(ɵStateStream);
  _dispatcher = inject(InternalDispatcher);
  _config = inject(NgxsConfig);
  /**
   * Returns the root state operators.
   */
  getRootStateOperations() {
    const rootStateOperations = {
      getState: () => this._stateStream.getValue(),
      setState: (newState) => this._stateStream.next(newState),
      dispatch: (actionOrActions) => this._dispatcher.dispatch(actionOrActions)
    };
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      return this._config.developmentMode ? ensureStateAndActionsAreImmutable(rootStateOperations) : rootStateOperations;
    } else {
      return rootStateOperations;
    }
  }
  setStateToTheCurrentWithNew(results) {
    const stateOperations = this.getRootStateOperations();
    const currentState = stateOperations.getState();
    stateOperations.setState(__spreadValues(__spreadValues({}, currentState), results.defaults));
  }
  /** @nocollapse */
  static ɵfac = function InternalStateOperations_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InternalStateOperations)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _InternalStateOperations,
    factory: _InternalStateOperations.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalStateOperations, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function ensureStateAndActionsAreImmutable(root) {
  return {
    getState: () => root.getState(),
    setState: (value) => {
      const frozenValue = deepFreeze(value);
      return root.setState(frozenValue);
    },
    dispatch: (actions) => {
      return root.dispatch(actions);
    }
  };
}
function createRootSelectorFactory(selectorMetaData, selectors, memoizedSelectorFn) {
  return (context) => {
    const {
      argumentSelectorFunctions,
      selectorOptions
    } = getRuntimeSelectorInfo(context, selectorMetaData, selectors);
    const {
      suppressErrors
    } = selectorOptions;
    return function selectFromRoot(rootState) {
      const results = argumentSelectorFunctions.map((argFn) => argFn(rootState));
      try {
        return memoizedSelectorFn(...results);
      } catch (ex) {
        if (suppressErrors && ex instanceof TypeError) {
          return void 0;
        }
        if (typeof ngDevMode !== "undefined" && ngDevMode) {
          const message = "The selector below has thrown an error upon invocation. Please check for any unsafe property access that may result in null or undefined values.";
          console.error(message, selectorMetaData.originalFn);
        }
        throw ex;
      }
    };
  };
}
function createMemoizedSelectorFn(originalFn, creationMetadata) {
  const containerClass = creationMetadata?.containerClass;
  const wrappedFn = function wrappedSelectorFn() {
    const returnValue = originalFn.apply(containerClass, arguments);
    if (typeof returnValue === "function") {
      const innerMemoizedFn = ɵmemoize.apply(null, [returnValue]);
      return innerMemoizedFn;
    }
    return returnValue;
  };
  const memoizedFn = ɵmemoize(wrappedFn);
  Object.setPrototypeOf(memoizedFn, originalFn);
  return memoizedFn;
}
function getRuntimeSelectorInfo(context, selectorMetaData, selectors = []) {
  const localSelectorOptions = selectorMetaData.getSelectorOptions();
  const selectorOptions = context.getSelectorOptions(localSelectorOptions);
  const selectorsToApply = getSelectorsToApply(selectors, selectorOptions, selectorMetaData.containerClass);
  const argumentSelectorFunctions = selectorsToApply.map((selector) => {
    const factory = getRootSelectorFactory(selector);
    return factory(context);
  });
  return {
    selectorOptions,
    argumentSelectorFunctions
  };
}
function getSelectorsToApply(selectors = [], selectorOptions, containerClass) {
  const selectorsToApply = [];
  const canInjectContainerState = selectorOptions.injectContainerState || selectors.length === 0;
  if (containerClass && canInjectContainerState) {
    const metadata = ɵgetStoreMetadata(containerClass);
    if (metadata) {
      selectorsToApply.push(containerClass);
    }
  }
  selectorsToApply.push(...selectors);
  return selectorsToApply;
}
function getRootSelectorFactory(selector) {
  const metadata = ɵgetSelectorMetadata(selector) || ɵgetStoreMetadata(selector);
  return metadata?.makeRootSelector || (() => selector);
}
function compliantPropGetter(paths) {
  return (obj) => {
    for (let i = 0; i < paths.length; i++) {
      if (!obj) return void 0;
      obj = obj[paths[i]];
    }
    return obj;
  };
}
function fastPropGetter(paths) {
  const segments = paths;
  let seg = "store." + segments[0];
  let i = 0;
  const l = segments.length;
  let expr = seg;
  while (++i < l) {
    expr = expr + " && " + (seg = seg + "." + segments[i]);
  }
  const fn = new Function("store", "return " + expr + ";");
  return fn;
}
var ɵPROP_GETTER = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "PROP_GETTER" : "", {
  providedIn: "root",
  factory: () => inject(NgxsConfig).compatibility?.strictContentSecurityPolicy ? compliantPropGetter : fastPropGetter
});
function buildGraph(stateClasses) {
  const findName = (stateClass) => {
    const meta = stateClasses.find((s) => s === stateClass);
    if (typeof ngDevMode !== "undefined" && ngDevMode && !meta) {
      throw new Error(`Child state not found: ${stateClass}. \r
You may have forgotten to add states to module`);
    }
    return meta[ɵMETA_KEY].name;
  };
  return stateClasses.reduce((graph, stateClass) => {
    const meta = stateClass[ɵMETA_KEY];
    graph[meta.name] = (meta.children || []).map(findName);
    return graph;
  }, {});
}
function nameToState(states) {
  return states.reduce((result, stateClass) => {
    const meta = stateClass[ɵMETA_KEY];
    result[meta.name] = stateClass;
    return result;
  }, {});
}
function findFullParentPath(obj, out = {}) {
  const find = (graph, target) => {
    for (const key in graph) {
      if (graph[key]?.includes(target)) {
        const parent = find(graph, key);
        return parent ? `${parent}.${key}` : key;
      }
    }
    return null;
  };
  for (const key in obj) {
    const parent = find(obj, key);
    out[key] = parent ? `${parent}.${key}` : key;
  }
  return out;
}
function topologicalSort(graph) {
  const sorted = [];
  const visited = {};
  const visit = (name, ancestors = []) => {
    visited[name] = true;
    ancestors.push(name);
    for (const dep of graph[name]) {
      if (typeof ngDevMode !== "undefined" && ngDevMode && ancestors.includes(dep)) {
        throw new Error(`Circular dependency '${dep}' is required by '${name}': ${ancestors.join(" -> ")}`);
      }
      if (!visited[dep]) visit(dep, ancestors.slice());
    }
    if (!sorted.includes(name)) sorted.push(name);
  };
  for (const key in graph) visit(key);
  return sorted.reverse();
}
function throwStateNameError(name) {
  throw new Error(`${name} is not a valid state name. It needs to be a valid object property name.`);
}
function throwStateNamePropertyError() {
  throw new Error(`States must register a 'name' property.`);
}
function throwStateUniqueError(current, newName, oldName) {
  throw new Error(`State name '${current}' from ${newName} already exists in ${oldName}.`);
}
function throwStateDecoratorError(name) {
  throw new Error(`States must be decorated with @State() decorator, but "${name}" isn't.`);
}
function throwActionDecoratorError() {
  throw new Error("@Action() decorator cannot be used with static methods.");
}
function throwSelectorDecoratorError() {
  throw new Error("Selectors only work on methods.");
}
function getUndecoratedStateWithInjectableWarningMessage(name) {
  return `'${name}' class should be decorated with @Injectable() right after the @State() decorator`;
}
function getInvalidInitializationOrderMessage(addedStates) {
  let message = "You have an invalid state initialization order. This typically occurs when `NgxsModule.forFeature`\nor `provideStates` is called before `NgxsModule.forRoot` or `provideStore`.\nOne example is when `NgxsRouterPluginModule.forRoot` is called before `NgxsModule.forRoot`.";
  if (addedStates) {
    const stateNames = Object.keys(addedStates).map((stateName) => `"${stateName}"`);
    message += `
Feature states added before the store initialization is complete: ${stateNames.join(", ")}.`;
  }
  return message;
}
function throwPatchingArrayError() {
  throw new Error("Patching arrays is not supported.");
}
function throwPatchingPrimitiveError() {
  throw new Error("Patching primitives is not supported.");
}
var stateNameRegex = new RegExp("^[a-zA-Z0-9_]+$");
function ensureStateNameIsValid(name) {
  if (!name) {
    throwStateNamePropertyError();
  } else if (!stateNameRegex.test(name)) {
    throwStateNameError(name);
  }
}
function ensureStateNameIsUnique(stateName, state, statesByName) {
  const existingState = statesByName[stateName];
  if (existingState && existingState !== state) {
    throwStateUniqueError(stateName, state.name, existingState.name);
  }
}
function ensureStatesAreDecorated(stateClasses) {
  stateClasses.forEach((stateClass) => {
    if (!ɵgetStoreMetadata(stateClass)) {
      throwStateDecoratorError(stateClass.name);
    }
  });
}
function ensureStateClassIsInjectable(stateClass) {
  if (jit_hasInjectableAnnotation(stateClass) || aot_hasNgInjectableDef(stateClass)) {
    return;
  }
  console.warn(getUndecoratedStateWithInjectableWarningMessage(stateClass.name));
}
function aot_hasNgInjectableDef(stateClass) {
  return !!stateClass.ɵprov;
}
function jit_hasInjectableAnnotation(stateClass) {
  const annotations = stateClass.__annotations__ || [];
  return annotations.some((annotation) => annotation?.ngMetadataName === "Injectable");
}
var NGXS_DEVELOPMENT_OPTIONS = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "NGXS_DEVELOPMENT_OPTIONS" : "", {
  providedIn: "root",
  factory: () => ({
    warnOnUnhandledActions: true
  })
});
var NgxsUnhandledActionsLogger = class _NgxsUnhandledActionsLogger {
  /**
   * These actions should be ignored by default; the user can increase this
   * list in the future via the `ignoreActions` method.
   */
  _ignoredActions = /* @__PURE__ */ new Set([InitState.type, UpdateState.type]);
  constructor() {
    const options = inject(NGXS_DEVELOPMENT_OPTIONS);
    if (typeof options.warnOnUnhandledActions === "object") {
      this.ignoreActions(...options.warnOnUnhandledActions.ignore);
    }
  }
  /**
   * Adds actions to the internal list of actions that should be ignored.
   */
  ignoreActions(...actions) {
    for (const action of actions) {
      this._ignoredActions.add(action.type);
    }
  }
  /** @internal */
  warn(action) {
    const actionShouldBeIgnored = Array.from(this._ignoredActions).some((type) => type === getActionTypeFromInstance(action));
    if (actionShouldBeIgnored) {
      return;
    }
    action = action.constructor && action.constructor.name !== "Object" ? action.constructor.name : action.type;
    console.warn(`The ${action} action has been dispatched but hasn't been handled. This may happen if the state with an action handler for this action is not registered.`);
  }
  /** @nocollapse */
  static ɵfac = function NgxsUnhandledActionsLogger_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsUnhandledActionsLogger)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _NgxsUnhandledActionsLogger,
    factory: _NgxsUnhandledActionsLogger.ɵfac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsUnhandledActionsLogger, [{
    type: Injectable
  }], () => [], null);
})();
var NgxsUnhandledErrorHandler = class _NgxsUnhandledErrorHandler {
  _ngZone = inject(NgZone);
  _errorHandler = inject(ErrorHandler);
  /**
   * The `_unhandledErrorContext` is left unused internally since we do not
   * require it for internal operations. However, developers who wish to provide
   * their own custom error handler may utilize this context information.
   */
  handleError(error, _unhandledErrorContext) {
    this._ngZone.runOutsideAngular(() => this._errorHandler.handleError(error));
  }
  /** @nocollapse */
  static ɵfac = function NgxsUnhandledErrorHandler_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsUnhandledErrorHandler)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _NgxsUnhandledErrorHandler,
    factory: _NgxsUnhandledErrorHandler.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsUnhandledErrorHandler, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function ofAction(...allowedTypes) {
  return ofActionOperator(allowedTypes);
}
function ofActionDispatched(...allowedTypes) {
  return ofActionOperator(allowedTypes, [ActionStatus.Dispatched]);
}
function ofActionSuccessful(...allowedTypes) {
  return ofActionOperator(allowedTypes, [ActionStatus.Successful]);
}
function ofActionCanceled(...allowedTypes) {
  return ofActionOperator(allowedTypes, [ActionStatus.Canceled]);
}
function ofActionCompleted(...allowedTypes) {
  const allowedStatuses = [ActionStatus.Successful, ActionStatus.Canceled, ActionStatus.Errored];
  return ofActionOperator(allowedTypes, allowedStatuses, mapActionResult);
}
function ofActionErrored(...allowedTypes) {
  return ofActionOperator(allowedTypes, [ActionStatus.Errored], mapActionResult);
}
function ofActionOperator(allowedTypes, statuses, mapOperator = mapAction) {
  const allowedMap = createAllowedActionTypesMap(allowedTypes);
  const allowedStatusMap = statuses && createAllowedStatusesMap(statuses);
  return function(o) {
    return o.pipe(filterStatus(allowedMap, allowedStatusMap), mapOperator());
  };
}
function filterStatus(allowedTypes, allowedStatuses) {
  return filter((ctx) => {
    const actionType = getActionTypeFromInstance(ctx.action);
    const typeMatch = allowedTypes[actionType];
    const statusMatch = allowedStatuses ? allowedStatuses[ctx.status] : true;
    return typeMatch && statusMatch;
  });
}
function mapActionResult() {
  return map(({
    action,
    status,
    error
  }) => {
    return {
      action,
      result: {
        successful: ActionStatus.Successful === status,
        canceled: ActionStatus.Canceled === status,
        error
      }
    };
  });
}
function mapAction() {
  return map((ctx) => ctx.action);
}
function createAllowedActionTypesMap(types) {
  return types.reduce((filterMap, klass) => {
    filterMap[getActionTypeFromInstance(klass)] = true;
    return filterMap;
  }, {});
}
function createAllowedStatusesMap(statuses) {
  return statuses.reduce((filterMap, status) => {
    filterMap[status] = true;
    return filterMap;
  }, {});
}
function simplePatch(value) {
  return (existingState) => {
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      if (Array.isArray(value)) {
        throwPatchingArrayError();
      } else if (typeof value !== "object") {
        throwPatchingPrimitiveError();
      }
    }
    const newState = __spreadValues({}, existingState);
    for (const key in value) {
      newState[key] = value[key];
    }
    return newState;
  };
}
var StateContextFactory = class _StateContextFactory {
  _internalStateOperations = inject(InternalStateOperations);
  /**
   * Create the state context
   */
  createStateContext(path) {
    const root = this._internalStateOperations.getRootStateOperations();
    return {
      getState() {
        const currentAppState = root.getState();
        return getState(currentAppState, path);
      },
      patchState(val) {
        const currentAppState = root.getState();
        const patchOperator = simplePatch(val);
        setStateFromOperator(root, currentAppState, patchOperator, path);
      },
      setState(val) {
        const currentAppState = root.getState();
        if (isStateOperator(val)) {
          setStateFromOperator(root, currentAppState, val, path);
        } else {
          setStateValue(root, currentAppState, val, path);
        }
      },
      dispatch(actions) {
        return root.dispatch(actions);
      }
    };
  }
  /** @nocollapse */
  static ɵfac = function StateContextFactory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StateContextFactory)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _StateContextFactory,
    factory: _StateContextFactory.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StateContextFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function setStateValue(root, currentAppState, newValue, path) {
  const newAppState = setValue(currentAppState, path, newValue);
  root.setState(newAppState);
  return newAppState;
}
function setStateFromOperator(root, currentAppState, stateOperator, path) {
  const local = getState(currentAppState, path);
  const newValue = stateOperator(local);
  return setStateValue(root, currentAppState, newValue, path);
}
function getState(currentAppState, path) {
  return getValue(currentAppState, path);
}
var InternalActionHandlerFactory = class _InternalActionHandlerFactory {
  _actions = inject(InternalActions);
  _stateContextFactory = inject(StateContextFactory);
  createActionHandler(path, handlerFn, options) {
    const {
      dispatched$
    } = this._actions;
    return (action) => {
      const stateContext = this._stateContextFactory.createStateContext(path);
      let result = handlerFn(stateContext, action);
      if (isPromise(result)) {
        result = from(result);
      }
      if (isObservable(result)) {
        result = result.pipe(
          mergeMap((value) => isPromise(value) || isObservable(value) ? value : of(value)),
          // If this observable has completed without emitting any values,
          // we wouldn't want to complete the entire chain of actions.
          // If any observable completes, then the action will be canceled.
          // For instance, if any action handler had a statement like
          // `handler(ctx) { return EMPTY; }`, then the action would be canceled.
          // See https://github.com/ngxs/store/issues/1568
          // Note that we actually don't care about the return type; we only care
          // about emission, and thus `undefined` is applicable by the framework.
          defaultIfEmpty(void 0)
        );
        if (options.cancelUncompleted) {
          const canceled = dispatched$.pipe(ofActionDispatched(action));
          result = result.pipe(takeUntil(canceled));
        }
        result = result.pipe(
          // Note that we use the `finalize` operator only when the action handler
          // explicitly returns an observable (or a promise) to wait for. This means
          // the action handler is written in a "fire & wait" style. If the handler’s
          // result is unsubscribed (either because the observable has completed or
          // it was unsubscribed by `takeUntil` due to a new action being dispatched),
          // we prevent writing to the state context.
          finalize(() => {
            if (typeof ngDevMode !== "undefined" && ngDevMode) {
              let noopAndWarn = function() {
                console.warn(`"${action}" attempted to change the state, but the change was ignored because state updates are not allowed after the action handler has completed.`);
              };
              stateContext.setState = noopAndWarn;
              stateContext.patchState = noopAndWarn;
            } else {
              stateContext.setState = noop;
              stateContext.patchState = noop;
            }
          })
        );
      } else {
        result = of(void 0);
      }
      return result;
    };
  }
  /** @nocollapse */
  static ɵfac = function InternalActionHandlerFactory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _InternalActionHandlerFactory)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _InternalActionHandlerFactory,
    factory: _InternalActionHandlerFactory.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InternalActionHandlerFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function noop() {
}
function cloneDefaults(defaults) {
  let value = defaults === void 0 ? {} : defaults;
  if (defaults) {
    if (Array.isArray(defaults)) {
      value = defaults.slice();
    } else if (typeof defaults === "object") {
      value = __spreadValues({}, defaults);
    }
  }
  return value;
}
var StateFactory = class _StateFactory {
  _injector = inject(Injector);
  _config = inject(NgxsConfig);
  _actionHandlerFactory = inject(InternalActionHandlerFactory);
  _actions = inject(InternalActions);
  _actionResults = inject(InternalDispatchedActionResults);
  _initialState = inject(ɵINITIAL_STATE_TOKEN, {
    optional: true
  });
  _actionRegistry = inject(ɵNgxsActionRegistry);
  _propGetter = inject(ɵPROP_GETTER);
  _actionsSubscription = null;
  _ngxsUnhandledErrorHandler = null;
  _states = [];
  _statesByName = {};
  _statePaths = {};
  getRuntimeSelectorContext = ɵmemoize(() => {
    const stateFactory = this;
    const propGetter2 = stateFactory._propGetter;
    function resolveGetter(key) {
      const path = stateFactory._statePaths[key];
      return path ? propGetter2(path.split(".")) : null;
    }
    const context = {
      getStateGetter(key) {
        let getter = (
          /*@__INLINE__*/
          resolveGetter(key)
        );
        if (getter) {
          return getter;
        }
        return (...args) => {
          if (!getter) {
            getter = /*@__INLINE__*/
            resolveGetter(key);
          }
          return getter ? getter(...args) : void 0;
        };
      },
      getSelectorOptions(localOptions) {
        const globalSelectorOptions = stateFactory._config.selectorOptions;
        return __spreadValues(__spreadValues({}, globalSelectorOptions), localOptions || {});
      }
    };
    return context;
  });
  constructor() {
    inject(DestroyRef).onDestroy(() => this._actionsSubscription?.unsubscribe());
  }
  /**
   * Add a new state to the global defs.
   */
  add(stateClasses) {
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      ensureStatesAreDecorated(stateClasses);
    }
    const {
      newStates
    } = this.addToStatesMap(stateClasses);
    if (!newStates.length) return [];
    const stateGraph = buildGraph(newStates);
    const sortedStates = topologicalSort(stateGraph);
    const paths = findFullParentPath(stateGraph);
    const nameGraph = nameToState(newStates);
    const bootstrappedStores = [];
    for (const name of sortedStates) {
      const stateClass = nameGraph[name];
      const path = paths[name];
      const meta = stateClass[ɵMETA_KEY];
      this.addRuntimeInfoToMeta(meta, path);
      if (typeof ngDevMode !== "undefined" && ngDevMode) {
        ensureStateClassIsInjectable(stateClass);
      }
      const stateMap = {
        name,
        path,
        isInitialised: false,
        actions: meta.actions,
        instance: inject(stateClass),
        defaults: cloneDefaults(meta.defaults)
      };
      if (!this.hasBeenMountedAndBootstrapped(name, path)) {
        bootstrappedStores.push(stateMap);
      }
      this._states.push(stateMap);
      this.hydrateActionMetasMap(stateMap);
    }
    return bootstrappedStores;
  }
  /**
   * Add a set of states to the store and return the defaults
   */
  addAndReturnDefaults(stateClasses) {
    const classes = stateClasses || [];
    const mappedStores = this.add(classes);
    const defaults = mappedStores.reduce((result, mappedStore) => setValue(result, mappedStore.path, mappedStore.defaults), {});
    return {
      defaults,
      states: mappedStores
    };
  }
  connectActionHandlers() {
    this._actionsSubscription = this._actions.pipe(filter((ctx) => ctx.status === ActionStatus.Dispatched), mergeMap((ctx) => {
      const action = ctx.action;
      return this.invokeActions(action).pipe(map(() => ({
        action,
        status: ActionStatus.Successful
      })), defaultIfEmpty({
        action,
        status: ActionStatus.Canceled
      }), catchError((error) => {
        const ngxsUnhandledErrorHandler = this._ngxsUnhandledErrorHandler ||= this._injector.get(NgxsUnhandledErrorHandler);
        const handleableError = assignUnhandledCallback(error, () => ngxsUnhandledErrorHandler.handleError(error, {
          action
        }));
        return of({
          action,
          status: ActionStatus.Errored,
          error: handleableError
        });
      }));
    })).subscribe((ctx) => this._actionResults.next(ctx));
  }
  /**
   * Invoke actions on the states.
   */
  invokeActions(action) {
    const type = getActionTypeFromInstance(action);
    const results = [];
    let actionHasBeenHandled = false;
    const actionHandlers = this._actionRegistry.get(type);
    if (actionHandlers) {
      for (const actionHandler of actionHandlers) {
        let result;
        try {
          result = actionHandler(action);
        } catch (e) {
          result = new Observable((subscriber) => subscriber.error(e));
        }
        results.push(result);
        actionHasBeenHandled = true;
      }
    }
    if (typeof ngDevMode !== "undefined" && ngDevMode && !actionHasBeenHandled) {
      const unhandledActionsLogger = this._injector.get(NgxsUnhandledActionsLogger, null);
      unhandledActionsLogger?.warn(action);
    }
    if (!results.length) {
      results.push(of(void 0));
    }
    return forkJoin(results);
  }
  addToStatesMap(stateClasses) {
    const newStates = [];
    const statesMap = this._statesByName;
    for (const stateClass of stateClasses) {
      const stateName = ɵgetStoreMetadata(stateClass).name;
      if (typeof ngDevMode !== "undefined" && ngDevMode) {
        ensureStateNameIsUnique(stateName, stateClass, statesMap);
      }
      const unmountedState = !statesMap[stateName];
      if (unmountedState) {
        newStates.push(stateClass);
        statesMap[stateName] = stateClass;
      }
    }
    return {
      newStates
    };
  }
  addRuntimeInfoToMeta(meta, path) {
    this._statePaths[meta.name] = path;
    meta.path = path;
  }
  hasBeenMountedAndBootstrapped(name, path) {
    const valueIsBootstrappedInInitialState = getValue(this._initialState, path) !== void 0;
    return this._statesByName[name] && valueIsBootstrappedInInitialState;
  }
  hydrateActionMetasMap({
    path,
    actions,
    instance
  }) {
    for (const actionType of Object.keys(actions)) {
      const actionHandlers = actions[actionType].map((actionMeta) => {
        const handlerFn = (ctx, action) => instance[actionMeta.fn](ctx, action);
        return this._actionHandlerFactory.createActionHandler(path, handlerFn, actionMeta.options);
      });
      for (const actionHandler of actionHandlers) {
        this._actionRegistry.register(actionType, actionHandler);
      }
    }
  }
  /** @nocollapse */
  static ɵfac = function StateFactory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StateFactory)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _StateFactory,
    factory: _StateFactory.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(StateFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var Store = class _Store {
  _stateStream = inject(ɵStateStream);
  _internalStateOperations = inject(InternalStateOperations);
  _config = inject(NgxsConfig);
  _internalExecutionStrategy = inject(InternalNgxsExecutionStrategy);
  _stateFactory = inject(StateFactory);
  /**
   * This is a derived state stream that leaves NGXS execution strategy to emit state changes within the Angular zone,
   * because state is being changed actually within the `<root>` zone, see `InternalDispatcher#dispatchSingle`.
   * All selects would use this stream, and it would call leave only once for any state change across all active selectors.
   */
  _selectableStateStream = this._stateStream.pipe(leaveNgxs(this._internalExecutionStrategy), shareReplay({
    bufferSize: 1,
    refCount: true
  }));
  constructor() {
    this.initStateStream();
  }
  /**
   * Dispatches action(s).
   */
  dispatch(actionOrActions) {
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      if (
        // If a single action is dispatched and it's nullable.
        actionOrActions == null || // If a list of actions is dispatched and any of the actions are nullable.
        Array.isArray(actionOrActions) && actionOrActions.some((action) => action == null)
      ) {
        const error = new Error("`dispatch()` was called without providing an action.");
        return new Observable((subscriber) => subscriber.error(error));
      }
    }
    return this._internalStateOperations.getRootStateOperations().dispatch(actionOrActions);
  }
  /**
   * Selects a slice of data from the store.
   */
  select(selector) {
    const selectorFn = this.getStoreBoundSelectorFn(selector);
    return this._selectableStateStream.pipe(map(selectorFn), catchError((error) => {
      if (this._config.selectorOptions.suppressErrors && error instanceof TypeError) {
        return of(void 0);
      }
      throw error;
    }), distinctUntilChanged(), leaveNgxs(this._internalExecutionStrategy));
  }
  /**
   * Select one slice of data from the store.
   */
  selectOnce(selector) {
    return this.select(selector).pipe(take(1));
  }
  /**
   * Select a snapshot from the state.
   */
  selectSnapshot(selector) {
    const selectorFn = this.getStoreBoundSelectorFn(selector);
    return selectorFn(this._stateStream.getValue());
  }
  /**
   * Select a signal from the state.
   */
  selectSignal(selector) {
    const selectorFn = this.getStoreBoundSelectorFn(selector);
    return computed(() => selectorFn(this._stateStream.state()));
  }
  /**
   * Allow the user to subscribe to the root of the state
   */
  subscribe(fn) {
    return this._selectableStateStream.pipe(leaveNgxs(this._internalExecutionStrategy)).subscribe(fn);
  }
  /**
   * Return the raw value of the state.
   */
  snapshot() {
    return this._internalStateOperations.getRootStateOperations().getState();
  }
  /**
   * Reset the state to a specific point in time. This method is useful
   * for plugin's who need to modify the state directly or unit testing.
   */
  reset(state) {
    this._internalStateOperations.getRootStateOperations().setState(state);
  }
  getStoreBoundSelectorFn(selector) {
    const makeSelectorFn = getRootSelectorFactory(selector);
    const runtimeContext = this._stateFactory.getRuntimeSelectorContext();
    return makeSelectorFn(runtimeContext);
  }
  initStateStream() {
    const initialStateValue = inject(ɵINITIAL_STATE_TOKEN);
    const value = this._stateStream.value;
    const storeIsEmpty = !value || Object.keys(value).length === 0;
    if (storeIsEmpty) {
      this._stateStream.next(initialStateValue);
    }
  }
  /** @nocollapse */
  static ɵfac = function Store_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Store)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _Store,
    factory: _Store.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Store, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var NGXS_PREBOOT_FNS = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "NGXS_PREBOOT_FNS" : "");
function withNgxsPreboot(prebootFn) {
  return makeEnvironmentProviders([{
    provide: NGXS_PREBOOT_FNS,
    multi: true,
    useValue: prebootFn
  }]);
}
var ROOT_STORE_GUARD = new InjectionToken("ROOT_STORE_GUARD", {
  providedIn: "root",
  factory: () => ({
    initialized: false
  })
});
function assertRootStoreNotInitialized() {
  const rootStoreGuard = inject(ROOT_STORE_GUARD);
  if (rootStoreGuard.initialized) {
    throw new Error("provideStore() should only be called once.");
  }
  rootStoreGuard.initialized = true;
}
var SelectFactory = class _SelectFactory {
  static store = null;
  static config = null;
  constructor(store, config2) {
    _SelectFactory.store = store;
    _SelectFactory.config = config2;
    inject(DestroyRef).onDestroy(() => {
      _SelectFactory.store = null;
      _SelectFactory.config = null;
    });
  }
  /** @nocollapse */
  static ɵfac = function SelectFactory_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SelectFactory)(ɵɵinject(Store), ɵɵinject(NgxsConfig));
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _SelectFactory,
    factory: _SelectFactory.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SelectFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Store
  }, {
    type: NgxsConfig
  }], null);
})();
var LifecycleStateManager = class _LifecycleStateManager {
  _store = inject(Store);
  _internalStateOperations = inject(InternalStateOperations);
  _stateContextFactory = inject(StateContextFactory);
  _appBootstrappedState = inject(ɵNgxsAppBootstrappedState);
  _initStateHasBeenDispatched;
  ngxsBootstrap(action, results) {
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      if (action instanceof InitState) {
        this._initStateHasBeenDispatched = true;
      } else if (
        // This is a dev mode-only check that ensures the correct order of
        // state initialization. The `NgxsModule.forRoot` or `provideStore` should
        // always come first, followed by `forFeature` and `provideStates`. If the
        // `UpdateState` is dispatched before the `InitState` is dispatched, it indicates
        // that modules or providers are in an invalid order.
        action instanceof UpdateState && !this._initStateHasBeenDispatched
      ) {
        console.error(getInvalidInitializationOrderMessage(action.addedStates));
      }
    }
    this._internalStateOperations.getRootStateOperations().dispatch(action).pipe(mergeMap(() => {
      if (!results) {
        return EMPTY;
      }
      this._invokeInitOnStates(results.states);
      return this._appBootstrappedState;
    })).subscribe((appBootstrapped) => {
      if (appBootstrapped) {
        this._invokeBootstrapOnStates(results.states);
      }
    });
  }
  _invokeInitOnStates(mappedStores) {
    for (const mappedStore of mappedStores) {
      const instance = mappedStore.instance;
      if (instance.ngxsOnChanges) {
        let previousValue;
        this._store.select((state) => getValue(state, mappedStore.path)).pipe(
          // Ensure initial state is captured
          startWith(void 0),
          // `skip` is using `filter` internally.
          skip(1)
        ).subscribe((currentValue) => {
          const change = new NgxsSimpleChange(previousValue, currentValue, !mappedStore.isInitialised);
          previousValue = currentValue;
          instance.ngxsOnChanges(change);
        });
      }
      if (instance.ngxsOnInit) {
        instance.ngxsOnInit(this._getStateContext(mappedStore));
      }
      mappedStore.isInitialised = true;
    }
  }
  _invokeBootstrapOnStates(mappedStores) {
    for (const mappedStore of mappedStores) {
      const instance = mappedStore.instance;
      if (instance.ngxsAfterBootstrap) {
        instance.ngxsAfterBootstrap(this._getStateContext(mappedStore));
      }
    }
  }
  _getStateContext(mappedStore) {
    return this._stateContextFactory.createStateContext(mappedStore.path);
  }
  /** @nocollapse */
  static ɵfac = function LifecycleStateManager_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LifecycleStateManager)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _LifecycleStateManager,
    factory: _LifecycleStateManager.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LifecycleStateManager, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function rootStoreInitializer() {
  if (typeof ngDevMode !== "undefined" && ngDevMode) {
    assertRootStoreNotInitialized();
  }
  installOnUnhandhedErrorHandler();
  const prebootFns = inject(NGXS_PREBOOT_FNS, {
    optional: true
  }) || [];
  prebootFns.forEach((prebootFn) => prebootFn());
  const factory = inject(StateFactory);
  const internalStateOperations = inject(InternalStateOperations);
  inject(Store);
  inject(SelectFactory);
  const states = inject(ROOT_STATE_TOKEN, {
    optional: true
  }) || [];
  const lifecycleStateManager = inject(LifecycleStateManager);
  const results = factory.addAndReturnDefaults(states);
  internalStateOperations.setStateToTheCurrentWithNew(results);
  factory.connectActionHandlers();
  lifecycleStateManager.ngxsBootstrap(new InitState(), results);
}
function featureStatesInitializer() {
  inject(Store);
  const internalStateOperations = inject(InternalStateOperations);
  const factory = inject(StateFactory);
  const states = inject(FEATURE_STATE_TOKEN, {
    optional: true
  }) || [];
  const lifecycleStateManager = inject(LifecycleStateManager);
  const flattenedStates = states.reduce((total, values) => total.concat(values), []);
  const results = factory.addAndReturnDefaults(flattenedStates);
  if (results.states.length) {
    internalStateOperations.setStateToTheCurrentWithNew(results);
    lifecycleStateManager.ngxsBootstrap(new UpdateState(results.defaults), results);
  }
}
var NGXS_ROOT_STORE_INITIALIZER = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "NGXS_ROOT_STORE_INITIALIZER" : "");
var NGXS_FEATURE_STORE_INITIALIZER = new InjectionToken(typeof ngDevMode !== "undefined" && ngDevMode ? "NGXS_FEATURE_STORE_INITIALIZER" : "");
var NGXS_ROOT_ENVIRONMENT_INITIALIZER = [{
  provide: NGXS_ROOT_STORE_INITIALIZER,
  useFactory: rootStoreInitializer
}, provideEnvironmentInitializer(() => inject(NGXS_ROOT_STORE_INITIALIZER))];
var NGXS_FEATURE_ENVIRONMENT_INITIALIZER = [{
  provide: NGXS_FEATURE_STORE_INITIALIZER,
  useFactory: featureStatesInitializer
}, provideEnvironmentInitializer(() => inject(NGXS_FEATURE_STORE_INITIALIZER))];
var NgxsRootModule = class _NgxsRootModule {
  constructor() {
    rootStoreInitializer();
  }
  /** @nocollapse */
  static ɵfac = function NgxsRootModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsRootModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _NgxsRootModule
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsRootModule, [{
    type: NgModule
  }], () => [], null);
})();
var NgxsFeatureModule = class _NgxsFeatureModule {
  constructor() {
    featureStatesInitializer();
  }
  /** @nocollapse */
  static ɵfac = function NgxsFeatureModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsFeatureModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _NgxsFeatureModule
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsFeatureModule, [{
    type: NgModule
  }], () => [], null);
})();
function getRootProviders(states, options) {
  return [...states, {
    provide: ROOT_STATE_TOKEN,
    useValue: states
  }, {
    provide: APP_BOOTSTRAP_LISTENER,
    useFactory: () => {
      const appBootstrappedState = inject(ɵNgxsAppBootstrappedState);
      return () => appBootstrappedState.bootstrap();
    },
    multi: true
  }, {
    provide: NGXS_OPTIONS,
    useValue: options
  }];
}
function getFeatureProviders(states) {
  return [PluginManager, ...states, {
    provide: FEATURE_STATE_TOKEN,
    multi: true,
    useValue: states
  }];
}
var NgxsModule = class _NgxsModule {
  static forRoot(states = [], options = {}) {
    return {
      ngModule: NgxsRootModule,
      providers: getRootProviders(states, options)
    };
  }
  static forFeature(states = []) {
    return {
      ngModule: NgxsFeatureModule,
      providers: getFeatureProviders(states)
    };
  }
  /** @nocollapse */
  static ɵfac = function NgxsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _NgxsModule
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsModule, [{
    type: NgModule
  }], null, null);
})();
function Action(actions, options) {
  return (target, name, _descriptor) => {
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      const isStaticMethod = ɵhasOwnProperty(target, "prototype");
      if (isStaticMethod) {
        throwActionDecoratorError();
      }
    }
    const meta = ɵensureStoreMetadata(target.constructor);
    const actionArray = Array.isArray(actions) ? actions : [actions];
    for (const action of actionArray) {
      const type = action.type;
      if (!meta.actions[type]) {
        meta.actions[type] = [];
      }
      meta.actions[type].push({
        fn: name,
        options: options || {},
        type
      });
    }
  };
}
function State(options) {
  return (target) => {
    const stateClass = target;
    const inherited = Object.getPrototypeOf(stateClass);
    const meta = ɵensureStoreMetadata(stateClass);
    const mergedOptions = __spreadValues(__spreadValues({}, inherited[ɵMETA_OPTIONS_KEY] || {}), options);
    mutateMetaData(meta, inherited, mergedOptions);
    stateClass[ɵMETA_OPTIONS_KEY] = mergedOptions;
  };
}
function mutateMetaData(meta, inherited, options) {
  const {
    name,
    defaults,
    children
  } = options;
  const stateName = typeof name === "string" ? name : name?.getName?.() || null;
  if (typeof ngDevMode !== "undefined" && ngDevMode) {
    ensureStateNameIsValid(stateName);
  }
  if (ɵhasOwnProperty(inherited, ɵMETA_KEY)) {
    const inheritedMeta = inherited[ɵMETA_KEY] || {};
    meta.actions = __spreadValues(__spreadValues({}, meta.actions), inheritedMeta.actions);
  }
  meta.name = stateName;
  meta.defaults = defaults;
  meta.children = children;
}
function propGetter(paths, config2) {
  if (config2?.compatibility?.strictContentSecurityPolicy) {
    return compliantPropGetter(paths);
  } else {
    return fastPropGetter(paths);
  }
}
function throwSelectFactoryNotConnectedError() {
  throw new Error("You have forgotten to import the NGXS module!");
}
var DOLLAR_CHAR_CODE = 36;
function createSelectObservable(selector) {
  if (!SelectFactory.store) {
    throwSelectFactoryNotConnectedError();
  }
  return SelectFactory.store.select(selector);
}
function createSelectorFn(name, rawSelector, paths = []) {
  rawSelector = !rawSelector ? removeDollarAtTheEnd(name) : rawSelector;
  if (typeof rawSelector === "string") {
    const propsArray = paths.length ? [rawSelector, ...paths] : rawSelector.split(".");
    return propGetter(propsArray, SelectFactory.config);
  }
  return rawSelector;
}
function removeDollarAtTheEnd(name) {
  const lastCharIndex = name.length - 1;
  const dollarAtTheEnd = name.charCodeAt(lastCharIndex) === DOLLAR_CHAR_CODE;
  return dollarAtTheEnd ? name.slice(0, lastCharIndex) : name;
}
function Select(rawSelector, ...paths) {
  return function(target, key) {
    const name = key.toString();
    const selectorId = `__${name}__selector`;
    const selector = createSelectorFn(name, rawSelector, paths);
    Object.defineProperties(target, {
      [selectorId]: {
        writable: true,
        enumerable: false,
        configurable: true
      },
      [name]: {
        enumerable: true,
        configurable: true,
        get() {
          return this[selectorId] || (this[selectorId] = createSelectObservable(selector));
        }
      }
    });
  };
}
var SELECTOR_OPTIONS_META_KEY = "NGXS_SELECTOR_OPTIONS_META";
var selectorOptionsMetaAccessor = {
  getOptions: (target) => {
    return target?.[SELECTOR_OPTIONS_META_KEY] || {};
  },
  defineOptions: (target, options) => {
    if (!target) return;
    target[SELECTOR_OPTIONS_META_KEY] = options;
  }
};
function setupSelectorMetadata(originalFn, creationMetadata) {
  const selectorMetaData = ɵensureSelectorMetadata(originalFn);
  selectorMetaData.originalFn = originalFn;
  let getExplicitSelectorOptions = () => ({});
  if (creationMetadata) {
    selectorMetaData.containerClass = creationMetadata.containerClass;
    selectorMetaData.selectorName = creationMetadata.selectorName || null;
    getExplicitSelectorOptions = creationMetadata.getSelectorOptions || getExplicitSelectorOptions;
  }
  const selectorMetaDataClone = __spreadValues({}, selectorMetaData);
  selectorMetaData.getSelectorOptions = () => getLocalSelectorOptions(selectorMetaDataClone, getExplicitSelectorOptions());
  return selectorMetaData;
}
function getLocalSelectorOptions(selectorMetaData, explicitOptions) {
  return __spreadValues(__spreadValues(__spreadValues(__spreadValues({}, selectorOptionsMetaAccessor.getOptions(selectorMetaData.containerClass) || {}), selectorOptionsMetaAccessor.getOptions(selectorMetaData.originalFn) || {}), selectorMetaData.getSelectorOptions() || {}), explicitOptions);
}
function SelectorOptions(options) {
  return function decorate(target, methodName, descriptor) {
    if (methodName) {
      descriptor ||= Object.getOwnPropertyDescriptor(target, methodName);
      const originalFn = descriptor.value || descriptor.originalFn;
      if (originalFn) {
        selectorOptionsMetaAccessor.defineOptions(originalFn, options);
      }
    } else {
      selectorOptionsMetaAccessor.defineOptions(target, options);
    }
  };
}
function createSelector(selectors, projector, creationMetadata) {
  const memoizedFn = createMemoizedSelectorFn(projector, creationMetadata);
  const selectorMetaData = setupSelectorMetadata(projector, creationMetadata);
  selectorMetaData.makeRootSelector = createRootSelectorFactory(selectorMetaData, selectors, memoizedFn);
  return memoizedFn;
}
function Selector(selectors) {
  return (target, key, descriptor) => {
    descriptor ||= Object.getOwnPropertyDescriptor(target, key);
    const originalFn = descriptor?.value;
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      if (typeof originalFn !== "function") {
        throwSelectorDecoratorError();
      }
    }
    const memoizedFn = createSelector(selectors, originalFn, {
      containerClass: target,
      selectorName: key.toString(),
      getSelectorOptions() {
        return {};
      }
    });
    const newDescriptor = {
      configurable: true,
      get() {
        return memoizedFn;
      },
      originalFn
    };
    return newDescriptor;
  };
}
var ActionDirector = class _ActionDirector {
  _registry = inject(ɵNgxsActionRegistry);
  _actionHandlerFactory = inject(InternalActionHandlerFactory);
  attachAction(stateToken, Action2, handlerFn, options = {}) {
    const actionHandler = this._actionHandlerFactory.createActionHandler(stateToken.getName(), handlerFn, options);
    const detach = this._registry.register(Action2.type, actionHandler);
    return {
      detach
    };
  }
  /** @nocollapse */
  static ɵfac = function ActionDirector_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ActionDirector)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _ActionDirector,
    factory: _ActionDirector.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ActionDirector, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var NgxsDevelopmentModule = class _NgxsDevelopmentModule {
  static forRoot(options) {
    return {
      ngModule: _NgxsDevelopmentModule,
      providers: [NgxsUnhandledActionsLogger, {
        provide: NGXS_DEVELOPMENT_OPTIONS,
        useValue: options
      }]
    };
  }
  /** @nocollapse */
  static ɵfac = function NgxsDevelopmentModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NgxsDevelopmentModule)();
  };
  /** @nocollapse */
  static ɵmod = ɵɵdefineNgModule({
    type: _NgxsDevelopmentModule
  });
  /** @nocollapse */
  static ɵinj = ɵɵdefineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NgxsDevelopmentModule, [{
    type: NgModule
  }], null, null);
})();
function withNgxsDevelopmentOptions(options) {
  return makeEnvironmentProviders([NgxsUnhandledActionsLogger, {
    provide: NGXS_DEVELOPMENT_OPTIONS,
    useValue: options
  }]);
}
var NoopNgxsExecutionStrategy = class _NoopNgxsExecutionStrategy {
  enter(func) {
    return func();
  }
  leave(func) {
    return func();
  }
  /** @nocollapse */
  static ɵfac = function NoopNgxsExecutionStrategy_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _NoopNgxsExecutionStrategy)();
  };
  /** @nocollapse */
  static ɵprov = ɵɵdefineInjectable({
    token: _NoopNgxsExecutionStrategy,
    factory: _NoopNgxsExecutionStrategy.ɵfac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NoopNgxsExecutionStrategy, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
function withNgxsNoopExecutionStrategy() {
  return makeEnvironmentProviders([{
    provide: InternalNgxsExecutionStrategy,
    useExisting: NoopNgxsExecutionStrategy
  }]);
}
function getMissingMetaDataError(selector, context = {}) {
  const metadata = ɵgetSelectorMetadata(selector) || ɵgetStoreMetadata(selector);
  if (!metadata) {
    return new Error(`${context.prefix}The value provided as the ${context.noun} is not a valid selector.`);
  }
  return null;
}
function ensureValidSelector(selector, context = {}) {
  const noun = context.noun || "selector";
  const prefix = context.prefix ? context.prefix + ": " : "";
  ensureValueProvided(selector, {
    noun,
    prefix: context.prefix
  });
  const error = getMissingMetaDataError(selector, {
    noun,
    prefix
  });
  if (error) {
    if (!NgZone.isInAngularZone()) {
      Promise.resolve().then(() => {
        const errorAgain = getMissingMetaDataError(selector, {
          noun,
          prefix
        });
        if (errorAgain) {
          console.error(error);
        }
      });
    } else {
      throw error;
    }
  }
}
function ensureValueProvided(value, context = {}) {
  const noun = context.noun || "value";
  const prefix = context.prefix ? context.prefix + ": " : "";
  if (!value) {
    throw new Error(`${prefix}A ${noun} must be provided.`);
  }
}
function createModelSelector(selectorMap) {
  const selectorKeys = Object.keys(selectorMap);
  const selectors = Object.values(selectorMap);
  if (typeof ngDevMode !== "undefined" && ngDevMode) {
    ensureValidSelectorMap({
      prefix: "[createModelSelector]",
      selectorMap,
      selectorKeys,
      selectors
    });
  }
  return createSelector(selectors, (...args) => {
    return selectorKeys.reduce((obj, key, index) => {
      obj[key] = args[index];
      return obj;
    }, {});
  });
}
function ensureValidSelectorMap({
  prefix,
  selectorMap,
  selectorKeys,
  selectors
}) {
  ensureValueProvided(selectorMap, {
    prefix,
    noun: "selector map"
  });
  ensureValueProvided(typeof selectorMap === "object", {
    prefix,
    noun: "valid selector map"
  });
  ensureValueProvided(selectorKeys.length, {
    prefix,
    noun: "non-empty selector map"
  });
  selectors.forEach((selector, index) => ensureValidSelector(selector, {
    prefix,
    noun: `selector for the '${selectorKeys[index]}' property`
  }));
}
function createPickSelector(selector, keys) {
  if (typeof ngDevMode !== "undefined" && ngDevMode) {
    ensureValidSelector(selector, {
      prefix: "[createPickSelector]"
    });
  }
  const validKeys = keys.filter(Boolean);
  const selectors = validKeys.map((key) => createSelector([selector], (s) => s[key]));
  return createSelector([...selectors], (...props) => {
    return validKeys.reduce((acc, key, index) => {
      acc[key] = props[index];
      return acc;
    }, {});
  });
}
function createPropertySelectors(parentSelector) {
  if (typeof ngDevMode !== "undefined" && ngDevMode) {
    ensureValidSelector(parentSelector, {
      prefix: "[createPropertySelectors]",
      noun: "parent selector"
    });
  }
  const cache = {};
  return new Proxy({}, {
    get(_target, prop) {
      const selector = cache[prop] || createSelector([parentSelector], (s) => s?.[prop]);
      cache[prop] = selector;
      return selector;
    }
  });
}
function withNgxsPendingTasks() {
  return withNgxsPreboot(() => {
    const actions$ = inject(Actions);
    const appRef = inject(ApplicationRef);
    const pendingTasks = inject(PendingTasks);
    let removeTask = null;
    const executedActions = /* @__PURE__ */ new Set();
    appRef.onDestroy(() => executedActions.clear());
    let isStable = false;
    appRef.whenStable().then(() => {
      isStable = true;
    });
    const subscription = actions$.pipe(
      filter((context) => {
        if (context.status === ActionStatus.Dispatched) {
          executedActions.add(context.action);
          removeTask ||= pendingTasks.add();
          return false;
        } else {
          return true;
        }
      }),
      // Every time an action is completed, we debounce the stream to ensure only one
      // task is removed, even if multiple synchronous actions are completed in a row.
      // We use `buffer` to collect action contexts because, if we only use
      // `debounceTime(0)`, we may lose action contexts that are never removed from the set.
      buffer(actions$.pipe(debounceTime(0)))
    ).subscribe((contexts) => {
      for (const context of contexts) {
        if (!executedActions.has(context.action)) {
          continue;
        }
        executedActions.delete(context.action);
        if (executedActions.size === 0) {
          removeTask?.();
          removeTask = null;
          if (isStable) {
            subscription.unsubscribe();
          }
        }
      }
    });
  });
}
function provideStore(states = [], ...optionsAndFeatures) {
  const features = [];
  let options = {};
  if (optionsAndFeatures.length > 0) {
    if (isEnvironmentProvider(optionsAndFeatures[0])) {
      features.push(...optionsAndFeatures);
    } else {
      options = optionsAndFeatures[0];
      features.push(...optionsAndFeatures.slice(1));
    }
  }
  return makeEnvironmentProviders([...getRootProviders(states, options), NGXS_ROOT_ENVIRONMENT_INITIALIZER, features]);
}
function isEnvironmentProvider(target) {
  return !!target.ɵproviders;
}
function provideStates(states, ...features) {
  return makeEnvironmentProviders([...getFeatureProviders(states), features, NGXS_FEATURE_ENVIRONMENT_INITIALIZER]);
}
function withNgxsPlugin(plugin) {
  return makeEnvironmentProviders([
    ɵisPluginClass(plugin) ? {
      provide: NGXS_PLUGINS,
      useClass: plugin,
      multi: true
    } : {
      provide: NGXS_PLUGINS,
      useValue: plugin,
      multi: true
    },
    // We should inject the `PluginManager` to retrieve `NGXS_PLUGINS` and
    // register those plugins. The plugin can be added from inside the child
    // route, so the plugin manager should be re-injected.
    provideEnvironmentInitializer(() => inject(PluginManager))
  ]);
}
function select(selector) {
  return inject(Store).selectSignal(selector);
}
function dispatch(ActionType) {
  const store = inject(Store);
  return (...args) => store.dispatch(new ActionType(...args));
}
function createSelectMap(selectorMap) {
  const store = inject(Store);
  return Object.entries(selectorMap).reduce((accumulator, [key, selector]) => {
    accumulator[key] = store.selectSignal(selector);
    return accumulator;
  }, {});
}
function createDispatchMap(actionMap) {
  return Object.entries(actionMap).reduce((accumulator, [key, ActionType]) => {
    accumulator[key] = dispatch(ActionType);
    return accumulator;
  }, {});
}
function isWrappedDefaultExport(value) {
  return value && typeof value === "object" && "default" in value;
}
function maybeUnwrapDefaultExport(input) {
  return isWrappedDefaultExport(input) ? input["default"] : input;
}
var REGISTERED_PROVIDERS = new InjectionToken("", {
  providedIn: "root",
  factory: () => {
    const registeredProviders = /* @__PURE__ */ new Set();
    inject(ApplicationRef).onDestroy(() => registeredProviders.clear());
    return registeredProviders;
  }
});
function lazyProvider(factory) {
  return () => __async(null, null, function* () {
    if (typeof ngDevMode !== "undefined" && ngDevMode) {
      assertInInjectionContext(lazyProvider);
    }
    const appRef = inject(ApplicationRef);
    const parentInjector = inject(EnvironmentInjector);
    const registeredProviders = inject(REGISTERED_PROVIDERS);
    const provider = maybeUnwrapDefaultExport(yield factory());
    if (registeredProviders.has(provider)) {
      return true;
    }
    registeredProviders.add(provider);
    const injector = createEnvironmentInjector([provider], parentInjector);
    appRef.onDestroy(() => injector.destroy());
    return true;
  });
}
function ɵprovideNgxsInternalStateTokens() {
  return makeEnvironmentProviders([{
    provide: ɵNGXS_STATE_CONTEXT_FACTORY,
    useExisting: StateContextFactory
  }, {
    provide: ɵNGXS_STATE_FACTORY,
    useExisting: StateFactory
  }]);
}
export {
  Action,
  ActionDirector,
  ActionStatus,
  Actions,
  InitState,
  NGXS_PLUGINS,
  NgxsConfig,
  NgxsDevelopmentModule,
  NgxsModule,
  NgxsSimpleChange,
  NgxsUnhandledActionsLogger,
  NgxsUnhandledErrorHandler,
  Select,
  Selector,
  SelectorOptions,
  State,
  StateToken,
  Store,
  UpdateState,
  actionMatcher,
  createDispatchMap,
  createModelSelector,
  createPickSelector,
  createPropertySelectors,
  createSelectMap,
  createSelector,
  dispatch,
  getActionTypeFromInstance,
  getValue,
  lazyProvider,
  ofAction,
  ofActionCanceled,
  ofActionCompleted,
  ofActionDispatched,
  ofActionErrored,
  ofActionSuccessful,
  provideStates,
  provideStore,
  select,
  setValue,
  withNgxsDevelopmentOptions,
  withNgxsNoopExecutionStrategy,
  withNgxsPendingTasks,
  withNgxsPlugin,
  withNgxsPreboot,
  NgxsFeatureModule as ɵNgxsFeatureModule,
  NgxsRootModule as ɵNgxsRootModule,
  ɵprovideNgxsInternalStateTokens
};
/*! Bundled license information:

@angular/core/fesm2022/rxjs-interop.mjs:
  (**
   * @license Angular v20.3.10
   * (c) 2010-2025 Google LLC. https://angular.dev/
   * License: MIT
   *)
*/
//# sourceMappingURL=@ngxs_store.js.map
