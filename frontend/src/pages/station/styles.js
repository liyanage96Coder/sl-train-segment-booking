import styled from "styled-components";

export const Wrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px;
`;

export const Heading = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

export const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

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

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;

  background: ${({ $variant }) =>
    $variant === "secondary" ? "#eef2ff" : "#4f46e5"};
  color: ${({ $variant }) => ($variant === "secondary" ? "#4f46e5" : "#ffffff")};

  &:hover:not(:disabled) {
    background: ${({ $variant }) =>
      $variant === "secondary" ? "#e0e7ff" : "#4338ca"};
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

export const AddAtStartButton = styled(ActionButton).attrs({
  $variant: "primary",
})`
  margin-bottom: 16px;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
`;

export const StationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
`;

export const StationLabel = styled.h3`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
`;

export const StationOrder = styled.span`
  color: #9ca3af;
  font-weight: 400;
`;

export const StationCode = styled.span`
  color: #6b7280;
  font-size: 0.85rem;
`;

export const EmptyState = styled.p`
  color: #9ca3af;
  font-size: 0.9rem;
  text-align: center;
  padding: 24px 0;
`;

//Station List

export const WrapperList = styled.div`
  max-width: 720px;
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

export const EditInput = styled.input`
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.85rem;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
  }
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

export const TextButton = styled.button`
  border: none;
  background: none;
  color: ${({ $variant }) => ($variant === "danger" ? "#dc2626" : "#4f46e5")};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 6px;

  &:hover:not(:disabled) {
    text-decoration: underline;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;