export const emailRegex = new RegExp(/^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,63}\.[a-zA-Z]{2,}$/);
export const passwordRegex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
export const numberRegex = new RegExp(/^\d+$/);
export const StringWithSpace = new RegExp(/^[a-zA-Z. ]{2,32}$/);
export const phoneNumberRegex = new RegExp(/^[0-9]{10}$/);
export const classNameRegex = new RegExp(/^[a-zA-Z0-9. ]{2,32}$/);
export const SubjectNameRegex = new RegExp(/^[a-zA-Z0-9. ]{2,64}$/);
export const lectureNameRegex = new RegExp(/^[a-zA-Z0-9. ]{2,64}$/);
export const urlRegex =new RegExp(/https:\/\/vz-[a-f0-9]{8}-[a-z0-9]{3}\.b-cdn\.net\/[a-f0-9-]{36}\/playlist\.m3u8/)