import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../store/store';
import ProducerForm from '../ProducerForm';

const mockState = {
    producer: {
        producers: [
            {
                id: 1,
                cpfCnpj: '12345678901234',
                name: 'Produtor Teste',
                farms: [],
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
    it('deve adicionar uma fazenda à lista', () => {
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/producer']}>
                    <ProducerForm />
                </MemoryRouter>
            </Provider>
        );

        // Simular preenchimento dos campos da fazenda
        fireEvent.change(screen.getByLabelText(/Nome da Fazenda:/), { target: { value: 'Nova Fazenda' } });
        fireEvent.change(screen.getByLabelText(/Cidade:/), { target: { value: 'Nova Cidade' } });
        fireEvent.change(screen.getByLabelText(/Estado:/), { target: { value: 'Novo Estado' } });
        fireEvent.change(screen.getByLabelText(/Área Total \(ha\):/), { target: { value: '150' } });
        fireEvent.change(screen.getByLabelText(/Área Agricultável \(ha\):/), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText(/Área de Vegetação \(ha\):/), { target: { value: '30' } });

        // Simular clique no botão de adicionar fazenda
        fireEvent.click(screen.getByText(/Adicionar Fazenda/));

        // Verificar se a fazenda foi adicionada à lista
        expect(screen.getByText(/Nova Fazenda/)).toBeInTheDocument();
        expect(screen.getByText(/Nova Cidade/)).toBeInTheDocument();
        expect(screen.getByText(/Novo Estado/)).toBeInTheDocument();
    });
});
