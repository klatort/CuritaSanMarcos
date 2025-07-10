// // tests/flows/flowReservar.test.js
// // Mockeamos lectura de archivo y base de datos
// jest.mock('fs', () => {
//     const fs = jest.requireActual('fs');
//   return {
//     ...fs,
//   readFileSync: jest.fn().mockReturnValue(
//     '1. Cardiología\n2. Dermatología\n0. Salir'
//   ),
//   };
// });
// jest.mock('../../mysql', () => ({
//   query: jest.fn(),
// }));

// const flowReservar = require('../../flujos/flowReservar');
// const menuFlow    = require('../../flujos/menuFlow');
// const db           = require('../../mysql');

// describe('flowReservar', () => {
//   let tools;
//   beforeEach(() => {
//     tools = {
//       flowDynamic: jest.fn(),
//       fallBack:    jest.fn(),
//       gotoFlow:    jest.fn(),
//     };
//     db.query.mockClear();
//   });

//   it('hace fallBack si la especialidad es inválida', async () => {
//     await flowReservar({ body: '99' }, tools);
//     expect(tools.fallBack).toHaveBeenCalledWith(
//       expect.stringContaining('Respuesta no válida, por favor selecciona una de las especialidades')
//     );
//   });

//   it('si elige "0" vuelve al menú', async () => {
//     await flowReservar({ body: '0' }, tools);
//     expect(tools.flowDynamic).toHaveBeenCalledWith(
//       expect.stringContaining('Regresando al Menú')
//     );
//     expect(tools.gotoFlow).toHaveBeenCalledWith(menuFlow);
//   });
// });
/**
 * Test de formato para flowReservar – cubre el Paso 2 y aumenta la cobertura.
 *  - Verifica que la fecha salga en castellano y en negrita.
 *  - Funciona sólo con mocks; no toca la base de datos real.
 */
// tests/flowReservar.test.js


process.env.NODE_ENV = 'test'

jest.mock("../mysql", () => ({
  getConnection: () => ({
    query: jest.fn(),
    on:    jest.fn()
  })
}))

const mysql       = require('../mysql')
const menuFlow    = require('../flujos/menuFlow')
const flowReservar = require('../flujos/flowReservar')
const {
  _stepEspecialidad,
  _stepMedico,
  _stepHorario
} = flowReservar

describe('Paso 1: Especialidad', () => {
  let msgs, tools

  beforeEach(() => {
    msgs = []
    tools = {
      flowDynamic: async txt => msgs.push(txt),
      fallBack: msg => { throw new Error(`FALL: ${msg}`) },
      gotoFlow: f => msgs.push(`GOTO:${f}`)
    }
    mysql.query.mockReset()
  })

  it('opción 0 regresa al menú', async () => {
    await _stepEspecialidad({ body: '0' }, tools)
    expect(msgs).toEqual([
      'Regresando al Menú... 🏃',
      `GOTO:${menuFlow}`
    ])
  })

  it('opción inválida hace fallBack', async () => {
    await expect(_stepEspecialidad({ body: '999' }, tools))
      .rejects.toThrow(/FALL/)
  })

  it('sin médicos hace fallBack', async () => {
    mysql.query.mockResolvedValue([])
    await expect(_stepEspecialidad({ body: '1' }, tools))
      .rejects.toThrow(/No hay médicos registrados/)
  })

  it('lista de médicos correcta', async () => {
    mysql.query.mockResolvedValue([
      { id_medico: 1, nombre: 'Juana', apellido: 'López' },
      { id_medico: 2, nombre: 'Pedro', apellido: 'García' }
    ])
    await _stepEspecialidad({ body: '1' }, tools)
    expect(msgs[0]).toMatch(/Lista de médicos en/)
    expect(msgs[0]).toMatch(/1\. Juana López/)
    expect(msgs[0]).toMatch(/2\. Pedro García/)
  })
})

describe('Paso 2: Médico', () => {
  let msgs, tools

  beforeEach(() => {
    msgs = []
    tools = {
      flowDynamic: async txt => msgs.push(txt),
      fallBack: msg => { throw new Error(`FALL: ${msg}`) }
    }
    mysql.query.mockReset()
    // simulamos que _stepEspecialidad cargó dicMed
    flowReservar._stepEspecialidad._dicMed = { '1': 42 }
  })

  it('idx inválido hace fallBack', async () => {
    await expect(_stepMedico({ body: '9' }, tools))
      .rejects.toThrow(/FALL/)
  })

  it('sin horarios hace fallBack', async () => {
    mysql.query.mockResolvedValue([])
    await expect(_stepMedico({ body: '1' }, tools))
      .rejects.toThrow(/El médico no está disponible/)
  })

  it('muestra y formatea horarios', async () => {
    mysql.query.mockResolvedValue([
      { id_horario: 7, fecha: '2025-08-05', hora_inicio: '08:00:00', hora_final: '08:30:00' }
    ])
    await _stepMedico({ body: '1' }, tools)
    expect(msgs[0]).toMatch(/\*Martes 5 de agosto \(05\/08\/2025\)\*/)
    expect(msgs[0]).toMatch(/Hora: 08:00 - 08:30/)
  })
})

describe('Paso 3: Horario', () => {
  let msgs, tools

  beforeEach(() => {
    msgs = []
    tools = {
      flowDynamic: async txt => msgs.push(txt),
      fallBack: msg => { throw new Error(`FALL: ${msg}`) },
      gotoFlow: f => msgs.push(`GOTO:${f}`)
    }
    mysql.query.mockReset()
    // simulamos que _stepMedico cargó dicHor
    flowReservar._stepMedico._dicHor = { '1': 99 }
  })

  it('idx inválido hace fallBack', async () => {
    await expect(_stepHorario({ body: 'X' }, tools))
      .rejects.toThrow(/FALL/)
  })

  it('reserva y vuelve al menú', async () => {
    mysql.query.mockResolvedValue({})
    await _stepHorario({ body: '1' }, tools)
    expect(msgs).toEqual([
      'Cita reservada exitosamente. ✅',
      'Regresando al Menú... 🏃',
      `GOTO:${menuFlow}`
    ])
  })
})
