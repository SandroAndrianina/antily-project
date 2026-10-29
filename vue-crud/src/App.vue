<script setup lang="ts">
</script>

<template>
  <!-- SVG filters used by the CSS (filter: url(#paint) / url(#brush)) -->
  <svg class="svg-defs" width="0" height="0" aria-hidden="true">
    <defs>
      <!-- Worn paint: slightly rough edges + tiny missing specks -->
      <filter id="paint" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="rough" />
        <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="3" seed="8" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  22 0 0 0 -4.2" result="specks" />
        <feComposite in="rough" in2="specks" operator="in" />
      </filter>
      <!-- Light version for small text: rough edges only, no specks -->
      <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="3" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.4" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <!-- Brush stroke: streaky, rough edges -->
      <filter id="brush" x="-5%" y="-30%" width="110%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03 0.25" numOctaves="2" seed="5" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
  </svg>

  <!-- key = the top-level route: the layout stays mounted when only the inner page changes -->
  <RouterView v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="String(route.matched[0]?.path)" />
    </Transition>
  </RouterView>
</template>
