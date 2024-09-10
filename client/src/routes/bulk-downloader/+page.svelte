<script lang="ts">
  import Header from '../../Header.svelte';
  import { postBulkDownload } from '$lib/api-helpers';
  import { slide } from 'svelte/transition';
  import Log from '../../Log.svelte';

  let folder = '';
  let rssUrl = '';

  let logger: Log;

  let downloadMessage = 'Download all episodes';
  $: downloadMessage = downloading
    ? '\u00A0\u00A0\u00A0\u00A0\u00A0Downloading\u00A0\u00A0\u00A0\u00A0\u00A0'
    : 'Download all episodes';

  let downloading = false;

  const bulkDownload = async () => {
    downloading = true;
    try {
      const numAdded = await postBulkDownload(folder, rssUrl);
      logger.log(`Added ${numAdded} torrent${numAdded !== 1 ? 's' : ''}.`);
    } catch (e: unknown) {
      console.error(e);
      if (e instanceof Error && 'message' in e) {
        logger.error(e.message);
      }
    }
    downloading = false;
  }
</script>

<Header title="Bulk Download - Easy Show Downloader"></Header>

<p>Use this form to download all torrents from an RSS feed to a single folder under your media root.</p>

<hr>

<div class="line standalone-input-holder">
  <label for="folder-input">Folder:&nbsp;</label>
  <input 
    type="text"
    bind:value={folder}
    placeholder="Folder" 
    id="folder-input"
    class="standalone"
  >
</div>

<div class="line standalone-input-holder">
  <label for="rss-url-input">RSS&nbsp;URL:&nbsp;</label>
  <input 
    type="text"
    bind:value={rssUrl}
    placeholder="RSS feed URL" 
    id="rss-url-input"
    class="standalone"
  >
</div>

<hr>

<button
  id="download-new"
  class="variable-text"
  on:click={bulkDownload}
  disabled={downloading}
>
  <div class="inner">
    {#key downloadMessage}
      <span transition:slide>{downloadMessage}</span>
    {/key}
  </div>
</button>

<hr>

<div>
  <Log bind:this={logger} />
</div>
