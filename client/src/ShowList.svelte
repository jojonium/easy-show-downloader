<script lang="ts">
  import { Show } from "@easy-show-downloader/common/src/show";

  export let shows: Show[] = []
  export let disabled = false;

  const addShow = () => {
    shows = [...shows, new Show('', /.*/)];
  }

  const removeShow = (i: number) => {
    shows = shows.filter((_, j) => j !== i);
  }

  const regexHandler = (e: Event): RegExp => {
    let newVal = "";
    if (e.target !== null) newVal = (e.target as HTMLInputElement).value;
    return new RegExp(newVal);
  }
</script>

<h3>Shows</h3>

<ul>
  <li class="show header">
    <div class="delete"> </div>
    <div class="th">Folder</div> <div class="th">Regex</div>
  </li>
  {#each shows as {title, regex, folder, feedUrl}, i}
    <li class="show">
      <button class="delete" id="delete-{i}" title="Delete" on:click={() => removeShow(i)} {disabled}>X</button>
      <input 
        type="text"
        bind:value={folder}
        placeholder="Folder" 
        id="show-folder-input-{i}"
        {disabled}
      >
      <input
        type="text"
        value={regex.source}
        placeholder="Regular expression"
        id="show-regex-input-{i}"
        on:input={(e) => {regex = regexHandler(e)}}
        {disabled}
      >
    </li>
  {/each}
</ul>

{#if shows.length === 0}
  <p>No shows</p>
{/if}

<button id="add-show" on:click={addShow} {disabled}>Add show</button>
