<script lang="ts">
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

<h3>Log</h3>

<ul>
  {#each entries as {message, level}}
    <li>
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
</style>
