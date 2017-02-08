let userId = localStorage.getItem('userId');

if (!userId) {
  const newId = '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem('userId', newId);
  userId = newId;
}

ga('set', 'userId', userId);

export function getUserId() {
  return userId;
}
