// /public/js/rooms.js

let pendingSelection = [];

function reserveSlot(btn, time, date, room, slotIdx) {
    event.preventDefault();
    // Check if this slot is already in our pending list
    const existingIndex = pendingSelection.findIndex(p => p.slotIdx == slotIdx && p.date == date);
    
    if (existingIndex > -1) {
        // Toggle OFF: Remove from selection and reset button
        pendingSelection.splice(existingIndex, 1);
        btn.className = "btn btn-sm btn-available w-100";
        btn.textContent = "Reserve";
    } else {
        // Toggle ON: Add to selection (with 4-slot limit)
        if (pendingSelection.length >= 4) {
            alert("Limit: You can only select up to 4 slots (2 hours) at a time.");
            return;
        }
        pendingSelection.push({ time, date, room, slotIdx });
        btn.className = "btn btn-sm btn-selected w-100";
        btn.textContent = "Selected";
    }
    
    // Toggle the Confirm button visibility
    $('#confirmBtn').toggle(pendingSelection.length > 0);
}

function showPrivacyModal() {
    // 3. Logic: 1-Hour Minimum (2 slots)
    if (pendingSelection.length < 2) {
        alert("Minimum reservation time is 1 hour (2 consecutive slots).");
        return;
    }
    const myModal = new bootstrap.Modal(document.getElementById('anonModal'));
    myModal.show();
}

function processBooking(isAnon) {
    const modalElement = document.getElementById('anonModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    // Prepare data to match reservationCon.js exactly
    const dataToSend = pendingSelection.map(s => ({
        room: s.room,
        date: s.date,
        slotTime: s.time,
        slotIndex: s.slotIdx, // Must match the name in reservationCon
        isAnonymous: isAnon
    }));

    fetch('/reserve-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections: dataToSend, isAnon: isAnon })
    }).then(res => {
        if (res.ok) location.reload();
        else alert("Reservation failed. Check your connection.");
    });
}
