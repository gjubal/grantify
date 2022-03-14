import styled, { keyframes } from 'styled-components';

interface EntryProps {
  width: string;
  justification: 'center' | 'start' | 'end';
}

export const ExpenseContainer = styled.section`
  width: 770px;
`;

export const ExpenseRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const Entry = styled.h3<EntryProps>`
  width: ${props => String(props.width)}rem;
  display: flex;
  justify-content: ${props => String(props.justification)};
`;

export const ButtonSpan = styled.span`
  width: 1rem;
`;

const appearFromBottom = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const AnimationContainer = styled.div`
  width: 720px;
  animation: ${appearFromBottom} 1s;
`;
