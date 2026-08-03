import styled from "styled-components";

export const Wrapper = styled.div`
  margin: 0 auto;
  padding: 24px;
`;

export const Heading = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 16px;

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
  margin: 0 0 12px;
`;

export const StationList = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  margin-bottom: 20px;
  max-height: 340px;
  overflow-y: auto;
`;

export const StationRow = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #fafafa;
  }
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

export const StationName = styled.span`
  flex: 1;
  font-size: 0.9rem;
  color: #1f2937;
`;

export const OrderSelect = styled.select`
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.85rem;
  min-width: 64px;
  cursor: pointer;

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const SubmitButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  background: #4f46e5;
  color: #ffffff;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: #4338ca;
  }

  &:disabled {
    opacity: 0.6;
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
  font-size: 0.8rem;
  color: #9ca3af;
  margin: -8px 0 16px;
`;

export const DistanceInput = styled.input`
  width: 84px;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.85rem;

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

export const DistanceLabel = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

//Routes List

export const WrapperList = styled.div`
  margin: 0 auto;
  padding: 24px;
`;

export const HeadingList = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px;
`;

export const ErrorTextList = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin: 0 0 12px;
`;

export const StationCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const ActionsCell = styled.div`
  display: flex;
  gap: 8px;
`;

export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;

  background: ${({ $variant }) =>
        $variant === "danger" ? "#fef2f2" : "#eef2ff"};
  color: ${({ $variant }) => ($variant === "danger" ? "#dc2626" : "#4f46e5")};

  &:hover:not(:disabled) {
    background: ${({ $variant }) =>
        $variant === "danger" ? "#fee2e2" : "#e0e7ff"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;