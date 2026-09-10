const fs = require('fs');

const communeCoords = {
  "Cerrillos": [-33.5000, -70.7167],
  "Cerro Navia": [-33.4243, -70.7386],
  "Conchalí": [-33.3833, -70.6833],
  "El Bosque": [-33.5667, -70.6667],
  "Estación Central": [-33.4667, -70.7000],
  "Huechuraba": [-33.3667, -70.6333],
  "Independencia": [-33.4167, -70.6667],
  "La Cisterna": [-33.5333, -70.6667],
  "La Florida": [-33.5222, -70.5981],
  "La Granja": [-33.5333, -70.6167],
  "La Pintana": [-33.5833, -70.6333],
  "La Reina": [-33.4333, -70.5333],
  "Las Condes": [-33.4140, -70.5482],
  "Lo Barnechea": [-33.3500, -70.5167],
  "Lo Espejo": [-33.5167, -70.6833],
  "Lo Prado": [-33.4333, -70.7167],
  "Macul": [-33.4833, -70.6000],
  "Maipú": [-33.5100, -70.7562],
  "Ñuñoa": [-33.4548, -70.5968],
  "Pedro Aguirre Cerda": [-33.4833, -70.6667],
  "Peñalolén": [-33.4833, -70.5500],
  "Providencia": [-33.4314, -70.6093],
  "Pudahuel": [-33.4333, -70.7667],
  "Quilicura": [-33.3667, -70.7333],
  "Quinta Normal": [-33.4333, -70.6833],
  "Recoleta": [-33.4074, -70.6416],
  "Renca": [-33.4000, -70.7333],
  "San Joaquín": [-33.4833, -70.6333],
  "San Miguel": [-33.4833, -70.6500],
  "San Ramón": [-33.5333, -70.6333],
  "Santiago": [-33.4372, -70.6506],
  "Vitacura": [-33.3833, -70.5667],
  "Puente Alto": [-33.6117, -70.5758],
  "Pirque": [-33.6333, -70.5333],
  "San José de Maipo": [-33.6333, -70.3500],
  "Colina": [-33.2000, -70.6833],
  "Lampa": [-33.2833, -70.8667],
  "Tiltil": [-33.0833, -70.9333],
  "San Bernardo": [-33.5833, -70.7000],
  "Buin": [-33.7333, -70.7333],
  "Calera de Tango": [-33.6333, -70.7833],
  "Paine": [-33.8167, -70.7500],
  "Melipilla": [-33.6833, -71.2167],
  "Alhué": [-34.0333, -71.1000],
  "Curacaví": [-33.4000, -71.1500],
  "María Pinto": [-33.5167, -71.1167],
  "San Pedro": [-33.9000, -71.4667],
  "Talagante": [-33.6667, -70.9333],
  "El Monte": [-33.6833, -71.0167],
  "Isla de Maipo": [-33.7500, -70.9000],
  "Padre Hurtado": [-33.5667, -70.8167],
  "Peñaflor": [-33.6167, -70.8833]
};

const tipos = ["24/7", "TRADICIONAL", "Puntos Soy Starken", "Alianzas"];
const statuses = ["ABIERTO AHORA", "CERRADO"];

let idCounter = 1;
const branches = [];

Object.keys(communeCoords).forEach(comuna => {
  const [baseLat, baseLng] = communeCoords[comuna];
  for (let i = 1; i <= 10; i++) {
    const type = tipos[Math.floor(Math.random() * tipos.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Dispersar pines en un radio pequeño (aprox 2km) alrededor del centro de la comuna
    const latOffset = (Math.random() - 0.5) * 0.04;
    const lngOffset = (Math.random() - 0.5) * 0.04;
    
    branches.push({
      id: idCounter++,
      name: `Starken ${comuna} ${i}`,
      address: `Av. Principal ${Math.floor(Math.random() * 1000) + 1}, ${comuna}`,
      type: type,
      status: status,
      statusText: status === 'CERRADO' ? 'Abre Mañana A Las 09:00' : '',
      lat: parseFloat((baseLat + latOffset).toFixed(5)),
      lng: parseFloat((baseLng + lngOffset).toFixed(5))
    });
  }
});

const content = `export const mockSucursales = ${JSON.stringify(branches, null, 2)};\n`;
fs.writeFileSync('./src/mockSucursales.js', content);
console.log("Mock data generated at ./src/mockSucursales.js with accurate coords!");
