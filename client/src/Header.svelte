<script lang="ts">
  import { version } from '$app/environment';
  const viteMode = import.meta.env.MODE;
  export let title: string;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<header>
  <h1 class="line">{title} v{version}
    {#if viteMode === 'development'}
      &lt;<span style="color: yellow;">Development mode</span>&gt;
    {/if}
  </h1>
</header>

<hr>
