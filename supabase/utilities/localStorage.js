// 로컬 스토리지 사용 함수
export const localStorageUtils = () => {
  const setItemToLocalStorage = (itemKey, item) => {
    const strItem = JSON.stringify(item);
    localStorage.setItem(itemKey, strItem);
  };
  const removeItemFromLocalStorage = (itemKey) => {
    localStorage.removeItem(itemKey);
  };
  const getItemFromLocalStorage = (itemKey) => {
    const strItem = localStorage.getItem(itemKey);
    return JSON.parse(strItem);
  };
  return {
    setItemToLocalStorage,
    removeItemFromLocalStorage,
    getItemFromLocalStorage,
  };
};
