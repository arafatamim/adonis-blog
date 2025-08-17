import { defineComponent, ref, computed } from "vue";

export default defineComponent({
  name: "CommentBox",
  props: {
    initialComment: {
      type: String,
      default: "",
    },
    maxLength: {
      type: Number,
      default: 500,
    },
  },
  emits: ["submit"],
  setup(props, { emit }) {
    const comment = ref(props.initialComment);
    const remainingChars = computed(
      () => props.maxLength - comment.value.length,
    );

    const handleInput = (event: Event) => {
      const target = event.target as HTMLTextAreaElement;
      comment.value = target.value.slice(0, props.maxLength);
    };

    const handleSubmit = () => {
      const text = comment.value.trim();
      if (!text) return;
      emit("submit", text);
      comment.value = "";
    };

    return () => (
      <div class="box">
        <div class="field">
          <div class="control">
            <textarea
              class="textarea"
              placeholder="Write a comment..."
              value={comment.value}
              maxlength={props.maxLength}
              onInput={handleInput}
            />
          </div>
          <p class="help">
            {remainingChars.value} character
            {remainingChars.value === 1 ? "" : "s"} remaining
          </p>
        </div>
        <div class="field">
          <div class="control">
            <button
              class="button"
              disabled={!comment.value.trim()}
              onClick={handleSubmit}
            >
              Post Comment
            </button>
          </div>
        </div>
      </div>
    );
  },
});
