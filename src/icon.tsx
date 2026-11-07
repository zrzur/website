import { hugeicons as paths } from "./hugeicons";
export function Icon(props: { name: string; class?: string }) {
  return (
    <svg
      class={props.class}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      innerHTML={paths[props.name] || paths.hash}
    />
  );
}
