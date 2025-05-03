export const updatePost = async (post, id) => {
  try {
    await fetch(
      `https://680dfecfc47cb8074d91bfc4.mockapi.io/mini-project/posts/${id}`,
      {
        method: "PUT",
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
