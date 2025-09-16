// Базовый URL и заголовки запросов
const config = {
  baseUrl: "https://nomoreparties.co/v1/wff-cohort-40",
  headers: {
    authorization: "46d30473-151c-4856-9627-d1142bcc5281",
    "Content-Type": "application/json",
  },
};

// Проверка ответа от сервера
const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  // Если ошибка, отклоняем промис
  return Promise.reject(`Ошибка: ${res.status}`);
};

// Получение информации о пользователе с сервера
export const getUserInfo = () => {
  const endpoint = `${config.baseUrl}/users/me`;
  return fetch(endpoint, {
    headers: config.headers,
  }).then(checkResponse);
};

// Получение карточек с сервера
export const getInitialCards = () => {
  const endpoint = `${config.baseUrl}/cards`;
  return fetch(endpoint, {
    headers: config.headers,
  }).then(checkResponse);
};

// Обновление информации о пользователе
export const updateUserProfile = (name, about) => {
  const endpoint = `${config.baseUrl}/users/me`;
  const payload = { name, about };
  return fetch(endpoint, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify(payload),
  }).then(checkResponse);
};

// Добавление новой карточки
export const addCard = (name, link) => {
  const endpoint = `${config.baseUrl}/cards`;
  const payload = { name, link };
  return fetch(endpoint, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify(payload),
  }).then(checkResponse);
};

// Удаление карточки
export const removeCard = (cardId) => {
  const endpoint = `${config.baseUrl}/cards/${cardId}`;
  return fetch(endpoint, {
    method: "DELETE",
    headers: config.headers,
  }).then(checkResponse);
};

// Поставить лайк карточке
export const likeCard = (cardId) => {
  const endpoint = `${config.baseUrl}/cards/likes/${cardId}`;
  return fetch(endpoint, {
    method: "PUT",
    headers: config.headers,
  }).then(checkResponse);
};

// Убрать лайк с карточки
export const unlikeCard = (cardId) => {
  const endpoint = `${config.baseUrl}/cards/likes/${cardId}`;
  return fetch(endpoint, {
    method: "DELETE",
    headers: config.headers,
  }).then(checkResponse);
};

// Обновление аватара пользователя
export const updateUserAvatar = (avatar) => {
  const endpoint = `${config.baseUrl}/users/me/avatar`;
  const payload = { avatar };
  return fetch(endpoint, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify(payload),
  }).then(checkResponse);
};