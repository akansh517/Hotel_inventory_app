// ===== DATA STORAGE =====
function getRooms() {
    return JSON.parse(localStorage.getItem('hotelRooms') || '[]');
}

function saveRooms(rooms) {
    localStorage.setItem('hotelRooms', JSON.stringify(rooms));
}

// ===== RENDER =====
function render() {
    const rooms = getRooms();
    const filter = document.querySelector('.filter-pill.active').dataset.filter;

    const filtered = filter === 'all' ? rooms : rooms.filter(r => r.status === filter);

    // Summary
    document.getElementById('availableCount').textContent = rooms.filter(r => r.status === 'Available').length;
    document.getElementById('bookedCount').textContent = rooms.filter(r => r.status === 'Booked').length;
    document.getElementById('tentativeCount').textContent = rooms.filter(r => r.status === 'Tentative').length;

    // Room List
    const listEl = document.getElementById('roomList');
    const emptyEl = document.getElementById('emptyState');

    if (filtered.length === 0) {
        listEl.innerHTML = '';
        emptyEl.style.display = 'block';
    } else {
        emptyEl.style.display = 'none';
        listEl.innerHTML = filtered.map(room => {
            const statusClass = room.status.toLowerCase();
            return `
                <div class="room-card" data-id="${room.id}">
                    <div class="room-card-header">
                        <h3><span class="status-dot ${statusClass}"></span> Room ${room.roomNumber}</h3>
                        <span class="status-badge ${statusClass}">${room.status}</span>
                    </div>
                    <div class="room-card-body">
                        <div class="type">${room.roomType}</div>
                        ${room.guestName ? `<div class="guest">👤 ${room.guestName}</div>` : ''}
                        <div class="dates">📅 ${formatDate(room.checkInDate)} → ${formatDate(room.checkOutDate)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ===== ADD / EDIT =====
function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Add New Room';
    document.getElementById('roomForm').reset();
    document.getElementById('editingId').value = '';
    document.getElementById('checkInDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('checkOutDate').value = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    document.getElementById('modal').classList.remove('hidden');
}

function openEditModal(room) {
    document.getElementById('modalTitle').textContent = `Edit Room ${room.roomNumber}`;
    document.getElementById('roomNumber').value = room.roomNumber;
    document.getElementById('roomType').value = room.roomType;
    document.getElementById('roomStatus').value = room.status;
    document.getElementById('guestName').value = room.guestName || '';
    document.getElementById('contactNumber').value = room.contactNumber || '';
    document.getElementById('checkInDate').value = room.checkInDate || '';
    document.getElementById('checkOutDate').value = room.checkOutDate || '';
    document.getElementById('editingId').value = room.id;
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function saveRoom(e) {
    e.preventDefault();
    const rooms = getRooms();
    const editingId = document.getElementById('editingId').value;

    const roomData = {
        id: editingId || Date.now().toString(),
        roomNumber: document.getElementById('roomNumber').value.trim(),
        roomType: document.getElementById('roomType').value,
        status: document.getElementById('roomStatus').value,
        guestName: document.getElementById('guestName').value.trim(),
        contactNumber: document.getElementById('contactNumber').value.trim(),
        checkInDate: document.getElementById('checkInDate').value,
        checkOutDate: document.getElementById('checkOutDate').value
    };

    if (editingId) {
        const index = rooms.findIndex(r => r.id === editingId);
        if (index !== -1) rooms[index] = roomData;
    } else {
        rooms.push(roomData);
    }

    saveRooms(rooms);
    closeModal();
    render();
}

// ===== DETAIL VIEW =====
let currentDetailRoom = null;

function openDetail(roomId) {
    const rooms = getRooms();
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    currentDetailRoom = room;

    document.getElementById('detailTitle').textContent = `Room ${room.roomNumber}`;

    const nights = room.checkInDate && room.checkOutDate
        ? Math.ceil((new Date(room.checkOutDate) - new Date(room.checkInDate)) / 86400000)
        : 0;

    document.getElementById('detailContent').innerHTML = `
        <div class="detail-section">
            <h4>Room Information</h4>
            <div class="detail-row"><span class="label">Room Number</span><span class="value">${room.roomNumber}</span></div>
            <div class="detail-row"><span class="label">Type</span><span class="value">${room.roomType}</span></div>
            <div class="detail-row"><span class="label">Status</span><span class="value"><span class="status-badge ${room.status.toLowerCase()}">${room.status}</span></span></div>
        </div>
        <div class="detail-section">
            <h4>Guest Information</h4>
            <div class="detail-row"><span class="label">Name</span><span class="value">${room.guestName || '— Not assigned —'}</span></div>
            <div class="detail-row"><span class="label">Contact</span><span class="value">${room.contactNumber ? `<a href="tel:${room.contactNumber}">${room.contactNumber}</a>` : '— No contact —'}</span></div>
        </div>
        <div class="detail-section">
            <h4>Booking Dates</h4>
            <div class="detail-row"><span class="label">Check-in</span><span class="value">${formatDate(room.checkInDate)}</span></div>
            <div class="detail-row"><span class="label">Check-out</span><span class="value">${formatDate(room.checkOutDate)}</span></div>
            <div class="detail-row"><span class="label">Duration</span><span class="value">${nights} night${nights !== 1 ? 's' : ''}</span></div>
        </div>
        <div class="detail-section">
            <h4>Quick Status Change</h4>
            <div class="status-buttons">
                <button class="status-btn ${room.status === 'Available' ? 'active' : ''}" onclick="changeStatus('${room.id}', 'Available')">✅ Available</button>
                <button class="status-btn ${room.status === 'Booked' ? 'active' : ''}" onclick="changeStatus('${room.id}', 'Booked')">🔴 Booked</button>
                <button class="status-btn ${room.status === 'Tentative' ? 'active' : ''}" onclick="changeStatus('${room.id}', 'Tentative')">🟡 Tentative</button>
            </div>
        </div>
    `;

    document.getElementById('detailModal').classList.remove('hidden');
}

function changeStatus(roomId, newStatus) {
    const rooms = getRooms();
    const room = rooms.find(r => r.id === roomId);
    if (room) {
        room.status = newStatus;
        saveRooms(rooms);
        render();
        openDetail(roomId); // Refresh detail view
    }
}

function closeDetail() {
    document.getElementById('detailModal').classList.add('hidden');
    currentDetailRoom = null;
}

function deleteRoom() {
    if (!currentDetailRoom) return;
    if (confirm(`Delete Room ${currentDetailRoom.roomNumber}?`)) {
        let rooms = getRooms();
        rooms = rooms.filter(r => r.id !== currentDetailRoom.id);
        saveRooms(rooms);
        closeDetail();
        render();
    }
}

function editFromDetail() {
    if (!currentDetailRoom) return;
    closeDetail();
    openEditModal(currentDetailRoom);
}

// ===== EXPORT TO EXCEL (CSV) =====
function exportToExcel() {
    const rooms = getRooms();
    if (rooms.length === 0) {
        alert('No rooms to export!');
        return;
    }

    const filter = document.querySelector('.filter-pill.active').dataset.filter;
    const filtered = filter === 'all' ? rooms : rooms.filter(r => r.status === filter);

    let csv = 'Room Number,Room Type,Status,Guest Name,Contact Number,Check-in Date,Check-out Date,Nights\n';

    filtered.forEach(room => {
        const nights = room.checkInDate && room.checkOutDate
            ? Math.ceil((new Date(room.checkOutDate) - new Date(room.checkInDate)) / 86400000)
            : 0;

        const row = [
            room.roomNumber,
            room.roomType,
            room.status,
            room.guestName || '',
            room.contactNumber || '',
            room.checkInDate || '',
            room.checkOutDate || '',
            nights
        ].map(field => {
            const str = String(field);
            if (str.includes(',') || str.includes('"')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        });

        csv += row.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HotelInventory_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ===== EVENT LISTENERS =====
document.getElementById('addBtn').addEventListener('click', openAddModal);
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('roomForm').addEventListener('submit', saveRoom);
document.getElementById('exportBtn').addEventListener('click', exportToExcel);
document.getElementById('closeDetail').addEventListener('click', closeDetail);
document.getElementById('deleteRoomBtn').addEventListener('click', deleteRoom);
document.getElementById('editRoomBtn').addEventListener('click', editFromDetail);

// Filters
document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        render();
    });
});

// Room card clicks
document.getElementById('roomList').addEventListener('click', (e) => {
    const card = e.target.closest('.room-card');
    if (card) openDetail(card.dataset.id);
});

// Initial render
render();

// Register Service Worker for offline support
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
}