import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const App = (): React.ReactElement => {
  return (
    <div>
      <Header />
      <h1>Hello App</h1>
      <Footer />
    </div>
  );
};

export default App;
