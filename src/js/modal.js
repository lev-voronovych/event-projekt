const modalBackdrop = document.querySelector('.modal-backdrop');
const closeBtn = document.querySelector('.btn-modal-close');

function togleModal() {
    modalBackdrop.classList.toggle("is-hidden")
}

closeBtn.addEventListener("click", togleModal)
modalBackdrop.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) togleModal()
})

