function createCard(name, imageSrc, handleLike, handleDelete, handleImageClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

  // Установка данных карточки
  const cardImage = cardElement.querySelector('.card__image');
  cardImage.src = imageSrc;
  cardImage.alt = name;

  cardElement.querySelector('.card__title').textContent = name;

  // Добавление обработчика для кнопки удаления
  const buttonDelete = cardElement.querySelector('.card__delete-button');
  buttonDelete.addEventListener('click', handleDelete);

  // --- Обработчик открытия попапа с картинкой ---
  cardImage.addEventListener('click', function() {
    if (typeof handleImageClick === 'function') {
      handleImageClick(name, imageSrc);
    }
  });

  const likeButton = cardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', handleLike);

  return cardElement;
}

function handleLike(evt) {
  evt.target.classList.toggle('card__like-button_is-active');
}

function deleteCard(evt) {
  const card = evt.target.closest('.places__item');
  card.remove();
}

export { createCard, handleLike, deleteCard };
