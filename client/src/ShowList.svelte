<script lang="ts">
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
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

<h3 class="line">Shows</h3>

<div class="indent">
  <ul>
    <li class="show header line">
      <div class="delete"> </div>
      <div class="th">Folder</div> <div class="th">Regex</div>
    </li>
    {#each shows as {title, regex, folder, feedUrl}, i (i)}
      <li class="show line" in:fly={{ y: -10 }} out:fly={{ y: -10 }} animate:flip>
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

  <div class="indent line">
    <button id="add-show" on:click={addShow} {disabled}>Add show</button>
  </div>
</div>
