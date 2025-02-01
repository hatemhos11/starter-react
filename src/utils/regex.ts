export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex = new RegExp(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/);
// LOCALIZATION
export const arabicRegex = new RegExp(/^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF0-9\s\p{P}\p{S}]+$/u);
export const englishRegex = new RegExp(/^[A-Za-z0-9\s\p{P}\p{S}]+$/u);
