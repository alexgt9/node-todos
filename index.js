import app from './app.js';
import getPort, { portNumbers } from 'get-port';

const PORT = process.env.PORT || await getPort({ port: portNumbers(5100, 5200)});
const PUBLIC_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`Api docs on ${PUBLIC_URL}/api-docs`);
  console.log(`Listening on ${PUBLIC_URL}`);
});