import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import canvasReducer from "./slice/canava";
import Proctor from "./components/Proctor";
import ChatButton from "./components/ChatButton";
import "./App.css";

const store = configureStore({
  reducer: {
    canvas: canvasReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable checks
    }),
});
function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Proctor />
        <ChatButton />
      </div>
    </Provider>
  );
}

export default App;
