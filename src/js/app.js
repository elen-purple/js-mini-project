import { getPosts } from "./crud/posts/get-posts";
import { createPost } from "./crud/posts/create-posts";
import { updatePost } from "./crud/posts/update-post";
import { getPost } from "./crud/posts/get-post";
import { deletePost } from "./crud/posts/delete-post";
import { getFilteredPosts } from "./crud/posts/get-filtered-posts";
import { createUser } from "./crud/users/create-user";
import { getUsers } from "./crud/users/get-users";
import layoutPosts from "../templates/posts.hbs";
import layoutPostsNoLogined from "../templates/posts-nologined.hbs";

if (!Object.keys(localStorage).includes("isLogined")) {
  localStorage.setItem("isLogined", "");
}

if (localStorage.getItem("isLogined")) {
  document.querySelector(".header__list").classList.add("display-none");
  document.querySelector(".header__wrapper").classList.remove("display-none");
  document.querySelector(".header__name").textContent =
    localStorage.getItem("isLogined");
  document.querySelector(".add__form").querySelector(`[name="name"]`).value =
    localStorage.getItem("isLogined");
  document
    .querySelector(".add__form")
    .querySelector(`[name="name"]`)
    .setAttribute("disabled", "");
} else {
  document.querySelector(".header__list").classList.remove("display-none");
  document.querySelector(".header__wrapper").classList.add("display-none");
}

