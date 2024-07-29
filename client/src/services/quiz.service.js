import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getAllQuizzes = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "/quizzes");
    return response.data;
  } catch (error) {
    console.error("Error getting quizzes:", error);
    throw error;
  }
};

export const getQuizById = async quizId => {
  try {
    const response = await axios.get(API_BASE_URL + `/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting quiz by ID:", error);
    throw error;
  }
};

export const createQuiz = async (userId, quizData) => {
  try {
    const response = await axios.post(
      API_BASE_URL + `/quiz/create/${userId}`,
      quizData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

export const explainAnswer = async quizId => {
  try {
    const response = await axios.post(API_BASE_URL + `/quiz/explain/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

export const updateQuiz = async (quizId, quizData) => {
  try {
    const response = await axios.put(
      API_BASE_URL + `/quizzes/${quizId}`,
      quizData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating quiz:", error);
    throw error;
  }
};

export const deleteQuiz = async quizId => {
  try {
    const response = await axios.delete(API_BASE_URL + `/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting quiz:", error);
    throw error;
  }
};

export const startQuizAttempt = async (userId, quizId) => {
  try {
    const response = await axios.post(
      API_BASE_URL + `/quizzes/${quizId}/attempt/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error starting quiz attempt:", error);
    throw error;
  }
};

export const shareQuiz = async (senderId, receiverId, quizId) => {
  try {
    const response = await axios.post(API_BASE_URL + "/shareQuiz", {
      senderId,
      receiverId,
      quizId,
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export const acceptQuiz = async notificationId => {
  try {
    const response = await axios.put(`/api/acceptQuiz/${notificationId}`);
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};

export const denyQuiz = async notificationId => {
  try {
    const response = await axios.put(`/api/denyQuiz/${notificationId}`);
    console.log(response.data); // Handle the response as needed
  } catch (error) {
    console.error(error);
  }
};
