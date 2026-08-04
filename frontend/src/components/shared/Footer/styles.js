import styled from "styled-components";

export const FooterWrapper = styled.footer`
  background: #111827;
  color: #d1d5db;
  padding: 40px 24px 20px;
  margin-top: 40px;
`;

export const FooterGrid = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
  gap: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 4px;
`;

export const BrandText = styled.p`
  font-size: 0.82rem;
  color: #9ca3af;
  line-height: 1.5;
  margin: 0;
`;

export const ColumnTitle = styled.h4`
  font-size: 0.82rem;
  font-weight: 600;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin: 0 0 4px;
`;

export const FooterLink = styled.a`
  font-size: 0.85rem;
  color: #d1d5db;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: #ffffff;
    text-decoration: underline;
  }
`;

export const ContactRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #d1d5db;
`;

export const SocialRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
`;

export const SocialIconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #1f2937;
  color: #d1d5db;
  cursor: pointer;

  &:hover {
    background: #4f46e5;
    color: #ffffff;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #1f2937;
  max-width: 1100px;
  margin: 32px auto 16px;
`;

export const BottomRow = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const Copyright = styled.p`
  font-size: 0.78rem;
  color: #6b7280;
  margin: 0;
`;

export const BottomLinks = styled.div`
  display: flex;
  gap: 16px;
`;