import styled from "styled-components";

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
`;

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  background: #4f46e5;
  color: #ffffff;
  white-space: nowrap;
  transition: background 0.15s ease;

  &:hover {
    background: #4338ca;
  }
`;