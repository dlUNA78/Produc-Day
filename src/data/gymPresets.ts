import { WorkoutSplit, WorkoutRoutine } from '../types';

export const UPPER_LOWER_SPLIT: WorkoutSplit = {
  id: 'split-upper-lower',
  name: 'Torso / Pierna (Upper & Lower)',
  description: '4 días de alta eficiencia divididos en tren superior e inferior con 3 días de recuperación.',
  schedule: {
    1: 'REST',
    2: 'REST',
    3: 'REST',
    4: 'REST',
    5: 'REST',
    6: 'REST',
    0: 'REST',
  },
  routines: [
    {
      id: 'routine-upper-a',
      name: 'Upper A — Enfoque Fuerza & Empuje',
      shortName: 'Upper A',
      targetMuscles: ['Pecho', 'Espalda', 'Hombros', 'Tríceps', 'Bíceps'],
      estimatedMinutes: 65,
      exercises: [
        {
          id: 'ex-ua-1',
          name: 'Press de Banca Plano con Barra',
          muscleGroup: 'Pecho',
          restSeconds: 120,
          notes: 'Retracción escapular firme. 1-2 reps en reserva (RIR 2).',
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 70, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 75, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '6-8', weightKg: 80, isCompleted: false },
            { id: 's4', setNumber: 4, reps: '6', weightKg: 80, isCompleted: false },
          ]
        },
        {
          id: 'ex-ua-2',
          name: 'Remo con Barra Prono (Pendlay)',
          muscleGroup: 'Espalda',
          restSeconds: 90,
          notes: 'Tira con los codos hacia la cadera sin balanceo de torso.',
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 65, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 70, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 70, isCompleted: false },
            { id: 's4', setNumber: 4, reps: '8', weightKg: 70, isCompleted: false },
          ]
        },
        {
          id: 'ex-ua-3',
          name: 'Press Militar de Pie con Barra',
          muscleGroup: 'Hombros',
          restSeconds: 90,
          notes: 'Bloquea glúteos y core fuerte durante todo el empuje.',
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 40, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 45, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 45, isCompleted: false },
          ]
        },
        {
          id: 'ex-ua-4',
          name: 'Jalón al Pecho en Polea (Agarre Neutro)',
          muscleGroup: 'Espalda',
          restSeconds: 75,
          notes: 'Pausa isométrica de 1 segundo abajo apretando dorsales.',
          sets: [
            { id: 's1', setNumber: 1, reps: '10-12', weightKg: 55, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 60, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 60, isCompleted: false },
          ]
        },
        {
          id: 'ex-ua-5',
          name: 'Elevaciones Laterales en Polea / Mancuerna',
          muscleGroup: 'Hombros',
          restSeconds: 60,
          notes: 'Movimiento controlado, codos ligeramente flexionados.',
          sets: [
            { id: 's1', setNumber: 1, reps: '15', weightKg: 10, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '12-15', weightKg: 12, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '12', weightKg: 12, isCompleted: false },
          ]
        },
        {
          id: 'ex-ua-6',
          name: 'Curl de Bíceps en Banco Inclinado',
          muscleGroup: 'Bíceps',
          restSeconds: 60,
          notes: 'Máximo estiramiento de la cabeza larga en la parte baja.',
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 14, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 14, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 14, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'routine-lower-a',
      name: 'Lower A — Cuádriceps & Sentadilla',
      shortName: 'Lower A',
      targetMuscles: ['Cuádriceps', 'Isquios', 'Glúteos', 'Gemelos', 'Core / Abdomen'],
      estimatedMinutes: 60,
      exercises: [
        {
          id: 'ex-la-1',
          name: 'Sentadilla Trasera con Barra (Barbell Squat)',
          muscleGroup: 'Cuádriceps',
          restSeconds: 120,
          notes: 'Profundidad paralela o profunda con rodillas estables.',
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 90, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 100, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '6-8', weightKg: 105, isCompleted: false },
            { id: 's4', setNumber: 4, reps: '6', weightKg: 105, isCompleted: false },
          ]
        },
        {
          id: 'ex-la-2',
          name: 'Peso Muerto Rumano con Mancuernas/Barra',
          muscleGroup: 'Isquios',
          restSeconds: 90,
          notes: 'Empuja la cadera hacia atrás sintiendo tensión en isquios.',
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 80, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 85, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8-10', weightKg: 85, isCompleted: false },
          ]
        },
        {
          id: 'ex-la-3',
          name: 'Prensa Inclinada a 45°',
          muscleGroup: 'Cuádriceps',
          restSeconds: 90,
          notes: 'Pies a mitad de la plataforma para balance cuadriceps/glúteo.',
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 160, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10-12', weightKg: 180, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 190, isCompleted: false },
          ]
        },
        {
          id: 'ex-la-4',
          name: 'Curl Femoral Sentado en Máquina',
          muscleGroup: 'Isquios',
          restSeconds: 60,
          notes: 'Fase excéntrica de 3 segundos.',
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 45, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '12', weightKg: 50, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 50, isCompleted: false },
          ]
        },
        {
          id: 'ex-la-5',
          name: 'Elevación de Talones de Pie (Gemelos)',
          muscleGroup: 'Gemelos',
          restSeconds: 45,
          notes: 'Pausa de 2s en máxima elongación.',
          sets: [
            { id: 's1', setNumber: 1, reps: '15', weightKg: 60, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '15', weightKg: 65, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '12', weightKg: 70, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'routine-upper-b',
      name: 'Upper B — Enfoque Hipertrofia & Tracción',
      shortName: 'Upper B',
      targetMuscles: ['Espalda', 'Pecho', 'Hombros', 'Tríceps', 'Bíceps'],
      estimatedMinutes: 60,
      exercises: [
        {
          id: 'ex-ub-1',
          name: 'Press Inclinado con Mancuernas (30°)',
          muscleGroup: 'Pecho',
          restSeconds: 90,
          notes: 'Foco en el haz clavicular del pectoral.',
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 28, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 30, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 32, isCompleted: false },
            { id: 's4', setNumber: 4, reps: '8', weightKg: 32, isCompleted: false },
          ]
        },
        {
          id: 'ex-ub-2',
          name: 'Dominadas Lastradas / Jalón Neutro',
          muscleGroup: 'Espalda',
          restSeconds: 90,
          notes: 'Rango completo de movimiento desde bloqueo articular.',
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 0, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 10, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '6', weightKg: 10, isCompleted: false },
          ]
        },
        {
          id: 'ex-ub-3',
          name: 'Fondos en Paralelas (Dips)',
          muscleGroup: 'Pecho',
          restSeconds: 90,
          notes: 'Torso inclinado hacia adelante para activar pecho.',
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 0, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 5, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 10, isCompleted: false },
          ]
        },
        {
          id: 'ex-ub-4',
          name: 'Remo en Polea Baja (Gironda)',
          muscleGroup: 'Espalda',
          restSeconds: 75,
          notes: 'Espalda recta, contracción sostenida.',
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 60, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 65, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 65, isCompleted: false },
          ]
        },
        {
          id: 'ex-ub-5',
          name: 'Extensiones de Tríceps en Polea Alta (Cuerda)',
          muscleGroup: 'Tríceps',
          restSeconds: 60,
          notes: 'Abre la cuerda al final de la extensión.',
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 25, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '12', weightKg: 27, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 30, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'routine-lower-b',
      name: 'Lower B — Isquios & Cadena Posterior',
      shortName: 'Lower B',
      targetMuscles: ['Isquios', 'Glúteos', 'Cuádriceps', 'Gemelos', 'Core / Abdomen'],
      estimatedMinutes: 55,
      exercises: [
        {
          id: 'ex-lb-1',
          name: 'Peso Muerto Convencional',
          muscleGroup: 'Isquios',
          restSeconds: 120,
          notes: 'Mantén la barra pegada a las espinillas.',
          sets: [
            { id: 's1', setNumber: 1, reps: '5', weightKg: 110, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '5', weightKg: 120, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '5', weightKg: 130, isCompleted: false },
          ]
        },
        {
          id: 'ex-lb-2',
          name: 'Sentadilla Búlgara con Mancuernas',
          muscleGroup: 'Cuádriceps',
          restSeconds: 90,
          notes: 'Enfoca la presión en el talón del pie delantero.',
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 18, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 20, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 20, isCompleted: false },
          ]
        },
        {
          id: 'ex-lb-3',
          name: 'Hip Thrust con Barra (Empuje de Cadera)',
          muscleGroup: 'Glúteos',
          restSeconds: 90,
          notes: 'Pausa de 2s arriba con retroversión pélvica.',
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 100, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 110, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 120, isCompleted: false },
          ]
        },
        {
          id: 'ex-lb-4',
          name: 'Extensiones de Cuádriceps en Máquina',
          muscleGroup: 'Cuádriceps',
          restSeconds: 60,
          notes: 'Control excéntrico para bombear sangre.',
          sets: [
            { id: 's1', setNumber: 1, reps: '15', weightKg: 50, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '12', weightKg: 55, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '12', weightKg: 60, isCompleted: false },
          ]
        }
      ]
    }
  ]
};

