import { defineStore } from "pinia";

export const usePageStore = defineStore("page", () => {
  const isOpen = ref(true);

  const onPage = ref(true);

  function isSideBarOpen(v: boolean, n?: any) {
    [isOpen.value, onPage.value] = v ? [true, true] : [false, false];
  }

  return { isOpen, onPage, isSideBarOpen };
});
