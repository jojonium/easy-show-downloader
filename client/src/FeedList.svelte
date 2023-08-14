<script lang="ts">
  export let rssUrls: string[] = []
  export let disabled = false;

  const addFeed = () => {
    rssUrls = [...rssUrls, ''];
  }

  const removeFeed = (i: number) => {
    rssUrls = rssUrls.filter((_, j) => j !== i);
  }

</script>

<h3>RSS Feeds</h3>

<ul>
    <li class="feed header">
      <span class="delete"></span>
      <span>URL</span>
    </li>
  {#each rssUrls as url, i}
    <li class="feed">
      <button class="delete" id="delete-{i}" title="Delete" on:click={() => removeFeed(i)} {disabled}>X</button>
      <input type="text" bind:value={url} id={'rss-feed-' + i} {disabled}>
    </li>
  {/each}
</ul>

{#if rssUrls.length === 0}
  <p>No RSS feeds</p>
{/if}

<button id="add-show" on:click={addFeed} {disabled}>Add RSS feed</button>
