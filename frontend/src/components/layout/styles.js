import styled from "styled-components";

export const NavBar = styled.nav`
  display: flex;
  gap: 4px;
  padding: 12px 24px;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
`;

export const NavLink = styled.a`
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  color: ${({ $active }) => ($active ? "#4f46e5" : "#6b7280")};
  background: ${({ $active }) => ($active ? "#eef2ff" : "transparent")};
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`;