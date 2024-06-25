import app, { PORT, PUBLIC_URL } from './app.js';

app.listen(PORT, () => {
  console.log(`Api docs on ${PUBLIC_URL}/api-docs`);
  console.log(`Listening on ${PUBLIC_URL}`);
});