import styled from "styled-components";

export const NavBar = styled.nav`
  width: 100%;
  height: 100vh;
  padding: 20px 12px;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-sizing: border-box;
  overflow-y: auto;
  position: sticky;
  top: 0;
`;

export const Brand = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  padding: 0 10px;
  margin-bottom: 20px;
`;

export const NavLink = styled.span`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  color: ${({ $active }) => ($active ? "#4f46e5" : "#4b5563")};
  background: ${({ $active }) => ($active ? "#eef2ff" : "transparent")};
  cursor: pointer;

  &:hover {
    background: ${({ $active }) => ($active ? "#eef2ff" : "#f3f4f6")};
  }
`;