/**
 * The voice room exactly as the Zrzur app draws it on a computer (web
 * 26.2.0: VoiceCallCardActiveRoom, ParticipantTile, AccountBar's voice card),
 * owner 2026-11-20: "the same design as the app's voice room, a copy of it".
 *
 * The shared screen is the focused tile on top, with the sharer's name in a
 * dark pill; under it the button that hides the others, then one 16:9 tile
 * per person with the default avatar (the Zrzur face on its colour) and the
 * name pill; the one who speaks has the online-colour outline; the full
 * screen button at the end of the bottom edge. The voice card of the channel
 * list is left out (owner, 2026-11-20). A picture of the app, not a working call:
 * nothing is focusable, and the figure carries one label.
 * Icons: the app's own drawings (Hugeicons stroke rounded, MIT).
 */
import { For, type JSX } from "solid-js";

const ICONS = {
  speaker: "<path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"M14 14.814V9.186c0-3.145 0-4.717-.925-5.109-.926-.391-2.015.72-4.193 2.945-1.128 1.152-1.771 1.407-3.376 1.407-1.403 0-2.105 0-2.61.344C1.85 9.487 2.01 10.882 2.01 12s-.159 2.513.888 3.227c.504.344 1.206.344 2.609.344 1.605 0 2.248.255 3.376 1.407 2.178 2.224 3.267 3.336 4.193 2.945.925-.392.925-1.964.925-5.11\" class=z-shape /><path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"M17 9c.625.82 1 1.863 1 3s-.375 2.18-1 3M20 7c1.25 1.366 2 3.106 2 5s-.75 3.634-2 5\"/>",
  hangUp: "<path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"m4.912 10.541 2.64-2.64a2.08 2.08 0 0 0 .507-2.064c-.17-.571-.362-1.257-.49-1.844C7.453 3.45 6.976 3 6.42 3H4.912c-1.11 0-2.023.904-1.901 2.008.926 8.392 7.59 15.055 15.981 15.981 1.104.122 2.008-.79 2.008-1.9v-1.51c0-.554-.452-1.01-.998-1.11-.603-.109-1.24-.289-1.774-.459-.767-.244-1.619-.072-2.188.496l-2.581 2.582M20 4l-6 6m6 0-6-6\"/>",
  cameraOff: "<path stroke=currentColor stroke-linecap=round d=\"m2.002 2 19.975 20M16.852 16.868c-.13.938-.386 1.599-.893 2.106C14.937 20 13.289 20 9.993 20h-.999c-3.296 0-4.943 0-5.967-1.026C2.002 17.95 2.002 16.3 2.002 13v-2c0-3.3 0-4.95 1.024-5.975.342-.343.755-.571 1.275-.723\"/><path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"M8.236 4h1.755c3.296 0 4.944 0 5.967 1.025C16.982 6.05 16.982 7.7 16.982 11v1.757m0-3.526 2.32-1.702c1.47-.988 2.147-.357 2.365.12.452 1.279.31 3.744.31 6.893-.107 2.013-.382 2.23-.663 2.452l-.003.002\"/>",
  shareScreen: "<path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"M16 3H8c-2.828 0-4.243 0-5.121.879C2 4.757 2 6.172 2 9v2c0 2.828 0 4.243.879 5.121C3.757 17 5.172 17 8 17h8c2.828 0 4.243 0 5.121-.879C22 15.243 22 13.828 22 11V9c0-2.828 0-4.243-.879-5.121C20.243 3 18.828 3 16 3\" class=z-shape /><path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"M14.25 21H16m-1.75 0a1.5 1.5 0 0 1-1.5-1.5V17H12m2.25 4h-4.5m0 0H8m1.75 0a1.5 1.5 0 0 0 1.5-1.5V17H12m0 0v4M9 10s2.21-3 3-3 3 3 3 3m-3-2.5V13\"/>",
  sounds: "<path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"M7 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0m0 0V2c.333.5.6 2.6 3 3\"/><circle cx=10.5 cy=19.5 r=2.5 stroke=currentColor class=z-shape /><circle cx=20 cy=18 r=2 stroke=currentColor class=z-shape /><path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"M13 19.5V11c0-.91 0-1.365.247-1.648.246-.282.747-.35 1.748-.487 3.014-.411 5.206-1.667 6.375-2.436.28-.184.42-.276.525-.22s.105.223.105.554v11.163\"/><path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"M13 13c4.8 0 8-2.333 9-3\"/>",
  fullscreen: "<path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"M15.5 21c1.396 0 2.093 0 2.661-.172a4 4 0 0 0 2.667-2.667C21 17.593 21 16.896 21 15.5m0-7c0-1.396 0-2.093-.172-2.661a4 4 0 0 0-2.667-2.667C17.593 3 16.896 3 15.5 3m-7 18c-1.396 0-2.093 0-2.661-.172a4 4 0 0 1-2.667-2.667C3 17.593 3 16.896 3 15.5m0-7c0-1.396 0-2.093.172-2.661A4 4 0 0 1 5.84 3.172C6.407 3 7.104 3 8.5 3\"/>",
  caretDown: "<path stroke=currentColor stroke-linecap=round stroke-linejoin=round d=\"M18 9s-4.419 6-6 6-6-6-6-6\"/>",
} as const;

