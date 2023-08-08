<script lang="ts">
  export let rssUrls: string[] = []
</script>

<h3>RSS Feeds</h3>

<ul>
    <li class="feed header">
      URL
    </li>
  {#each rssUrls as url, i}
    <li class="feed">
      <input type="text" value={url} id={'rss-feed-' + i}>
    </li>
  {/each}
</ul>

<style>
  ul {
    padding: 0;
  }
  li.feed input {
    min-width: 50em;
    max-width: 80%;
  }
</style>
