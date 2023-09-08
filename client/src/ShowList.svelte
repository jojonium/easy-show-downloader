<script lang="ts">
  import type { DataStore } from "$lib/data-store";
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import { LINE_HEIGHT } from "$lib/constants";

  export let dataStore: DataStore;
  export let disabled = false;

  // Manually set height so CSS transitions work.
  let listHeight = LINE_HEIGHT + 'em';
  $: listHeight = $dataStore.shows.length === 0 ? '0' : (($dataStore.shows.length + 1) * LINE_HEIGHT) + 'em';

  /**
   * Inputs are strings and need to be converted into RegExp objects. If the
   * new string does not create a valid RegExp, the old regex is returned and
   * the err flag is set.
  */
  const regexHandler = (e: Event, old: string): {regex: RegExp, err: boolean} => {
    if (e.target === null) throw new Error("This shouldn't happen");
    const target = e.target as HTMLInputElement;
    try {
      const regex = new RegExp(target.value);
      return {regex, err: false};
    } catch (e: unknown) {
      return {regex: new RegExp(old), err: true};
    }
  }
</script>

<h3 class="line">Shows</h3>

<div class="indent list-holder">
  <div style="height: {listHeight}" class="transition-height">
    {#if $dataStore.shows.length > 0}
      <div class="header line" in:fly={{ y: -10 }} out:fly={{ y: -10 }}>
        <div class="delete"><!-- placeholder --></div>
        <span class="folder">Folder</span> <span class="regex">Regex</span>
      </div>
    {/if}
    <ul>
      {#each $dataStore.shows as {regex, err, folder, id} (id)}
        <li class="show line" in:fly={{ y: -10 }} out:fly={{ y: -10 }} animate:flip>
          <div class="button-holder delete">
            <button class="delete" id="delete-{id}" title="Delete" on:click={() => id && dataStore.removeShow(id)} {disabled}>X</button>
          </div>
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
            value={regex.source === '(?:)' ? '' : regex.source}
            placeholder="Regular expression"
            id="show-regex-input-{id}"
            class="regex"
            class:regex-error={err}
            on:input={(event) => {
              let {regex: r, err: e} = regexHandler(event, regex.source);
              regex = r;
              err = e;
            }}
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
