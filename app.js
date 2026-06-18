const STORAGE_KEY = 'hotel_inventory_rooms_v1';
let filter = 'All';

function loadRooms() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveRooms(rooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}
function nights(a, b) {
  if (!a || !b) return 0;
  const d = (new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round(d));
}
function esc(v) {
  return `"${String(v ?? '').replaceAll('"', '""')}"`;
}
function updateCounts(rooms) {
  document.getElementById('cAvailable').textContent = rooms.filter(r => r.status === 'Available').length;
  document.getElementById('cBooked').textContent = rooms.filter(r => r.status === 'Booked').length;
  document.getElementById('cTentative').textContent = rooms.filter(r => r.status === 'Tentative').length;
}
function render() {
  const rooms = loadRooms();
  updateCounts(rooms);
  const list = document.getElementById('list');
  const show = filter === 'All' ? rooms : rooms.filter(r => r.status === filter);

  list.innerHTML = show.map((r, idx) => `
    <div class="room ${r.status.toLowerCase()}">
      <h3>Room ${r.roomNumber} • ${r.status}</h3>
      <div class="small">${r.roomType}</div>
      <div class="small">Guest: ${r.guestName || '-'}</div>
      <div class="small">Contact: ${r.contactNumber || '-'}</div>
      <div class="small">${r.checkIn || '-'} → ${r.checkOut || '-'} (${nights(r.checkIn, r.checkOut)} nights)</div>
      <div style="margin-top:8px; display:flex; gap:8px;">
        <button class="pill" onclick="setStatus(${idx},'Available')">Available</button>
        <button class="pill" onclick="setStatus(${idx},'Booked')">Booked</button>
        <button class="pill" onclick="setStatus(${idx},'Tentative')">Tentative</button>
        <button class="pill" onclick="removeRoom(${idx})">Delete</button>
      </div>
    </div>
  `).join('');
}
window.setStatus = (idx, status) => {
  const rooms = loadRooms();
  if (!rooms[idx]) return;
  rooms[idx].status = status;
  saveRooms(rooms);
  render();
};
window.removeRoom = (idx) => {
  const rooms = loadRooms();
  rooms.splice(idx, 1);
  saveRooms(rooms);
  render();
};

document.getElementById('roomForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const rooms = loadRooms();
  const room = {
    roomNumber: document.getElementById('roomNumber').value.trim(),
    roomType: document.getElementById('roomType').value,
    status: document.getElementById('status').value,
    guestName: document.getElementById('guestName').value.trim(),
    contactNumber: document.getElementById('contactNumber').value.trim(),
    checkIn: document.getElementById('checkIn').value,
    checkOut: document.getElementById('checkOut').value
  };
  if (!room.roomNumber) return;
  rooms.push(room);
  saveRooms(rooms);
  e.target.reset();
  render();
});

document.querySelectorAll('.pill[data-filter]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pill[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  });
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const rooms = loadRooms();
  const rows = [['Room Number','Room Type','Status','Guest Name','Contact Number','Check-in','Check-out','Nights']];
  rooms.forEach(r => rows.push([r.roomNumber,r.roomType,r.status,r.guestName,r.contactNumber,r.checkIn,r.checkOut,nights(r.checkIn,r.checkOut)]));
  const csv = rows.map(row => row.map(esc).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `hotel_inventory_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

// Register SW for GitHub Pages project path
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/Hotel_inventory_app/sw.js', { scope: '/Hotel_inventory_app/' })
      .then(() => console.log('Service Worker registered'))
      .catch((err) => console.error('Service Worker registration failed:', err));
  });
}

render();