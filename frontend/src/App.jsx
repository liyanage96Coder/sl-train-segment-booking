import { BrowserRouter, Routes, Route } from "react-router-dom";

import AddStation from "./pages/station/AddStation";
import StationList from "./pages/station/StationList";
import AddRoute from "./pages/routes/AddRoute";
import RouteList from "./pages/routes/RouteList";

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/station" element={<StationList />} />
        <Route path="/station/add_station" element={<AddStation />} />

        <Route path="/route" element={<RouteList />} />
        <Route path="/route/add_route" element={<AddRoute />} />
      </Routes>
    </BrowserRouter>

  );

}


export default App;