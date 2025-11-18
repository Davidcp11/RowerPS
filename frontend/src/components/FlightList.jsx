import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  Grid,
  Stack,
  InputAdornment,
  Paper,
} from '@mui/material';


import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

export default function FlightList({
  loading,
  error,
  flights,
  onFlightSelect,
  filters,
  onFilterChange,
  selectedFlightId
}) {

  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(name, value);
  };

  const formatDateTime = (isoString) => {
    return new Date(isoString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  
  const getStatusStyles = (status) => {
    if (status === 'Concluído') {
      return {
        bgcolor: '#E0E0E0', 
        color: '#757575',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        border: 'none'
      };
    }
    return {
      bgcolor: '#E0F7FA', 
      color: '#006064',   
      fontWeight: 'bold',
      textTransform: 'uppercase',
      border: 'none'
    };
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
      
      <Paper elevation={0} variant="outlined" sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: 'text.secondary', fontWeight: 'bold' }}>
          <FilterAltIcon fontSize="small" /> FILTROS
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              size="small"
              name="mission"
              placeholder="Buscar por missão..."
              value={filters.mission}
              onChange={handleChange}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><SearchIcon color="action" fontSize="small" /></InputAdornment>,
                },
              }}
              sx={{ bgcolor: 'white' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              label="Operador"
              name="operatorSarpas"
              value={filters.operatorSarpas}
              onChange={handleChange}
              sx={{ bgcolor: 'white' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              size="small"
              label="Drone"
              name="droneSisant"
              value={filters.droneSisant}
              onChange={handleChange}
              sx={{ bgcolor: 'white' }}
            />
          </Grid>
        </Grid>
      </Paper>

      {loading && <Typography align="center" sx={{ py: 2 }}>Carregando voos...</Typography>}
      {error && <Typography align="center" color="error" sx={{ py: 2 }}>{error}</Typography>}
      
      {!loading && !error && flights.length === 0 && (
        <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
          Nenhum voo encontrado.
        </Typography>
      )}

      <Stack spacing={2}>
        {flights.map((flight) => {
          const isSelected = flight.id === selectedFlightId;

          return (
            <Card 
              key={flight.id} 
              elevation={isSelected ? 8 : 2}
              sx={{ 
                textAlign: 'center', 
                borderRadius: 3,
                transition: 'all 0.3s ease', 
                cursor: 'pointer',
                border: isSelected ? '2px solid #016C72' : '1px solid transparent',
                backgroundColor: isSelected ? '#f2fafa' : 'white',
                transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
              }}
              onClick={() => onFlightSelect(flight)}
            >
              <CardContent sx={{ pb: 2 }}>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  {flight.mission}
                </Typography>

                <Typography variant="body2" color="text.secondary">Drone: {flight.droneSisant}</Typography>
                <Typography variant="body2" color="text.secondary">Operador: {flight.operatorSarpas}</Typography>

                <Box sx={{ my: 2 }}>
                  <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>Início:</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{formatDateTime(flight.startTime)}</Typography>
                  <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>Fim:</Typography>
                  <Typography variant="body2" color="text.secondary">{formatDateTime(flight.endTime)}</Typography>
                </Box>

                <Stack direction="row" justifyContent="center" alignItems="center" spacing={2} sx={{ mt: 1 }}>
                  <Chip label={flight.status} sx={getStatusStyles(flight.status)} />
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={(e) => {
                      e.stopPropagation(); // Evita clique duplo se o card já for clicável
                      onFlightSelect(flight);
                    }} 
                    disableElevation
                    sx={{ fontWeight: 'bold', color: 'white', textTransform: 'none', borderRadius: 2, px: 2 }}
                  >
                    Ver no Mapa
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}