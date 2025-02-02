import styled from 'styled-components';


export const StyledButtonWithIcon = styled.button`
  background-color: #007bff;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25%;
  gap: 10px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);

  &:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 123, 255, 0.5);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
  }
`;