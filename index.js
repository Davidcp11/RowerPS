import express from "express";
import { PrismaClient } from '@prisma/client';
import * as turf from '@turf/turf';
import cors from 'cors';


const app = express();
const prisma = new PrismaClient();


app.use(express.json());
app.use(cors());


const PORT = process.env.PORT || 3000;

app.post('/flights', async (req, res) => {
  try {
    const {
      mission,
      startTime,
      endTime,
      operatorSarpas,
      droneSisant,
      polygonJson,
    } = req.body;

    // --- 1. Validação de Campos Obrigatórios (Já tínhamos) ---
    if (
      !mission ||
      !startTime ||
      !endTime ||
      !operatorSarpas ||
      !droneSisant ||
      !polygonJson
    ) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Convertemos as strings de data em objetos Date logo no início
    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);

    // Validação simples: O fim não pode ser antes do início
    if (newEndTime <= newStartTime) {
      return res.status(400).json({ error: 'O horário de fim deve ser após o horário de início.' });
    }

    // --- 2. Validação de Regra de Negócio: Conflito de Drone  ---
    const conflictingDroneFlight = await prisma.flight.findMany({
      where: {
        droneSisant: droneSisant, // 1. Mesmo drone
        AND: [
          { startTime: { lt: newEndTime } }, // 2. E (Início Existente < Fim Novo)
          { endTime: { gt: newStartTime } }, // 3. E (Fim Existente > Início Novo)
        ],
      },
    });

    if (conflictingDroneFlight.length > 0) {
      return res.status(409).json({
        error: 'Conflito de agendamento: O drone já está em voo nesse horário.',
      });
    }

    // --- 3. Validação de Regra de Negócio: Conflito de Operador  ---
    const conflictingOperatorFlight = await prisma.flight.findMany({
      where: {
        operatorSarpas: operatorSarpas, // 1. Mesmo operador
        AND: [
          { startTime: { lt: newEndTime } }, // 2. E (Início Existente < Fim Novo)
          { endTime: { gt: newStartTime } }, // 3. E (Fim Existente > Início Novo)
        ],
      },
    });

    if (conflictingOperatorFlight.length > 0) {
      return res.status(409).json({
        error: 'Conflito de agendamento: O operador já está em voo nesse horário.',
      });
    }

    // --- 4. Validação de Formato (Bônus, mas importante) ---
    // SARPAS: 3 números, 3 letras, qualquer ordem, 6 chars total
    const sarpasRegex = /^(?=[a-zA-Z0-9]{6}$)(?=(?:.*[a-zA-Z]){3})(?=(?:.*\d){3}).*$/;
    if (!sarpasRegex.test(operatorSarpas)) {
      return res.status(400).json({ error: 'Formato de SARPAS inválido. Deve conter 3 letras e 3 números.' });
    }

    // SISANT: PP-xxxxxxx (7 dígitos)
    const sisantRegex = /^PP-\d{7}$/;
    if (!sisantRegex.test(droneSisant)) {
      return res.status(400).json({ error: 'Formato de SISANT inválido. Deve ser PP-xxxxxxx.' });
    }

    // --- 6. VALIDAÇÃO DE CONFLITO ESPACIAL (POLÍGONO) ---

    // 6a. Encontrar voos simultâneos (qualquer voo que "toque" o novo período)
    const now = new Date();

    // 6a. Encontrar voos simultâneos E QUE AINDA NÃO FORAM CONCLUÍDOS
    const simultaneousFlights = await prisma.flight.findMany({
      where: {

        // 2. NOVO FILTRO:
        // Só cheque contra voos cujo horário de término
        // ainda está no FUTURO (ou seja, 'Agendado')
        endTime: { gt: now },

        // 3. REGRA ANTIGA:
        // E que sejam simultâneos
        AND: [
          { startTime: { lt: newEndTime } }, // Início Existente < Fim Novo
          { endTime: { gt: newStartTime } }, // Fim Existente > Início Novo
        ],
      },
    });

    if (simultaneousFlights.length > 0) {
      // 6b. Criar o polígono do "novo" voo com o Turf
      // Nota: O Turf exige que o polígono seja "fechado"
      // (o primeiro e o último ponto devem ser iguais).
      const newPolygonCoords = [...polygonJson, polygonJson[0]]; // Fecha o polígono

      // O formato GeoJSON que o Turf precisa é: [[ [lng, lat], [lng, lat], ... ]]
      // Nosso formato é: [ {lat, lng}, {lat, lng}, ... ]
      // Precisamos converter:
      const newTurfPolygon = turf.polygon([
        newPolygonCoords.map(p => [p.lng, p.lat])
      ]);


      // 6c. Iterar sobre os voos simultâneos e checar a intersecção
      for (const flight of simultaneousFlights) {

        // Converte o polígono salvo no banco (string) de volta para JSON
        const existingPolygonJson = JSON.parse(flight.polygonJson);

        // Fecha o polígono e converte para o formato [lng, lat]
        const existingPolygonCoords = [...existingPolygonJson, existingPolygonJson[0]];
        const existingTurfPolygon = turf.polygon([
          existingPolygonCoords.map(p => [p.lng, p.lat])
        ]);

        // 6d. A checagem mágica!
        const intersects = turf.booleanIntersects(newTurfPolygon, existingTurfPolygon);

        if (intersects) {
          // Se houver QUALQUER intersecção, bloqueamos
          return res.status(409).json({
            error: `Conflito espacial: O polígono do voo intercepta o voo ${flight.mission}.`,
          });
        }
      }
    }
    // --- 7. Se todas as validações passaram, criar o voo ---
    const newFlight = await prisma.flight.create({
      data: {
        mission: mission,
        startTime: newStartTime, // Usando a variável de data
        endTime: newEndTime,     // Usando a variável de data
        operatorSarpas: operatorSarpas,
        droneSisant: droneSisant,
        polygonJson: JSON.stringify(polygonJson),
      },
    });

    res.status(201).json(newFlight);

  } catch (error) {
    console.error('Erro ao criar voo:', error);
    res.status(500).json({ error: 'Não foi possível cadastrar o voo.' });
  }
});

