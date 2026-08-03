import styled from "styled-components";

export const Wrapper = styled.div`
  margin: 0 auto;
  padding: 24px;
`;

export const LoginWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const LoginButton = styled.button`
  padding: 10px 24px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.2);
  }
`;

export const Heading = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px;
`;

export const SelectorGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FieldLabel = styled.label`
  font-size: 0.78rem;
  font-weight: 600;
  color: #374151;
`;

export const Select = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: #fff;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin: 8px 0;
`;

export const SuccessBanner = styled.div`
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 16px;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 20px 0;
`;

/* ── Passenger counts + summary ───────────────────────── */

export const PassengerRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
`;

export const CountField = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CountLabel = styled.span`
  font-size: 0.85rem;
  color: #374151;
`;

export const CountInput = styled.input`
  width: 60px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.85rem;
  text-align: center;
`;

export const SummaryBar = styled.div`
  position: sticky;
  bottom: 0;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 14px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
`;

export const SummaryText = styled.div`
  font-size: 0.85rem;
  color: #374151;

  strong {
    color: #111827;
    font-size: 1.05rem;
  }
`;

export const ConfirmButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  background: #4f46e5;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #4338ca;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const HelperText = styled.p`
  font-size: 0.78rem;
  color: #9ca3af;
  margin: -4px 0 16px;
`;