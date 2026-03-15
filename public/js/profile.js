// public/js/profile.js

// Edit Bio
function editMyBio() {
    const newBio = prompt("Enter your new bio:")
    if (newBio !== null && newBio.trim() !== "") {
        fetch('/profile/update-bio', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ bio: newBio })
        }).then(res => { if (res.ok) location.reload() })
    }
}

// Photo upload -> show preview when file is selected
const photoInput = document.getElementById('photoFileInput')
if (photoInput) {
    photoInput.addEventListener('change', () => {
        const file = photoInput.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = e => {
            document.getElementById('photoPreview').src = e.target.result
            document.getElementById('photoPreviewWrap').style.display = 'block'
        }
        reader.readAsDataURL(file)
    })
}

// Upload the selected file to the server
function confirmPhotoUpload () {
    const file = photoInput.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('photo', file)

    fetch('/profile/update-photo', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            if (data.success) location.reload()
            else alert(data.error || 'Upload failed.')
        })
        .catch(() => alert('Network error. Please try again.'))
}

// Cancel -> hide preview and clear the input
function cancelPhotoUpload () {
    photoInput.value = ''
    document.getElementById('photoPreviewWrap').style.display = 'none'
    document.getElementById('photoPreview').src = ''
}

// Delete Account
function deleteAccount() {
    if (confirm("Delete account? This will permanently remove your profile and all your reservations.")) {
        fetch('/profile/delete', { method: 'POST' })
            .then(() => window.location.href = '/login')
    }
}
