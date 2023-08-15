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
  let initialized = false;
  let logger: Log;

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
  let saveMessage = 'Save to server';
  $: saveMessage = saving ? 'Saving...'.padEnd(14, '\u00A0') 
    : anyModified ? 'Save to server' : 'No changes'.padEnd(14, '\u00A0');
  let downloadMessage = 'Download new episodes';
  $: downloadMessage = downloading ? 'Downloading...'.padEnd(21, '\u00A0') : 'Download new episodes';
  let data: Data = blankData;
  let saving = false;
  let downloading = false;

  const refreshData = async () => {
    try {
      const d = await getData();
      data = d;
      if (!data.mediaRoot) data.mediaRoot = '';
      cached = {
        mediaRoot: data.mediaRoot,
        shows: JSON.stringify(data.shows),
        rssUrls: JSON.stringify(data.rssUrls)
      }
      console.log("Refreshed data from server.");
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error && 'message' in e) {
        logger.error(e.message);
      }
    }
    initialized = true;
  };

  const save = async () => {
    saving = true;
    try {
      await postData(data);
      logger.log('Saved data to server.')
      await refreshData();
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error && 'message' in e) {
        logger.error(e.message);
      }
    }
    saving = false;
  }

  const downloadNew = async () => {
    downloading = true;
    try {
      const numAdded = await postDownload();
      logger.log(`Added ${numAdded} torrent${numAdded !== 1 ? 's' : ''}.`);
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error && 'message' in e) {
        logger.error(e.message);
      }
    }
    downloading = false;
  }

  onMount(refreshData);
</script>

<header>
  <h1 class="line">Easy Show Downloader v{version}
    {#if viteMode === 'development'}
      &lt;<span style="color: yellow;">Development mode</span>&gt;
    {/if}
  </h1>
</header>

<hr>

<div class="line">
  <button 
    id="save"
    on:click={save}
    disabled={saving || downloading || !anyModified}
  >{@html saveMessage}</button>
  <button id="download-new"
    on:click={downloadNew}
    disabled={saving || downloading}
  >{@html downloadMessage}</button>
</div>

<hr>

<div class="main-content">
{#if !initialized}
  <p>Loading data...</p>
{:else}
  <div class="line">
    <span>Media root:</span> <input 
      type="text"
      id="media-root-input"
      bind:value={data.mediaRoot}
      disabled={saving || downloading}
    >
  </div>

  <hr>

  <ShowList bind:shows={data.shows} disabled={saving || downloading}/>

  <hr>

  <FeedList bind:rssUrls={data.rssUrls} disabled={saving || downloading}/>
{/if}
</div>

<hr>

<div>
  <Log bind:this={logger} />
</div>
