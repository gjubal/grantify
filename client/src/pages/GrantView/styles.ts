import styled, { keyframes } from 'styled-components';

interface EntryProps {
  width?: string;
  ml?: string;
}

export const DataboxContainer = styled.div`
  width: 300px;
`;

export const FormContainer = styled.div`
  width: 800px;
  margin-bottom: -60px;
`;

export const FormDivider = styled.div`
  margin-bottom: 20px;
`;

export const ExpenseContainer = styled.section`
  width: 800px;
`;

export const ExpenseRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

// export const Entry = styled.h3<EntryProps>`
//   width: ${props => String(props.width)}rem;
//   display: flex;
//   justify-content: ${props => String(props.justification)};
//   width: 10rem;
// `;
export const Entry = styled.div<EntryProps>`
  width: ${props => String(props.width)}rem;
  margin-left: ${props => String(props.ml)}rem;
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

export const NotesContainer = styled.div`
  width: 800px;
  margin-top: 1rem;
`;
