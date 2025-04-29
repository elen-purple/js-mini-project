export const deletePost = async (id) => {
  try {
    await fetch(
      `https://680dfecfc47cb8074d91bfc4.mockapi.io/mini-project/posts/${id}`,
      {
        method: "DELETE",
      }
    );
  } catch (e) {
    return e;
  }
};
