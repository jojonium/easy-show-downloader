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

<style>
  li.feed input {
    min-width: 50em;
    max-width: 80%;
  }
  li.feed {
    display: flex;
  }
  li.feed * {
    flex-grow: 1;
  }
  li.feed .delete {
    flex-grow: 0;
    width: 2em;
  }
  ul {
    padding: 0;
  }
</style>
