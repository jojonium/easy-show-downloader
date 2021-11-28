<script lang="ts">
  import type {Data} from '@easy-show-downloader/common/dist/data';
  import {onMount} from "svelte";
  import {getData} from "./api-helpers";

  export let name: string;
  let data: Data = {shows: [], rssUrls: []};
  $: showTitles = data.shows.map(s => s.title);

  onMount(async () => {
    data = await getData();
  });
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
  <p>Shows: {showTitles}</p>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
