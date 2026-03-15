document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const role     = document.getElementById('role').value;
  const errorEl  = document.getElementById('errorMsg');

  errorEl.textContent = '';

  if (!username || !password || !role) {
    errorEl.textContent = 'Please fill all fields';
    return;
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, role })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Login failed');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    window.location.href = '/dashboard.html';

  } catch (err) {
    errorEl.textContent = err.message;
  }
});