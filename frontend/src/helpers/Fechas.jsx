/* 
    HELPER PARA FECHAS
        - Devuelve fechas del tipo: 17 de agosto de 2025, 14:13 (hace 5 minutos)
*/

export const fechaFormateada = (fecha) => {
  return new Date(fecha).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

export const tiempoRelativo = (fecha) => {

  const diff = Date.now() - new Date(fecha).getTime();
  const minutos = Math.floor(diff / 60000);

  if (minutos < 1) return "Hace un momento";
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.floor(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  return `Hace ${dias} d`;

};
