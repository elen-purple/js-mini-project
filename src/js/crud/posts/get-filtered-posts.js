export const getFilteredPosts = async (key, value, page) => {
  const posts = await fetch(
    `https://680dfecfc47cb8074d91bfc4.mockapi.io/mini-project/posts`
    ).then((reponse) => reponse.json());
  if (
    posts.filter((post) => post.tag.toLowerCase().includes(value.toLowerCase()))
      .length > 0
  ) {
    try {
      return await fetch(
        `https://680dfecfc47cb8074d91bfc4.mockapi.io/mini-project/posts?l=8&p=${page}&${key}=${value}`
      ).then((reponse) => reponse.json());
    } catch (e) {
      return e;
    }
  }
};
