import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { PieChart, Tooltip, Pie, Cell, Legend } from 'recharts';
import { Card, CardTitle, CardValue, DashboardContainer, DashboardGrid } from '../components/styled/dashboard.styles';
import { clearError, fetchDashboardData } from '../store/slices/producerSlice';
import { StyledButtonWithIcon } from '../components/styled/styles';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/loading/loading';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { dashboardData, loading, error } = useSelector((state: RootState) => state.producer);
    const COLORS = [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#8B4513',
        '#00FF00',
        '#FF0000',
        '#0000FF',
        '#FFFF00',
        '#00FFFF',
        '#FF00FF',
        '#800080',
        '#808080',
        '#C0C0C0',
        '#000000',
        '#FFA500',
        '#00FF7F',
        '#FF4500',
    ];

    const fetchDashboardAllData = async () => {
        try {
            await dispatch(fetchDashboardData()).unwrap();
        } catch (err) {
            console.error('Erro ao carregar os dados:', err);
        }
    };

    useEffect(() => {
        fetchDashboardAllData();
    }, [fetchDashboardAllData]);

    useEffect(() => {
        if (error) {
            toast.error(`Erro: ${error}`);
            dispatch(clearError());
        }
    }, [error, dispatch]);


    const farmsByState = dashboardData?.farmsByState?.map(item => ({
        name: item.state,
        value: item.total,
    })) || [];

    const landUsage = dashboardData?.landUsage?.map(item => ({
        name: item.category,
        value: parseInt("" + item.total, 10),
    })) || [];

    const cropsDistribution = dashboardData?.cropsDistribution?.map(item => ({
        name: item.crop,
        value: item.total,
    })) || [];


    return (
        <DashboardContainer>
            <h1>Dashboard</h1>
            <StyledButtonWithIcon onClick={() => navigate('/producers')}>
                Lista de Produtores
                <FaArrowRight />
            </StyledButtonWithIcon>
            <StyledButtonWithIcon onClick={() => navigate('/add-edit-producer')}>
                Adicionar novo produtor
                <FaArrowRight />
            </StyledButtonWithIcon>

            {loading && <Loading />}

            {!loading && dashboardData && (
                <>
                    <DashboardGrid>
                        <Card>
                            <CardTitle>Total de Fazendas</CardTitle>
                            <CardValue>{dashboardData?.totalFarms || 0}</CardValue>
                        </Card>
                        <Card>
                            <CardTitle>Total de Hectares</CardTitle>
                            <CardValue>{parseInt("" + dashboardData?.totalHectares || '0', 10)} ha</CardValue>
                        </Card>
                    </DashboardGrid>

                    <DashboardGrid>
                        <Card>
                            <CardTitle>Distribuição por Estado</CardTitle>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <PieChart width={300} height={300}>
                                    <Pie data={farmsByState} dataKey="value" nameKey="name">
                                        {dashboardData?.farmsByState?.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </div>
                        </Card>

                        <Card>
                            <CardTitle>Uso do Solo</CardTitle>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <PieChart width={300} height={300}>
                                    <Pie data={landUsage} dataKey="value" nameKey="name">
                                        {dashboardData?.landUsage?.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </div>
                        </Card>
                    </DashboardGrid>

                    <DashboardGrid>
                        <Card>
                            <CardTitle>Por Cultura Plantada</CardTitle>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <PieChart width={300} height={300}>
                                    <Pie data={cropsDistribution} dataKey="value" nameKey="name">
                                        {dashboardData?.cropsDistribution?.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </div>
                        </Card>
                    </DashboardGrid>
                </>
            )}
        </DashboardContainer>
    );
};

export default Dashboard;
