<script lang="ts">
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  export let rssUrls: string[] = []
  export let disabled = false;

  let listHeight = '1.2em';
  $: listHeight = rssUrls.length === 0 ? '0' : ((rssUrls.length + 1) * 1.2) + 'em';

  const addFeed = () => {
    rssUrls = [...rssUrls, ''];
  }

  const removeFeed = (i: number) => {
    rssUrls = rssUrls.filter((_, j) => j !== i);
  }

</script>

<h3 class="line">RSS Feeds</h3>

<div class="indent list-holder">
  <div style="height: {listHeight}" class="transition-height">
    {#if rssUrls.length > 0}
      <div class="feed header line" in:fly={{ y: -10 }} out:fly={{ y: -10 }}>
        <span class="delete"><!-- placeholder --></span>
        <span>URL</span>
      </div>
    {/if}
    <ul>
      {#each rssUrls as url, i (i)}
        <li class="feed line" in:fly={{ y: -10 }} out:fly={{ y: -10 }} animate:flip>
          <button class="delete" id="delete-{i}" title="Delete" on:click={() => removeFeed(i)} {disabled}>X</button>
          <input type="text" bind:value={url} id={'rss-feed-' + i} {disabled}>
        </li>
      {/each}
    </ul>
  </div>

  <div class="indent line">
    <button id="add-show" on:click={addFeed} {disabled}>Add RSS feed</button>
  </div>
</div>
