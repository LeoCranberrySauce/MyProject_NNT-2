import axios from 'axios';

// Usage: node simulateOrderMovement.js <serverBaseUrl> <orderId>
// Example: node simulateOrderMovement.js http://localhost:5000 645f8d...

const serverBase = process.argv[2] || 'http://localhost:4000';
const orderId = process.argv[3];

if (!orderId) {
  console.error('Please provide an orderId as the 2nd argument');
  process.exit(1);
}

// Simple linear interpolation from start to end
const lerp = (a,b,t) => a + (b-a)*t;

async function getOrder() {
  try {
    const res = await axios.get(`${serverBase}/api/order/track/${orderId}`);
    if (res.data && res.data.success && res.data.location) return res.data.location;
  } catch (e) { console.error('getOrder error', e.message); }
  return null;
}

async function updateLocation(lat,lng,name) {
  try {
    const payload = { orderId, location: { lat, lng, name } };
    await axios.post(`${serverBase}/api/order/update-location`, payload);
    console.log('Updated to', lat, lng);
  } catch (e) { console.error('update error', e.message); }
}

async function simulate() {
  // Attempt to read delivery address location from order (may return simulated location)
  const dest = await getOrder();
  if (!dest) { console.error('Could not fetch order destination'); return; }

  // Choose a starting point slightly offset from destination
  const startLat = dest.lat + 0.01;
  const startLng = dest.lng + 0.01;

  const steps = 20;
  for (let i=0;i<=steps;i++) {
    const t = i/steps;
    const lat = lerp(startLat, dest.lat, t);
    const lng = lerp(startLng, dest.lng, t);
    await updateLocation(lat,lng,`Driver ~${Math.round((1-t)*100)}% away`);
    await new Promise(r=>setTimeout(r, 2000));
  }

  console.log('Simulation complete');
}

simulate();
