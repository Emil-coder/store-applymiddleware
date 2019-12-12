var defaultAppleState = 0;
var defaultOrangeState = 10;

function appleReducer(state = defaultAppleState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    default: return state;
  }
}

function orangeReducer(state = defaultOrangeState, action) {
  switch (action.type) {
    case 'EAT_ORANGE':
      return state - 1;
    default: return state;
  }
}

var rootReducer = combineReducers({
  apple: appleReducer,
  orange: orangeReducer
})

var Store = createStore(
  rootReducer,
  applyMiddleware(logger)
);

function combineReducers(stateTree) {
  var keys = Object.keys(stateTree);

  return function rootReducer(state = {}, action) {
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var reducer = stateTree[key];
      var subState = state[key];

      state[key] = reducer(subState, action);
    }

    return state;
  }
}

function createStore(reducer, enhancer) {

  if (typeof enhancer === "function") {
    return enhancer(createStore)(reducer);
  }

  var state;
  var subscriptions = [];

  var obj = {
    getState: function () {
      return state;
    },
    dispatch: function (action) {
      state = reducer(state, action);
      subscriptions.forEach(function (fn) {
        fn();
      })

      return action;
    },
    subscribe: function (fn) {
      subscriptions.push(fn);

      return function unsubscribe() {
        var index = subscriptions.indexOf(fn);
        subscriptions.splice(index, 1);
      }
    }
  }

  obj.dispatch({ type: 'REDUX_INIT' });
  return obj;
}

function logger(store) {

  var getState = store.getState;

  return function (next) {
    return function (action) {
      console.log('Will dispatch', action);

      // Call the next dispatch method in the middleware chain.
      var returnValue = next(action);

      console.log('state updated', getState());
      // This will most likely be the action itself, unless middleware
      // further in chain, changed it.
      return returnValue;

    }

  }
}

function applyMiddleware(...fns) {

  return function (createStore) {
    return function (reducer) {

      var store = createStore(reducer);
      var oldDispatch = store.dispatch;

      // Modify dispatch
      store.dispatch = fns.reduceRight(function (prev, curr) {
        return curr(store)(prev); // i.e dispatch = logger(store)(oldDispatch)
      }, oldDispatch)

      return store;
    }
  }
}

export default Store;