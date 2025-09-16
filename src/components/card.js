import { likeCard, unlikeCard } from "./api.js";

// Обработка лайка карточки
function handleLikeButtonClick(event, cardId, likeCounter) {
  const btnLike = event.target;
  const liked = btnLike.classList.contains("card__like-button_is-active");
  const likeAction = liked ? unlikeCard : likeCard;

  likeAction(cardId)
    .then((cardInfo) => {
      btnLike.classList.toggle("card__like-button_is-active");
      likeCounter.textContent = cardInfo.likes.length;
    })
    .catch((error) => {
      console.error(`Ошибка при обновлении лайка: ${error}`);
    });
}

// Создание карточки
function createCard(
  cardInfo,
  templateNode,
  likeHandler,
  imageClickHandler,
  deleteHandler
) {
  const cardNode = templateNode.querySelector(".card").cloneNode(true);
  cardNode.dataset.cardId = cardInfo._id;

  const imgNode = cardNode.querySelector(".card__image");
  const titleNode = cardNode.querySelector(".card__title");
  const btnDelete = cardNode.querySelector(".card__delete-button");
  const btnLike = cardNode.querySelector(".card__like-button");
  const counterLike = cardNode.querySelector(".card__like-count");

  imgNode.src = cardInfo.link;
  imgNode.alt = cardInfo.name;
  titleNode.textContent = cardInfo.name;
  counterLike.textContent = cardInfo.likes.length;

  const currentUserId = document.querySelector(".profile__title").dataset.userId;

  if (cardInfo.owner && cardInfo.owner._id !== currentUserId) {
    btnDelete.style.display = "none";
  }

  const likedByUser = cardInfo.likes.some((user) => user._id === currentUserId);
  if (likedByUser) {
    btnLike.classList.add("card__like-button_is-active");
  }

  // Вызываем deleteHandler напрямую — он должен открыть попап подтверждения удаления
  btnDelete.addEventListener("click", () => {
    if (typeof deleteHandler === "function") {
      deleteHandler(cardNode);
    }
  });

  btnLike.addEventListener("click", (event) => {
    likeHandler(event, cardInfo._id, counterLike);
  });

  imgNode.addEventListener("click", () => imageClickHandler(cardInfo));

  return cardNode;
}

export { handleLikeButtonClick, createCard };