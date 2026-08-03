import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
`;

export const Modal = styled.div`
  background: #fff;
  border-radius: 12px;
  width: 340px;
  padding: 24px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const Title = styled.h3`
  font-size: 1.05rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

export const CloseButton = styled.button`
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 1.1rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 12px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  }

  &:disabled {
    background: #f3f4f6;
  }
`;

export const ErrorText = styled.p`
  color: #dc2626;
  font-size: 0.82rem;
  margin: 0 0 12px;
`;

export const SubmitButton = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

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
    to { transform: rotate(360deg); }
  }
`;