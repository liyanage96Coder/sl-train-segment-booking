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

export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin: 0 0 12px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #eef2ff;
  color: #3F0997;
  font-size: 0.8rem;
  font-weight: 600;
`;

export const RouteText = styled.span`
  font-size: 0.85rem;
  color: #4b5563;
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

export const ActionsCell = styled.div`
  display: flex;
  gap: 8px;
`;

//Add Train

export const WrapperTrain = styled.div`
  max-width: 680px;
  margin: 0 auto;
  padding: 24px;
`;

export const HeadingTrain = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px;
`;

export const SectionLabel = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin: 20px 0 8px;
`;

export const Input = styled.input`
  width: 100%;
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

export const Select = styled.select`
  width: 100%;
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

export const ErrorTextTrain = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin: 8px 0 0;
`;

export const HelperText = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 4px 0 0;
`;

/* ── Coaches ───────────────────────────────────────── */

export const CoachCard = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
  position: relative;
`;

export const CoachTitle = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: #3F0997;
  margin: 0 0 10px;
`;

export const CoachFieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
`;

export const CoachFieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CoachFieldLabel = styled.label`
  font-size: 0.75rem;
  color: #6b7280;
`;

export const RemoveCoachButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 6px;
  background: #fef2f2;
  color: #dc2626;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AddCoachButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px dashed #6366f1;
  border-radius: 8px;
  background: #eef2ff;
  color: #3F0997;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  justify-content: center;

  &:hover:not(:disabled) {
    background: #e0e7ff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ── Stop selection ────────────────────────────────── */

export const StopList = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  max-height: 280px;
  overflow-y: auto;
`;

export const StopRow = styled.label`
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

export const StopName = styled.span`
  font-size: 0.9rem;
  color: #1f2937;
`;

/* ── Submit ────────────────────────────────────────── */

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
  background: #3F0997;
  color: #ffffff;
  margin-top: 20px;
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