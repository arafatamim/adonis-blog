import { router } from "@inertiajs/vue3";
import { ref } from "vue";

export default function useSave(postId: number, isSaved: boolean) {
  const isSavedRef = ref(isSaved);

  const toggleSave = () => {
    if (isSavedRef.value) {
      router.delete(`/posts/${postId}/save`, {
        preserveState: true,
        preserveScroll: true,
        only: ["savesCount", "isSaved"],
        onSuccess: () => {
          isSavedRef.value = false;
        },
      });
    } else {
      router.post(
        `/posts/${postId}/save`,
        {},
        {
          preserveState: true,
          preserveScroll: true,
          only: ["savesCount", "isSaved"],
          onSuccess: () => {
            isSavedRef.value = true;
          },
        },
      );
    }
  };

  return {
    isSaved: isSavedRef,
    toggleSave,
  };
}
