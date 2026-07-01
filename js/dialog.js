export function createDialogController({ gameMenuDialogIds, getWorld, isGameCanvasVisible }) {
  let isGameMenuPauseActive = false;

  function initDialogBackdropClose() {
    const dialogs = document.querySelectorAll(".metaDialog");

    dialogs.forEach((dialog) => {
      if (!(dialog instanceof HTMLDialogElement)) return;

      dialog.addEventListener("click", (event) => {
        if (event.target !== dialog) return;

        dialog.close();
        syncGameMenuPauseState();
      });
    });
  }

  function isAnyGameMenuDialogOpen() {
    return gameMenuDialogIds.some((dialogId) => {
      const dialog = document.getElementById(dialogId);
      return dialog instanceof HTMLDialogElement && dialog.open;
    });
  }

  function syncGameMenuPauseState() {
    const world = getWorld();

    if (!world || !isGameCanvasVisible()) return;

    const shouldPauseForMenu = isAnyGameMenuDialogOpen();

    if (shouldPauseForMenu) {
      if (!world.isPaused) {
        isGameMenuPauseActive = true;
        world.isPaused = true;
        world.resetKeyboard?.();
      }
      return;
    }

    if (!isGameMenuPauseActive) return;

    isGameMenuPauseActive = false;
    world.isPaused = false;
    world.resetKeyboard?.();
  }

  function initGameMenuDialogPause() {
    gameMenuDialogIds.forEach((dialogId) => {
      const dialog = document.getElementById(dialogId);

      if (!(dialog instanceof HTMLDialogElement)) return;

      dialog.addEventListener("close", syncGameMenuPauseState);
      dialog.addEventListener("cancel", () => {
        window.setTimeout(syncGameMenuPauseState, 0);
      });
    });
  }

  function openDialogById(dialogId) {
    openDialogByIdWithOptions(dialogId);
  }

  function openDialogByIdWithOptions(dialogId, options = {}) {
    if (!dialogId) return;

    const dialog = document.getElementById(dialogId);

    if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;

    updateDialogMenuReturnState(dialog, Boolean(options.fromGameMenu));
    dialog.showModal();
    syncGameMenuPauseState();
  }

  function updateDialogMenuReturnState(dialog, shouldShow) {
    const backToMenuButton = dialog.querySelector(".backToMenuButton");

    if (!(backToMenuButton instanceof HTMLButtonElement)) return;

    backToMenuButton.hidden = !shouldShow;
  }

  function closeDialogById(dialogId) {
    const dialog = document.getElementById(dialogId);

    if (!(dialog instanceof HTMLDialogElement) || !dialog.open) return;

    dialog.close();
    updateDialogMenuReturnState(dialog, false);
    syncGameMenuPauseState();
  }

  function initGameMenu() {
    const gameMenuButton = document.getElementById("gameMenuButton");

    initGameMenuDialogPause();

    if (!(gameMenuButton instanceof HTMLButtonElement)) return;

    gameMenuButton.addEventListener("click", () => {
      openDialogById("gameMenuDialog");
    });
  }

  function initStartScreenDialogs() {
    const dialogButtons = document.querySelectorAll("[data-dialog-target]");
    const returnButtons = document.querySelectorAll("[data-return-dialog-target]");

    dialogButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const dialogId = button.getAttribute("data-dialog-target");
        const fromGameMenu = Boolean(button.closest("#gameMenuDialog"));

        if (button.closest("#gameMenuDialog")) {
          closeDialogById("gameMenuDialog");
        }
        openDialogByIdWithOptions(dialogId, { fromGameMenu });
      });
    });

    returnButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (!(button instanceof HTMLButtonElement)) return;

        const dialogId = button.getAttribute("data-return-dialog-target");
        const currentDialog = button.closest("dialog");

        if (currentDialog instanceof HTMLDialogElement && currentDialog.id) {
          closeDialogById(currentDialog.id);
        }

        openDialogById(dialogId);
      });
    });
  }

  function isMetaDialogOpen() {
    return Array.from(document.querySelectorAll(".metaDialog")).some((dialog) => dialog.open);
  }

  return {
    initDialogBackdropClose,
    initGameMenu,
    initStartScreenDialogs,
    isMetaDialogOpen,
  };
}