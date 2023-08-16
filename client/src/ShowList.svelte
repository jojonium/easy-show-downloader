<script lang="ts">
  import { Show } from "@easy-show-downloader/common/src/show";
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';

  export let shows: Show[] = []
  export let disabled = false;

  let listHeight = '1.2em';
  $: listHeight = shows.length === 0 ? '0' : ((shows.length + 1) * 1.2) + 'em';

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

<div class="indent list-holder">
  <div style="height: {listHeight}" class="transition-height">
    {#if shows.length > 0}
      <div class="show header line" in:fly={{ y: -10 }} out:fly={{ y: -10 }}>
        <span class="delete"><!-- placeholder --></span>
        <span>Folder</span> <span>Regex</span>
      </div>
    {/if}
    <ul>
      {#each shows as {regex, folder}, i (i)}
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
  </div>

  <div class="indent line">
    <button id="add-show" on:click={addShow} {disabled}>Add show</button>
  </div>
</div>
