<svelte:head>
  <title>Easy Show Downloader</title>
</svelte:head>

<script lang="ts">
  import { browser } from '$app/environment';
  import { getData } from '$lib/api-helpers';
  import { type Data, blankData} from '@easy-show-downloader/common/src/data';
  import { onMount } from 'svelte';
  import FeedList from '../FeedList.svelte';
  import ShowList from '../ShowList.svelte';
  import { version } from '$app/environment';

  let dataPromise: Promise<Data> = Promise.resolve(blankData);
  onMount(async () => {
    dataPromise = getData();
  })
  const viteMode = import.meta.env.MODE;
</script>

<header>
  <h1>Easy Show Downloader - v{version}</h1>
  {#if viteMode === 'development'}
    <p>Development mode</p>
  {/if}
</header>

{#await dataPromise}
  <p>Loading data...</p>
{:then data}
  <span>Media root:</span> <input type="text" id="media-root-input" value={data.mediaRoot ?? ""}>

  <ShowList shows={data.shows}/>

  <FeedList rssUrls={data.rssUrls}/>
{:catch someError}
  <p>{someError.message}</p>
{/await}

