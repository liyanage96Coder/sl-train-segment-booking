import styled from "styled-components";

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

export const Thead = styled.thead`
  background: #f9fafb;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 12px 16px;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: middle;
`;

export const Tr = styled.tr`
  &:last-child ${Td} {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }
`;

export const EmptyRow = styled.td`
  padding: 32px 16px;
  text-align: center;
  color: #9ca3af;
`;