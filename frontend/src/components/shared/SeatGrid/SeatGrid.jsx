import * as S from "./styles.js";

/**
 * Renders one coach's seats. Selection state and click handling live in
 * the parent (BookSeat) so the local/foreign tagging logic — which
 * depends on the GLOBAL order seats were clicked across every coach —
 * stays in one place.
 */
export default function SeatGrid({ coach, selectedSeatIds, seatTypeFor, onSeatClick }) {
    return (
        <S.CoachBlock>
            <S.CoachHeader>
                <S.CoachTitle>Coach {coach.coach_number}</S.CoachTitle>
                <S.CoachFares>
                    Local: LKR {Number(coach.fare_local).toFixed(2)} · Foreign: USD{" "}
                    {Number(coach.fare_foreign).toFixed(2)}
                </S.CoachFares>
            </S.CoachHeader>

            <S.SeatGridWrapper>
                {coach.seats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    let state = "available";

                    if (!seat.available) {
                        state = "unavailable";
                    } else if (isSelected) {
                        state = seatTypeFor(seat.id) === "foreign" ? "selected-foreign" : "selected-local";
                    }

                    return (
                        <S.SeatButton
                            key={seat.id}
                            type="button"
                            $state={state}
                            disabled={!seat.available}
                            onClick={() => onSeatClick(seat.id)}
                            title={
                                seat.available
                                    ? `Seat ${seat.seat_number}`
                                    : `Seat ${seat.seat_number} — not available for this leg`
                            }
                        >
                            {seat.seat_number}
                        </S.SeatButton>
                    );
                })}
            </S.SeatGridWrapper>
        </S.CoachBlock>
    );
}