import './pages/index.css';
import { createCard, handleLikeButtonClick } from './components/card';
import { openModal, closeModal } from './components/modal';
import { clearValidation, enableValidation } from "./components/validation";
import { addCard, getInitialCards, getUserInfo, removeCard, updateUserAvatar, updateUserProfile } from "./components/api.js";

// Шаблон карточки и контейнер для списка
const cardTemplateNode = document.querySelector("#card-template").content;
const cardList = document.querySelector(".places__list");

// Элементы для аватара пользователя
const avatarEditBtn = document.querySelector(".profile__image-edit-button");
const avatarPopupNode = document.querySelector(".popup_type_avatar");
const avatarFormNode = document.querySelector('form[name="avatar-update"]');
const avatarInputLink = avatarFormNode.querySelector('input[name="avatar-link"]');
const userAvatar = document.querySelector(".profile__image");

// Элементы профиля пользователя
const profilePopupNode = document.querySelector(".popup_type_edit");
const profileEditBtn = document.querySelector(".profile__edit-button");
const userName = document.querySelector(".profile__title");
const userAbout = document.querySelector(".profile__description");
const profileFormNode = document.querySelector('form[name="edit-profile"]');
const userNameInput = profileFormNode.querySelector('input[name="name"]');
const userAboutInput = profileFormNode.querySelector('input[name="description"]');

// Элементы для добавления новой карточки
const cardAddBtn = document.querySelector(".profile__add-button");
const cardAddPopupNode = document.querySelector(".popup_type_new-card");
const cardAddFormNode = document.querySelector('form[name="new-place"]');
const cardNameInput = cardAddFormNode.querySelector('input[name="place-name"]');
const cardLinkInput = cardAddFormNode.querySelector('input[name="link"]');

// Элементы попапа с изображением
const imagePopupNode = document.querySelector(".popup_type_image");
const imagePopupPic = imagePopupNode.querySelector(".popup__image");
const imagePopupText = imagePopupNode.querySelector(".popup__caption");

// Элементы попапа удаления карточки
const cardDeletePopupNode = document.querySelector(".popup_type_delete-card");
const cardDeleteBtn = cardDeletePopupNode.querySelector(".popup__button_delete");

let cardPendingDelete = null;

// Список всех попапов
const popupList = document.querySelectorAll(".popup");

// Конфиг для валидации форм
const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible"
};

// Изменяет текст кнопки во время загрузки
function setLoadingState(isLoading, button, buttonText = "Сохранить", loadingText = "Сохранение...") {
  button.textContent = isLoading ? loadingText : buttonText;
}

// Открывает попап и сбрасывает форму
const showPopupWithReset = (form, popup, config) => {
  form.reset();
  clearValidation(form, config);
  openModal(popup);
};

// Универсальный обработчик отправки формы
const handleFormSend = (evt, submitCallback) => {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  const originalText = submitBtn.textContent;
  setLoadingState(true, submitBtn, originalText);
  submitCallback()
    .catch((err) => console.error(err))
    .finally(() => setLoadingState(false, submitBtn, originalText));
};

// Обновление аватара пользователя
avatarFormNode.addEventListener("submit", (evt) => {
  handleFormSend(evt, () => {
    const avatarUrl = avatarInputLink.value;
    return updateUserAvatar(avatarUrl)
      .then((userData) => {
        userAvatar.style.backgroundImage = `url(${userData.avatar})`;
        closeModal(avatarPopupNode);
        avatarFormNode.reset();
      });
  });
});

// Открытие попапа аватара
avatarEditBtn.addEventListener("click", () => showPopupWithReset(avatarFormNode, avatarPopupNode, validationSettings));

// Открытие изображения карточки
function handleCardImageClick({ link, name }) {
  imagePopupPic.src = link;
  imagePopupPic.alt = name;
  imagePopupText.textContent = name;
  openModal(imagePopupNode);
}

// Обновление профиля пользователя
profileFormNode.addEventListener("submit", (evt) => {
  handleFormSend(evt, () => {
    const name = userNameInput.value;
    const about = userAboutInput.value;
    return updateUserProfile(name, about)
      .then((userData) => {
        userName.textContent = userData.name;
        userAbout.textContent = userData.about;
        closeModal(profilePopupNode);
      });
  });
});

// Открытие попапа профиля
profileEditBtn.addEventListener("click", () => {
  userNameInput.value = userName.textContent;
  userAboutInput.value = userAbout.textContent;
  clearValidation(profileFormNode, validationSettings);
  openModal(profilePopupNode);
});

// Добавление новой карточки
cardAddFormNode.addEventListener("submit", (evt) => {
  handleFormSend(evt, () => {
    const name = cardNameInput.value;
    const link = cardLinkInput.value;
    return addCard(name, link)
      .then((cardData) => {
        const newCard = createCard(
          cardData,
          cardTemplateNode,
          handleLikeButtonClick,
          handleCardImageClick,
          handleDeleteButtonClick,
          userName.dataset.userId // <-- добавлено
        );
        cardList.prepend(newCard);
        closeModal(cardAddPopupNode);
        cardAddFormNode.reset();
      });
  });
});

// Открытие попапа добавления карточки
cardAddBtn.addEventListener("click", () => showPopupWithReset(cardAddFormNode, cardAddPopupNode, validationSettings));

// Открытие попапа удаления карточки
function handleDeleteButtonClick(cardElement) {
  cardPendingDelete = cardElement;
  openModal(cardDeletePopupNode);
}

// Удаление карточки
cardDeleteBtn.addEventListener("click", () => {
  if (cardPendingDelete) {
    const cardId = cardPendingDelete.dataset.cardId;
    const originalText = cardDeleteBtn.textContent;
    setLoadingState(true, cardDeleteBtn, originalText, "Удаление...");
    removeCard(cardId)
      .then(() => {
        cardPendingDelete.remove();
        closeModal(cardDeletePopupNode);
      })
      .catch((err) => console.error(`Ошибка при удалении карточки: ${err}`))
      .finally(() => {
        setLoadingState(false, cardDeleteBtn, originalText);
        cardPendingDelete = null;
      });
  }
});

// Закрытие попапов по крестику и оверлею
popupList.forEach((popup) => {
  const closeBtn = popup.querySelector(".popup__close");
  closeBtn.addEventListener("click", () => closeModal(popup));
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === evt.currentTarget) closeModal(popup);
  });
});

// Отрисовка карточек на странице
function renderCards(cards) {
  cards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      cardTemplateNode,
      handleLikeButtonClick,
      handleCardImageClick,
      handleDeleteButtonClick,
      userName.dataset.userId // <-- добавлено
    );
    cardList.append(cardElement);
  });
}

// Инициализация: загрузка профиля и карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userName.textContent = userData.name;
    userAbout.textContent = userData.about;
    if (userData.avatar) {
      userAvatar.style.backgroundImage = `url(${userData.avatar})`;
    }
    userName.dataset.userId = userData._id;
    renderCards(cards);
  })
  .catch((err) => {
    console.error(`Ошибка при загрузке данных: ${err}`);
  });

// Включение валидации форм
enableValidation(validationSettings);