export const PPL_SPLIT: WorkoutSplit = {
  id: 'split-ppl',
  name: 'Push / Pull / Legs (PPL)',
  description: 'Estructura clásica de 6 días dividida en Empuje, Tirón y Piernas para máxima hipertrofia.',
  schedule: {
    1: 'REST',
    2: 'REST',
    3: 'REST',
    4: 'REST',
    5: 'REST',
    6: 'REST',
    0: 'REST',
  },
  routines: [
    {
      id: 'routine-push-a',
      name: 'Push A — Pecho, Hombro & Tríceps',
      shortName: 'Push A',
      targetMuscles: ['Pecho', 'Hombros', 'Tríceps'],
      estimatedMinutes: 60,
      exercises: [
        {
          id: 'ex-ppa-1',
          name: 'Press de Banca con Barra',
          muscleGroup: 'Pecho',
          restSeconds: 120,
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 75, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 80, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '6', weightKg: 85, isCompleted: false },
          ]
        },
        {
          id: 'ex-ppa-2',
          name: 'Press Militar Sentado con Mancuernas',
          muscleGroup: 'Hombros',
          restSeconds: 90,
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 22, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 24, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 24, isCompleted: false },
          ]
        },
        {
          id: 'ex-ppa-3',
          name: 'Aperturas en Polea Inclinada',
          muscleGroup: 'Pecho',
          restSeconds: 60,
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 15, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '12', weightKg: 15, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 17, isCompleted: false },
          ]
        },
        {
          id: 'ex-ppa-4',
          name: 'Press Francés con Barra Z',
          muscleGroup: 'Tríceps',
          restSeconds: 75,
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 30, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 32, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 35, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'routine-pull-a',
      name: 'Pull A — Espalda, Rear Delt & Bíceps',
      shortName: 'Pull A',
      targetMuscles: ['Espalda', 'Hombros', 'Bíceps'],
      estimatedMinutes: 60,
      exercises: [
        {
          id: 'ex-pla-1',
          name: 'Remo con Barra T o Pecho Apoyado',
          muscleGroup: 'Espalda',
          restSeconds: 90,
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 50, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 60, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 60, isCompleted: false },
          ]
        },
        {
          id: 'ex-pla-2',
          name: 'Jalón al Pecho Agarre Ancho',
          muscleGroup: 'Espalda',
          restSeconds: 75,
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 55, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 60, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 60, isCompleted: false },
          ]
        },
        {
          id: 'ex-pla-3',
          name: 'Face Pull en Polea Alta',
          muscleGroup: 'Hombros',
          restSeconds: 60,
          sets: [
            { id: 's1', setNumber: 1, reps: '15', weightKg: 20, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '15', weightKg: 25, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '12', weightKg: 25, isCompleted: false },
          ]
        },
        {
          id: 'ex-pla-4',
          name: 'Curl Martillo con Mancuernas',
          muscleGroup: 'Bíceps',
          restSeconds: 60,
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 14, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 16, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 16, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'routine-legs-a',
      name: 'Legs A — Cuádriceps, Isquios & Gemelos',
      shortName: 'Legs A',
      targetMuscles: ['Cuádriceps', 'Isquios', 'Glúteos', 'Gemelos'],
      estimatedMinutes: 60,
      exercises: [
        {
          id: 'ex-lga-1',
          name: 'Hack Squat (Sentadilla Hack)',
          muscleGroup: 'Cuádriceps',
          restSeconds: 120,
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 100, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 120, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 130, isCompleted: false },
          ]
        },
        {
          id: 'ex-lga-2',
          name: 'Curl Femoral Acostado',
          muscleGroup: 'Isquios',
          restSeconds: 75,
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 40, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 45, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 45, isCompleted: false },
          ]
        },
        {
          id: 'ex-lga-3',
          name: 'Zancadas Dinámicas con Mancuernas',
          muscleGroup: 'Cuádriceps',
          restSeconds: 75,
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 16, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '12', weightKg: 18, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 18, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'routine-push-b',
      name: 'Push B — Inclinado & Hombro Lateral',
      shortName: 'Push B',
      targetMuscles: ['Pecho', 'Hombros', 'Tríceps'],
      estimatedMinutes: 55,
      exercises: [
        {
          id: 'ex-ppb-1',
          name: 'Press Inclinado con Mancuernas',
          muscleGroup: 'Pecho',
          restSeconds: 90,
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 28, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 30, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 32, isCompleted: false },
          ]
        },
        {
          id: 'ex-ppb-2',
          name: 'Elevaciones Laterales Pesadas',
          muscleGroup: 'Hombros',
          restSeconds: 60,
          sets: [
            { id: 's1', setNumber: 1, reps: '15', weightKg: 12, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '12', weightKg: 14, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '10', weightKg: 14, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'routine-pull-b',
      name: 'Pull B — Densidad Espalda & Bíceps',
      shortName: 'Pull B',
      targetMuscles: ['Espalda', 'Bíceps'],
      estimatedMinutes: 55,
      exercises: [
        {
          id: 'ex-plb-1',
          name: 'Remo Unilateral con Mancuerna (Kroc Row)',
          muscleGroup: 'Espalda',
          restSeconds: 90,
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 32, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 36, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '8', weightKg: 40, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'routine-legs-b',
      name: 'Legs B — Glúteos & Peso Muerto',
      shortName: 'Legs B',
      targetMuscles: ['Glúteos', 'Isquios', 'Cuádriceps'],
      estimatedMinutes: 55,
      exercises: [
        {
          id: 'ex-lgb-1',
          name: 'Peso Muerto Rumano',
          muscleGroup: 'Isquios',
          restSeconds: 120,
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 90, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 100, isCompleted: false },
          ]
        }
      ]
    }
  ]
};

