import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/layout/Nav";
import AddStation from "./pages/station/AddStation";
import StationList from "./pages/station/StationList";
import AddRoute from "./pages/routes/AddRoute";
import RouteList from "./pages/routes/RouteList";
import AddTrain from "./pages/trains/AddTrain";
import TrainList from "./pages/trains/TrainList";
import BookSeat from "./pages/BookSeat/BookSeat";

function App() {

  return (

    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/stations" element={<StationList />} />
        <Route path="/station/add_station" element={<AddStation />} />

        <Route path="/routes" element={<RouteList />} />
        <Route path="/route/add_route" element={<AddRoute />} />
        <Route path="/route/edit_route/:routeId" element={<AddRoute />} />

        <Route path="/trains" element={<TrainList />} />
        <Route path="/train/add_train" element={<AddTrain />} />
        <Route path="/train/edit_train/:trainId" element={<AddTrain />} />

        <Route path="/book_seat" element={<BookSeat />} />

      </Routes>
    </BrowserRouter>

  );

}


export default App;