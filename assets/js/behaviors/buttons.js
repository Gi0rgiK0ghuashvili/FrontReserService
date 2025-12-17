function editHall(id, name) {
    document.getElementById('editHallId').value = id;
    document.getElementById('editHallName').value = name;
    
    // Bootstrap 5 მოდალის გახსნა
    const editModalEl = document.getElementById('editHallModal');
    const editModal = new bootstrap.Modal(editModalEl);
    editModal.show();
}

function deleteHall(id, name) {
    if (confirm('დარწმუნებული ხართ რომ გსურთ "' + name + '" მენიუს წაშლა?')) {
        const formData = new FormData();
        formData.append('action', 'delete');
        formData.append('id', id);
        
        // დებაგი - რა იგზავნება
        console.log('=== DELETE REQUEST ===');
        console.log('ID:', id);
        console.log('Name:', name);
        for (let pair of formData.entries()) {
            console.log(pair[0] + ':', pair[1]);
        }
        
        fetch('hall_operations.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Status:', response.status);
            return response.text();
        })
        .then(text => {
            console.log('Raw Response:', text);
            console.log('Response Length:', text.length);
            console.log('First 100 chars:', text.substring(0, 100));
            
            const data = JSON.parse(text);
            console.log('Parsed:', data);
            
            if (data.success) {
                alert('მენიუ წარმატებით წაიშალა!');
                location.reload();
            } else {
                alert('შეცდომა: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('შეცდომა!');
        });
    }
}

// ახალი დარბაზის დამატება
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addHallForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        formData.append('action', 'add');
        
        fetch('hall_operations.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Add response status:', response.status);
            return response.text();
        })
        .then(text => {
            console.log('Add response text:', text);
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    alert('მენიუ წარმატებით დაემატა!');
                    location.reload();
                } else {
                    alert('შეცდომა: ' + data.message);
                }
            } catch (e) {
                console.error('JSON parse error:', e);
                alert('ორგანიზაციის საპასუხო ფორმატში შეცდომა');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('ქსელის შეცდომა მოხდა!');
        });
    });

    // დარბაზის რედაქტირება
    document.getElementById('editHallForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        formData.append('action', 'edit');
        
        fetch('hall_operations.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            console.log('Edit response status:', response.status);
            return response.text();
        })
        .then(text => {
            console.log('Edit response text:', text);
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    alert('მენიუ წარმატებით განახლდა!');
                    // მოდალის დახურვა
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editHallModal'));
                    if (modal) {
                        modal.hide();
                    }
                    location.reload();
                } else {
                    alert('შეცდომა: ' + data.message);
                }
            } catch (e) {
                console.error('JSON parse error:', e);
                alert('ორგანიზაციის საპასუხო ფორმატში შეცდომა');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            alert('ქსელის შეცდომა მოხდა!');
        });
    });
});