/*
 * @route   GET /flights
 * @desc    Lista todos os voos
 */
app.get('/flights', async (req, res) => {
  try {
    // 1. Capture os filtros da URL (ex: /flights?mission=Teste)
    const { mission, operatorSarpas, droneSisant } = req.query;

    // 2. Construa a cláusula 'where' dinamicamente
    const whereClause = {
      AND: [], // Usamos AND para que todos os filtros se apliquem
    };

    if (mission) {
      whereClause.AND.push({
        mission: {
          contains: mission, // 'contains' é como o 'LIKE' do SQL (busca parcial)
          mode: 'insensitive', // Não diferencia maiúsculas/minúsculas
        },
      });
    }
    if (operatorSarpas) {
      whereClause.AND.push({
        operatorSarpas: {
          contains: operatorSarpas,
          mode: 'insensitive',
        },
      });
    }
    if (droneSisant) {
      whereClause.AND.push({
        droneSisant: {
          contains: droneSisant,
          mode: 'insensitive',
        },
      });
    }

    // 3. Busque os voos usando os filtros
    const flights = await prisma.flight.findMany({
      where: whereClause, // Aplica o 'where'
      orderBy: {
        startTime: 'desc',
      },
    });

    // --- Lógica do Status (sem alteração) ---
    const now = new Date();
    const flightsWithStatus = flights.map(flight => {
      const endTime = new Date(flight.endTime);
      const status = endTime < now ? 'Concluído' : 'Agendado';
      return { ...flight, status: status };
    });
    // --- Fim da Lógica ---

    res.status(200).json(flightsWithStatus);

  } catch (error) {
    console.error('Erro ao listar voos:', error);
    res.status(500).json({ error: 'Não foi possível buscar os voos.' });
  }
});


app.get('/', (req, res) => {
  res.send('API Rower');
});


app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})