# Colombo Fort–Badulla Segment-Based Seat Booking System

A booking system for Sri Lanka's Colombo Fort–Badulla scenic line that lets a single
reserved seat be sold independently across multiple non-overlapping legs of the same
journey — a seat vacated at Kandy can be resold for the Kandy → Badulla leg instead of
sitting empty for the rest of the trip, with each passenger charged only for the
distance they actually travel.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Core Design Decisions](#core-design-decisions)
- [Concurrency Handling](#concurrency-handling)
- [Fare Calculation](#fare-calculation)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [Extra Credit Features](#extra-credit-features)
- [Challenges & Tradeoffs](#challenges--tradeoffs)
- [What I'd Do With More Time](#what-id-do-with-more-time)

## Overview

Sri Lanka Railways currently sells reserved seats for a whole journey at a time — if a
passenger disembarks partway, that seat sits empty (and unsellable) for the rest of the
route, while fares are inflated to cover that wasted capacity. This system fixes that:
a seat is modeled as a set of independently bookable *segments* along a train's route,
so two different passengers can hold the same physical seat for two different,
non-overlapping legs of the same trip, each paying only for the distance they travel.

The system also generalizes the domain so it isn't hardcoded to one line: stations,
routes (ordered station sequences with real distances), trains (with configurable
coaches, seat counts, and per-km fare rates), and trips (a specific train running on a
specific date) are all manageable through an admin UI, not fixture data.

## Tech Stack

- **Backend:** Laravel 11, MySQL 8
- **Frontend:** React (Vite), styled-components, react-router-dom, recharts, lucide-react
- **Infra:** Docker Compose (db, backend, frontend services)

## Architecture

### Data Model

| Table | Purpose |
|---|---|
| `stations` | Master list of all stations, with a global `station_order` for admin management |
| `routes` | A named sequence of stations a train can run along |
| `route_station` | Pivot: per-route `stop_order` and cumulative `distance_km` for each station on that route |
| `trains` | A named train tied to one route |
| `train_coaches` | A train's coaches, each with `seat_count`, `price_local_per_km`, `price_foreign_per_km` |
| `train_station` | Pivot: which of the route's stations a given train actually stops at |
| `seats` | Individual, addressable seats within a coach |
| `trips` | A specific train running on a specific calendar date — seat availability is scoped per trip |
| `bookings` | One row per booking transaction (may cover multiple seats/passengers) |
| `booking_seats` | One row per seat within a booking — this **is** the segment-occupancy record |

Stations, coaches, seats, and route length are all admin-configurable through the UI —
nothing about the number of coaches, seats per coach, or stations on the line is
hardcoded, so the department can extend the route or add rolling stock without a code
change.

## Core Design Decisions

### 1. Representing segment occupancy

Each station carries a `stop_order` (position) and a cumulative `distance_km` *per
route* (not globally — the same station can sit at different positions on different
routes). A booking records only `from_station_id` / `to_station_id`; it does **not**
store a snapshot of stop order or distance at booking time.

**Why not denormalize the order onto the booking?** It's tempting — it would turn every
overlap check into a plain integer comparison with no joins. But it's a correctness
trap: if an admin ever edits a route's station order after bookings already exist
against it, old bookings would carry stale order numbers while new bookings resolve
against current ones, and two segments could silently become incomparable or produce
wrong overlap results. Instead, station order/distance is always resolved **live**
from `route_station` at comparison time, for every booking being compared — old and
new alike — so they're always evaluated against the same snapshot of route data.

Overlap detection uses a standard half-open interval comparison:
```
[existingFrom, existingTo) overlaps [requestedFrom, requestedTo)
    iff existingFrom < requestedTo AND requestedFrom < existingTo
```
This is what correctly allows Colombo Fort→Kandy and Kandy→Badulla to be booked on the
same seat without conflict — they share a boundary station but no actual travelled
distance.

### 2. Fare = per-km rate × actual distance travelled

Each coach stores `price_local_per_km` / `price_foreign_per_km`, and each route stores
real cumulative distance (km) per station. Fare for a leg is:
```
fare = rate_per_km × |distance(to_station) − distance(from_station)|
```
**Alternatives considered:**
- *Flat price per coach, whole journey* — rejected outright: it can't express that a
  Colombo→Kandy passenger should pay less than a Colombo→Badulla passenger on the same
  seat, which is the entire premise of the assignment.
- *Hop-count pricing* (rate × number of stations skipped, ignoring real distance) —
  considered as a faster-to-build fallback, since it avoids needing real distance data.
  Rejected in favor of real distance because two adjacent stations can be wildly
  different distances apart on this specific line, and hop-count pricing would silently
  reproduce a version of the same unfairness the brief is asking to fix.

### 3. Route/train modeling is separate from booking

Routes own *station order and distance*. Trains reference a route and additionally
record *which of that route's stations they actually stop at* (a train doesn't have to
stop everywhere the route passes). This split means the same route can be reused by
multiple trains with different stopping patterns, and a station's position/distance is
defined once per route rather than duplicated per train.

## Concurrency Handling

The critical correctness requirement: two people booking overlapping or adjacent legs
of the *same seat* at the *same time* must not both succeed.

**Read path (seat map) is intentionally unlocked.** `GET /trains/{train}/seat-map`
checks availability without taking any row locks — it's a best-effort preview, the same
as an airline's seat picker. Locking rows just to *display* them would serialize every
concurrent user's page load for no correctness benefit, since nobody is writing
anything at that point.

**Write path (booking) is where correctness is enforced.** `BookingService::createBooking()`
runs inside a single DB transaction:
1. For each requested seat, it issues `SELECT ... FOR UPDATE` on that seat's existing
   `booking_seats` rows for the trip before checking overlap.
2. If any requested seat is found to overlap an existing booking, the **entire**
   transaction throws and rolls back — a multi-seat group booking is all-or-nothing,
   since silently confirming some seats and dropping others would be a confusing and
   unfair outcome for the passenger.
3. On conflict, the API returns **HTTP 409** (not 422), so the frontend can distinguish
   "you lost a race" from "your input was invalid" and react accordingly — refreshing
   the seat map and clearing the stale selection rather than just showing a form error.

**Deadlock avoidance:** when a booking touches multiple seats, they're locked in a
consistent ascending `seat_id` order — globally, across every concurrent request, not
just within one. Two group bookings contending for overlapping sets of seats therefore
queue on each other instead of deadlocking.

**Why pessimistic locking instead of a DB constraint?** MySQL has no native exclusion
constraint for range types (unlike Postgres), so there's no way to let the database
itself reject an overlapping insert declaratively. Pessimistic locking inside an
explicit transaction was the most direct way to guarantee correctness given that
constraint, at the cost of the two lines of extra bookkeeping (lock ordering) needed to
avoid deadlocks.

**Verifying it:** open the same train/date/leg in two browser tabs, select the same
seat in both, and click Confirm in both within a second of each other. One booking
succeeds; the other receives a 409 and its seat map refreshes to show that seat as
taken.

## Fare Calculation

See Core Design Decision #2 above. `FareCalculatorService` is a small,
dependency-injected, unit-testable service — not a static helper — specifically so it
can be tested against different coach/route fixtures independent of the booking
transaction.

## Getting Started

### Prerequisites
- Docker Desktop (Windows: WSL2 backend enabled)

### Run it

```bash
git clone <repo-url>
cd sl-train-segment-booking
docker compose up --build
```

No manual `.env` setup is required for local development — `docker-compose.yml` ships
with working defaults for the database. Migrations and seeders run automatically on
backend container startup.

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api

### Recommended path to see it working end-to-end

1. `/stations` -> add a handful of real stations
2. `/routes` -> build a route: tick stations, set stop order, set real cumulative
   distance (km) per station
3. `/trains` -> add a train on that route, with one or more coaches (seat count + local
   and foreign per-km rates)
4. `/book_seat` -> pick route -> from/to -> date -> train -> click seats on the seat map
   -> confirm
5. `/train-schedule` -> view all bookings for that train/date as a station-by-seat grid
6. `/dashboard` -> revenue, occupancy, and passenger-mix analytics across all bookings

### Running tests

```bash
docker compose exec backend php artisan test
```

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/stations` | List / create stations |
| POST | `/api/stations/insert-between` | Insert a station at a specific position |
| PUT/DELETE | `/api/stations/{station}` | Edit / remove a station |
| GET/POST | `/api/routes` | List / create routes with stations, order, distance |
| GET/PUT/DELETE | `/api/routes/{route}` | View / update / delete a route |
| GET/POST | `/api/trains` | List / create trains with coaches and stops |
| DELETE | `/api/trains/{train}` | Delete a train |
| GET | `/api/trains/for-leg` | Trains that stop at both a given origin and destination |
| GET | `/api/trains/{train}/seat-map` | Per-coach fares + per-seat availability for a leg/date |
| GET | `/api/trains/{train}/schedule` | Full station x seat booking grid for a train/date |
| GET | `/api/trains/{train}/booked-dates` | Distinct dates a train has any booking on |
| POST | `/api/bookings` | Create a booking (one or more seats, atomic) |
| GET | `/api/bookings` | List all bookings |
| DELETE | `/api/bookings/{booking}` | Cancel a booking |
| GET | `/api/dashboard` | Aggregated revenue/occupancy/passenger-mix stats |

## Extra Credit Features

### Seat map visualization
**Problem:** passengers need to see which specific seats are free for their leg, not
just "N seats available."
**Solution:** a coach-by-coach grid, color-coded blue (available) / red (unavailable
for the requested leg) / indigo or green (currently selected, local or foreign),
generated per coach from live availability data.
**Design notes:** seat state is computed per-request against the requested leg, not
cached -- a seat that's free for Colombo->Kandy but taken for Kandy->Badulla correctly
shows as available when that leg is selected.

### Admin dashboard
**Problem:** the department wants visibility into occupancy and revenue, not just a
booking form.
**Solution:** a dashboard aggregating total revenue, total bookings, seats booked,
upcoming trips, a 14-day revenue trend, local/foreign passenger split, top routes by
revenue, and per-train occupancy -- all from a single aggregation endpoint.
**Design notes:** occupancy is computed as booked-seats-ever vs total seats per train
(not scoped to a single date) -- worth narrowing to a specific date range if the
department wants a "today's occupancy" view specifically.

### Clearer handling of booking conflicts
**Problem:** the brief specifically calls out wanting clear conflict handling, not a
generic error.
**Solution:** conflicts return HTTP 409 with a specific message identifying which seat
was lost; the frontend distinguishes this from validation errors, clears the stale
selection, and automatically refreshes the seat map so the user sees current reality
rather than retrying blind.

### Train schedule visualization (beyond the suggested list)
**Problem:** admins need to see a train's full booking picture across all seats and
station segments, not just one leg at a time.
**Solution:** a calendar (with booked dates highlighted) plus a station x seat grid per
train/date, where each booking renders as a block spanning the stations it covers --
clicking a block shows passenger/fare details with a delete action.

## Challenges & Tradeoffs

- **Windows/WSL2 Docker build failures** (`exec format error` on `npm install`) were
  resolved by explicitly pinning `--platform=linux/amd64` in the frontend Dockerfile
  and compose service, plus clearing stale build cache -- this turned out to be a
  wrong-architecture image layer rather than a Dockerfile logic issue.
- **Route ordering bugs in `routes/api.php`**: a duplicate `Route::prefix('trains')`
  group registered before the explicit `/trains/for-leg` route caused Laravel to match
  `for-leg` as a `{train}` wildcard parameter. Fixed by removing the redundant group and
  keeping specific paths registered before wildcard routes.
- **Real-distance vs hop-count fare pricing** was a deliberate scope decision made
  partway through the build (see Core Design Decision #2) -- chose accuracy over speed
  of implementation given the brief's explicit framing around fare fairness.
- **Seat-map staleness**: since the seat map is intentionally unlocked for reads, a
  browser tab left open indefinitely won't reflect another user's booking until it's
  refreshed or a confirm attempt is made (which will still correctly fail with a 409).
  This is a UX staleness gap, not a correctness gap -- real-time updates would need
  polling or WebSocket broadcasting, which wasn't implemented (see below).

## What I'd Do With More Time

- Real-time seat map updates via polling or Laravel Reverb/WebSocket broadcasting, so a
  seat goes red for other viewers the moment it's booked, not just on next fetch.
- Waitlisting for fully booked segments.
- Edit forms for routes/trains (currently create + delete only; editing an existing
  route's stations mid-flight also needs a policy decision about what happens to
  bookings already made against the old station order).
- Scoping the dashboard's occupancy metric to a specific date/date range rather than
  all-time.
- A `passenger_type` fare preview directly on each seat in the seat map (currently
  shown per-coach, requiring the passenger to cross-reference).


- The seeded admin account uses a hardcoded demo password for reviewer
  convenience. In a real deployment this would be replaced with a proper
  registration/invite flow and the password would never be committed.