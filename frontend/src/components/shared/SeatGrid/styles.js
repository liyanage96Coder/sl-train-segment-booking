import styled from "styled-components";

export const CoachBlock = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const CoachHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
`;

export const CoachTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

export const CoachFares = styled.span`
  font-size: 0.78rem;
  color: #6b7280;
`;

export const SeatGridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 40px);
  gap: 8px 10px;
`;

// Visual aisle gap every 2 seats, mimicking a 2+2 train coach layout.
export const SeatButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  border: none;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease;

  ${({ $state }) => {
        if ($state === "unavailable") {
            return `
        background: #fecaca;
        color: #991b1b;
        cursor: not-allowed;
      `;
        }
        if ($state === "selected-local") {
            return `
        background: #4f46e5;
        color: #ffffff;
      `;
        }
        if ($state === "selected-foreign") {
            return `
        background: #059669;
        color: #ffffff;
      `;
        }
        // available
        return `
      background: #bfdbfe;
      color: #1e40af;
    `;
    }}

  &:hover:not(:disabled) {
    transform: scale(1.08);
  }

  &:nth-child(4n + 2) {
    margin-right: 14px; /* aisle gap after seat 2 in every row of 4 */
  }
`;

export const Legend = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #4b5563;
`;

export const LegendSwatch = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 4px;
  display: inline-block;
  background: ${({ $color }) => $color};
`;