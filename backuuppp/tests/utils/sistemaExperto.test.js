// tests/utils/sistemaExperto.test.js
const SistemaExpertoMedico = require('../../SistemaExperto');

describe('SistemaExpertoMedico', () => {
  let sistema;

  beforeEach(() => {
    sistema = new SistemaExpertoMedico();
  });

  it('recomienda Cardiología si dolorPecho es true', () => {
    const salida = sistema.recomendarEspecialidad({ dolorPecho: true });
    expect(salida).toContain('Cardiología');
  });

  it('recomienda Neurología si mareos y dolorCabeza son true', () => {
    const salida = sistema.recomendarEspecialidad({ mareos: true, dolorCabeza: true });
    expect(salida).toContain('Neurología');
  });

  it('devuelve mensaje por defecto si no hay matches', () => {
    const salida = sistema.recomendarEspecialidad({ sintomaX: true });
    expect(salida).toEqual(['No se encontró una especialidad adecuada']);
  });
});
