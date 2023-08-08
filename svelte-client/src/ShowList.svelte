<script lang="ts">
  import type { Show } from "@easy-show-downloader/common/src/show";

  export let shows: Show[] = []
</script>

<h3>Shows</h3>

<ul>
    <li class="show header">
      <span>Folder</span> <span>Regex</span>
    </li>
  {#each shows as {title, regex, folder, feedUrl}, i}
    <li class="show">
      <input type="text" value={folder} id={'show-folder-input-' + i}>
      <input type="text" value={regex} id={'show-regex-input-' + i}>
    </li>
  {/each}
</ul>

<style>
  li.show {
    display: flex;
  }
  li.show * {
    flex-grow: 1;
  }
  ul {
    padding: 0;
  }
</style>
