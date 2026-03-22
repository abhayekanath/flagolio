const dialog = document.getElementById("docs-modal") as HTMLDialogElement | null;
const openBtn = document.getElementById("docs-modal-open");
const closeBtn = document.getElementById("docs-modal-close");

openBtn?.addEventListener("click", () => {
  dialog?.showModal();
});

closeBtn?.addEventListener("click", () => {
  dialog?.close();
});

dialog?.addEventListener("close", () => {
  openBtn?.focus();
});
