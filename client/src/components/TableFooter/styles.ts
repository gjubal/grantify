import styled from 'styled-components';

export const PaginationButton = styled.button<{ isActive: boolean }>`
  display: inline;
  width: 2rem;
  padding: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 1rem;
  margin-right: 0.4rem;

  color: ${props => (props.isActive ? '#fff' : '#2c3e50')};
  background-color: ${props => (props.isActive ? '#4080ea' : '#fff')};
`;
