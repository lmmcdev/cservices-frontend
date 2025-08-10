// Función para actualizar el estado solo si ha cambiado
export default function setIfChanged(setter, next, areEqual = Object.is) {
  setter(prev => (areEqual(prev, next) ? prev : next));
}