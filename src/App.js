import React from 'react';
import Store from './stores/Store';

// var unsub = Store.subscribe(function () {
//   console.log('STATE UPDATED', Store.getState());
// })

console.log('state:before', Store.getState());
Store.dispatch({ type: 'INCREMENT' });
Store.dispatch({ type: 'INCREMENT' });
Store.dispatch({ type: 'INCREMENT' });
Store.dispatch({ type: 'INCREMENT' });
Store.dispatch({ type: 'EAT_ORANGE' });
Store.dispatch({ type: 'EAT_ORANGE' });
console.log('state:after', Store.getState());

// unsub();
Store.dispatch({ type: 'INCREMENT' });

function App() {
  return (
    <div className="App">
      {/* {console.log('state', Store.getState())} */}
    </div>
  );
}

export default App;