let page = 1;
getPosts(page).then((data) => {
  let layout;
  if (localStorage.getItem("isLogined")) {
    layout = layoutPosts({ data });
  } else {
    layout = layoutPostsNoLogined({ data });
  }
  document.querySelector(".posts__list").innerHTML = layout;
});
let search = "";
document.querySelector(".posts__load").addEventListener("click", async () => {
  if (document.querySelector(".posts__input").value !== "") {
    page += 1;
    await getFilteredPosts("tag", search, page).then((data) => {
      let layout;
      if (localStorage.getItem("isLogined")) {
        layout = layoutPosts({ data });
      } else {
        layout = layoutPostsNoLogined({ data });
      }
      document
        .querySelector(".posts__list")
        .insertAdjacentHTML("beforeend", layout);
    });
    const posts = await getFilteredPosts("tag", search, page + 1).then(
      (data) => data
    );
    if (posts.length === 0) {
      document.querySelector(".posts__load").classList.add("display-none");
    }
  } else {
    page += 1;
    await getPosts(page).then((data) => {
      let layout;
      if (localStorage.getItem("isLogined")) {
        layout = layoutPosts({ data });
      } else {
        layout = layoutPostsNoLogined({ data });
      }
      document
        .querySelector(".posts__list")
        .insertAdjacentHTML("beforeend", layout);
    });
    const posts = await getPosts(page + 1).then((data) => data);
    if (posts.length === 0) {
      document.querySelector(".posts__load").classList.add("display-none");
    }
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
  if (!localStorage.getItem("isLogined")) {
    e.target[1].value = "";
  }
  e.target[2].value = "";
  e.target[3].value = "";
  await createPost(post);
  let postsLayout = "";
  if (document.querySelector(".posts__input").value !== "") {
    for (let i = 1; i < page + 1; i += 1) {
      await getFilteredPosts(
        "tag",
        document.querySelector(".posts__input").value,
        i
      ).then((data) => {
        let layout;
        if (localStorage.getItem("isLogined")) {
          layout = layoutPosts({ data });
        } else {
          layout = layoutPostsNoLogined({ data });
        }
        postsLayout = postsLayout.concat("", layout);
      });
    }
  } else {
    for (let i = 1; i < page + 1; i += 1) {
      await getPosts(i).then((data) => {
        let layout;
        if (localStorage.getItem("isLogined")) {
          layout = layoutPosts({ data });
        } else {
          layout = layoutPostsNoLogined({ data });
        }
        postsLayout = postsLayout.concat("", layout);
      });
    }
  }
  document.querySelector(".posts__list").innerHTML = postsLayout;
  document.querySelector(".posts__load").classList.remove("display-none");
  if (document.querySelector(".posts__input").value !== "") {
    const posts = await getFilteredPosts("tag", search, page + 1).then(
      (data) => data
    );
    if (posts.length === 0) {
      document.querySelector(".posts__load").classList.add("display-none");
    }
  } else {
    const posts = await getPosts(page + 1).then((data) => data);
    if (posts.length === 0) {
      document.querySelector(".posts__load").classList.add("display-none");
    }
  }
});

let currentId = "";

document.querySelector(".posts__list").addEventListener("click", async (e) => {
  if (e.target.classList.contains("posts__btn--update")) {
    document.querySelector(".backdrop").classList.toggle("is-hidden");
    document.querySelector("body").classList.toggle("no-scroll");
    currentId = e.target.parentElement.parentElement.parentElement.id;
    await getPost(e.target.parentElement.parentElement.parentElement.id).then(
      (post) => {
        document
          .querySelector(".backdrop")
          .querySelector(`[name="avatar"]`).value = post.avatar;
        document
          .querySelector(".backdrop")
          .querySelector(`[name="user"]`).value = post.user;
        document
          .querySelector(".backdrop")
          .querySelector(`[name="tag"]`).value = post.tag;
        document
          .querySelector(".backdrop")
          .querySelector(`[name="body"]`).value = post.body;
      }
    );
  } else if (e.target.classList.contains("posts__btn--delete")) {
    await deletePost(e.target.parentElement.parentElement.parentElement.id);
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
    commentId = e.target.parentElement.parentElement.id;
    document.querySelector(".modal__backdrop").classList.toggle("is-hidden");
    document.querySelector("body").classList.toggle("no-scroll");
    const post = await getPost(e.target.parentElement.parentElement.id);
    document.querySelector("#modal__avatar").src = post.avatar;
    document.querySelector("#modal__user").textContent = post.user;
    document.querySelector("#modal__tag").textContent = post.tag;
    document.querySelector("#modal__body").textContent = post.body;
    document.querySelector("#modal__comments").innerHTML = post.comments
      .map(
        (com) =>
          `<li class="modal__comment"><h3 class='modal__author'>${com.author}</h3><p class='modal__message'>${com.text}</p></li>`
      )
      .join("");
    if (document.querySelector("#modal__comments").innerHTML === "") {
      document.querySelector(
        "#modal__comments"
      ).innerHTML = `<p class="modal__none">There are any comments yet...</p>`;
    }
  }
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
    author: localStorage.getItem("isLogined"),
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
    .map(
      (com) =>
        `<li class="modal__comment"><h3 class='modal__author'>${com.author}</h3><p class='modal__message'>${com.text}</p></li>`
    )
    .join("");
});

document.querySelector(".posts__input").addEventListener("input", async (e) => {
  search = e.currentTarget.value;
  page = 1;
  let postsLayout = "";
  for (let i = 1; i < page + 1; i += 1) {
    await getFilteredPosts("tag", search, i).then((data) => {
      let layout;
      if (localStorage.getItem("isLogined")) {
        layout = layoutPosts({ data });
      } else {
        layout = layoutPostsNoLogined({ data });
      }
      postsLayout = postsLayout.concat("", layout);
    });
  }
  document.querySelector(".posts__list").innerHTML = postsLayout;
  document.querySelector(".posts__load").classList.remove("display-none");
  if (document.querySelector(".posts__list").innerHTML === "") {
    document.querySelector(
      ".posts__list"
    ).innerHTML = `<p class="posts__none">There are any posts like this...</p>`;
    document.querySelector(".posts__load").classList.add("display-none");
  }
  const filteredPosts = await getFilteredPosts("tag", search, page + 1).then(
    (data) => data
  );
  if (filteredPosts.length === 0) {
    document.querySelector(".posts__load").classList.add("display-none");
  }
});

document.querySelector("#sign-up").addEventListener("click", () => {
  document.querySelector(".signup__backdrop").classList.remove("is-hidden");
  document.querySelector("body").classList.add("no-scroll");
});

document.querySelector(".signup__close").addEventListener("click", () => {
  document.querySelector(".signup__backdrop").classList.add("is-hidden");
  document.querySelector("body").classList.remove("no-scroll");
  document.querySelector(".signup__form").querySelector(`[name="user"]`).value =
    "";
  document
    .querySelector(".signup__form")
    .querySelector(`[name="email"]`).value = "";
  document
    .querySelector(".signup__form")
    .querySelector(`[name="password"]`).value = "";
  document.querySelector("#error-name").classList.add("display-none");
  document.querySelector("#error-email").classList.add("display-none");
  document.querySelector(".signup__error").classList.add("display-none");
});

document
  .querySelector(".signup__form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector("#error-name").classList.add("display-none");
    document.querySelector(".signup__error").classList.add("display-none");
    document.querySelector("#error-email").classList.add("display-none");
    const myUser = {
      name: e.target[0].value,
      email: e.target[1].value,
      password: e.target[2].value,
    };
    const email = await getUsers().then(
      (users) => users.filter((user) => user.email === myUser.email).length > 0
    );
    const name = await getUsers().then(
      (users) => users.filter((user) => user.name === myUser.name).length > 0
    );
    if (name || email) {
      document.querySelector(".signup__error").classList.remove("display-none");
      if (email) {
        document.querySelector("#error-email").classList.remove("display-none");
      }
      if (name) {
        document.querySelector("#error-name").classList.remove("display-none");
      }
      return;
    }
    document.querySelector(".signup__backdrop").classList.add("is-hidden");
    document.querySelector("body").classList.remove("no-scroll");
    document.querySelector("#error-name").classList.add("display-none");
    document.querySelector(".signup__error").classList.add("display-none");
    document.querySelector("#error-email").classList.add("display-none");
    e.target[0].value = "";
    e.target[1].value = "";
    e.target[2].value = "";
    document.querySelector(".header__list").classList.add("display-none");
    document.querySelector(".header__wrapper").classList.remove("display-none");
    await createUser(myUser);
    localStorage.setItem("isLogined", myUser.name);
    document.querySelector(".header__name").textContent = myUser.name;
    document.querySelector(".add__form").querySelector(`[name="name"]`).value =
      localStorage.getItem("isLogined");
    document
      .querySelector(".add__form")
      .querySelector(`[name="name"]`)
      .setAttribute("disabled", "");
    let postsLayout = "";
    for (let i = 1; i < page + 1; i += 1) {
      await getFilteredPosts("tag", search, i).then((data) => {
        const layout = layoutPosts({ data });
        postsLayout = postsLayout.concat("", layout);
      });
    }
    document.querySelector(".posts__list").innerHTML = postsLayout;
  });

