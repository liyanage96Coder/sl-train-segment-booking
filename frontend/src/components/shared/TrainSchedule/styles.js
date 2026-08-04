import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 24px;
`;

export const ContentWrapper = styled.div`
 display: flex;
 flex-direction: row;
 gap: 20px;
`;

export const CoachWrapper = styled.div`
 display: flex;
 flex-direction: column;
  overflow: auto;
`;

export const MsgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const TopControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #fff;
  cursor: pointer;
`;

export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
`;

/* ── Calendar ─────────────────────────────────────── */

export const CalendarPanel = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px;
  width: 280px;
  flex-shrink: 0;
`;

export const CalendarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const CalendarTitle = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
`;

export const NavWrapper = styled.div`
  display: flex;
  gap: 6px;
`;

export const NavButton = styled.button`
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #e5e7eb;
  }
`;

export const TodayButton = styled.button`
  border: none;
  background: none;
  color: #3F0997;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
`;

export const DayLabel = styled.span`
  font-size: 0.68rem;
  color: #9ca3af;
  text-align: center;
`;

export const DayCell = styled.button`
  position: relative;
  aspect-ratio: 1;
  border: none;
  border-radius: 6px;
  font-size: 0.78rem;
  cursor: pointer;
  background: ${({ $isSelected }) => ($isSelected ? "#3F0997" : "transparent")};
  color: ${({ $isSelected, $isOtherMonth }) =>
    $isSelected ? "#fff" : $isOtherMonth ? "#d1d5db" : "#374151"};

  &:hover {
    background: ${({ $isSelected }) => ($isSelected ? "#3F0997" : "#f3f4f6")};
  }

  &::after {
    content: "";
    display: ${({ $hasBooking }) => ($hasBooking ? "block" : "none")};
    position: absolute;
    bottom: 3px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${({ $isSelected }) => ($isSelected ? "#fff" : "#3F0997")};
  }
`;

/* ── Coach tabs ───────────────────────────────────── */

export const CoachTabs = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 14px;
  flex-wrap: wrap;
`;

export const CoachTab = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid ${({ $active }) => ($active ? "#3F0997" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#eef2ff" : "#fff")};
  color: ${({ $active }) => ($active ? "#3F0997" : "#6b7280")};
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
`;

/* ── Grid ─────────────────────────────────────────── */

export const GridArea = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: auto;
  flex: 1;
`;

export const HeaderRow = styled.div`
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  position: sticky;
  top: 0;
  z-index: 1;
`;

export const HeaderCell = styled.div`
  width: ${({ $isStationCol }) => ($isStationCol ? "140px" : "70px")};
  flex-shrink: 0;
  padding: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
  text-align: center;
  border-right: 1px solid #f3f4f6;
`;

export const BodyRow = styled.div`
  display: flex;
  border-bottom: 1px solid #f3f4f6;
  height: 44px;
`;

export const StationCell = styled.div`
  width: 140px;
  flex-shrink: 0;
  padding: 8px;
  font-size: 0.78rem;
  color: #4b5563;
  display: flex;
  align-items: center;
  border-right: 1px solid #f3f4f6;
`;

export const SeatColumn = styled.div`
  width: 70px;
  flex-shrink: 0;
  position: relative;
  border-right: 1px solid #f9fafb;
`;

export const BookingBlock = styled.div`
  position: absolute;
  left: 3px;
  right: 3px;
  z-index: 5;
  top: ${({ $top }) => $top}px;
  height: ${({ $height }) => $height}px;
  background: ${({ $type }) => ($type === "foreign" ? "#059669" : "#3F0997")};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.68rem;
  font-weight: 600;
  overflow: hidden;

  &:hover {
    filter: brightness(1.1);
  }
`;

/* ── Popup ────────────────────────────────────────── */

export const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

export const PopupContainer = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 340px;
  padding: 20px;
`;

export const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const PopupTitle = styled.h3`
  font-size: 1rem;
  margin: 0;
  color: #1f2937;
`;

export const CloseButton = styled.button`
  border: none;
  background: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #9ca3af;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  padding: 6px 0;
  border-bottom: 1px solid #f3f4f6;

  span:first-child {
    color: #9ca3af;
  }
  span:last-child {
    color: #1f2937;
    font-weight: 500;
  }
`;

export const DeleteButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #fef2f2;
  color: #dc2626;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    background: #fee2e2;
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const BookingTooltip = styled.div`
  position: fixed;
  top: ${({ $y }) => $y + 14}px;
  left: ${({ $x }) => $x + 14}px;
  background: #1f2937;
  color: #fff;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.78rem;
  z-index: 200;
  pointer-events: none;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
`;

export const TooltipRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding: 2px 0;

  strong {
    color: #9ca3af;
    font-weight: 500;
  }
`;