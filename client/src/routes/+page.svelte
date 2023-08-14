<svelte:head>
  <title>Easy Show Downloader</title>
</svelte:head>

<script lang="ts">
  import { getData, postData, postDownload } from '$lib/api-helpers';
  import { type Data, blankData, stringifyData} from '@easy-show-downloader/common/src/data';
  import { onMount } from 'svelte';
  import FeedList from '../FeedList.svelte';
  import ShowList from '../ShowList.svelte';
  import { version } from '$app/environment';
  import Log from '../Log.svelte';

  const viteMode = import.meta.env.MODE;
  let logger: Log;

  let dataPromise: Promise<Data> = Promise.resolve(blankData);
  let modified = {
    mediaRoot: false,
    shows: false,
    rssUrls: false
  };
  let anyModified =  false;
  let cached = {
    mediaRoot: '',
    shows: '',
    rssUrls: ''
  };
  $: modified.mediaRoot = data.mediaRoot !== cached.mediaRoot;
  $: modified.shows = JSON.stringify(data.shows) !== cached.shows;
  $: modified.rssUrls = JSON.stringify(data.rssUrls) !== cached.rssUrls;
  $: anyModified = modified.mediaRoot || modified.shows || modified.rssUrls;
  let data: Data = blankData;
  let saving = false;

  const refreshData = () => {
    dataPromise = getData();
    dataPromise.then((d) => {
      data = d;
      if (!data.mediaRoot) data.mediaRoot = '';
      cached = {
        mediaRoot: data.mediaRoot,
        shows: JSON.stringify(data.shows),
        rssUrls: JSON.stringify(data.rssUrls)
      }
      logger.log("Refreshed data from server.");
      saving = false;
    }).catch((e) => {
      console.error(e);
      if (e instanceof Error && 'message' in e) {
        logger.error(e.message);
      }
    });
  };

  const save = async () => {
    saving = true;
    try {
      await postData(data);
      logger.log('Saved data to server.')
      refreshData();
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error && 'message' in e) {
        logger.error(e.message);
      }
    }
  }

  const downloadNew = async () => {
    saving = true;
    try {
      const numAdded = await postDownload();
      logger.log(`Added ${numAdded} torrent${numAdded !== 1 ? 's' : ''}.`);
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error && 'message' in e) {
        logger.error(e.message);
      }
    }
    saving = false;
  }

  onMount(refreshData);
</script>

<header>
  <h1>Easy Show Downloader - v{version}</h1>
  {#if viteMode === 'development'}
    <p>Development mode</p>
  {/if}
</header>

<button 
  id="save"
  on:click={save}
  disabled={saving || !anyModified}
>{anyModified ? 'Save to server' : 'No changes'}</button>
<button id="download-new" on:click={downloadNew} disabled={saving}>Download new episodes</button>

<hr>

<div>
{#await dataPromise}
  <p>Loading data...</p>
{:then}
  <span>Media root:</span> <input 
    type="text"
    id="media-root-input"
    bind:value={data.mediaRoot}
    disabled={saving}
  >

  <ShowList bind:shows={data.shows} disabled={saving}/>

  <FeedList bind:rssUrls={data.rssUrls} disabled={saving}/>
{:catch someError}
  <p style="red">{someError.message}</p>
{/await}
</div>

<div>
  <Log bind:this={logger} />
</div>