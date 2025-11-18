import { useState } from 'react';
import axios from 'axios'; 
import { 
  TextField, Button, Box, Typography, Grid, Paper, 
  InputAdornment, Alert, Collapse
} from '@mui/material';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import PersonIcon from '@mui/icons-material/Person';
import RadarIcon from '@mui/icons-material/Radar';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';

const initialFormState = {
  mission: '',
  operatorSarpas: '',
  droneSisant: '',
  startDate: null,
  startTime: null,
  endDate: null,
  endTime: null,
};

export default function FlightForm({ polygonPoints, onFlightCreated, onClearPolygon }) {
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setFormError(null);
  };

  const handleDateChange = (fieldName, newValue) => {
    setFormData(prevData => ({ ...prevData, [fieldName]: newValue }));
    setFormError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      setFormError('Preencha todas as datas e horários.');
      setSubmitting(false);
      return;
    }

    if (polygonPoints.length === 0) {
      setFormError('Por favor, desenhe o polígono do voo no mapa.');
      setSubmitting(false);
      return;
    }

    const dateStartStr = formData.startDate.format('YYYY-MM-DD');
    const timeStartStr = formData.startTime.format('HH:mm');
    
    const dateEndStr = formData.endDate.format('YYYY-MM-DD');
    const timeEndStr = formData.endTime.format('HH:mm');

    const startISO = `${dateStartStr}T${timeStartStr}:00Z`;
    const endISO = `${dateEndStr}T${timeEndStr}:00Z`;

    const submissionData = {
      mission: formData.mission,
      operatorSarpas: formData.operatorSarpas,
      droneSisant: formData.droneSisant,
      startTime: startISO,
      endTime: endISO,
      polygonJson: polygonPoints, 
    };

    try {
      const response = await axios.post('http://localhost:3000/flights', submissionData);
      setFormData(initialFormState); 
      onFlightCreated(response.data); 
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setFormError(err.response.data.error);
      } else {
        setFormError('Erro ao cadastrar o voo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
        <FlightTakeoffIcon /> Novo Voo
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        
        <TextField
          margin="normal"
          required
          fullWidth
          id="mission"
          label="Nome da Missão"
          name="mission"
          value={formData.mission}
          onChange={handleChange}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <RadarIcon color="action" />
                </InputAdornment>
              ),
            },
          }}
        />

        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid>
            <TextField
              required
              fullWidth
              label="SARPAS"
              name="operatorSarpas"
              placeholder="123ABC"
              value={formData.operatorSarpas}
              onChange={handleChange}
              slotProps={{
                htmlInput: { maxLength: 6 },
                input: {
                  startAdornment: <InputAdornment position="start"><PersonIcon fontSize="small"/></InputAdornment>,
                },
              }}
            />
          </Grid>
          <Grid>
            <TextField
              required
              fullWidth
              label="SISANT"
              name="droneSisant"
              placeholder="PP-12345"
              value={formData.droneSisant}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><FlightTakeoffIcon fontSize="small"/></InputAdornment>,
                },
              }}
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, color: 'text.secondary' }}>
          Agendamento
        </Typography>
        
        <Grid container spacing={2}>
          <Grid>
            <DatePicker
              label="Data Início"
              value={formData.startDate}
              onChange={(newValue) => handleDateChange('startDate', newValue)}
              slotProps={{ textField: { fullWidth: true, size: 'small', required: true } }}
            />
          </Grid>
          <Grid>
            <TimePicker
              label="Hora Início"
              value={formData.startTime}
              onChange={(newValue) => handleDateChange('startTime', newValue)}
              ampm={false} 
              slotProps={{ textField: { fullWidth: true, size: 'small', required: true } }}
            />
          </Grid>
          <Grid>
            <DatePicker
              label="Data Fim"
              value={formData.endDate}
              onChange={(newValue) => handleDateChange('endDate', newValue)}
              slotProps={{ textField: { fullWidth: true, size: 'small', required: true } }}
            />
          </Grid>
          <Grid>
            <TimePicker
              label="Hora Fim"
              value={formData.endTime}
              onChange={(newValue) => handleDateChange('endTime', newValue)}
              ampm={false}
              slotProps={{ textField: { fullWidth: true, size: 'small', required: true } }}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Collapse in={!!formError}>
            <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>
          </Collapse>

          <Collapse in={polygonPoints.length === 0 && !formError}>
            <Alert severity="info" variant="outlined">
              Desenhe a área no mapa ao lado.
            </Alert>
          </Collapse>

          <Collapse in={polygonPoints.length > 0 && !formError}>
            <Alert 
              severity="success"
              variant="filled"
              sx={{ 
                alignItems: 'center',
                '& .MuiAlert-message': { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
              }}
            >
              <span>Área definida!</span>
              <Button 
                size="small" 
                color="inherit" 
                variant="outlined" 
                onClick={onClearPolygon}
                startIcon={<RefreshIcon />}
                sx={{ borderColor: 'rgba(255,255,255,0.5)', ml: 2 }}
              >
                Refazer
              </Button>
            </Alert>
          </Collapse>
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          endIcon={<SendIcon />}
          disabled={submitting}
          sx={{ mt: 3, py: 1.5, fontWeight: 'bold', fontSize: '1rem' }}
        >
          {submitting ? 'Cadastrando...' : 'Cadastrar Voo'}
        </Button>

      </Box>
    </Paper>
  );
};
