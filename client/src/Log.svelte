<script lang="ts">
  import { fly } from 'svelte/transition';

  type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  type Entry = {
    message: string,
    level: LogLevel
  }
  let entries: Entry[] = [];

  export function debug(message: string) {
    entries = [...entries, {message, level: 'DEBUG'}];
  }
  export function log(message: string) {
    entries = [...entries, {message, level: 'INFO'}];
  }
  export function warn(message: string) {
    entries = [...entries, {message, level: 'WARN'}];
  }
  export function error(message: string) {
    entries = [...entries, {message, level: 'ERROR'}];
  }
</script>

<h3 class="line">Log</h3>

<ul class="indent">
  {#each entries as {message, level}}
    <li class="line" in:fly={{ y: -10 }} out:fly={{ y: -10 }}>
      <p class={level}>{message}</p>
    </li>
  {/each}
</ul>

<style>
  .WARN {
    color: orange;
  }
  .ERROR {
    color: red;
  }
  ul {
    padding: 0;
    list-style-type: none;
  }
</style>
