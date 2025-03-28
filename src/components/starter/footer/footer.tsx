import { component$ } from "@builder.io/qwik";
import { useServerTimeLoader } from "../../../routes/layout";

export default component$(() => {
  const serverTime = useServerTimeLoader();

  return (
    <footer>
      <div class="container container-center">
          <span>{serverTime.value.date}</span>
      </div>
    </footer>
  );
});
