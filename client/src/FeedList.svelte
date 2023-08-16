<script lang="ts">
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  export let rssUrls: string[] = []
  export let disabled = false;

  const addFeed = () => {
    rssUrls = [...rssUrls, ''];
  }

  const removeFeed = (i: number) => {
    rssUrls = rssUrls.filter((_, j) => j !== i);
  }

</script>

<h3 class="line">RSS Feeds</h3>

<div class="indent">
  <ul>
    <li class="feed header line">
      <span class="delete"></span>
      <span>URL</span>
    </li>
    {#each rssUrls as url, i (i)}
      <li class="feed line" in:fly={{ y: -10 }} out:fly={{ y: -10 }} animate:flip>
        <button class="delete" id="delete-{i}" title="Delete" on:click={() => removeFeed(i)} {disabled}>X</button>
        <input type="text" bind:value={url} id={'rss-feed-' + i} {disabled}>
      </li>
    {/each}
  </ul>

  {#if rssUrls.length === 0}
    <p>No RSS feeds</p>
  {/if}

  <div class="indent line">
    <button id="add-show" on:click={addFeed} {disabled}>Add RSS feed</button>
  </div>
</div>
