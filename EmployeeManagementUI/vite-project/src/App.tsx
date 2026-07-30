import {BrowserRouter,Routes,Route} from "react-router-dom"
import EmployeeList from "./Components/EmployeeList";
import Home from "./pages/Home";
import Employees from "./pages/Employees";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route
      path="/"
      element={<Home/>}
      />
      <Route
      path="/employees"
      element={<Employees/>}
      />
    </Routes>
    </BrowserRouter>
  );
}

export default App;