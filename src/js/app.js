import { getPosts } from "./crud/get-posts";
import { createPost } from "./crud/create-posts";
import { updatePost } from "./crud/update-post";
import { getPost } from "./crud/get-post";
import { deletePost } from "./crud/delete-post";
import { getFilteredPosts } from "./crud/get-filtered-posts";
import layoutPosts from "../templates/posts.hbs";
let page = 1;
getPosts(page).then((data) => {
  const layout = layoutPosts({ data });
  document.querySelector(".posts__list").innerHTML = layout;
});
let search = "";
document.querySelector(".posts__load").addEventListener("click", () => {
  if (document.querySelector(".posts__input").value !== "") {
    page += 1;
    getFilteredPosts("tag", search, page).then((data) => {
      const layout = layoutPosts({ data });
      document
        .querySelector(".posts__list")
        .insertAdjacentHTML("beforeend", layout);
    });
  } else {
    page += 1;
    getPosts(page).then((data) => {
      const layout = layoutPosts({ data });
      document
        .querySelector(".posts__list")
        .insertAdjacentHTML("beforeend", layout);
    });
  }
});

document.querySelector(".add__form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const post = {
    avatar: e.target[0].value,
    user: e.target[1].value,
    tag: e.target[2].value,
    body: e.target[3].value,
    comments: [],
  };
  e.target[0].value = "";
  e.target[1].value = "";
  e.target[2].value = "";
  e.target[3].value = "";
  await createPost(post);
  let postsLayout = "";
  for (let i = 1; i < page + 1; i += 1) {
    await getPosts(i).then((data) => {
      const layout = layoutPosts({ data });
      postsLayout = postsLayout.concat("", layout);
    });
  }
  document.querySelector(".posts__list").innerHTML = postsLayout;
});

let currentId = "";

document.querySelector(".posts__list").addEventListener("click", async (e) => {
  if (e.target.classList.contains("posts__btn--update")) {
    document.querySelector(".backdrop").classList.toggle("is-hidden");
    document.querySelector("body").classList.toggle("no-scroll");
    currentId = e.target.parentElement.parentElement.id;
    await getPost(e.target.parentElement.parentElement.id).then((post) => {
      document
        .querySelector(".backdrop")
        .querySelector(`[name="avatar"]`).value = post.avatar;
      document.querySelector(".backdrop").querySelector(`[name="user"]`).value =
        post.user;
      document.querySelector(".backdrop").querySelector(`[name="tag"]`).value =
        post.tag;
      document.querySelector(".backdrop").querySelector(`[name="body"]`).value =
        post.body;
    });
  } else if (e.target.classList.contains("posts__btn--delete")) {
    await deletePost(e.target.parentElement.parentElement.id);
    let postsLayout = "";
    for (let i = 1; i < page + 1; i += 1) {
      await getFilteredPosts("tag", search, i).then((data) => {
        const layout = layoutPosts({ data });
        postsLayout = postsLayout.concat("", layout);
      });
    }
    document.querySelector(".posts__list").innerHTML = postsLayout;
  }
});

document.querySelector(".update__close").addEventListener("click", () => {
  document.querySelector(".backdrop").classList.toggle("is-hidden");
  document.querySelector("body").classList.toggle("no-scroll");
});

document
  .querySelector(".update__form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const post = {
      avatar: e.target[0].value,
      user: e.target[1].value,
      tag: e.target[2].value,
      body: e.target[3].value,
      comments: [],
    };
    e.target[0].value = "";
    e.target[1].value = "";
    e.target[2].value = "";
    e.target[3].value = "";
    document.querySelector(".backdrop").classList.toggle("is-hidden");
    document.querySelector("body").classList.toggle("no-scroll");
    await updatePost(post, currentId);
    let postsLayout = "";
    for (let i = 1; i < page + 1; i += 1) {
      await getFilteredPosts("tag", search, i).then((data) => {
        const layout = layoutPosts({ data });
        postsLayout = postsLayout.concat("", layout);
      });
    }
    document.querySelector(".posts__list").innerHTML = postsLayout;
  });

let commentId = "";
document.querySelector(".posts__list").addEventListener("click", async (e) => {
  if (e.target.classList.contains("posts__comments")) {
    commentId = e.target.parentElement.id;
    document.querySelector(".modal__backdrop").classList.toggle("is-hidden");
    document.querySelector("body").classList.toggle("no-scroll");
    const post = await getPost(e.target.parentElement.id);
    document.querySelector("#modal__avatar").src = post.avatar;
    document.querySelector("#modal__user").textContent = post.user;
    document.querySelector("#modal__tag").textContent = post.tag;
    document.querySelector("#modal__body").textContent = post.body;
    document.querySelector("#modal__comments").innerHTML = post.comments
      .map((com) => `<li class="modal__comment">${com.text}</li>`)
      .join("");
    if (document.querySelector("#modal__comments").innerHTML === "") {
      document.querySelector(
        "#modal__comments"
      ).innerHTML = `<p class="modal__none">There are any comments yet...</p>`;
    }
  }
});
document.querySelector(".modal__form").addEventListener("submit", (e) => {
  e.preventDefault();
});

document.querySelector(".modal__close").addEventListener("click", async () => {
  document.querySelector(".modal__backdrop").classList.toggle("is-hidden");
  document.querySelector("body").classList.toggle("no-scroll");
  document.querySelector("#modal__avatar").src = "";
  document.querySelector("#modal__user").textContent = "";
  document.querySelector("#modal__tag").textContent = "";
  document.querySelector("#modal__body").textContent = "";
  document.querySelector("#modal__comments").innerHTML = "";
});

document.querySelector(".modal__form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const post = await getPost(commentId);
  const comment = document.querySelector(".modal__input").value;
  const comments = [...post.comments];
  document.querySelector(".modal__input").value = "";
  comments[comments.length] = {
    text: comment,
  };
  const updatedPost = {
    avatar: post.avatar,
    user: post.user,
    tag: post.tag,
    body: post.body,
    id: post.id,
    comments: comments,
    user: post.user,
  };
  await updatePost(updatedPost, commentId);
  const gettedPost = await getPost(commentId);
  document.querySelector("#modal__avatar").src = gettedPost.avatar;
  document.querySelector("#modal__user").textContent = gettedPost.user;
  document.querySelector("#modal__tag").textContent = gettedPost.tag;
  document.querySelector("#modal__body").textContent = gettedPost.body;
  document.querySelector("#modal__comments").innerHTML = gettedPost.comments
    .map((com) => `<li class="modal__comment">${com.text}</li>`)
    .join("");
});

document.querySelector(".posts__input").addEventListener("input", async (e) => {
  search = e.currentTarget.value;
  page = 1;
  let postsLayout = "";
  for (let i = 1; i < page + 1; i += 1) {
    await getFilteredPosts("tag", search, i).then((data) => {
      const layout = layoutPosts({ data });
      postsLayout = postsLayout.concat("", layout);
    });
  }
  document.querySelector(".posts__list").innerHTML = postsLayout;
  if (document.querySelector(".posts__list").innerHTML === "") {
    document.querySelector(
      ".posts__list"
    ).innerHTML = `<p class="posts__none">There are any posts like this...</p>`;
  }
});
