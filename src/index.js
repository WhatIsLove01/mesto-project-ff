import './pages/index.css';
import { initialCards } from './scripts/cards';
import { createCard, handleLike, deleteCard } from './components/card';
import { openModal, closeModal, setModalEventListeners, closeByOverlay } from './components/modal';

// @todo: DOM узлы
const containerCard = document.querySelector('.places__list');

// @todo: Вывести карточки на страницу
function outputCards() {
  initialCards.forEach((dataCard) => {
    const card = createCard(
      dataCard.name,
      dataCard.link,
      handleLike,
      deleteCard,
      handleCardClick // обязательно передаём!
    );
    containerCard.append(card);
  });
}

// Вызов функции для отображения карточек
outputCards();

// кнопка редактирования профиля
const buttonEdit = document.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_type_edit');

// кнопка добавления карточки
const buttonAdd = document.querySelector('.profile__add-button');
const popupAdd = document.querySelector('.popup_type_new-card');

// открытие картинки
const imageOpen = document.querySelector('.card__image');
const popupImage = document.querySelector('.popup_type_image');

// кнопка закрытия попапов
const buttonsClose = document.querySelectorAll('.popup__close');

// текст профиля
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// форма редактирования профиля
const inputName = document.querySelector('.popup__input_type_name');
const inputDescription = document.querySelector('.popup__input_type_description');

// открытие редактирования профиля
buttonEdit.addEventListener('click',function(){
  // Заполнение полей формы текущими данными профиля
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  openModal(popupEdit)
});

// открытие добавления карточки
buttonAdd.addEventListener('click', function(){
  openModal(popupAdd)
});

// закрытие попапов по кнопке закрытия
buttonsClose.forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
})

// Находим форму в DOM
const formEditProfile = document.querySelector('.popup__form[name="edit-profile"]');
// Находим поля формы в DOM
const nameInput = document.querySelector('.popup__input_type_name');
const jobInput = document.querySelector('.popup__input_type_description');

// Обработчик «отправки» формы
function handleEditProfileFormSubmit(evt) {
    evt.preventDefault(); // Отмена стандартной отправки

    // Получаем значения полей
    const nameValue = nameInput.value;
    const jobValue = jobInput.value;

    // Выбираем элементы профиля
    const profileTitle = document.querySelector('.profile__title');
    const profileDescription = document.querySelector('.profile__description');

    // Вставляем новые значения
    profileTitle.textContent = nameValue;
    profileDescription.textContent = jobValue;

    // Закрываем попап после сохранения
    closeModal(popupEdit);
}

// Прикрепляем обработчик к форме
formEditProfile.addEventListener('submit', handleEditProfileFormSubmit);

const formAddCard = document.querySelector('.popup__form[name="new-place"]');
const inputCardName = document.querySelector('.popup__input_type_card-name');
const inputCardLink = document.querySelector('.popup__input_type_url');

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  // Получаем значения полей
  const name = inputCardName.value;
  const link = inputCardLink.value;

  // Создаём новую карточку
  const newCard = createCard(
    name,
    link,
    handleLike,
    deleteCard,
    handleCardClick // обязательно передаём!
  );

  // Добавляем карточку в начало контейнера
  containerCard.prepend(newCard);

  // Очищаем форму
  formAddCard.reset();

  // Закрываем попап
  closeModal(popupAdd);
}

formAddCard.addEventListener('submit', handleAddCardSubmit);

// функция-обработчик клика по изображению карточки
function handleCardClick(name, link) {
  const popupImage = document.querySelector('.popup_type_image');
  const popupImg = popupImage.querySelector('.popup__image');
  const popupCaption = popupImage.querySelector('.popup__caption');
  popupImg.src = link;
  popupImg.alt = name;
  popupCaption.textContent = name;
  openModal(popupImage);
}

// Установка слушателей событий для закрытия попапов
setModalEventListeners();

// Добавляем слушатель для закрытия по оверлею
document.addEventListener('click', closeByOverlay);