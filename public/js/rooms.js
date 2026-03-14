// public/js/rooms.js
// I merged some of the guardrails within my branch into this that weren't on the final version of phase 1

let reservationStart = null;
let reservationRange = [];

function reserveSlot(btn, date, slotIndex, room){

    if (btn.classList.contains('btn-reserved') || btn.classList.contains('btn-faculty') || btn.classList.contains('btn-checkedin')){
        alert("This slot is already reserved.");
        return;
    }

    const dayIndex = btn.dataset.day;

    if (reservationStart === null){
        reservationStart = { dayIndex, slotIndex, date, room, btn };
        btn.classList.remove('btn-available');
        btn.classList.add('btn-selected');
        btn.textContent = "Start";
        return;
    }

    if (reservationStart.dayIndex !== dayIndex){
        alert("Start and end slots must be on the same day.");
        resetSelection();
        return;
    }

    const startIndex = Math.min(reservationStart.slotIndex, slotIndex);
    const endIndex   = Math.max(reservationStart.slotIndex, slotIndex);
    const slotCount = endIndex - startIndex + 1;

    if (slotCount < 2){
        alert("Minimum reservation time is 1 hour (2 consecutive slots).");
        resetSelection();
        return;
    }

    if (slotCount > 4){
        alert("Maximum reservation time is 2 hours (4 consecutive slots).");
        resetSelection();
        return;
    }

    const allButtons = document.querySelectorAll(`button[data-day="${dayIndex}"]`);

    let conflict = false;

    allButtons.forEach(b => {
        const bIndex = parseInt(b.dataset.slot);
        if (bIndex >= startIndex && bIndex <= endIndex){
            if (b.classList.contains('btn-reserved') || b.classList.contains('btn-faculty')  || b.classList.contains('btn-checkedin')){
                conflict = true;
            }
        }
    });

    if (conflict){
        alert("Your selected range includes an already-reserved slot. Please choose a different range.");
        resetSelection();
        return;
    }

    reservationRange = [];

    allButtons.forEach(b => {
        const bIndex = parseInt(b.dataset.slot);
        if (bIndex >= startIndex && bIndex <= endIndex){
            b.classList.remove('btn-available');
            b.classList.add('btn-selected');
            b.textContent = "Selected";
            reservationRange.push({
                dayIndex,
                slotIndex: bIndex,
                date: b.dataset.date,
                slotTime: b.dataset.time,
                room
            });
        }
    });

    document.getElementById('confirmBtn').style.display = 'inline-block';
    reservationStart = null;
}

function showPrivacyModal(){
    if (reservationRange.length < 2){
        alert("Please select at least 2 consecutive slots (1 hour minimum).");
        return;
    }
    const myModal = new bootstrap.Modal(document.getElementById('anonModal'));
    myModal.show();
}

function processBooking(isAnon){

    const modalEl = document.getElementById('anonModal');
    bootstrap.Modal.getInstance(modalEl).hide();

    const selections = reservationRange.map(s => ({
        room:      s.room,
        date:      s.date,
        slotTime:  s.slotTime,
        slotIndex: s.slotIndex
    }));

    fetch('/reserve-multiple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections, isAnon })
    })
    .then(res => {
        if (res.ok) {
            location.reload();
        } else {
            return res.text().then(msg => { throw new Error(msg); });
        }
    })
    .catch(err => {
        console.error("Reservation error:", err);
        alert("Reservation failed. Please try again.");
        resetSelection();
    });
}

function resetSelection(){

    reservationStart = null;

    reservationRange.forEach(s => {
        const btns = document.querySelectorAll(
            `button[data-day="${s.dayIndex}"][data-slot="${s.slotIndex}"]`
        );
        btns.forEach(b => {
            b.classList.remove('btn-selected');
            b.classList.add('btn-available');
            b.textContent = "Reserve";
        });
    });

    if (reservationStart && reservationStart.btn){
        reservationStart.btn.classList.remove('btn-selected');
        reservationStart.btn.classList.add('btn-available');
        reservationStart.btn.textContent = "Reserve";
    }

    reservationRange = [];
    const confirmBtn = document.getElementById('confirmBtn');

    if (confirmBtn){
        confirmBtn.style.display = 'none';
    }
}