export const FULL_BODY_SPLIT: WorkoutSplit = {
  id: 'split-full-body',
  name: 'Full Body (3 días)',
  description: 'Frecuencia ideal para compaginar estudio/trabajo con entrenamientos de cuerpo completo.',
  schedule: {
    1: 'REST',
    2: 'REST',
    3: 'REST',
    4: 'REST',
    5: 'REST',
    6: 'REST',
    0: 'REST',
  },
  routines: [
    {
      id: 'routine-fb-a',
      name: 'Full Body A — Fuerza Básica',
      shortName: 'Full Body A',
      targetMuscles: ['Cuádriceps', 'Pecho', 'Espalda', 'Hombros', 'Core / Abdomen'],
      estimatedMinutes: 65,
      exercises: [
        {
          id: 'ex-fba-1',
          name: 'Sentadilla con Barra',
          muscleGroup: 'Cuádriceps',
          restSeconds: 120,
          sets: [
            { id: 's1', setNumber: 1, reps: '6', weightKg: 90, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '6', weightKg: 95, isCompleted: false },
            { id: 's3', setNumber: 3, reps: '6', weightKg: 100, isCompleted: false },
          ]
        },
        {
          id: 'ex-fba-2',
          name: 'Press de Banca Plano',
          muscleGroup: 'Pecho',
          restSeconds: 90,
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 75, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 80, isCompleted: false },
          ]
        },
        {
          id: 'ex-fba-3',
          name: 'Remo con Barra Prono',
          muscleGroup: 'Espalda',
          restSeconds: 90,
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 70, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 75, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'routine-fb-b',
      name: 'Full Body B — Tracción & Unilateral',
      shortName: 'Full Body B',
      targetMuscles: ['Isquios', 'Hombros', 'Espalda', 'Bíceps', 'Tríceps'],
      estimatedMinutes: 60,
      exercises: [
        {
          id: 'ex-fbb-1',
          name: 'Peso Muerto Rumano',
          muscleGroup: 'Isquios',
          restSeconds: 120,
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 85, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 90, isCompleted: false },
          ]
        },
        {
          id: 'ex-fbb-2',
          name: 'Press Militar con Barra',
          muscleGroup: 'Hombros',
          restSeconds: 90,
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 45, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 45, isCompleted: false },
          ]
        },
        {
          id: 'ex-fbb-3',
          name: 'Dominadas Neutras',
          muscleGroup: 'Espalda',
          restSeconds: 90,
          sets: [
            { id: 's1', setNumber: 1, reps: '8', weightKg: 0, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '8', weightKg: 0, isCompleted: false },
          ]
        }
      ]
    },
    {
      id: 'routine-fb-c',
      name: 'Full Body C — Hipertrofia & Bombeo',
      shortName: 'Full Body C',
      targetMuscles: ['Cuádriceps', 'Pecho', 'Espalda', 'Bíceps', 'Tríceps'],
      estimatedMinutes: 60,
      exercises: [
        {
          id: 'ex-fbc-1',
          name: 'Prensa de Piernas',
          muscleGroup: 'Cuádriceps',
          restSeconds: 90,
          sets: [
            { id: 's1', setNumber: 1, reps: '12', weightKg: 180, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 200, isCompleted: false },
          ]
        },
        {
          id: 'ex-fbc-2',
          name: 'Press Inclinado con Mancuernas',
          muscleGroup: 'Pecho',
          restSeconds: 90,
          sets: [
            { id: 's1', setNumber: 1, reps: '10', weightKg: 28, isCompleted: false },
            { id: 's2', setNumber: 2, reps: '10', weightKg: 30, isCompleted: false },
          ]
        }
      ]
    }
  ]
};

export const DEFAULT_SPLITS: WorkoutSplit[] = [
  UPPER_LOWER_SPLIT,
  PPL_SPLIT,
  FULL_BODY_SPLIT
];
