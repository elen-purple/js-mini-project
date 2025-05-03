export const getPosts = async (page) => {
  try {
    return await fetch(
      `https://680dfecfc47cb8074d91bfc4.mockapi.io/mini-project/posts?l=8&p=${page}`
    ).then((reponse) => reponse.json());
  } catch (e) {
    return e;
  }
};
