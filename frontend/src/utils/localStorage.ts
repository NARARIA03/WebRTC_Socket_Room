/**
 * @description 로컬스토리지에서 값 가져오는 함수
 */
export const getLocalStorage = (key: string): string | null => {
  const value = localStorage.getItem(key);
  return value;
};

/**
 * @description 로컬스토리지에 값 저장하는 함수
 */
export const setLocalStorage = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

/**
 * @description 로컬스토리지에서 값 삭제하는 함수
 */
export const deleteLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
