import { router } from "@inertiajs/vue3";
import { ref } from "vue";
import type { PostMeta } from "~/types/post_meta";

export default function useSave(
  postId: number,
  initialValue: PostMeta = {
    isSaved: false,
    savesCount: 0,
  },
) {
  const isSaved = ref(initialValue.isSaved);
  const savesCount = ref(initialValue.savesCount);

  const toggleSave = () => {
    if (isSaved.value) {
      // Unlike the post
      router.delete(`/posts/${postId}/save`, {
        preserveState: true,
        preserveScroll: true,
        onSuccess: (page) => {
          isSaved.value = false;
          savesCount.value = Math.max(0, savesCount.value - 1);
          router.reload({ only: ["savedPosts"] });
        },
      });
    } else {
      // Like the post
      router.post(
        `/posts/${postId}/save`,
        {},
        {
          preserveState: true,
          preserveScroll: true,
          onSuccess: (page) => {
            isSaved.value = true;
            savesCount.value += 1;
            router.reload({ only: ["savedPosts"] });
          },
        },
      );
    }
  };

  return {
    isSaved,
    savesCount,
    toggleSave,
  };
}