/** One of the app's icons, drawn at the app's size and line weight */
function AppIcon(props: { name: keyof typeof ICONS; size?: number }) {
  return (
    // a constant drawing from the table above, never user input
    // eslint-disable-next-line solid/no-innerhtml
    <svg class="cs-icon" width={props.size ?? 20} height={props.size ?? 20} viewBox="0 0 24 24" fill="none" aria-hidden="true" innerHTML={ICONS[props.name]} />
  );
}

/** The controller face, version B (the same path as the logo) */
const FACE =
  "M 84 78 L 172 78 C 181 78 187 81 193 88 L 226 124 C 237 136 237 148 226 159 L 210 175 C 199 186 185 186 175 176 L 166 167 C 162 163 157 161 150 161 L 106 161 C 99 161 94 163 90 167 L 81 176 C 71 186 57 186 46 175 L 30 159 C 19 148 19 136 30 124 L 63 88 C 69 81 75 78 84 78 Z M 68 126 C 70 113 78 104 89 104 C 102 103 112 112 115 125 C 117 132 112 135 107 131 C 101 126 96 122 91 122 C 85 122 80 126 75 131 C 70 135 67 132 68 126 Z M 188 126 C 186 113 178 104 167 104 C 154 103 144 112 141 125 C 139 132 144 135 149 131 C 155 126 160 122 165 122 C 171 122 176 126 181 131 C 186 135 189 132 188 126 Z";

/** The app's default avatar: the face on one of its colours (web public/avatars) */
function DefaultAvatar(props: { background: string; foreground: string }) {
  return (
    <svg class="cs-avatar" viewBox="0 0 512 512" aria-hidden="true">
      <circle cx="256" cy="256" r="256" fill={props.background} />
      <g transform="translate(58.155 53.518) scale(1.54566)">
        <path d={FACE} fill={props.foreground} fill-rule="evenodd" />
      </g>
    </svg>
  );
}

/** The avatars of the app's catalogue the three people have: raspberry, amber, mint */
const PEOPLE = [
  { key: "a", background: "#E0195F", foreground: "#FFFFFF", sharing: true },
  { key: "b", background: "#F6C65B", foreground: "#0D0E16", sharing: false },
  { key: "c", background: "#83D7B9", foreground: "#0D0E16", sharing: false },
] as const;

export function CallScene(props: {
  /** room name and the three names */
  room: string;
  names: readonly [string, string, string];
  label: string;
  /** the shared screen: the owner's shot of a voice room */
  screen: JSX.Element;
}) {
  return (
    <figure class="call-scene" role="img" aria-label={props.label}>
      <div class="cs-room" aria-hidden="true">
        {/* the channel header: the speaker, then the room's name */}
        <div class="cs-header">
          <AppIcon name="speaker" size={20} />
          <span class="cs-header-name">{props.room}</span>
        </div>
        <div class="cs-view">
          {/* the shared screen, focused; its name pill at the start of the bottom edge */}
          <div class="cs-tile cs-focus">
            <div class="cs-screen">{props.screen}</div>
            <div class="cs-overlay">
              <span class="cs-pill">
                <AppIcon name="speaker" size={16} />
                <span>{props.names[0]}</span>
              </span>
            </div>
          </div>
          <span class="cs-toggle">
            <AppIcon name="caretDown" size={16} />
          </span>
          <div class="cs-grid">
            <For each={PEOPLE}>
              {(person, index) => (
                <div class={`cs-tile cs-person cs-person-${person.key}`}>
                  <div class="cs-avatar-holder">
                    <DefaultAvatar background={person.background} foreground={person.foreground} />
                  </div>
                  <div class="cs-overlay">
                    <span class="cs-pill">
                      {person.sharing && <AppIcon name="shareScreen" size={16} />}
                      <span>{props.names[index()]}</span>
                    </span>
                  </div>
                </div>
              )}
            </For>
          </div>
          <span class="cs-fullscreen">
            <AppIcon name="fullscreen" size={20} />
          </span>
        </div>
      </div>
    </figure>
  );
}
