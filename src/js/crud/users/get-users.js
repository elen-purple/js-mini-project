export const getUsers = async () => {
  try {
    return await fetch(
      `https://680dfecfc47cb8074d91bfc4.mockapi.io/mini-project/users`
    ).then((reponse) => reponse.json());
  } catch (e) {
    return e;
  }
};
