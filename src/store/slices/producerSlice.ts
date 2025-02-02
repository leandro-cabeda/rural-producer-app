import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

interface DashboardData {
  totalFarms: number;
  totalHectares: number;
  farmsByState: { state: string; total: number }[];
  landUsage: { category: string; total: number }[];
  cropsDistribution: { crop: string; total: number }[];
}

// Producer.ts
export interface Producer {
  id: number;
  cpfCnpj: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  farms?: Farm[];
}

// Farm.ts
export interface Farm {
  id: number;
  name: string;
  city: string;
  state: string;
  totalArea: number;
  arableArea: number;
  vegetationArea: number;
  createdAt?: string;
  updatedAt?: string;
  producerId?: number; // ID do produtor (caso precise associar)
  crops?: Crop[];
  harvests?: Harvest[];
}

// Crop.ts
export interface Crop {
  id: number;
  name: string;
  year: number;
  createdAt?: string;
  updatedAt?: string;
  farmId?: number; // ID da fazenda (caso precise associar)
  harvestId?: number; // ID da colheita (caso precise associar)
}

// Harvest.ts
export interface Harvest {
  id: number;
  year: number;
  createdAt?: string;
  updatedAt?: string;
  crops?: Crop[];
  farmId?: number; // ID da fazenda (caso precise associar)
}

interface ProducerState {
  producers: Producer[];
  producer: Producer | null;
  dashboardData: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProducerState = {
  producers: [],
  producer: null,
  dashboardData: null,
  loading: false,
  error: null,
};

const url = "https://rural-producer-api.onrender.com"; // url da api em produção na plataforma Render
//const url = "http://localhost:3000"; // url da api local para acesso


export const fetchDashboardData = createAsyncThunk('producer/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/producers/dashboard`);
      if (!response.ok) throw new Error('Erro ao buscar os dados do dashboard');
      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  });

export const fetchProducers = createAsyncThunk('producer/fetchProducers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/producers`);
      if (!response.ok) throw new Error('Erro ao buscar os dados dos produtores');
      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  });

export const addProducerAsync = createAsyncThunk(
  'producer/addProducer',
  async (newProducer: Producer, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/producers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducer),
      });

      if (!response.ok) throw new Error('Erro ao adicionar o produtor: '
        + JSON.stringify(await response.json()));

      const addedProducer = await response.json();
      return addedProducer;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProducerAsync = createAsyncThunk(
  'producer/updateProducer',
  async (updatedProducer: Producer, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/producers/${updatedProducer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProducer),
      });

      if (!response.ok) throw new Error('Erro ao atualizar o produtor: '
        + JSON.stringify(await response.json()));

      const updatedData = await response.json();
      return updatedData;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProducerAsync = createAsyncThunk(
  'producer/deleteProducer',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/producers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar o produtor: '
        + JSON.stringify(await response.json()));

      return id;  // Retorna o id para que possamos remover o produtor do estado
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const findOneProducerAsync = createAsyncThunk(
  'producer/findOneProducer',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`${url}/producers/${id}`, {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Erro ao buscar o produtor: '
        + JSON.stringify(await response.json()));

      return response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


const producerSlice = createSlice({
  name: 'producer',
  initialState,
  reducers: {
    // Essas chamadas sao para adicionar/editar/excluir um produtor de forma sincrona
    // sem necessidade de uma chamada assíncrona externa
    addProducer: (state, action: PayloadAction<Producer>) => {
      state.producers.push(action.payload);
    },
    updateProducer: (state, action: PayloadAction<Producer>) => {
      const index = state.producers.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.producers[index] = action.payload;
      }
    },
    deleteProducer: (state, action: PayloadAction<Producer>) => {
      state.producers = state.producers.filter(p => p.id !== action.payload.id);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message + ', erro ao carregar os dados do dashboard';
      })
      .addCase(addProducerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProducerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.producers.push(action.payload);
      })
      .addCase(addProducerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message + ', erro ao adicionar o produtor';
      })
      .addCase(updateProducerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProducerAsync.fulfilled, (state, action) => {
        const index = state.producers.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.producers[index] = action.payload;  // Substitui o produtor com os novos dados
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateProducerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message + ', erro ao atualizar o produtor';
      })
      .addCase(deleteProducerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProducerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.producers = state.producers.filter(p => p.id !== action.payload);  // Filtra o produtor excluído
      })
      .addCase(deleteProducerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message + ', erro ao excluir o produtor';
      })
      .addCase(fetchProducers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.producers = action.payload;
      })
      .addCase(fetchProducers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message + ', erro ao buscar os dados';
      })
      .addCase(fetchProducers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findOneProducerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.producer = action.payload;
      })
      .addCase(findOneProducerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message + ', erro ao buscar o produtor';
      })
      .addCase(findOneProducerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
  },
});

export const { addProducer, updateProducer, deleteProducer } = producerSlice.actions;
export default producerSlice.reducer;
