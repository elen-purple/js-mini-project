export const createPost = async (post) => {
  try {
    await fetch(
      "https://680dfecfc47cb8074d91bfc4.mockapi.io/mini-project/posts",
      {
        method: "POST",
        body: JSON.stringify(post),
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
      }
    );
  } catch (e) {
    return e;
  }
};
