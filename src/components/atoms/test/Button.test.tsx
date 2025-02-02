import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

test('Renderiza o botão e dispara o clique', () => {
  const handleClick = jest.fn();
  render(<Button text="Clique aqui" onClick={handleClick} />);
  
  const button = screen.getByText(/clique/i);
  fireEvent.click(button);

  expect(handleClick).toHaveBeenCalledTimes(1);
});