document.querySelector("#log-out").addEventListener("click", async () => {
  document.querySelector(".header__list").classList.remove("display-none");
  document.querySelector(".header__wrapper").classList.add("display-none");
  localStorage.setItem("isLogined", "");
  document.querySelector(".add__form").querySelector(`[name="name"]`).value =
    "";
  document
    .querySelector(".add__form")
    .querySelector(`[name="name"]`)
    .removeAttribute("disabled");
  let postsLayout = "";
  for (let i = 1; i < page + 1; i += 1) {
    await getFilteredPosts("tag", search, i).then((data) => {
      const layout = layoutPostsNoLogined({ data });
      postsLayout = postsLayout.concat("", layout);
    });
  }
  document.querySelector(".posts__list").innerHTML = postsLayout;
});

document.querySelector("#log-in").addEventListener("click", () => {
  document.querySelector(".login__backdrop").classList.remove("is-hidden");
  document.querySelector("body").classList.add("no-scroll");
});

document.querySelector(".login__close").addEventListener("click", () => {
  document.querySelector(".login__backdrop").classList.add("is-hidden");
  document.querySelector("body").classList.remove("no-scroll");
  document.querySelector(".login__form").querySelector(`[name="email"]`).value =
    "";
  document
    .querySelector(".login__form")
    .querySelector(`[name="password"]`).value = "";
  document.querySelector("#login-error-email").classList.add("display-none");
  document.querySelector("#login-error-password").classList.add("display-none");
  document.querySelector(".login__error").classList.add("display-none");
});

document.querySelector(".login__form").addEventListener("submit", async (e) => {
  e.preventDefault();
  document.querySelector("#login-error-email").classList.add("display-none");
  document.querySelector(".login__error").classList.add("display-none");
  document.querySelector("#login-error-password").classList.add("display-none");

  const emailText = e.target[0].value;
  const passwordText = e.target[1].value;

  const email = await getUsers().then(
    (users) => users.filter((user) => user.email === emailText).length > 0
  );
  if (!email) {
    document.querySelector(".login__error").classList.remove("display-none");
    document
      .querySelector("#login-error-email")
      .classList.remove("display-none");
    return;
  }
  const [user] = await getUsers().then((users) =>
    users.filter((user) => user.email === emailText)
  );
  if (user.password !== passwordText) {
    document.querySelector(".login__error").classList.remove("display-none");
    document
      .querySelector("#login-error-password")
      .classList.remove("display-none");
    return;
  }
  document.querySelector(".login__backdrop").classList.add("is-hidden");
  document.querySelector("body").classList.remove("no-scroll");
  document.querySelector("#login-error-password").classList.add("display-none");
  document.querySelector(".login__error").classList.add("display-none");
  document.querySelector("#login-error-email").classList.add("display-none");
  e.target[0].value = "";
  e.target[1].value = "";
  document.querySelector(".header__list").classList.add("display-none");
  document.querySelector(".header__wrapper").classList.remove("display-none");
  localStorage.setItem("isLogined", user.name);
  document.querySelector(".header__name").textContent = user.name;
  document.querySelector(".add__form").querySelector(`[name="name"]`).value =
    localStorage.getItem("isLogined");
  document
    .querySelector(".add__form")
    .querySelector(`[name="name"]`)
    .setAttribute("disabled", "");
  let postsLayout = "";
  for (let i = 1; i < page + 1; i += 1) {
    await getFilteredPosts("tag", search, i).then((data) => {
      const layout = layoutPosts({ data });
      postsLayout = postsLayout.concat("", layout);
    });
  }
  document.querySelector(".posts__list").innerHTML = postsLayout;
});
