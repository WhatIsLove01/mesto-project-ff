// @todo: DOM узлы
const containerCard = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(name, imageSrc) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true);

  // Установка данных карточки
  const cardImage = cardElement.querySelector('.card__image');
  cardImage.src = imageSrc;
  cardImage.alt = name;

  cardElement.querySelector('.card__title').textContent = name;

  // Добавление обработчика для кнопки удаления
  const buttonDelete = cardElement.querySelector('.card__delete-button');
  buttonDelete.addEventListener('click', deleteCard);

  return cardElement;
}

// @todo: Функция удаления карточки
function deleteCard(evt) {
  const card = evt.target.closest('.places__item');
  card.remove();
}

// @todo: Вывести карточки на страницу
function outputCard() {
  initialCards.forEach((dataCard) => {
    const card = createCard(dataCard.name, dataCard.link);
    containerCard.append(card);
  });
}

// Вызов функции для отображения карточек
outputCard();