export const getPost = async (id) => {
  try {
    return await fetch(
      `https://680dfecfc47cb8074d91bfc4.mockapi.io/mini-project/posts/${id}`
    ).then((reponse) => reponse.json());
  } catch (e) {
    return e;
  }
};
