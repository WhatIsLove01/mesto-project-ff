function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscClose);
}

function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscClose);
}

function handleEscClose(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

const closeByOverlay = evt => {
  if (evt.target.classList.contains('popup_is-opened')) {
    closeModal(evt.target);
  }
};

export { openModal, closeModal, closeByOverlay };

export function setModalEventListeners() {
  document.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('popup_is-opened')) {
      closeModal(evt.target);
    }
  });
}