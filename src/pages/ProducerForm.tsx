import React, { useState, useEffect, use } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import {
    Container,
    Title,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    FarmList,
    FarmItem,
    AddFarmButton,
    ClearButton,
} from '../components/styled/producer-form.styles'; // Importe os componentes estilizados
import { addProducerAsync, Crop, Farm, findOneProducerAsync, Harvest, Producer, updateProducerAsync } from '../store/slices/producerSlice';
import { FaArrowLeft, FaArrowRight, FaPlus, FaSave } from 'react-icons/fa';
import { StyledButtonWithIcon } from '../components/styled/styles';
import { AppDispatch, RootState } from '../store/store';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatCpfCnpj, validateCpfCnpj } from '../utils';
import Loading from '../components/loading/loading';

const ProducerForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { id } = useParams();
    const producers = useSelector((state: RootState) => state.producer.producers);
    const { loading, error, producer } = useSelector((state: RootState) => state.producer);

    const [producerData, setProducerData] = useState<Producer>({
        id: 0,
        cpfCnpj: '',
        name: '',
        farms: [],
    });

    const [newFarm, setNewFarm] = useState<Farm>({
        id: 0,
        name: '',
        city: '',
        state: '',
        totalArea: 0,
        arableArea: 0,
        vegetationArea: 0,
        crops: [],
        harvests: [],
    });

    const [newCrop, setNewCrop] = useState<Crop>({
        id: 0,
        name: '',
        year: 0,
        farmId: 0,
        harvestId: 0,
    });

    const [newHarvest, setNewHarvest] = useState<Harvest>({
        id: 0,
        year: 0,
        crops: [],
    });

    const fetchProducer = async () => {
        try {
            await dispatch(findOneProducerAsync(Number(id))).unwrap();
            if (error) toast.error("Erro ao buscar o produtor: " + error);
        } catch (error) {
            console.error('Erro ao buscar o produtor:', error);
        }
    };

    useEffect(() => {
        fetchProducer();
    }, [id]);

    useEffect(() => {
        if (id) {
            let producerToEdit: Producer | undefined = producers.find((producer: Producer) => producer.id === Number(id));
            producerToEdit = producer || producerToEdit;

            if (producerToEdit) {
                setProducerData(producerToEdit);
                setNewFarm(prev => {
                    const farmToUpdate = producerToEdit?.farms?.[0];

                    return {
                        ...prev,
                        crops: farmToUpdate?.crops ?? [],
                        harvests: farmToUpdate?.harvests ?? [],
                        name: farmToUpdate?.name ?? "",
                        city: farmToUpdate?.city ?? "",
                        state: farmToUpdate?.state ?? "",
                        totalArea: farmToUpdate?.totalArea ?? 0,
                        arableArea: farmToUpdate?.arableArea ?? 0,
                        vegetationArea: farmToUpdate?.vegetationArea ?? 0
                    };
                });

                setNewCrop(prev => {
                    const cropToUpdate = producerToEdit?.farms?.[0]?.crops?.[0];

                    return {
                        ...prev,
                        name: cropToUpdate?.name ?? "",
                        year: cropToUpdate?.year ?? 0,
                        farmId: cropToUpdate?.farmId ?? 0,
                        harvestId: cropToUpdate?.harvestId ?? 0,
                    };
                });

                setNewHarvest(prev => {
                    const harvestToUpdate = producerToEdit?.farms?.[0]?.harvests?.[0];

                    return {
                        ...prev,
                        year: harvestToUpdate?.year ?? 0,
                        crops: harvestToUpdate?.crops ?? [],
                    };
                });
            }
        }
    }, [id, producers, producer]);


    const handleProducerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProducerData({
            ...producerData,
            [e.target.name]: e.target.name === "cpfCnpj" ? formatCpfCnpj(e.target.value) : e.target.value,
        });
    };

    useEffect(() => {
        if (
            newFarm.arableArea && Number(newFarm.arableArea) > 0 &&
            newFarm.vegetationArea && Number(newFarm.vegetationArea) > 0 &&
            newFarm.totalArea && Number(newFarm.totalArea) > 0 &&
            Number(newFarm.arableArea) + Number(newFarm.vegetationArea) > Number(newFarm.totalArea)
        ) {
            toast.error("Erro: A soma da área agricultável e vegetação não pode ser maior que a área total.");

            setNewFarm({
                ...newFarm,
                arableArea: 0,
                vegetationArea: 0,
            });
        }
    }, [newFarm.arableArea, newFarm.vegetationArea, newFarm.totalArea]);

    const handleFarmChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        setNewFarm({
            ...newFarm,
            [e.target.name]: e.target.value,
        });
    };

    const handleCropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCrop({
            ...newCrop,
            [e.target.name]: e.target.value,
        });
    };

    const handleHarvestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewHarvest({
            ...newHarvest,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddFarm = () => {
        if (!newFarm.name || !newFarm.city || !newFarm.state
            || !newFarm.totalArea || !newFarm.arableArea || !newFarm.vegetationArea
        ) {
            toast.error("Erro: Preencha os campos da fazenda antes de adicionar.");
            return;
        }

        setNewFarm({
            ...newFarm,
            id: 1,
        });
    };

    useEffect(() => {

        if (newFarm.id > 0) {
            setProducerData((prev) => ({
                ...prev,
                farms: [...prev.farms || [], { ...newFarm, id: prev?.farms?.length || 0 + 1 }],
            }));

            setNewFarm({
                id: 0,
                name: '',
                city: '',
                state: '',
                totalArea: 0,
                arableArea: 0,
                vegetationArea: 0,
                crops: [],
                harvests: [],
            });

        }

    }, [newFarm]);

    const handleAddCrop = () => {
        if (producerData?.farms?.length === 0) {
            toast.error("Adicione uma fazenda primeiro!");
            return;
        }

        setNewCrop({
            ...newCrop,
            id: 1,
        });
    };

    useEffect(() => {
        if (producerData?.farms?.length && newCrop.id > 0) {
            setProducerData((prev) => {

                const updatedFarmsCrop = prev?.farms?.map((farm) => {

                    return {
                        ...farm,
                        crops:
                            [...farm.crops || [],
                            {
                                ...newCrop,
                                id: farm?.crops?.length || 0 + 1,
                                farmId: farm.id,
                            }
                            ],
                    };

                });

                return {
                    ...prev,
                    farms: updatedFarmsCrop,
                };
            });

            setNewFarm(prev => ({
                ...prev,
                crops: [...prev.crops || [], { ...newCrop, id: prev?.crops?.length || 0 + 1 }],
            }))

            setNewHarvest(prev => ({
                ...prev,
                crops: [...prev.crops || [], { ...newCrop, id: prev?.crops?.length || 0 + 1 }],
            }));

            setNewCrop({
                id: 0,
                name: '',
                year: 0,
                farmId: 0,
                harvestId: 0,
            });

        }
    }, [newCrop]);

    const handleAddHarvest = () => {
        if (producerData?.farms?.length === 0) {
            toast.error("Adicione uma fazenda primeiro!");
            return;
        }

        setNewHarvest({
            ...newHarvest,
            id: 1,
        });
    };

    useEffect(() => {
        if (producerData?.farms?.length && newHarvest.id > 0) {

            setProducerData((prev: any) => {

                const updatedFarmsCropHarvest = prev?.farms?.map((farm: any) => {
                    let cropFind: Crop | { id: number } = { id: 0 };

                    if (newHarvest?.crops?.length) {
                        for (let i = 0; i < (newHarvest.crops ?? []).length; i++) {
                            if (farm?.crops?.find((c: Crop) => c.id === newHarvest.crops![i].id)) {
                                cropFind = farm.crops.find((c: Crop) => c.id === newHarvest.crops![i].id) as Crop;
                                break;
                            }
                        }
                    }

                    const index = farm?.crops?.findIndex((c: Crop) => c.id === cropFind.id);
                    if (index !== undefined && index !== -1) {
                        farm.crops[index].harvestId = farm?.harvests?.length || 0 + 1;
                    }

                    return {
                        ...farm,
                        crops: [...farm.crops || []],
                        harvests:
                            [...farm.harvests || [],
                            {
                                ...newHarvest,
                                id: farm?.harvests?.length || 0 + 1,
                                farmId: farm.id,
                            }
                            ],
                    };

                });

                return {
                    ...prev,
                    farms: updatedFarmsCropHarvest,
                };
            });

            setNewFarm(prev => ({
                ...prev,
                harvests: [...prev.harvests || [], { ...newHarvest, id: prev?.harvests?.length || 0 + 1 }],
            }))

            setNewHarvest((prev: any) => ({
                ...prev,
                id: 0,
                year: 0,
            }));
        }
    }, [newHarvest]);


    const handleSaveProducer = async () => {
        if (!validateCpfCnpj(producerData.cpfCnpj)) {
            toast.error("CPF/CNPJ inválido!");
            return;
        }


        try {
            if (id) {
                await dispatch(updateProducerAsync(producerData)).unwrap();
                toast.success("Produtor atualizado com sucesso!");
            } else {
                await dispatch(addProducerAsync(producerData)).unwrap();
                toast.success("Produtor cadastrado com sucesso!");
            }
        } catch (err) {
            toast.error("Error: " + err as string);
        } finally {
            !error && navigate('/producers');
            error && toast.error("Ocorreu erro: " + error);
        }
    };


    return (
        <Container>
            <Title>{id ? 'Editar Produtor' : 'Cadastrar Produtor'}</Title>
            <StyledButtonWithIcon style={{ width: "35%" }} onClick={() => navigate('/producers')}>
                <FaArrowLeft />
                Voltar a Lista de Produtores
            </StyledButtonWithIcon>
            <StyledButtonWithIcon style={{ width: "20%" }} onClick={() => navigate('/')}>
                Dashboard
                <FaArrowRight />
            </StyledButtonWithIcon>
            <Form>
                <FormGroup>
                    <Label htmlFor="name">Nome:</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={producerData.name}
                        onChange={handleProducerChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="cpfCnpj">CPF/CNPJ:</Label>
                    <Input
                        type="text"
                        id="cpfCnpj"
                        name="cpfCnpj"
                        value={producerData.cpfCnpj}
                        onChange={handleProducerChange}
                    />
                </FormGroup>

                <Title>Adicionar Fazenda</Title>
                <FormGroup>
                    <Label htmlFor="farmName">Nome da Fazenda:</Label>
                    <Input
                        type="text"
                        id="farmName"
                        name="name"
                        value={newFarm.name}
                        onChange={handleFarmChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="city">Cidade:</Label>
                    <Input
                        type="text"
                        id="city"
                        name="city"
                        value={newFarm.city}
                        onChange={handleFarmChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="state">Estado:</Label>
                    <Input
                        type="text"
                        id="state"
                        name="state"
                        value={newFarm.state}
                        onChange={handleFarmChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="totalArea">Área Total (ha):</Label>
                    <Input
                        type="number"
                        id="totalArea"
                        name="totalArea"
                        value={newFarm.totalArea}
                        onChange={handleFarmChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="arableArea">Área Agricultável (ha):</Label>
                    <Input
                        type="number"
                        id="arableArea"
                        name="arableArea"
                        value={newFarm.arableArea}
                        onChange={handleFarmChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="vegetationArea">Área de Vegetação (ha):</Label>
                    <Input
                        type="number"
                        id="vegetationArea"
                        name="vegetationArea"
                        value={newFarm.vegetationArea}
                        onChange={handleFarmChange}
                    />
                </FormGroup>
                <AddFarmButton type="button" style={{ width: "30%", alignSelf: "center" }} onClick={handleAddFarm}>
                    <FaPlus style={{ marginRight: "5px" }} />
                    Adicionar Fazenda
                </AddFarmButton>

                <FarmList>
                    {producerData?.farms?.map((farm, index) => (
                        <FarmItem key={index}>
                            {farm.name} - {farm.city}, {farm.state} - {farm.totalArea} - {farm.arableArea} - {farm.vegetationArea}
                        </FarmItem>
                    ))}
                </FarmList>

                <Title>Culturas</Title>
                <FormGroup>
                    <Label htmlFor="cropName">Nome da Cultura:</Label>
                    <Input
                        type="text"
                        id="cropName"
                        name="name"
                        value={newCrop.name}
                        onChange={handleCropChange}
                    />
                </FormGroup>
                <FormGroup>
                    <Label htmlFor="cropYear">Ano:</Label>
                    <Input
                        type="number"
                        id="cropYear"
                        name="year"
                        value={newCrop.year}
                        onChange={handleCropChange}
                    />
                </FormGroup>
                <AddFarmButton type="button" style={{ width: "30%", alignSelf: "center" }} onClick={handleAddCrop}>
                    <FaPlus style={{ marginRight: "5px" }} />
                    Adicionar Cultura
                </AddFarmButton>

                <FarmList>
                    {newFarm?.crops?.map((crop, index) => (
                        <FarmItem key={index}>
                            {crop.name} - {crop.year}
                            {crop.harvestId ? ` (Colheita ID: ${crop.harvestId})` : ""}
                        </FarmItem>
                    ))}
                </FarmList>

                <Title>Colheitas</Title>
                <FormGroup>
                    <Label htmlFor="harvestYear">Ano:</Label>
                    <Input
                        type="number"
                        id="harvestYear"
                        name="year"
                        value={newHarvest.year}
                        onChange={handleHarvestChange}
                    />
                </FormGroup>
                <AddFarmButton type="button" style={{ width: "30%", alignSelf: "center" }} onClick={handleAddHarvest}>
                    <FaPlus style={{ marginRight: "5px" }} />
                    Adicionar Colheita
                </AddFarmButton>

                <FarmList>
                    {newFarm?.harvests?.map((crop, index) => (
                        <FarmItem key={index}>
                            {crop.year}

                        </FarmItem>
                    ))}
                </FarmList>

                <div>
                    {loading && <Loading />}
                    {!loading &&
                        <Button type="button" onClick={handleSaveProducer}>
                            <FaSave style={{ marginRight: "5px" }} />
                            {id ? 'Salvar Alterações' : 'Salvar Produtor'}
                        </Button>
                    }
                    <ClearButton type="button" onClick={() => navigate('/producers')}>
                        <FaArrowLeft style={{ marginRight: "5px" }} />
                        Voltar para a Lista de Produtores
                    </ClearButton>
                </div>
            </Form>
        </Container>
    );
};

export default ProducerForm;
