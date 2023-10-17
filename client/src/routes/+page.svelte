<svelte:head>
  <title>Easy Show Downloader</title>
</svelte:head>

<script lang="ts">
  import { version } from '$app/environment';
  import { getData, postData, postDownload } from '$lib/api-helpers';
  import { createDataStore, stringify, toServerFormat, type ClientSideData } from '$lib/data-store';
  import { blankData } from '@easy-show-downloader/common/src/data';
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import FeedList from '../FeedList.svelte';
  import Log from '../Log.svelte';
  import ShowList from '../ShowList.svelte';

  const viteMode = import.meta.env.MODE;
  let initialized = false;
  let logger: Log;
  let dataStore = createDataStore(blankData);
  let saving = false;
  let downloading = false;
  let regexErrors = false;
  $: regexErrors = $dataStore.shows.some(s => s.err);

  // Cache initial data so "Save" button only becomes enabled when something is changed.
  let anyModified =  false;
  type Cache = { mediaRoot: string, shows: string, rssUrls: string };
  let cached: Cache = { mediaRoot: '', shows: '', rssUrls: '' };
  const checkModified = (prev: Cache, next: ClientSideData) => {
    const {mediaRoot, shows, rssUrls} = stringify(next);
    return mediaRoot !== prev.mediaRoot || shows !== prev.shows || rssUrls !== prev.rssUrls;
  };
  $: anyModified = checkModified(cached, $dataStore);

  let saveMessage = 'Save to server';
  $: saveMessage = saving ? 'Saving...'.padEnd(14, '\u00A0')
    : regexErrors ? 'Fix errors'.padEnd(14, '\u00A0')
    : (initialized && anyModified) ? 'Save to server' : '\u00A0\u00A0No changes\u00A0\u00A0';
  let downloadMessage = 'Download new episodes';
  $: downloadMessage = downloading
    ? '\u00A0\u00A0\u00A0\u00A0\u00A0Downloading\u00A0\u00A0\u00A0\u00A0\u00A0'
    : 'Download new episodes';

  const refreshData = async () => {
    try {
      const d = await getData();
      for (const s of d.shows) s.id = Math.random();
      dataStore = createDataStore(d);
      cached = stringify($dataStore);
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
      await postData(toServerFormat($dataStore));
      cached = stringify($dataStore);
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

<div class="line" style="display: flex;">
    <button 
      id="save"
      class="variable-text"
      on:click={save}
      disabled={!initialized || regexErrors || saving || downloading || !anyModified}
    >
      <div class="inner">
      {#key saveMessage}
        <span transition:slide>{saveMessage}</span>
      {/key}
      </div>
  </button>
  <span>&nbsp;</span>
  <button
    id="download-new"
    class="variable-text"
    on:click={downloadNew}
    disabled={saving || downloading}
  >
    <div class="inner">
      {#key downloadMessage}
        <span transition:slide>{downloadMessage}</span>
      {/key}
    </div>
  </button>
</div>

<hr>

<div class="main-content">
{#if !initialized}
  <p>Loading data...</p>
{:else}
  <div class="line media-root-holder">
    <div>Media root:&nbsp;</div> <input 
      type="text"
      id="media-root-input"
      bind:value={$dataStore.mediaRoot}
      title="Each show will be downloaded to a subfolder in this root directory"
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
