import Layout from "../components/Layout";
import '../styles/globals.css'
import { Provider } from "react-redux";
import store from "../redux/store";
import { persistor } from "../redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { createWrapper } from "next-redux-wrapper";



function MyApp({ Component, pageProps }) {
  return <>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

        <Layout>
         
          <Component {...pageProps} />
        </Layout>

      </PersistGate>
    </Provider>
  </>
}

const makestore = () => store;
const wrapper = createWrapper(makestore);
export default wrapper.withRedux(MyApp);

