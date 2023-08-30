<script lang="ts">
  import type { DataStore } from "$lib/data-store";
  import { flip } from 'svelte/animate';
  import { fly } from 'svelte/transition';
  import { LINE_HEIGHT } from "$lib/constants";

  export let dataStore: DataStore;
  export let disabled = false;

  let listHeight = LINE_HEIGHT + 'em';
  $: listHeight = $dataStore.rssUrls.length === 0 ? '0' : (($dataStore.rssUrls.length + 1) * LINE_HEIGHT) + 'em';
</script>

<h3 class="line">RSS Feeds</h3>

<div class="indent list-holder">
  <div style="height: {listHeight}" class="transition-height">
    {#if $dataStore.rssUrls.length > 0}
      <div class="feed header line" in:fly={{ y: -10 }} out:fly={{ y: -10 }}>
        <span class="delete"><!-- placeholder --></span>
        <span>URL</span>
      </div>
    {/if}
    <ul>
      {#each $dataStore.rssUrls as url, i (i)}
        <li class="feed line" in:fly={{ y: -10 }} out:fly={{ y: -10 }} animate:flip>
          <button class="delete" id="delete-{i}" title="Delete" on:click={() => dataStore.removeFeed(i)} {disabled}>X</button>
          <input type="text" bind:value={url} id={'rss-feed-' + i} {disabled}>
        </li>
      {/each}
    </ul>
  </div>

  <div class="indent line">
    <button id="add-show" on:click={dataStore.addFeed} {disabled}>Add RSS feed</button>
  </div>
</div>
