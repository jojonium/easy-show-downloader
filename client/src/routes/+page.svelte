<svelte:head>
  <title>Easy Show Downloader</title>
</svelte:head>

<script lang="ts">
  import { version } from '$app/environment';
  import { getData, postData, postDownload } from '$lib/api-helpers';
  import { createDataStore, toServerFormat } from '$lib/data-store';
  import { blankData } from '@easy-show-downloader/common/src/data';
  import { onMount } from 'svelte';
  import FeedList from '../FeedList.svelte';
  import Log from '../Log.svelte';
  import ShowList from '../ShowList.svelte';

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
  $: modified.mediaRoot = $dataStore.mediaRoot !== cached.mediaRoot;
  $: modified.shows = JSON.stringify($dataStore.shows) !== cached.shows;
  $: modified.rssUrls = JSON.stringify($dataStore.rssUrls) !== cached.rssUrls;
  $: anyModified = modified.mediaRoot || modified.shows || modified.rssUrls;
  let saveMessage = 'Save to server';
  $: saveMessage = saving ? 'Saving...'.padEnd(14, '\u00A0') 
    : anyModified ? 'Save to server' : 'No changes'.padEnd(14, '\u00A0');
  let downloadMessage = 'Download new episodes';
  $: downloadMessage = downloading ? 'Downloading...'.padEnd(21, '\u00A0') : 'Download new episodes';
  let dataStore = createDataStore(blankData);
  let saving = false;
  let downloading = false;

  const refreshData = async () => {
    try {
      const d = await getData();
      for (const s of d.shows) s.id = Math.random();
      dataStore = createDataStore(d);
      cached = {
        mediaRoot: $dataStore.mediaRoot ?? '',
        shows: JSON.stringify($dataStore.shows),
        rssUrls: JSON.stringify($dataStore.rssUrls)
      }
      console.log("Refreshed data from server.");
      console.log($dataStore);
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
      await postData(toServerFormat($dataStore));
      logger.log('Saved data to server.')
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
  >{saveMessage}</button>
  <button id="download-new"
    on:click={downloadNew}
    disabled={saving || downloading}
  >{downloadMessage}</button>
</div>

<hr>

<div class="main-content">
{#if !initialized}
  <p>Loading data...</p>
{:else}
  <div class="line media-root-holder">
    <div>Media root:</div> <input 
      type="text"
      id="media-root-input"
      bind:value={$dataStore.mediaRoot}
      disabled={saving || downloading}
    >
  </div>

  <hr>

  <ShowList dataStore={dataStore} disabled={saving || downloading}/>

  <hr>

  <FeedList dataStore={dataStore} disabled={saving || downloading}/>
{/if}
</div>

<hr>

<div>
  <Log bind:this={logger} />
</div>
