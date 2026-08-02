import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin-bottom: 12px;
`;

/* ── Stat cards ───────────────────────────────────── */

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #ffffff;
`;

export const StatIconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $color }) => $color || "#eef2ff"};
  color: ${({ $iconColor }) => $iconColor || "#4f46e5"};
`;

export const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const StatValue = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: #111827;
`;

export const StatLabel = styled.span`
  font-size: 0.78rem;
  color: #6b7280;
`;

/* ── Panels ───────────────────────────────────────── */

export const PanelGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 16px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 18px;
  background: #ffffff;
`;

export const PanelTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px;
`;

export const PanelSubtitle = styled.p`
  font-size: 0.78rem;
  color: #9ca3af;
  margin: 0 0 16px;
`;

/* ── Passenger split ──────────────────────────────── */

export const SplitRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

export const SplitLegend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SplitLegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #374151;
`;

export const SplitDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

/* ── Occupancy list ───────────────────────────────── */

export const OccupancyRow = styled.div`
  margin-bottom: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const OccupancyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 4px;
  color: #374151;
`;

export const OccupancyBarTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #f3f4f6;
  overflow: hidden;
`;

export const OccupancyBarFill = styled.div`
  height: 100%;
  border-radius: 4px;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $pct }) =>
        $pct > 80 ? "#dc2626" : $pct > 50 ? "#f59e0b" : "#10b981"};
`;

/* ── Recent bookings ──────────────────────────────── */

export const RouteText = styled.span`
  font-size: 0.85rem;
  color: #4b5563;
`;

export const FareText = styled.span`
  font-weight: 600;
  color: #111827;
`;

export const EmptyState = styled.p`
  color: #9ca3af;
  font-size: 0.85rem;
  text-align: center;
  padding: 24px 0;
`;