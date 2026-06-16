import API from "./axios";

/* Employees */
export const getEmployees = () => API.get("employees/");

/* EB Subjects */
export const getEBSubjects = () => API.get("eb-subjects/");

/* EB Results */
export const getEBExams = () => API.get("eb-exams/");

export const createEBExam = (data) => API.post("eb-exams/", data);

export const updateEBExam = (id, data) => API.put(`eb-exams/${id}/`, data);

export const deleteEBExam = (id) => API.delete(`eb-exams/${id}/`);

/* Promotions */
export const getPromotions = () => API.get("promotions/");

export const createPromotion = (data) => API.post("promotions/", data);

export const updatePromotion = (id, data) => API.put(`promotions/${id}/`, data);

export const deletePromotion = (id) => API.delete(`promotions/${id}/`);
