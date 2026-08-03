import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./components/layout/Nav";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import * as Layout from "./components/layout/AppLayout.js";
import AddStation from "./pages/station/AddStation";
import StationList from "./pages/station/StationList";
import AddRoute from "./pages/routes/AddRoute";
import RouteList from "./pages/routes/RouteList";
import AddTrain from "./pages/trains/AddTrain";
import TrainList from "./pages/trains/TrainList";
import BookSeat from "./pages/BookSeat/BookSeat";
import BookingList from "./pages/BookingList/BookingList";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";



function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<BookSeat />} />

        <Route
          path="/*"
          element={
            <Layout.LayoutWrapper>
              <Layout.SidebarColumn>
                <Nav />
              </Layout.SidebarColumn>

              <Layout.ContentColumn>
                <Routes>
                  <Route path="admin/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>}
                  />

                  <Route path="admin/stations" element={<ProtectedRoute> <StationList /> </ProtectedRoute>} />
                  <Route path="admin/station/add_station" element={<ProtectedRoute> <AddStation /> </ProtectedRoute>} />

                  <Route path="admin/routes" element={<ProtectedRoute> <RouteList /> </ProtectedRoute>} />
                  <Route path="admin/route/add_route" element={<ProtectedRoute> <AddRoute /> </ProtectedRoute>} />
                  <Route path="admin/route/edit_route/:routeId" element={<ProtectedRoute> <AddRoute /> </ProtectedRoute>} />

                  <Route path="admin/trains" element={<ProtectedRoute> <TrainList /> </ProtectedRoute>} />
                  <Route path="admin/train/add_train" element={<ProtectedRoute> <AddTrain /> </ProtectedRoute>} />
                  <Route path="admin/train/edit_train/:trainId" element={<ProtectedRoute> <AddTrain /> </ProtectedRoute>} />

                  <Route path="admin/bookings" element={<ProtectedRoute> <BookingList /> </ProtectedRoute>} />
                </Routes>
              </Layout.ContentColumn>
            </Layout.LayoutWrapper>
          }
        />

      </Routes>
    </BrowserRouter>
  );

}


export default App;