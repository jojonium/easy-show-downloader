<script lang="ts">
  import ShowList from '../ShowList.svelte';
  import FeedList from '../FeedList.svelte';
  import { getData } from '$lib/api-helpers';

  let dataPromise = getData();
</script>

<h1>Easy Show Downloader</h1>

{#await dataPromise}
  <p>Loading data...</p>
{:then data}
  <input type="text" id="media-root-input" value={data.mediaRoot}>

  <ShowList shows={data.shows}/>

  <FeedList rssUrls={data.rssUrls}/>
{:catch someError}
  <p>Error fetching data: {someError.message}</p>
{/await}

