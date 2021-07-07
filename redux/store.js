import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from "redux-devtools-extension";
import { rootReducer } from "./reducers/root-reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";



const initialState = {}
const middleware = [thunk]

// const store = createStore(rootReducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);



export const store = createStore(
  persistedReducer,initialState,composeWithDevTools(applyMiddleware(...middleware)));

export const persistor = persistStore(store);

export default store;



//
// const persistConfig = {
//   key: "root",
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, rootReducer);



// export const store = createStore(
//   persistedReducer,
//   typeof window !== "undefined" &&
//     window.__REDUX_DEVTOOLS_EXTENSION__ &&
//     window.__REDUX_DEVTOOLS_EXTENSION__()
// );

// export const persistor = persistStore(store);

// export default store;


