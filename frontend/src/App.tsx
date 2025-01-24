import { BrowserRouter as Router } from "react-router-dom";
import IndexRoutes from "./routes/IndexRoutes";

const App = () => {
  return (
    <Router>
      <IndexRoutes />
    </Router>
  );
};

export default App;
