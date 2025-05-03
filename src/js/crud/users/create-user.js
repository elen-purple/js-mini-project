export const createUser = async (user) => {
  try {
    await fetch(
      "https://680dfecfc47cb8074d91bfc4.mockapi.io/mini-project/users",
      {
        method: "POST",
        body: JSON.stringify(user),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
  } catch (e) {
    return e;
  }
};
