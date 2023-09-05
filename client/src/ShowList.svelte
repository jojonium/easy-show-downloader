<script lang="ts">
  import type { DataStore } from "$lib/data-store";
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import { LINE_HEIGHT } from "$lib/constants";

  export let dataStore: DataStore;
  export let disabled = false;

  let listHeight = LINE_HEIGHT + 'em';
  $: listHeight = $dataStore.shows.length === 0 ? '0' : (($dataStore.shows.length + 1) * LINE_HEIGHT) + 'em';

  const regexHandler = (e: Event): RegExp => {
    let newVal = "";
    if (e.target !== null) newVal = (e.target as HTMLInputElement).value;
    return new RegExp(newVal);
  }
</script>

<h3 class="line">Shows</h3>

<div class="indent list-holder">
  <div style="height: {listHeight}" class="transition-height">
    {#if $dataStore.shows.length > 0}
      <div class="header line" in:fly={{ y: -10 }} out:fly={{ y: -10 }}>
        <span class="delete"><!-- placeholder --></span>
        <span class="folder">Folder</span> <span class="regex">Regex</span>
      </div>
    {/if}
    <ul>
      {#each $dataStore.shows as {regex, folder, id} (id)}
        <li class="show line" in:fly={{ y: -10 }} out:fly={{ y: -10 }} animate:flip>
          <button class="delete" id="delete-{id}" title="Delete" on:click={() => id && dataStore.removeShow(id)} {disabled}>X</button>
          <input 
            type="text"
            bind:value={folder}
            placeholder="Folder" 
            id="show-folder-input-{id}"
            class="folder"
            {disabled}
          >
          <input
            type="text"
            value={regex.source}
            placeholder="Regular expression"
            id="show-regex-input-{id}"
            class="regex"
            on:input={(e) => {regex = regexHandler(e)}}
            {disabled}
          >
        </li>
      {/each}
    </ul>
  </div>

  <div class="indent line">
    <button id="add-show" on:click={dataStore.addShow} {disabled}>Add show</button>
  </div>
</div>
