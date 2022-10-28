import "../css/app.css";
import "bulma/css/bulma.min.css";
import "@fontsource/poppins";
import { createApp } from "petite-vue";

export const actions = {
  post: {
    async delete(id) {
      const res = await fetch("/api/post/" + id, {
        method: "DELETE",
        headers: withCsrf(withContentJson()),
      });
      return res.ok && res.status === 200;
    },
    async create(published, formElem) {
      const formData = new FormData(formElem);
      const asParams = new URLSearchParams(formData);
      asParams.set("published", published);

      const res = await fetch("/api/post", {
        method: "POST",
        body: asParams,
        headers: withCsrf(),
      });
      return res.ok && res.status === 201;
    },
    async save(id) {
      const res = await fetch("/api/post/" + id + "/save", {
        method: "POST",
        headers: withCsrf()
      })
      return res.ok && res.status === 200;
    }
  },
  async logout() {
    const res = await fetch("/logout", {
      method: "POST",
      headers: withCsrf(),
    });
    return res.ok && res.status === 200;
  },
};

/** Frontend components **/

/**
 * @typedef PostNavProps
 * @property postId {number}
 * @property saved {boolean}
 * @property username {string}
 */

/**
 * @param props {PostNavProps}
 */
export function PostNav(props) {
  return {
    deletePost: async () => {
      await actions.post.delete(props.postId);
      window.location.href = "/" + props.username;
    },
    savePost: async () => {
      await actions.post.save(props.postId)
    }
  };
}

export function FileUpload(props) {
  return {
    fileName: null,
    fileUrl: props?.imageUrl,
    onFileInput(e) {
      const files = e.target.files

      if (files.length > 0) {
        this.fileName = files[0].name
        this.fileUrl = URL.createObjectURL(files[0])
      } else {
        this.fileName = null
        this.fileUrl = null
      }
    }
  }
}

/* End Components */

createApp({
  PostNav,
  FileUpload
}).mount();

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name))
    ?.split("=")[1];
  // var cookieValue = null;
  // if (document.cookie && document.cookie !== "") {
  //   var cookies = document.cookie.split(";");
  //   for (var i = 0; i < cookies.length; i++) {
  //     var cookie = cookies[i].trim();
  //     // Does this cookie string begin with the name we want?
  //     if (cookie.substring(0, name.length + 1) === name + "=") {
  //       cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
  //       break;
  //     }
  //   }
  // }
  // return cookieValue;
}

const withCsrf = (obj) => {
  return { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"), ...obj };
};
const withContentJson = (obj) => {
  return { "Content-Type": "application/json", ...obj };
};

  // const logoutBtn = $(".btn-logout");
  // if (logoutBtn.length > 0) {
  //   bindEvent(logoutBtn, "click", async function () {
  //     const success = await actions.logout();
  //     if (success) {
  //       window.location.href = "/";
  //     }
  //   });
  // }
  // const followBtn = $(".btn-follow");
  // if (followBtn != null) {
  //   followBtn.addEventListener("click", () => {
  //     const uid = followBtn.getAttribute("data-uid");
  //     console.log(uid);
  //     // TODO: complete this
  //   });
  // }
  // const btnDelete = $(".btn-delete");
  // if (btnDelete.length > 0) {
  //   bindEvent(btnDelete, "click", async (e) => {
  //     const postElem = e.target.closest("[data-postid]");
  //     const postId = postElem.getAttribute("data-postid");
  //     const success = await actions.post.delete(postId);
  //     if (success) {
  //       postElem.remove();
  //     }
  //   });
  // }
