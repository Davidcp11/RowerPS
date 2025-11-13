// index.test.js
import request from 'supertest';
import { jest } from '@jest/globals';

// Mock do Prisma Client e do Turf
const mockPrisma = {
  flight: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

jest.unstable_mockModule('@turf/turf', () => ({
  booleanIntersects: jest.fn(),
  polygon: jest.fn((coords) => ({ type: 'Polygon', coordinates: coords })),
}));

// Importar o app APÓS os mocks estarem configurados
const { default: app } = await import('./index.js');
const turf = await import('@turf/turf');

describe('POST /flights - Testes de Criação de Voo', () => {
  beforeEach(() => {
    // Limpa o estado dos mocks (chamadas, retornos) antes de cada teste
    jest.clearAllMocks();
  });

  test('deve retornar 400 se campos obrigatórios estiverem faltando', async () => {
    const response = await request(app).post('/flights').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Todos os campos são obrigatórios.');
  });

  test('deve retornar 409 se o drone já estiver em voo no mesmo horário', async () => {
    mockPrisma.flight.findMany.mockResolvedValue([{ id: 1, droneSisant: 'PP-1234567' }]);

    const newFlight = {
      mission: 'Teste de Conflito de Drone',
      startTime: '2024-01-01T10:00:00.000Z',
      endTime: '2024-01-01T11:00:00.000Z',
      operatorSarpas: '123ABC',
      droneSisant: 'PP-1234567',
      polygonJson: [{ lat: -23.5, lng: -46.6 }],
    };

    const response = await request(app).post('/flights').send(newFlight);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Conflito de agendamento: O drone já está em voo nesse horário.');
  });

  test('deve retornar 409 se o operador já estiver em voo no mesmo horário', async () => {
    mockPrisma.flight.findMany
      .mockResolvedValueOnce([]) // Sem conflito de drone
      .mockResolvedValueOnce([{ id: 2, operatorSarpas: '123ABC' }]); // Com conflito de operador

    const newFlight = {
      mission: 'Teste de Conflito de Operador',
      startTime: '2024-01-01T10:00:00.000Z',
      endTime: '2024-01-01T11:00:00.000Z',
      operatorSarpas: '123ABC',
      droneSisant: 'PP-7654321',
      polygonJson: [{ lat: -23.5, lng: -46.6 }],
    };

    const response = await request(app).post('/flights').send(newFlight);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Conflito de agendamento: O operador já está em voo nesse horário.');
  });

  test('deve retornar 409 se o polígono do novo voo interceptar outro voo simultâneo', async () => {
    mockPrisma.flight.findMany
      .mockResolvedValueOnce([]) // Drone
      .mockResolvedValueOnce([]) // Operador
      .mockResolvedValueOnce([   // Voos simultâneos para checagem de polígono
        {
          id: 3,
          mission: 'Voo Existente',
          polygonJson: JSON.stringify([{ lat: -23.5, lng: -46.6 }]),
        },
      ]);
    turf.booleanIntersects.mockReturnValue(true);

    const newFlight = {
      mission: 'Teste de Conflito de Polígono',
      startTime: '2024-01-01T10:00:00.000Z',
      endTime: '2024-01-01T11:00:00.000Z',
      operatorSarpas: '123ABC',
      droneSisant: 'PP-1234567',
      polygonJson: [{ lat: -23.5, lng: -46.6 }],
    };

    const response = await request(app).post('/flights').send(newFlight);
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('Conflito espacial: O polígono do voo intercepta o voo Voo Existente.');
  });

  test('deve criar um voo com sucesso se todas as regras forem atendidas', async () => {
    mockPrisma.flight.findMany.mockResolvedValue([]);
    turf.booleanIntersects.mockReturnValue(false);

    const newFlightData = {
      mission: 'Voo de Sucesso',
      startTime: '2024-01-01T14:00:00.000Z',
      endTime: '2024-01-01T15:00:00.000Z',
      operatorSarpas: '987ZYX',
      droneSisant: 'PP-9876543',
      polygonJson: [{ lat: -25.5, lng: -48.6 }],
    };
    const createdFlight = { id: 10, ...newFlightData, polygonJson: JSON.stringify(newFlightData.polygonJson) };
    mockPrisma.flight.create.mockResolvedValue(createdFlight);

    const response = await request(app).post('/flights').send(newFlightData);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdFlight);
    expect(mockPrisma.flight.create).toHaveBeenCalledWith({
      data: {
        ...newFlightData,
        startTime: new Date(newFlightData.startTime),
        endTime: new Date(newFlightData.endTime),
        polygonJson: JSON.stringify(newFlightData.polygonJson),
      },
    });
  });
});
