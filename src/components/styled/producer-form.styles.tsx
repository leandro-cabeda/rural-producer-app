import styled from 'styled-components';

// Container Principal
const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

// Títulos
const Title = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

// Formulário e Seções
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 1rem;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const FarmList = styled.ul`
  margin-top: 20px;
  list-style: none;
  padding: 0;
`;

const FarmItem = styled.li`
  background-color: #eef2f7;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 4px;
  font-size: 1rem;
`;

const AddFarmButton = styled.button`
  padding: 8px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  &:hover {
    background-color: #218838;
  }
`;

const ClearButton = styled(Button)`
  background-color: #474646FF;
  margin-left: 10px;
  &:hover {
    background-color: #474646FF;
  }
`;

export { Container, Title, Form, FormGroup, Label, Input, Button, FarmList, FarmItem, AddFarmButton, ClearButton };
