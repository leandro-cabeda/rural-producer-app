import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux'; // Substitua pelo caminho correto do seu componente
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../store/store';
import ProducerForm from '../ProducerForm';

// Mock do estado do Redux com um produtor existente
const mockState = {
    producer: {
        producers: [
            {
                id: 1,
                cpfCnpj: '12345678901234',
                name: 'Produtor Teste',
                farms: [
                    {
                        id: 1,
                        name: 'Fazenda Teste',
                        city: 'Cidade Teste',
                        state: 'Estado Teste',
                        totalArea: 100,
                        arableArea: 50,
                        vegetationArea: 30,
                    },
                ],
            },
        ],
    },
};

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn((selector) => selector(mockState)),
    useDispatch: jest.fn(),
}));

describe('ProducerForm', () => {
    it('deve exibir dados do produtor e fazenda ao editar', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/producer']}>
                    <ProducerForm />
                </MemoryRouter>
            </Provider>
        );

        // Verificar se os campos do produtor estão corretos
        expect(screen.getByLabelText(/Nome:/)).toHaveValue('Produtor Teste');
        expect(screen.getByLabelText(/CPF\/CNPJ:/)).toHaveValue('12345678901234');

        // Verificar se a fazenda está na lista
        expect(screen.getByText(/Fazenda Teste/)).toBeInTheDocument();
        expect(screen.getByText(/Cidade Teste/)).toBeInTheDocument();
        expect(screen.getByText(/Estado Teste/)).toBeInTheDocument();
    });
});
