import React, { useEffect, useState } from 'react';
import { AppDispatch, RootState } from '../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { clearError, deleteProducerAsync, fetchProducers } from '../store/slices/producerSlice';
import { Container, Table, Th, Tr, Td, Button, Title } from '../components/styled/producer.styles';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaPlus, FaTimes, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { StyledButtonWithIcon } from '../components/styled/styles';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from '../components/loading/loading';

const ProducersList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, producers } = useSelector((state: RootState) => state.producer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [producerIdToDelete, setProducerIdToDelete] = useState<number | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const fetchProducersData = async () => {
    try {
      await dispatch(fetchProducers()).unwrap();
    } catch (err) {
      console.error('Erro ao carregar os dados dos produtores:', err);
    }
  };

  useEffect(() => {
    fetchProducersData();
  }, []);

  // Função para abrir o modal de confirmação
  const openModal = (id: number) => {
    setProducerIdToDelete(id);
    setIsModalOpen(true);
    setLoadingDelete(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setIsModalOpen(false);
    setProducerIdToDelete(null);
    setLoadingDelete(false);
  };

  // Função para excluir produtor
  const handleDelete = async () => {
    if (producerIdToDelete !== null) {
      try {
        await dispatch(deleteProducerAsync(producerIdToDelete)).unwrap();
        toast.success("Produtor excluida com sucesso!");
      } catch (err) {
        console.error('Erro ao excluir o produtor:', err);
      } finally {
        closeModal();
        setLoadingDelete(false);
      }
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(`Erro: ${error}`);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Função para abrir o formulário de adicionar/editar produtor
  const handleEdit = (producerId?: number) => {
    navigate(`/add-edit-producer${producerId ? `/${producerId}` : ''}`);
  };

  return (
    <Container>
      <Title>Lista de Produtores</Title>
      <StyledButtonWithIcon style={{ width: "20%" }} onClick={() => navigate('/')}>
        <FaArrowLeft />
        Voltar ao Dashboard
      </StyledButtonWithIcon>

      <Button style={{ width: "20%", marginBottom: "10px", fontSize: "16px" }} onClick={() => handleEdit()}>
        <FaPlus style={{ marginRight: "5px" }} />
        Adicionar Novo Produtor
      </Button>

      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Nome</Th>
            <Th>CPF/CNPJ</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {loading && <Loading />}

          {producers?.map((producer) => (
            <Tr key={producer.id}>
              <Td>{producer.id}</Td>
              <Td>{producer.name}</Td>
              <Td>{producer.cpfCnpj}</Td>
              <Td>
                <Button onClick={() => handleEdit(producer.id)}>
                  <FaEdit style={{ marginRight: '5px' }} />
                  Editar
                </Button>
                {loadingDelete && <Loading />}
                {!loadingDelete && <Button
                  style={{ marginLeft: '10px', backgroundColor: 'red' }}
                  onClick={() => openModal(producer.id)}
                >
                  <FaTrash style={{ marginRight: '5px' }} />
                  Excluir
                </Button>
                }
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>

      <Modal isOpen={isModalOpen} onRequestClose={closeModal}
        style={{
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          content: { width: '300px', margin: 'auto', height: '200px' }
        }}>
        <h2>Confirmar Exclusão</h2>
        <p>Você tem certeza que deseja excluir este produtor?</p>
        <Button style={{ marginRight: "10px", backgroundColor: "red" }} onClick={handleDelete}>
          <FaTrash style={{ marginRight: '5px' }} />
          Excluir
        </Button>
        <Button onClick={closeModal} style={{ backgroundColor: 'gray' }}>
          <FaTimes style={{ marginRight: '5px' }} />
          Cancelar
        </Button>
      </Modal>
    </Container>
  );
};

export default ProducersList;

