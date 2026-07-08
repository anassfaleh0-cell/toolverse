const r = await fetch('http://ip-api.com/json/8.8.8.8');
const d = await r.json();
console.log(JSON.stringify(d));
