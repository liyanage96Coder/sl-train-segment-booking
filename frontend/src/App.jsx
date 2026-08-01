import { BrowserRouter, Routes, Route } from "react-router-dom";

import AddStation from "./pages/station/AddStation";
import StationList from "./pages/station/StationList";

function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/station" element={<StationList />} />
        <Route path="/station/add_station" element={<AddStation />} />
      </Routes>
    </BrowserRouter>

  );

}


export default App;