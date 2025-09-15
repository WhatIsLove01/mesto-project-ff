// Функция открытия модального окна
export function openModal(popupElement) {
  if (!popupElement.classList.contains("popup_is-opened")) {
    popupElement.classList.add("popup_is-opened");
  }
  // навешиваем слушатель только один раз
  document.addEventListener("keydown", (event) => handleEscClose(event));
}

// Функция закрытия модального окна
export function closeModal(popupElement) {
  if (popupElement.classList.contains("popup_is-opened")) {
    popupElement.classList.remove("popup_is-opened");
  }
  // снимаем слушатель
  document.removeEventListener("keydown", handleEscClose);
}

// Функция-обработчик для Esc
function handleEscClose(event) {
  if (event.code === "Escape") {
    const openedPopup = document.querySelector(".popup_is-opened");
    openedPopup && closeModal(openedPopup);
  }
}